BEGIN;

DROP TABLE IF EXISTS "public"."schizophrenia_troubles_psychotiques";

CREATE TABLE IF NOT EXISTS "public"."schizophrenia_troubles_psychotiques" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,

    "rad_tbpsycho_spectre" "text",
    "rad_tbpsycho_type" "text",

    "rad_tbpsychovie" "text",
    "radhtml_tbpsychovie_type" "text",
    "radhtml_tbpsychovie_non" "text",
    "tbpsychovie_non_autre" character varying,
    "rad_tbpsychovie_premierep_age" "text",
    "rad_tbpsychovie_premiertrait_age" "text",
    "tbpsychovie_premiertrait_duree" character varying,
    "rad_tbpsychovie_premierhosp_age" "text",
    "tbduree" character varying,
    "tbdureetot" character varying,
    "rad_tbpsychovie_hospit_nb" "text",
    "rad_tbpsychovie_hospit_dureetot" "text",
    "rad_tbpsychovie_nb" "text",
    "rad_tbpsychovie_ep1_type" "text",
    "tbpsychovie_ep1_debut" character varying,
    "rad_tbpsychovie_ep1_hosp" "text",
    "tbpsychovie_ep1_hospduree" character varying,
    "rad_tbpsychovie_ep2_type" "text",
    "tbpsychovie_ep2_debut" character varying,
    "rad_tbpsychovie_ep2_hosp" "text",
    "tbpsychovie_ep2_hospduree" character varying,
    "rad_tbpsychovie_ep3_type" "text",
    "tbpsychovie_ep3_debut" character varying,
    "rad_tbpsychovie_ep3_hosp" "text",
    "tbpsychovie_ep3_hospduree" character varying,
    "rad_tbpsychovie_ep4_type" "text",
    "tbpsychovie_ep4_debut" character varying,
    "rad_tbpsychovie_ep4_hosp" "text",
    "tbpsychovie_ep4_hospduree" character varying,
    "rad_tbpsychovie_ep5_type" "text",
    "tbpsychovie_ep5_debut" character varying,
    "rad_tbpsychovie_ep5_hosp" "text",
    "tbpsychovie_ep5_hospduree" character varying,
    "rad_tbpsychovie_ep6_type" "text",
    "tbpsychovie_ep6_debut" character varying,
    "rad_tbpsychovie_ep6_hosp" "text",
    "tbpsychovie_ep6_hospduree" character varying,
    "rad_tbpsychovie_ep7_type" "text",
    "tbpsychovie_ep7_debut" character varying,
    "rad_tbpsychovie_ep7_hosp" "text",
    "tbpsychovie_ep7_hospduree" character varying,
    "rad_tbpsychovie_ep8_type" "text",
    "tbpsychovie_ep8_debut" character varying,
    "rad_tbpsychovie_ep8_hosp" "text",
    "tbpsychovie_ep8_hospduree" character varying,
    "rad_tbpsychovie_ep9_type" "text",
    "tbpsychovie_ep9_debut" character varying,
    "rad_tbpsychovie_ep9_hosp" "text",
    "tbpsychovie_ep9_hospduree" character varying,
    "rad_tbpsychovie_ep10_type" "text",
    "tbpsychovie_ep10_debut" character varying,
    "rad_tbpsychovie_ep10_hosp" "text",
    "tbpsychovie_ep10_hospduree" character varying,
    "rad_tbpsychovie_ep11_type" "text",
    "tbpsychovie_ep11_debut" character varying,
    "rad_tbpsychovie_ep11_hosp" "text",
    "tbpsychovie_ep11_hospduree" character varying,
    "rad_tbpsychovie_ep12_type" "text",
    "tbpsychovie_ep12_debut" character varying,
    "rad_tbpsychovie_ep12_hosp" "text",
    "tbpsychovie_ep12_hospduree" character varying,
    "rad_tbpsychovie_ep13_type" "text",
    "tbpsychovie_ep13_debut" character varying,
    "rad_tbpsychovie_ep13_hosp" "text",
    "tbpsychovie_ep13_hospduree" character varying,
    "rad_tbpsychovie_ep14_type" "text",
    "tbpsychovie_ep14_debut" character varying,
    "rad_tbpsychovie_ep14_hosp" "text",
    "tbpsychovie_ep14_hospduree" character varying,
    "rad_tbpsychovie_ep15_type" "text",
    "tbpsychovie_ep15_debut" character varying,
    "rad_tbpsychovie_ep15_hosp" "text",
    "tbpsychovie_ep15_hospduree" character varying,
    "rad_tbpsychovie_ep16_type" "text",
    "tbpsychovie_ep16_debut" character varying,
    "rad_tbpsychovie_ep16_hosp" "text",
    "tbpsychovie_ep16_hospduree" character varying,
    "rad_tbpsychovie_ep17_type" "text",
    "tbpsychovie_ep17_debut" character varying,
    "rad_tbpsychovie_ep17_hosp" "text",
    "tbpsychovie_ep17_hospduree" character varying,
    "rad_tbpsychovie_ep18_type" "text",
    "tbpsychovie_ep18_debut" character varying,
    "rad_tbpsychovie_ep18_hosp" "text",
    "tbpsychovie_ep18_hospduree" character varying,
    "rad_tbpsychovie_ep19_type" "text",
    "tbpsychovie_ep19_debut" character varying,
    "rad_tbpsychovie_ep19_hosp" "text",
    "tbpsychovie_ep19_hospduree" character varying,
    "rad_tbpsychovie_ep20_type" "text",
    "tbpsychovie_ep20_debut" character varying,
    "rad_tbpsychovie_ep20_hosp" "text",
    "tbpsychovie_ep20_hospduree" character varying,

    "rad_symptomesvie_persecution" "text",
    "rad_symptomesvie_persecution_mois" "text",
    "rad_symptomesvie_grandeur" "text",
    "rad_symptomesvie_grandeur_mois" "text",
    "rad_symptomesvie_somatique" "text",
    "rad_symptomesvie_somatique_mois" "text",
    "rad_symptomesvie_mystique" "text",
    "rad_symptomesvie_mystique_mois" "text",
    "rad_symptomesvie_culpabilite" "text",
    "rad_symptomesvie_culpabilite_mois" "text",
    "rad_symptomesvie_jalousie" "text",
    "rad_symptomesvie_jalousie_mois" "text",
    "rad_symptomesvie_erotomaniaque" "text",
    "rad_symptomesvie_erotomaniaque_mois" "text",
    "rad_symptomesvie_etrecontrole" "text",
    "rad_symptomesvie_etrecontrole_mois" "text",
    "rad_symptomesvie_volpensee" "text",
    "rad_symptomesvie_volpensee_mois" "text",
    "rad_symptomesvie_bizarre" "text",
    "rad_symptomesvie_bizarre_mois" "text",
    "rad_symptomesvie_idreferences" "text",
    "rad_symptomesvie_idreferences_mois" "text",
    "rad_symptomesvie_halluintrapsy" "text",
    "rad_symptomesvie_halluintrapsy_mois" "text",
    "rad_symptomesvie_hallusenso" "text",
    "rad_symptomesvie_hallusenso_mois" "text",
    "rad_symptomesvie_halluvisu" "text",
    "rad_symptomesvie_halluvisu_mois" "text",
    "rad_symptomesvie_hallucenesthe" "text",
    "rad_symptomesvie_hallucenesthe_mois" "text",
    "rad_symptomesvie_catatonie" "text",
    "rad_symptomesvie_catatonie_mois" "text",
    "rad_symptomesvie_compodesorg" "text",
    "rad_symptomesvie_compodesorg_mois" "text",
    "rad_symptomesvie_gestdiscord" "text",
    "rad_symptomesvie_gestdiscord_mois" "text",
    "rad_symptomesvie_discdesorg" "text",
    "rad_symptomesvie_discdesorg_mois" "text",
    "rad_symptomesvie_avolition" "text",
    "rad_symptomesvie_avolition_mois" "text",
    "rad_symptomesvie_alogie" "text",
    "rad_symptomesvie_alogie_mois" "text",
    "rad_symptomesvie_emousaffec" "text",
    "rad_symptomesvie_emousaffec_mois" "text",

    "rad_symptomeevo_mode" "text",
    "rad_tbpsychovie_mode_evolutif" "text",

    "rad_tbpsychoan" "text",
    "rad_tbpsychoan_hospi_tpscomplet" "text",
    "rad_tbpsychoan_hospi_tpscomplet_nb" "text",
    "rad_tbpsychoan_hospi_tpscomplet_duree" "text",
    "rad_tbpsychoan_hospi_tpscomplet_motif" "text",
    "rad_tbpsychoan_modpec_nonmed" "text",
    "chk_tbpsychoan_modpec_nonmed_tcc" "text"[],
    "chk_tbpsychoan_modpec_nonmed_remed" "text"[],
    "chk_tbpsychoan_modpec_nonmed_psychody" "text"[],
    "chk_tbpsychoan_modpec_nonmed_fam" "text"[],
    "tbpsychoan_modpec_nonmed_autre" character varying,
    "chk_aide_prise_tt" "text"[],
    "rad_aide_prise_tt_hospi" "text",
    "rad_tbpsychoan_ts" "text",
    "rad_tbpsychoan_ts_nb" "text",

    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),

    CONSTRAINT "schizophrenia_troubles_psychotiques_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "schizophrenia_troubles_psychotiques_visit_id_key" UNIQUE ("visit_id"),
    CONSTRAINT "schizophrenia_troubles_psychotiques_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id"),
    CONSTRAINT "schizophrenia_troubles_psychotiques_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE,
    CONSTRAINT "schizophrenia_troubles_psychotiques_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE
);

