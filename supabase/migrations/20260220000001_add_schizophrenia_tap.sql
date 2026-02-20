-- ============================================================================
-- Migration: Add schizophrenia_tap table
-- TEA/TAP (Test of Attentional Performance) for Schizophrenia Initial Visit
-- Contains two subtests: Attention soutenue + Flexibilité
-- Uses JSONB for tabular results (matrix data)
-- ============================================================================

-- 1. Create the table
CREATE TABLE IF NOT EXISTS "public"."schizophrenia_tap" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "visit_id" uuid NOT NULL,
    "patient_id" uuid NOT NULL,

    -- Shared test metadata (extracted from RTF or entered manually)
    "sujet" text,
    "examinateur" text,
    "date_passation" text,
    "age" integer,
    "normes" text,

    -- TAP - Attention soutenue
    "attention_type_test" text DEFAULT 'Couleur ou forme',
    "attention_results" jsonb DEFAULT '[]'::jsonb,

    -- TAP - Flexibilité
    "flexibilite_type_test" text DEFAULT 'Alternance lettres et chiffres',
    "flexibilite_results" jsonb DEFAULT '[]'::jsonb,
    "flexibilite_index_prestation_valeur" numeric(8,3),
    "flexibilite_index_prestation_percentile" integer,
    "flexibilite_index_speed_accuracy_valeur" numeric(8,3),
    "flexibilite_index_speed_accuracy_percentile" integer,

    -- Metadata
    "completed_by" uuid,
    "completed_at" timestamp with time zone DEFAULT now(),
    "created_at" timestamp with time zone DEFAULT now(),
    "updated_at" timestamp with time zone DEFAULT now()
);

ALTER TABLE "public"."schizophrenia_tap" OWNER TO "postgres";

-- 2. Primary Key
ALTER TABLE "public"."schizophrenia_tap"
    ADD CONSTRAINT "schizophrenia_tap_pkey" PRIMARY KEY ("id");

-- 3. Unique constraint on visit_id (required for upsert)
ALTER TABLE "public"."schizophrenia_tap"
    ADD CONSTRAINT "schizophrenia_tap_visit_id_key" UNIQUE ("visit_id");

-- 4. Foreign keys
ALTER TABLE "public"."schizophrenia_tap"
    ADD CONSTRAINT "schizophrenia_tap_visit_id_fkey"
    FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;

ALTER TABLE "public"."schizophrenia_tap"
    ADD CONSTRAINT "schizophrenia_tap_patient_id_fkey"
    FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;

ALTER TABLE "public"."schizophrenia_tap"
    ADD CONSTRAINT "schizophrenia_tap_completed_by_fkey"
    FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");

-- 5. Indexes
CREATE INDEX IF NOT EXISTS "idx_sz_tap_visit_id"
    ON "public"."schizophrenia_tap" ("visit_id");

CREATE INDEX IF NOT EXISTS "idx_sz_tap_patient_id"
    ON "public"."schizophrenia_tap" ("patient_id");

-- 6. Updated_at trigger
CREATE TRIGGER "update_schizophrenia_tap_updated_at"
    BEFORE UPDATE ON "public"."schizophrenia_tap"
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 7. Enable Row Level Security
ALTER TABLE "public"."schizophrenia_tap" ENABLE ROW LEVEL SECURITY;

-- 8. RLS Policies - Patient
CREATE POLICY "Patients view own tap responses"
    ON "public"."schizophrenia_tap"
    FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Patients insert own tap responses"
    ON "public"."schizophrenia_tap"
    FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own tap responses"
    ON "public"."schizophrenia_tap"
    FOR UPDATE USING (auth.uid() = patient_id);

-- 9. RLS Policies - Professional
CREATE POLICY "Professionals view all tap responses"
    ON "public"."schizophrenia_tap"
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid()
        AND role IN ('healthcare_professional', 'manager', 'administrator'))
    );

CREATE POLICY "Professionals insert tap responses"
    ON "public"."schizophrenia_tap"
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid()
        AND role IN ('healthcare_professional', 'manager', 'administrator'))
    );

CREATE POLICY "Professionals update tap responses"
    ON "public"."schizophrenia_tap"
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid()
        AND role IN ('healthcare_professional', 'manager', 'administrator'))
    );

