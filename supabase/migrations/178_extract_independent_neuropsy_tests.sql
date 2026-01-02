-- ============================================================================
-- eFondaMental Platform - Extract Independent Neuropsychological Tests
-- ============================================================================
-- This migration consolidates 5 identical tests from WAIS-III/WAIS-IV sections:
-- 1. TMT - Consolidate responses_wais3_tmt into responses_tmt
-- 2. Stroop - Consolidate responses_wais3_stroop into responses_stroop
-- 3. Fluences Verbales - Consolidate responses_wais3_fluences_verbales into responses_fluences_verbales
-- 4. Spatial Memory - Rename responses_wais3_mem3_spatial to responses_mem3_spatial
-- 
-- Benefits:
-- - Eliminates duplication (5 tests duplicated = 10 implementations -> 5)
-- - Single source of truth for updates
-- - Clearer organization showing they're independent, not WAIS subtests
-- ============================================================================

-- ============================================================================
-- PART 1: TMT Consolidation
-- ============================================================================

-- Step 1.1: Add questionnaire_version column to responses_tmt
ALTER TABLE responses_tmt
ADD COLUMN IF NOT EXISTS questionnaire_version TEXT CHECK (questionnaire_version IN ('WAIS-III', 'WAIS-IV'));

COMMENT ON COLUMN responses_tmt.questionnaire_version IS 'Tracks whether this response came from WAIS-III or WAIS-IV protocol (both use same questions/scoring)';

-- Step 1.2: Migrate existing data from responses_wais3_tmt to responses_tmt
INSERT INTO responses_tmt (
    id,
    visit_id,
    patient_id,
    patient_age,
    years_of_education,
    tmta_tps,
    tmta_err,
    tmta_cor,
    tmtb_tps,
    tmtb_err,
    tmtb_cor,
    tmtb_err_persev,
    tmta_errtot,
    tmta_tps_z,
    tmta_tps_pc,
    tmta_errtot_z,
    tmtb_errtot,
    tmtb_tps_z,
    tmtb_tps_pc,
    tmtb_errtot_z,
    tmtb_err_persev_z,
    tmt_b_a_tps,
    tmt_b_a_tps_z,
    questionnaire_version,
    completed_by,
    completed_at,
    created_at,
    updated_at
)
SELECT 
    id,
    visit_id,
    patient_id,
    patient_age,
    years_of_education,
    tmta_tps,
    tmta_err,
    tmta_cor,
    tmtb_tps,
    tmtb_err,
    tmtb_cor,
    tmtb_err_persev,
    tmta_errtot,
    tmta_tps_z,
    tmta_tps_pc,
    tmta_errtot_z,
    tmtb_errtot,
    tmtb_tps_z,
    tmtb_tps_pc,
    tmtb_errtot_z,
    tmtb_err_persev_z,
    tmt_b_a_tps,
    tmt_b_a_tps_z,
    'WAIS-III' as questionnaire_version,
    completed_by,
    completed_at,
    created_at,
    updated_at
FROM responses_wais3_tmt
ON CONFLICT (visit_id) DO NOTHING;

COMMENT ON TABLE responses_tmt IS 'Trail Making Test responses - unified for both WAIS-III and WAIS-IV protocols (identical questions and scoring)';

-- ============================================================================
-- PART 2: Stroop Consolidation
-- ============================================================================

-- Step 2.1: Add questionnaire_version column to responses_stroop
ALTER TABLE responses_stroop
ADD COLUMN IF NOT EXISTS questionnaire_version TEXT CHECK (questionnaire_version IN ('WAIS-III', 'WAIS-IV'));

COMMENT ON COLUMN responses_stroop.questionnaire_version IS 'Tracks whether this response came from WAIS-III or WAIS-IV protocol (both use same questions/scoring)';