ALTER TABLE "public"."schizophrenia_troubles_psychotiques" OWNER TO "postgres";

ALTER TABLE "public"."schizophrenia_troubles_psychotiques" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Patients view own schizophrenia_troubles_psychotiques" ON "public"."schizophrenia_troubles_psychotiques";
CREATE POLICY "Patients view own schizophrenia_troubles_psychotiques" ON "public"."schizophrenia_troubles_psychotiques" FOR SELECT USING (("auth"."uid"() = "patient_id"));

DROP POLICY IF EXISTS "Professionals insert schizophrenia_troubles_psychotiques" ON "public"."schizophrenia_troubles_psychotiques";
CREATE POLICY "Professionals insert schizophrenia_troubles_psychotiques" ON "public"."schizophrenia_troubles_psychotiques" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));

DROP POLICY IF EXISTS "Professionals update schizophrenia_troubles_psychotiques" ON "public"."schizophrenia_troubles_psychotiques";
CREATE POLICY "Professionals update schizophrenia_troubles_psychotiques" ON "public"."schizophrenia_troubles_psychotiques" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));

DROP POLICY IF EXISTS "Professionals view schizophrenia_troubles_psychotiques" ON "public"."schizophrenia_troubles_psychotiques";
CREATE POLICY "Professionals view schizophrenia_troubles_psychotiques" ON "public"."schizophrenia_troubles_psychotiques" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));

GRANT ALL ON TABLE "public"."schizophrenia_troubles_psychotiques" TO "anon";
GRANT ALL ON TABLE "public"."schizophrenia_troubles_psychotiques" TO "authenticated";
GRANT ALL ON TABLE "public"."schizophrenia_troubles_psychotiques" TO "service_role";

COMMIT;