-- 10. Update RPC function to include TAP_SZ in completion tracking
CREATE OR REPLACE FUNCTION public.get_visit_detail_data(p_visit_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    v_statuses jsonb := '{}'::jsonb;
    v_result jsonb;
BEGIN
    -- Bipolar screening module
    v_statuses := jsonb_build_object(
      'ASRM', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_asrm WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_asrm WHERE visit_id = p_visit_id)),
      'QIDS_SR16', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_qids WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_qids WHERE visit_id = p_visit_id)),
      'MDQ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_mdq WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_mdq WHERE visit_id = p_visit_id))
    );

    -- Bipolar initial thymic module
    v_statuses := v_statuses || jsonb_build_object(
      'MADRS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_madrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_madrs WHERE visit_id = p_visit_id)),
      'YMRS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_ymrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_ymrs WHERE visit_id = p_visit_id)),
      'CGI', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cgi WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cgi WHERE visit_id = p_visit_id)),
      'EGF', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_egf WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_egf WHERE visit_id = p_visit_id)),
      'ALDA', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_alda WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_alda WHERE visit_id = p_visit_id)),
      'ETAT_PATIENT', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_etat_patient WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_etat_patient WHERE visit_id = p_visit_id)),
      'FAST', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_fast WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_fast WHERE visit_id = p_visit_id))
    );

    -- Bipolar initial neuropsy module
    v_statuses := v_statuses || jsonb_build_object(
      'WAIS4_CRITERIA', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais4_criteria WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais4_criteria WHERE visit_id = p_visit_id)),
      'WAIS4_LEARNING', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais4_learning WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais4_learning WHERE visit_id = p_visit_id)),
      'WAIS4_SIMILITUDES', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais4_similitudes WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais4_similitudes WHERE visit_id = p_visit_id)),
      'WAIS4_DIGIT_SPAN', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais4_digit_span WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais4_digit_span WHERE visit_id = p_visit_id)),
      'WAIS4_MATRICES', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais4_matrices WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais4_matrices WHERE visit_id = p_visit_id)),
      'WAIS4_CODE', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais4_code WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais4_code WHERE visit_id = p_visit_id)),
      'WAIS_IV_CODE_SYMBOLES_IVT', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais_iv_code_symboles_ivt WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais_iv_code_symboles_ivt WHERE visit_id = p_visit_id)),
      'CVLT', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_cvlt WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_cvlt WHERE visit_id = p_visit_id)),
      'TMT', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_tmt WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_tmt WHERE visit_id = p_visit_id)),
      'STROOP', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_stroop WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_stroop WHERE visit_id = p_visit_id)),
      'FLUENCES_VERBALES', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_fluences_verbales WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_fluences_verbales WHERE visit_id = p_visit_id)),
      'TEST_COMMISSIONS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_test_commissions WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_test_commissions WHERE visit_id = p_visit_id))
    );

    -- WAIS-III module
    v_statuses := v_statuses || jsonb_build_object(
      'WAIS3_CRITERIA', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais3_criteria WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais3_criteria WHERE visit_id = p_visit_id)),
      'WAIS3_VOCABULAIRE', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais3_vocabulaire WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais3_vocabulaire WHERE visit_id = p_visit_id)),
      'WAIS3_MATRICES', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais3_matrices WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais3_matrices WHERE visit_id = p_visit_id)),
      'WAIS3_CODE_SYMBOLES', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais3_code_symboles WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais3_code_symboles WHERE visit_id = p_visit_id)),
      'WAIS3_DIGIT_SPAN', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais3_digit_span WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais3_digit_span WHERE visit_id = p_visit_id)),
      'WAIS3_LEARNING', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais3_learning WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais3_learning WHERE visit_id = p_visit_id)),
      'WAIS3_CPT2', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais3_cpt2 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais3_cpt2 WHERE visit_id = p_visit_id)),
      'SCIP', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_scip WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_scip WHERE visit_id = p_visit_id)),
      'COBRA', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_cobra WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_cobra WHERE visit_id = p_visit_id)),
      'CPT3', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_cpt3 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_cpt3 WHERE visit_id = p_visit_id)),
      'MEM3_SPATIAL', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_mem3_spatial WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_mem3_spatial WHERE visit_id = p_visit_id))
    );

    -- Bipolar initial auto (etat & traits) module
    v_statuses := v_statuses || jsonb_build_object(
      'EQ5D5L', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_eq5d5l WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_eq5d5l WHERE visit_id = p_visit_id)),
      'PRISE_M', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_prise_m WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_prise_m WHERE visit_id = p_visit_id)),
      'STAI_YA', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_stai_ya WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_stai_ya WHERE visit_id = p_visit_id)),
      'MARS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_mars WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_mars WHERE visit_id = p_visit_id)),
      'MATHYS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_mathys WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_mathys WHERE visit_id = p_visit_id)),
      'PSQI', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_psqi WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_psqi WHERE visit_id = p_visit_id)),
      'EPWORTH', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_epworth WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_epworth WHERE visit_id = p_visit_id)),
      'ASRS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_asrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_asrs WHERE visit_id = p_visit_id)),
      'CTQ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_ctq WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_ctq WHERE visit_id = p_visit_id)),
      'BIS10', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_bis10 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_bis10 WHERE visit_id = p_visit_id))
    );

    v_statuses := v_statuses || jsonb_build_object(
      'ALS18', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_als18 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_als18 WHERE visit_id = p_visit_id)),
      'AIM', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_aim WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_aim WHERE visit_id = p_visit_id)),
      'WURS25', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wurs25 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wurs25 WHERE visit_id = p_visit_id)),
      'AQ12', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_aq12 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_aq12 WHERE visit_id = p_visit_id)),
      'CSM', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_csm WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_csm WHERE visit_id = p_visit_id)),
      'CTI', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_cti WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_cti WHERE visit_id = p_visit_id))
    );

    v_statuses := v_statuses || jsonb_build_object(
      'DOSSIER_INFIRMIER_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_dossier_infirmier WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_dossier_infirmier WHERE visit_id = p_visit_id)),
      'BILAN_BIOLOGIQUE_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_bilan_biologique WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_bilan_biologique WHERE visit_id = p_visit_id))
    );

    -- Schizophrenia hetero module
    v_statuses := v_statuses || jsonb_build_object(
      'PANSS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_panss WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_panss WHERE visit_id = p_visit_id)),
      'CDSS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_cdss WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_cdss WHERE visit_id = p_visit_id)),
      'BARS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_bars WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_bars WHERE visit_id = p_visit_id)),
      'SUMD', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_sumd WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_sumd WHERE visit_id = p_visit_id)),
      'SAPS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_saps WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_saps WHERE visit_id = p_visit_id)),
      'AIMS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_aims WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_aims WHERE visit_id = p_visit_id)),
      'BARNES', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_barnes WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_barnes WHERE visit_id = p_visit_id)),
      'SAS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_sas WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_sas WHERE visit_id = p_visit_id)),
      'PSP', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_psp WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_psp WHERE visit_id = p_visit_id)),
      'BRIEF_A_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_brief_a_hetero WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_brief_a_hetero WHERE visit_id = p_visit_id)),
      'YMRS_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_ymrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_ymrs WHERE visit_id = p_visit_id)),
      'CGI_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_cgi WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_cgi WHERE visit_id = p_visit_id)),
      'EGF_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_egf WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_egf WHERE visit_id = p_visit_id))
    );

    v_statuses := v_statuses || jsonb_build_object(
      'TROUBLES_PSYCHOTIQUES', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_troubles_psychotiques WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_troubles_psychotiques WHERE visit_id = p_visit_id)),
      'TROUBLES_COMORBIDES_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_troubles_comorbides WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_troubles_comorbides WHERE visit_id = p_visit_id)),
      'TEA_COFFEE_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_tea_coffee WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_tea_coffee WHERE visit_id = p_visit_id)),
      'EVAL_ADDICTOLOGIQUE_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_eval_addictologique WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_eval_addictologique WHERE visit_id = p_visit_id)),
      'ISA_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_isa WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_isa WHERE visit_id = p_visit_id)),
      'SUICIDE_HISTORY_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_suicide_history WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_suicide_history WHERE visit_id = p_visit_id)),
      'ANTECEDENTS_FAMILIAUX_PSY_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_antecedents_familiaux_psy WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_antecedents_familiaux_psy WHERE visit_id = p_visit_id)),
      'PERINATALITE_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_perinatalite WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_perinatalite WHERE visit_id = p_visit_id)),
      'ECV', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_ecv WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_ecv WHERE visit_id = p_visit_id))
    );

    -- Schizophrenia neuropsychological module (Bloc 2 + WAIS-IV + CBQ + DACOBS + TAP)
    v_statuses := v_statuses || jsonb_build_object(
      'CVLT_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_cvlt WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_cvlt WHERE visit_id = p_visit_id)),
      'TMT_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_tmt WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_tmt WHERE visit_id = p_visit_id)),
      'COMMISSIONS_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_commissions WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_commissions WHERE visit_id = p_visit_id)),
      'LIS_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_lis WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_lis WHERE visit_id = p_visit_id)),
      'STROOP_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_stroop WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_stroop WHERE visit_id = p_visit_id)),
      'FLUENCES_VERBALES_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_fluences_verbales WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_fluences_verbales WHERE visit_id = p_visit_id)),
      'TAP_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_tap WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_tap WHERE visit_id = p_visit_id)),
      'WAIS4_CRITERIA_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_wais4_criteria WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_wais4_criteria WHERE visit_id = p_visit_id)),
      'WAIS4_EFFICIENCE_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_wais4_efficience WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_wais4_efficience WHERE visit_id = p_visit_id)),
      'WAIS4_SIMILITUDES_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_wais4_similitudes WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_wais4_similitudes WHERE visit_id = p_visit_id)),
      'WAIS4_MEMOIRE_CHIFFRES_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_wais4_memoire_chiffres WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_wais4_memoire_chiffres WHERE visit_id = p_visit_id)),
      'WAIS4_MATRICES_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_wais4_matrices WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_wais4_matrices WHERE visit_id = p_visit_id)),
      'SSTICS_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_sstics WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_sstics WHERE visit_id = p_visit_id)),
      'CBQ_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_cbq WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_cbq WHERE visit_id = p_visit_id))
    );

    v_statuses := v_statuses || jsonb_build_object(
      'DACOBS_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_dacobs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_dacobs WHERE visit_id = p_visit_id))
    );

    v_statuses := v_statuses || jsonb_build_object(
      'BILAN_SOCIAL_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_bilan_social WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_bilan_social WHERE visit_id = p_visit_id))
    );

    v_statuses := v_statuses || jsonb_build_object(
      'SQOL_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_sqol WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_sqol WHERE visit_id = p_visit_id)),
      'CTQ_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_ctq WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_ctq WHERE visit_id = p_visit_id)),
      'MARS_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_mars WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_mars WHERE visit_id = p_visit_id)),
      'BIS_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_bis WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_bis WHERE visit_id = p_visit_id)),
      'EQ5D5L_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_eq5d5l WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_eq5d5l WHERE visit_id = p_visit_id)),
      'IPAQ_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_ipaq WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_ipaq WHERE visit_id = p_visit_id)),
      'YBOCS_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_ybocs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_ybocs WHERE visit_id = p_visit_id)),
      'WURS25_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_wurs25 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_wurs25 WHERE visit_id = p_visit_id)),
      'STORI_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_stori WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_stori WHERE visit_id = p_visit_id)),
      'SOGS_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_sogs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_sogs WHERE visit_id = p_visit_id)),
      'PSQI_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_psqi WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_psqi WHERE visit_id = p_visit_id)),
      'PRESENTEISME_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_presenteisme WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_presenteisme WHERE visit_id = p_visit_id)),
      'FAGERSTROM_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_fagerstrom WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_fagerstrom WHERE visit_id = p_visit_id))
    );

    v_statuses := v_statuses || jsonb_build_object(
      'EPHP_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_ephp WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_ephp WHERE visit_id = p_visit_id))
    );

    v_statuses := v_statuses || jsonb_build_object(
      'BRIEF_A_AUTO_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_brief_a_auto WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_brief_a_auto WHERE visit_id = p_visit_id))
    );

    WITH visit_data AS (
      SELECT v.*, p.first_name, p.last_name, p.date_of_birth, p.gender, pa.type as pathology_type
      FROM visits v
      JOIN patients p ON v.patient_id = p.id
      LEFT JOIN patient_pathologies pa ON pa.patient_id = p.id
      WHERE v.id = p_visit_id
    )
    SELECT jsonb_build_object(
      'visit', jsonb_build_object(
        'id', vd.id,
        'patient_id', vd.patient_id,
        'visit_type', vd.visit_type,
        'visit_date', vd.visit_date,
        'status', vd.status,
        'created_at', vd.created_at,
        'updated_at', vd.updated_at,
        'scheduled_date', vd.scheduled_date
      ),
      'patient', jsonb_build_object(
        'id', vd.patient_id,
        'first_name', vd.first_name,
        'last_name', vd.last_name,
        'date_of_birth', vd.date_of_birth,
        'gender', vd.gender,
        'pathology_type', vd.pathology_type
      ),
      'questionnaire_statuses', v_statuses
    ) INTO v_result
    FROM visit_data vd;

    RETURN COALESCE(v_result, '{}'::jsonb);
END;
$function$;