-- Step 2.2: Migrate existing data from responses_wais3_stroop to responses_stroop
INSERT INTO responses_stroop (
    id,
    visit_id,
    patient_id,
    patient_age,
    stroop_w_tot,
    stroop_c_tot,
    stroop_cw_tot,
    stroop_w_tot_c,
    stroop_c_tot_c,
    stroop_cw_tot_c,
    stroop_interf,
    stroop_w_note_t,
    stroop_c_note_t,
    stroop_cw_note_t,
    stroop_interf_note_t,
    stroop_w_note_t_corrigee,
    stroop_c_note_t_corrigee,
    stroop_cw_note_t_corrigee,
    stroop_interf_note_tz,
    questionnaire_version,
    completed_by,
    completed_at,
    created_at,
    updated_at
)
SELECT 
    id,
    visit_id,
    patient_id,
    patient_age,
    stroop_w_tot,
    stroop_c_tot,
    stroop_cw_tot,
    stroop_w_tot_c,
    stroop_c_tot_c,
    stroop_cw_tot_c,
    stroop_interf,
    stroop_w_note_t,
    stroop_c_note_t,
    stroop_cw_note_t,
    stroop_interf_note_t,
    stroop_w_note_t_corrigee,
    stroop_c_note_t_corrigee,
    stroop_cw_note_t_corrigee,
    stroop_interf_note_tz,
    'WAIS-III' as questionnaire_version,
    completed_by,
    completed_at,
    created_at,
    updated_at
FROM responses_wais3_stroop
ON CONFLICT (visit_id) DO NOTHING;

COMMENT ON TABLE responses_stroop IS 'Stroop Test responses - unified for both WAIS-III and WAIS-IV protocols (identical questions and scoring)';

-- ============================================================================
-- PART 3: Fluences Verbales Consolidation
-- ============================================================================

-- Step 3.1: Add questionnaire_version column to responses_fluences_verbales
ALTER TABLE responses_fluences_verbales
ADD COLUMN IF NOT EXISTS questionnaire_version TEXT CHECK (questionnaire_version IN ('WAIS-III', 'WAIS-IV'));

COMMENT ON COLUMN responses_fluences_verbales.questionnaire_version IS 'Tracks whether this response came from WAIS-III or WAIS-IV protocol (both use same questions/scoring)';

-- Step 3.2: Migrate existing data from responses_wais3_fluences_verbales to responses_fluences_verbales
INSERT INTO responses_fluences_verbales (
    id,
    visit_id,
    patient_id,
    patient_age,
    years_of_education,
    fv_p_tot_correct,
    fv_p_deriv,
    fv_p_intrus,
    fv_p_propres,
    fv_p_tot_rupregle,
    fv_p_tot_correct_z,
    fv_p_tot_correct_pc,
    fv_anim_tot_correct,
    fv_anim_deriv,
    fv_anim_intrus,
    fv_anim_propres,
    fv_anim_tot_rupregle,
    fv_anim_tot_correct_z,
    fv_anim_tot_correct_pc,
    questionnaire_version,
    completed_by,
    completed_at,
    created_at,
    updated_at
)
SELECT 
    id,
    visit_id,
    patient_id,
    patient_age,
    years_of_education,
    fv_p_tot_correct,
    fv_p_deriv,
    fv_p_intrus,
    fv_p_propres,
    fv_p_tot_rupregle,
    fv_p_tot_correct_z,
    fv_p_tot_correct_pc,
    fv_anim_tot_correct,
    fv_anim_deriv,
    fv_anim_intrus,
    fv_anim_propres,
    fv_anim_tot_rupregle,
    fv_anim_tot_correct_z,
    fv_anim_tot_correct_pc,
    'WAIS-III' as questionnaire_version,
    completed_by,
    completed_at,
    created_at,
    updated_at
FROM responses_wais3_fluences_verbales
ON CONFLICT (visit_id) DO NOTHING;

COMMENT ON TABLE responses_fluences_verbales IS 'Fluences Verbales responses - unified for both WAIS-III and WAIS-IV protocols (identical questions and scoring)';

