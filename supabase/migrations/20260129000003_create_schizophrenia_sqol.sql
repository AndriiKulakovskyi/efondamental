-- ============================================================================
-- Migration: Create schizophrenia_sqol table
-- S-QoL (Schizophrenia Quality of Life) Questionnaire - Auquier et al., 2003
-- ============================================================================

-- Create the table
CREATE TABLE IF NOT EXISTS "public"."schizophrenia_sqol" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    
    -- Administration status
    "questionnaire_done" "text",
    
    -- Raw question responses (18 questions, 0-4 scale)
    "q1" integer,
    "q2" integer,
    "q3" integer,
    "q4" integer,
    "q5" integer,
    "q6" integer,
    "q7" integer,
    "q8" integer,
    "q9" integer,
    "q10" integer,
    "q11" integer,
    "q12" integer,
    "q13" integer,
    "q14" integer,
    "q15" integer,
    "q16" integer,
    "q17" integer,
    "q18" integer,
    
    -- "Pas concerné(e)" flags (18 booleans)
    "q1_not_concerned" boolean DEFAULT false,
    "q2_not_concerned" boolean DEFAULT false,
    "q3_not_concerned" boolean DEFAULT false,
    "q4_not_concerned" boolean DEFAULT false,
    "q5_not_concerned" boolean DEFAULT false,
    "q6_not_concerned" boolean DEFAULT false,
    "q7_not_concerned" boolean DEFAULT false,
    "q8_not_concerned" boolean DEFAULT false,
    "q9_not_concerned" boolean DEFAULT false,
    "q10_not_concerned" boolean DEFAULT false,
    "q11_not_concerned" boolean DEFAULT false,
    "q12_not_concerned" boolean DEFAULT false,
    "q13_not_concerned" boolean DEFAULT false,
    "q14_not_concerned" boolean DEFAULT false,
    "q15_not_concerned" boolean DEFAULT false,
    "q16_not_concerned" boolean DEFAULT false,
    "q17_not_concerned" boolean DEFAULT false,
    "q18_not_concerned" boolean DEFAULT false,
    
    -- Computed subscale scores (percentage 0-100)
    "score_vie_sentimentale" numeric(5,2),
    "score_estime_de_soi" numeric(5,2),
    "score_relation_famille" numeric(5,2),
    "score_relation_amis" numeric(5,2),
    "score_autonomie" numeric(5,2),
    "score_bien_etre_psychologique" numeric(5,2),
    "score_bien_etre_physique" numeric(5,2),
    "score_resilience" numeric(5,2),
    
    -- Global score (mean of valid subscales)
    "total_score" numeric(5,2),
    "interpretation" "text",
    
    -- Metadata
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE "public"."schizophrenia_sqol" OWNER TO "postgres";

-- Primary key
ALTER TABLE ONLY "public"."schizophrenia_sqol"
    ADD CONSTRAINT "schizophrenia_sqol_pkey" PRIMARY KEY ("id");

-- Unique constraint on visit_id (one response per visit)
ALTER TABLE ONLY "public"."schizophrenia_sqol"
    ADD CONSTRAINT "schizophrenia_sqol_visit_id_key" UNIQUE ("visit_id");

-- Foreign key constraints
ALTER TABLE ONLY "public"."schizophrenia_sqol"
    ADD CONSTRAINT "schizophrenia_sqol_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."schizophrenia_sqol"
    ADD CONSTRAINT "schizophrenia_sqol_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."schizophrenia_sqol"
    ADD CONSTRAINT "schizophrenia_sqol_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");

-- Enable Row Level Security
ALTER TABLE "public"."schizophrenia_sqol" ENABLE ROW LEVEL SECURITY;

-- Patient policies
CREATE POLICY "Patients view own schizophrenia_sqol" ON "public"."schizophrenia_sqol"
    FOR SELECT USING (("auth"."uid"() = "patient_id"));

CREATE POLICY "Patients insert own schizophrenia_sqol" ON "public"."schizophrenia_sqol"
    FOR INSERT WITH CHECK (("auth"."uid"() = "patient_id"));

CREATE POLICY "Patients update own schizophrenia_sqol" ON "public"."schizophrenia_sqol"
    FOR UPDATE USING (("auth"."uid"() = "patient_id"));

-- Professional policies
CREATE POLICY "Professionals view schizophrenia_sqol" ON "public"."schizophrenia_sqol"
    FOR SELECT USING ((EXISTS ( SELECT 1
       FROM "public"."user_profiles"
      WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));

CREATE POLICY "Professionals insert schizophrenia_sqol" ON "public"."schizophrenia_sqol"
    FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
       FROM "public"."user_profiles"
      WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));

CREATE POLICY "Professionals update schizophrenia_sqol" ON "public"."schizophrenia_sqol"
    FOR UPDATE USING ((EXISTS ( SELECT 1
       FROM "public"."user_profiles"
      WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));

-- Grant permissions
GRANT ALL ON TABLE "public"."schizophrenia_sqol" TO "anon";
GRANT ALL ON TABLE "public"."schizophrenia_sqol" TO "authenticated";
GRANT ALL ON TABLE "public"."schizophrenia_sqol" TO "service_role";