-- ============================================================================
-- PART 4: Spatial Memory Rename
-- ============================================================================

-- Rename the table from responses_wais3_mem3_spatial to responses_mem3_spatial
-- This test is independent of WAIS version

ALTER TABLE responses_wais3_mem3_spatial RENAME TO responses_mem3_spatial;

-- Rename indexes
ALTER INDEX IF EXISTS idx_responses_wais3_mem3_spatial_visit RENAME TO idx_responses_mem3_spatial_visit;
ALTER INDEX IF EXISTS idx_responses_wais3_mem3_spatial_patient RENAME TO idx_responses_mem3_spatial_patient;

-- Rename trigger
DROP TRIGGER IF EXISTS update_responses_wais3_mem3_spatial_updated_at ON responses_mem3_spatial;
CREATE TRIGGER update_responses_mem3_spatial_updated_at
    BEFORE UPDATE ON responses_mem3_spatial
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Rename policies
DROP POLICY IF EXISTS "Patients view own MEM-3 spatial" ON responses_mem3_spatial;
DROP POLICY IF EXISTS "Pros view all MEM-3 spatial" ON responses_mem3_spatial;
DROP POLICY IF EXISTS "Pros insert MEM-3 spatial" ON responses_mem3_spatial;
DROP POLICY IF EXISTS "Pros update MEM-3 spatial" ON responses_mem3_spatial;

CREATE POLICY "Patients view own MEM-3 spatial" 
ON responses_mem3_spatial FOR SELECT 
USING (auth.uid() = patient_id);

CREATE POLICY "Pros view all MEM-3 spatial" 
ON responses_mem3_spatial FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
);

CREATE POLICY "Pros insert MEM-3 spatial" 
ON responses_mem3_spatial FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
);

CREATE POLICY "Pros update MEM-3 spatial" 
ON responses_mem3_spatial FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
);

COMMENT ON TABLE responses_mem3_spatial IS 'MEM-III Spatial Memory responses - independent neuropsychological test';

-- ============================================================================
-- PART 5: Update RPC Function
-- ============================================================================

-- Update the get_visit_detail_data RPC to use unified tables
CREATE OR REPLACE FUNCTION get_visit_detail_data(p_visit_id UUID)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result jsonb;
  v_visit_type text;
  v_smoking_status text;
  v_fagerstrom_required boolean;
BEGIN
  -- Get visit type
  SELECT visit_type INTO v_visit_type FROM visits WHERE id = p_visit_id;
  
  IF v_visit_type = 'screening' THEN
    WITH visit_data AS (
      SELECT v.*, p.first_name, p.last_name, p.date_of_birth, p.gender
      FROM visits v
      JOIN patients p ON v.patient_id = p.id
      WHERE v.id = p_visit_id
    ),
    questionnaire_statuses AS (
      SELECT jsonb_build_object(
        'ASRM_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_asrm WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_asrm WHERE visit_id = p_visit_id)),
        'QIDS_SR16_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_qids_sr16 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_qids_sr16 WHERE visit_id = p_visit_id)),
        'MDQ_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_mdq WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_mdq WHERE visit_id = p_visit_id)),
        'MEDICAL_DIAGNOSTIC_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_medical_diagnostic WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_medical_diagnostic WHERE visit_id = p_visit_id)),
        'BIPOLAR_ORIENTATION_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_bipolar_orientation WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_bipolar_orientation WHERE visit_id = p_visit_id))
      ) AS statuses
    ),
    completion_calc AS (
      SELECT 5 AS total_questionnaires,
        ((CASE WHEN EXISTS (SELECT 1 FROM responses_asrm WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
         (CASE WHEN EXISTS (SELECT 1 FROM responses_qids_sr16 WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
         (CASE WHEN EXISTS (SELECT 1 FROM responses_mdq WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
         (CASE WHEN EXISTS (SELECT 1 FROM responses_medical_diagnostic WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
         (CASE WHEN EXISTS (SELECT 1 FROM responses_bipolar_orientation WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END)) AS completed_questionnaires
    )
    SELECT jsonb_build_object(
      'visit', (SELECT row_to_json(vd.*) FROM visit_data vd),
      'questionnaire_statuses', (SELECT statuses FROM questionnaire_statuses),
      'completion_status', (SELECT jsonb_build_object('total_questionnaires', total_questionnaires, 'completed_questionnaires', completed_questionnaires, 'completion_percentage', CASE WHEN total_questionnaires > 0 THEN ROUND((completed_questionnaires::numeric / total_questionnaires::numeric) * 100) ELSE 0 END) FROM completion_calc)
    ) INTO v_result;

  ELSIF v_visit_type = 'initial_evaluation' THEN
    -- Check tobacco response to determine if Fagerstrom is required
    SELECT smoking_status INTO v_smoking_status 
    FROM responses_tobacco 
    WHERE visit_id = p_visit_id;
    
    -- Fagerstrom is required only if smoking_status is 'current_smoker' or 'ex_smoker'
    v_fagerstrom_required := v_smoking_status IN ('current_smoker', 'ex_smoker');
    
    WITH visit_data AS (
      SELECT v.*, p.first_name, p.last_name, p.date_of_birth, p.gender
      FROM visits v
      JOIN patients p ON v.patient_id = p.id
      WHERE v.id = p_visit_id
    ),
    -- Split questionnaire statuses into multiple CTEs to avoid argument limit
    statuses_etat AS (
      SELECT jsonb_build_object(
        'EQ5D5L_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_eq5d5l WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_eq5d5l WHERE visit_id = p_visit_id)),
        'PRISE_M_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_prise_m WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_prise_m WHERE visit_id = p_visit_id)),
        'STAI_YA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_stai_ya WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_stai_ya WHERE visit_id = p_visit_id)),
        'MARS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_mars WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_mars WHERE visit_id = p_visit_id)),
        'MATHYS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_mathys WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_mathys WHERE visit_id = p_visit_id)),
        'ASRM_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_asrm WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_asrm WHERE visit_id = p_visit_id)),
        'QIDS_SR16_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_qids_sr16 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_qids_sr16 WHERE visit_id = p_visit_id)),
        'PSQI_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_psqi WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_psqi WHERE visit_id = p_visit_id)),
        'EPWORTH_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_epworth WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_epworth WHERE visit_id = p_visit_id))
      ) AS statuses
    ),
    statuses_traits AS (
      SELECT jsonb_build_object(
        'ASRS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_asrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_asrs WHERE visit_id = p_visit_id)),
        'CTQ_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_ctq WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_ctq WHERE visit_id = p_visit_id)),
        'BIS10_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_bis10 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_bis10 WHERE visit_id = p_visit_id)),
        'ALS18_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_als18 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_als18 WHERE visit_id = p_visit_id)),
        'AIM_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_aim WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_aim WHERE visit_id = p_visit_id)),
        'WURS25_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wurs25 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wurs25 WHERE visit_id = p_visit_id)),
        'AQ12_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_aq12 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_aq12 WHERE visit_id = p_visit_id)),
        'CSM_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_csm WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_csm WHERE visit_id = p_visit_id)),
        'CTI_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cti WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cti WHERE visit_id = p_visit_id))
      ) AS statuses
    ),
    statuses_hetero AS (
      SELECT jsonb_build_object(
        'MADRS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_madrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_madrs WHERE visit_id = p_visit_id)),
        'YMRS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_ymrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_ymrs WHERE visit_id = p_visit_id)),
        'CGI_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cgi WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cgi WHERE visit_id = p_visit_id)),
        'EGF_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_egf WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_egf WHERE visit_id = p_visit_id)),
        'ALDA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_alda WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_alda WHERE visit_id = p_visit_id)),
        'ETAT_PATIENT_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_etat_patient WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_etat_patient WHERE visit_id = p_visit_id)),
        'FAST_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_fast WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_fast WHERE visit_id = p_visit_id)),
        'SOCIAL_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_social WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_social WHERE visit_id = p_visit_id))
      ) AS statuses
    ),
    statuses_infirmier AS (
      SELECT jsonb_build_object(
        'TOBACCO_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_tobacco WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_tobacco WHERE visit_id = p_visit_id)),
        'FAGERSTROM_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_fagerstrom WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_fagerstrom WHERE visit_id = p_visit_id)),
        'PHYSICAL_PARAMS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_physical_params WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_physical_params WHERE visit_id = p_visit_id)),
        'BLOOD_PRESSURE_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_blood_pressure WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_blood_pressure WHERE visit_id = p_visit_id)),
        'ECG_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_ecg WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_ecg WHERE visit_id = p_visit_id)),
        'SLEEP_APNEA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_sleep_apnea WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_sleep_apnea WHERE visit_id = p_visit_id)),
        'BIOLOGICAL_ASSESSMENT_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_biological_assessment WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_biological_assessment WHERE visit_id = p_visit_id))
      ) AS statuses
    ),
    statuses_medical AS (
      SELECT jsonb_build_object(
        'DSM5_HUMEUR_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_dsm5_humeur WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_dsm5_humeur WHERE visit_id = p_visit_id)),
        'DSM5_PSYCHOTIC_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_dsm5_psychotic WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_dsm5_psychotic WHERE visit_id = p_visit_id)),
        'DSM5_COMORBID_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_dsm5_comorbid WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_dsm5_comorbid WHERE visit_id = p_visit_id)),
        'DIVA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_diva WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_diva WHERE visit_id = p_visit_id)),
        'FAMILY_HISTORY_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_family_history WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_family_history WHERE visit_id = p_visit_id)),
        'CSSRS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cssrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cssrs WHERE visit_id = p_visit_id)),
        'ISA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_isa WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_isa WHERE visit_id = p_visit_id)),
        'SIS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_sis WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_sis WHERE visit_id = p_visit_id)),
        'SUICIDE_HISTORY_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_suicide_history WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_suicide_history WHERE visit_id = p_visit_id))
      ) AS statuses
    ),
    statuses_medical2 AS (
      SELECT jsonb_build_object(
        'PERINATALITE_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_perinatalite WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_perinatalite WHERE visit_id = p_visit_id)),
        'PATHO_NEURO_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_patho_neuro WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_patho_neuro WHERE visit_id = p_visit_id)),
        'PATHO_CARDIO_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_patho_cardio WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_patho_cardio WHERE visit_id = p_visit_id)),
        'PATHO_ENDOC_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_patho_endoc WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_patho_endoc WHERE visit_id = p_visit_id)),
        'PATHO_DERMATO_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_patho_dermato WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_patho_dermato WHERE visit_id = p_visit_id)),
        'PATHO_URINAIRE_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_patho_urinaire WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_patho_urinaire WHERE visit_id = p_visit_id)),
        'ANTECEDENTS_GYNECO_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_antecedents_gyneco WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_antecedents_gyneco WHERE visit_id = p_visit_id)),
        'PATHO_HEPATO_GASTRO_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_patho_hepato_gastro WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_patho_hepato_gastro WHERE visit_id = p_visit_id)),
        'PATHO_ALLERGIQUE_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_patho_allergique WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_patho_allergique WHERE visit_id = p_visit_id))
      ) AS statuses
    ),
    statuses_medical3 AS (
      SELECT jsonb_build_object(
        'AUTRES_PATHO_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_autres_patho WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_autres_patho WHERE visit_id = p_visit_id))
      ) AS statuses
    ),
    -- Independent neuropsychological tests (now unified)
    statuses_neuropsy_independent AS (
      SELECT jsonb_build_object(
        'CVLT_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cvlt WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cvlt WHERE visit_id = p_visit_id)),
        'TMT_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_tmt WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_tmt WHERE visit_id = p_visit_id)),
        'STROOP_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_stroop WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_stroop WHERE visit_id = p_visit_id)),
        'FLUENCES_VERBALES_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_fluences_verbales WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_fluences_verbales WHERE visit_id = p_visit_id)),
        'MEM3_SPATIAL_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_mem3_spatial WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_mem3_spatial WHERE visit_id = p_visit_id))
      ) AS statuses
    ),
    -- WAIS-IV specific tests
    statuses_wais4 AS (
      SELECT jsonb_build_object(
        'WAIS4_CRITERIA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais4_criteria WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais4_criteria WHERE visit_id = p_visit_id)),
        'WAIS4_LEARNING_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais4_learning WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais4_learning WHERE visit_id = p_visit_id)),
        'WAIS4_MATRICES_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais4_matrices WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais4_matrices WHERE visit_id = p_visit_id)),
        'WAIS_IV_CODE_SYMBOLES_IVT', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais4_code WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais4_code WHERE visit_id = p_visit_id)),
        'WAIS4_DIGIT_SPAN_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais4_digit_span WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais4_digit_span WHERE visit_id = p_visit_id)),
        'WAIS4_SIMILITUDES_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais4_similitudes WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais4_similitudes WHERE visit_id = p_visit_id)),
        'COBRA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cobra WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cobra WHERE visit_id = p_visit_id)),
        'CPT3_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cpt3 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cpt3 WHERE visit_id = p_visit_id)),
        'TEST_COMMISSIONS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_test_commissions WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_test_commissions WHERE visit_id = p_visit_id))
      ) AS statuses
    ),
    statuses_wais4_2 AS (
      SELECT jsonb_build_object(
        'SCIP_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_scip WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_scip WHERE visit_id = p_visit_id))
      ) AS statuses
    ),
    -- WAIS-III specific tests (no longer includes TMT, Stroop, Fluences, Spatial)
    statuses_wais3 AS (
      SELECT jsonb_build_object(
        'WAIS3_CRITERIA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais3_criteria WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais3_criteria WHERE visit_id = p_visit_id)),
        'WAIS3_LEARNING_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais3_learning WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais3_learning WHERE visit_id = p_visit_id)),
        'WAIS3_VOCABULAIRE_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais3_vocabulaire WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais3_vocabulaire WHERE visit_id = p_visit_id)),
        'WAIS3_MATRICES_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais3_matrices WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais3_matrices WHERE visit_id = p_visit_id)),
        'WAIS3_CODE_SYMBOLES_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais3_code_symboles WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais3_code_symboles WHERE visit_id = p_visit_id)),
        'WAIS3_DIGIT_SPAN_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais3_digit_span WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais3_digit_span WHERE visit_id = p_visit_id)),
        'WAIS3_CPT2_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais3_cpt2 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais3_cpt2 WHERE visit_id = p_visit_id))
      ) AS statuses
    ),
    questionnaire_statuses AS (
      SELECT (SELECT statuses FROM statuses_etat) || 
             (SELECT statuses FROM statuses_traits) || 
             (SELECT statuses FROM statuses_hetero) || 
             (SELECT statuses FROM statuses_infirmier) || 
             (SELECT statuses FROM statuses_medical) || 
             (SELECT statuses FROM statuses_medical2) ||
             (SELECT statuses FROM statuses_medical3) ||
             (SELECT statuses FROM statuses_neuropsy_independent) ||
             (SELECT statuses FROM statuses_wais4) ||
             (SELECT statuses FROM statuses_wais4_2) ||
             (SELECT statuses FROM statuses_wais3) AS statuses
    ),
    completion_calc AS (
      SELECT 
        -- Total is now 73 if Fagerstrom required, 72 otherwise
        -- (5 independent + 10 WAIS-IV + 7 WAIS-III = 22 neuropsy, rest same)
        CASE WHEN v_fagerstrom_required THEN 73 ELSE 72 END AS total_questionnaires,
        (
          -- ETAT questionnaires (9)
          (CASE WHEN EXISTS (SELECT 1 FROM responses_eq5d5l WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_prise_m WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_stai_ya WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_mars WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_mathys WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_asrm WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_qids_sr16 WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_psqi WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_epworth WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          -- TRAITS questionnaires (9)
          (CASE WHEN EXISTS (SELECT 1 FROM responses_asrs WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_ctq WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_bis10 WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_als18 WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_aim WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_wurs25 WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_aq12 WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_csm WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_cti WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          -- HETERO questionnaires (8)
          (CASE WHEN EXISTS (SELECT 1 FROM responses_madrs WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_ymrs WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_cgi WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_egf WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_alda WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_etat_patient WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_fast WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_social WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          -- INFIRMIER questionnaires (6 or 7 depending on Fagerstrom)
          (CASE WHEN EXISTS (SELECT 1 FROM responses_tobacco WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN v_fagerstrom_required AND EXISTS (SELECT 1 FROM responses_fagerstrom WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_physical_params WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_blood_pressure WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_ecg WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_sleep_apnea WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_biological_assessment WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          -- MEDICAL questionnaires (19)
          (CASE WHEN EXISTS (SELECT 1 FROM responses_dsm5_humeur WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_dsm5_psychotic WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_dsm5_comorbid WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_diva WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_family_history WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_cssrs WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_isa WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_sis WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_suicide_history WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_perinatalite WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_patho_neuro WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_patho_cardio WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_patho_endoc WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_patho_dermato WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_patho_urinaire WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_antecedents_gyneco WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_patho_hepato_gastro WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_patho_allergique WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_autres_patho WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          -- Independent neuropsychological tests (5)
          (CASE WHEN EXISTS (SELECT 1 FROM responses_cvlt WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_tmt WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_stroop WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_fluences_verbales WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_mem3_spatial WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          -- WAIS-IV specific (10)
          (CASE WHEN EXISTS (SELECT 1 FROM responses_wais4_criteria WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_wais4_learning WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_wais4_matrices WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_wais4_code WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_wais4_digit_span WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_wais4_similitudes WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_cobra WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_cpt3 WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_test_commissions WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_scip WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          -- WAIS-III specific (7)
          (CASE WHEN EXISTS (SELECT 1 FROM responses_wais3_criteria WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_wais3_learning WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_wais3_vocabulaire WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_wais3_matrices WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_wais3_code_symboles WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_wais3_digit_span WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + 
          (CASE WHEN EXISTS (SELECT 1 FROM responses_wais3_cpt2 WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END)
        ) AS completed_questionnaires
    )
    SELECT jsonb_build_object(
      'visit', (SELECT row_to_json(vd.*) FROM visit_data vd),
      'questionnaire_statuses', (SELECT statuses FROM questionnaire_statuses),
      'completion_status', (SELECT jsonb_build_object(
        'total_questionnaires', total_questionnaires, 
        'completed_questionnaires', completed_questionnaires, 
        'completion_percentage', CASE WHEN total_questionnaires > 0 THEN ROUND((completed_questionnaires::numeric / total_questionnaires::numeric) * 100) ELSE 0 END
      ) FROM completion_calc)
    ) INTO v_result;
  
  ELSIF v_visit_type IN ('biannual_followup', 'annual_evaluation') THEN
    -- Follow-up visits remain unchanged
    WITH visit_data AS (
      SELECT v.*, p.first_name, p.last_name, p.date_of_birth, p.gender
      FROM visits v
      JOIN patients p ON v.patient_id = p.id
      WHERE v.id = p_visit_id
    ),
    questionnaire_statuses AS (
      SELECT jsonb_build_object(
        'ASRM_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_asrm WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_asrm WHERE visit_id = p_visit_id)),
        'QIDS_SR16_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_qids_sr16 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_qids_sr16 WHERE visit_id = p_visit_id)),
        'MADRS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_madrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_madrs WHERE visit_id = p_visit_id)),
        'YMRS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_ymrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_ymrs WHERE visit_id = p_visit_id)),
        'CGI_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cgi WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cgi WHERE visit_id = p_visit_id)),
        'DSM5_COMORBID_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_dsm5_comorbid WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_dsm5_comorbid WHERE visit_id = p_visit_id)),
        'DIVA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_diva WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_diva WHERE visit_id = p_visit_id)),
        'CSSRS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cssrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cssrs WHERE visit_id = p_visit_id)),
        'ISA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_isa WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_isa WHERE visit_id = p_visit_id)),
        'EQ5D5L_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_eq5d5l WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_eq5d5l WHERE visit_id = p_visit_id)),
        'MARS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_mars WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_mars WHERE visit_id = p_visit_id)),
        'PSQI_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_psqi WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_psqi WHERE visit_id = p_visit_id)),
        'EPWORTH_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_epworth WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_epworth WHERE visit_id = p_visit_id)),
        'FAST_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_fast WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_fast WHERE visit_id = p_visit_id))
      ) AS statuses
    ),
    completion_calc AS (
      SELECT 14 AS total_questionnaires,
        ((CASE WHEN EXISTS (SELECT 1 FROM responses_asrm WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
         (CASE WHEN EXISTS (SELECT 1 FROM responses_qids_sr16 WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
         (CASE WHEN EXISTS (SELECT 1 FROM responses_madrs WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
         (CASE WHEN EXISTS (SELECT 1 FROM responses_ymrs WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
         (CASE WHEN EXISTS (SELECT 1 FROM responses_cgi WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
         (CASE WHEN EXISTS (SELECT 1 FROM responses_dsm5_comorbid WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
         (CASE WHEN EXISTS (SELECT 1 FROM responses_diva WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
         (CASE WHEN EXISTS (SELECT 1 FROM responses_cssrs WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
         (CASE WHEN EXISTS (SELECT 1 FROM responses_isa WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
         (CASE WHEN EXISTS (SELECT 1 FROM responses_eq5d5l WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
         (CASE WHEN EXISTS (SELECT 1 FROM responses_mars WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
         (CASE WHEN EXISTS (SELECT 1 FROM responses_psqi WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
         (CASE WHEN EXISTS (SELECT 1 FROM responses_epworth WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
         (CASE WHEN EXISTS (SELECT 1 FROM responses_fast WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END)) AS completed_questionnaires
    )
    SELECT jsonb_build_object(
      'visit', (SELECT row_to_json(vd.*) FROM visit_data vd),
      'questionnaire_statuses', (SELECT statuses FROM questionnaire_statuses),
      'completion_status', (SELECT jsonb_build_object('total_questionnaires', total_questionnaires, 'completed_questionnaires', completed_questionnaires, 'completion_percentage', CASE WHEN total_questionnaires > 0 THEN ROUND((completed_questionnaires::numeric / total_questionnaires::numeric) * 100) ELSE 0 END) FROM completion_calc)
    ) INTO v_result;
    
  ELSE
    -- Unknown visit type
    v_result := jsonb_build_object('error', 'Unknown visit type: ' || v_visit_type);
  END IF;

  RETURN v_result;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_visit_detail_data(UUID) TO authenticated;

-- ============================================================================
-- PART 6: Backward Compatibility - Keep old questionnaire codes working
-- ============================================================================
-- The old codes (WAIS3_TMT_FR, etc.) will map to the unified tables in application code
-- No database changes needed for this - handled in TypeScript

-- ============================================================================
-- Safety: Comment out table drops (run manually after verifying migration)
-- ============================================================================
-- DROP TABLE IF EXISTS responses_wais3_tmt;
-- DROP TABLE IF EXISTS responses_wais3_stroop;
-- DROP TABLE IF EXISTS responses_wais3_fluences_verbales;

