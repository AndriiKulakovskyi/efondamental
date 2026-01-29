-- ============================================================================
-- Migration: Create schizophrenia_mars table
-- MARS (Medication Adherence Rating Scale)
-- Thompson K, Kulkarni J, Sergejew AA. (2000)
-- ============================================================================

-- Create the table
CREATE TABLE IF NOT EXISTS "public"."schizophrenia_mars" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    
    -- Administration status
    "questionnaire_done" "text",
    
    -- Question responses (binary: 'Oui' or 'Non')
    -- Q1-Q4: Adherence behavior
    "q1" "text",
    "q2" "text",
    "q3" "text",
    "q4" "text",
    -- Q5-Q6: Attitude
    "q5" "text",
    "q6" "text",
    -- Q7-Q8: Positive effects (reverse scored)
    "q7" "text",
    "q8" "text",
    -- Q9-Q10: Negative effects
    "q9" "text",
    "q10" "text",
    
    -- Computed scores
    "total_score" integer,                   -- 0-10 (sum of all scored items)
    "adherence_subscore" integer,            -- 0-4 (Q1-Q4)
    "attitude_subscore" integer,             -- 0-2 (Q5-Q6)
    "positive_effects_subscore" integer,     -- 0-2 (Q7-Q8)
    "negative_effects_subscore" integer,     -- 0-2 (Q9-Q10)
    "interpretation" "text",
    
    -- Metadata
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE "public"."schizophrenia_mars" OWNER TO "postgres";

-- Primary key
ALTER TABLE ONLY "public"."schizophrenia_mars"
    ADD CONSTRAINT "schizophrenia_mars_pkey" PRIMARY KEY ("id");

-- Unique constraint on visit_id (one response per visit)
ALTER TABLE ONLY "public"."schizophrenia_mars"
    ADD CONSTRAINT "schizophrenia_mars_visit_id_key" UNIQUE ("visit_id");

-- Foreign key constraints
ALTER TABLE ONLY "public"."schizophrenia_mars"
    ADD CONSTRAINT "schizophrenia_mars_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."schizophrenia_mars"
    ADD CONSTRAINT "schizophrenia_mars_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."schizophrenia_mars"
    ADD CONSTRAINT "schizophrenia_mars_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");

-- Enable Row Level Security
ALTER TABLE "public"."schizophrenia_mars" ENABLE ROW LEVEL SECURITY;

-- Patient policies
CREATE POLICY "Patients view own schizophrenia_mars" ON "public"."schizophrenia_mars"
    FOR SELECT USING (("auth"."uid"() = "patient_id"));

CREATE POLICY "Patients insert own schizophrenia_mars" ON "public"."schizophrenia_mars"
    FOR INSERT WITH CHECK (("auth"."uid"() = "patient_id"));

CREATE POLICY "Patients update own schizophrenia_mars" ON "public"."schizophrenia_mars"
    FOR UPDATE USING (("auth"."uid"() = "patient_id"));

-- Professional policies
CREATE POLICY "Professionals view schizophrenia_mars" ON "public"."schizophrenia_mars"
    FOR SELECT USING ((EXISTS ( SELECT 1
       FROM "public"."user_profiles"
      WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));

CREATE POLICY "Professionals insert schizophrenia_mars" ON "public"."schizophrenia_mars"
    FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
       FROM "public"."user_profiles"
      WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));

CREATE POLICY "Professionals update schizophrenia_mars" ON "public"."schizophrenia_mars"
    FOR UPDATE USING ((EXISTS ( SELECT 1
       FROM "public"."user_profiles"
      WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));

-- Grant permissions
GRANT ALL ON TABLE "public"."schizophrenia_mars" TO "anon";
GRANT ALL ON TABLE "public"."schizophrenia_mars" TO "authenticated";
GRANT ALL ON TABLE "public"."schizophrenia_mars" TO "service_role";

-- Add check constraints for valid score ranges (NULL allowed for partial completion)
ALTER TABLE "public"."schizophrenia_mars"
    ADD CONSTRAINT "schizophrenia_mars_total_score_range" CHECK (("total_score" IS NULL OR ("total_score" >= 0 AND "total_score" <= 10)));
ALTER TABLE "public"."schizophrenia_mars"
    ADD CONSTRAINT "schizophrenia_mars_adherence_subscore_range" CHECK (("adherence_subscore" IS NULL OR ("adherence_subscore" >= 0 AND "adherence_subscore" <= 4)));
ALTER TABLE "public"."schizophrenia_mars"
    ADD CONSTRAINT "schizophrenia_mars_attitude_subscore_range" CHECK (("attitude_subscore" IS NULL OR ("attitude_subscore" >= 0 AND "attitude_subscore" <= 2)));
ALTER TABLE "public"."schizophrenia_mars"
    ADD CONSTRAINT "schizophrenia_mars_positive_effects_subscore_range" CHECK (("positive_effects_subscore" IS NULL OR ("positive_effects_subscore" >= 0 AND "positive_effects_subscore" <= 2)));
ALTER TABLE "public"."schizophrenia_mars"
    ADD CONSTRAINT "schizophrenia_mars_negative_effects_subscore_range" CHECK (("negative_effects_subscore" IS NULL OR ("negative_effects_subscore" >= 0 AND "negative_effects_subscore" <= 2)));

-- Add check constraints for binary question values
ALTER TABLE "public"."schizophrenia_mars"
    ADD CONSTRAINT "schizophrenia_mars_q1_valid" CHECK (("q1" IS NULL OR "q1" IN ('Oui', 'Non')));
ALTER TABLE "public"."schizophrenia_mars"
    ADD CONSTRAINT "schizophrenia_mars_q2_valid" CHECK (("q2" IS NULL OR "q2" IN ('Oui', 'Non')));
ALTER TABLE "public"."schizophrenia_mars"
    ADD CONSTRAINT "schizophrenia_mars_q3_valid" CHECK (("q3" IS NULL OR "q3" IN ('Oui', 'Non')));
ALTER TABLE "public"."schizophrenia_mars"
    ADD CONSTRAINT "schizophrenia_mars_q4_valid" CHECK (("q4" IS NULL OR "q4" IN ('Oui', 'Non')));
ALTER TABLE "public"."schizophrenia_mars"
    ADD CONSTRAINT "schizophrenia_mars_q5_valid" CHECK (("q5" IS NULL OR "q5" IN ('Oui', 'Non')));
ALTER TABLE "public"."schizophrenia_mars"
    ADD CONSTRAINT "schizophrenia_mars_q6_valid" CHECK (("q6" IS NULL OR "q6" IN ('Oui', 'Non')));
ALTER TABLE "public"."schizophrenia_mars"
    ADD CONSTRAINT "schizophrenia_mars_q7_valid" CHECK (("q7" IS NULL OR "q7" IN ('Oui', 'Non')));
ALTER TABLE "public"."schizophrenia_mars"
    ADD CONSTRAINT "schizophrenia_mars_q8_valid" CHECK (("q8" IS NULL OR "q8" IN ('Oui', 'Non')));
ALTER TABLE "public"."schizophrenia_mars"
    ADD CONSTRAINT "schizophrenia_mars_q9_valid" CHECK (("q9" IS NULL OR "q9" IN ('Oui', 'Non')));
ALTER TABLE "public"."schizophrenia_mars"
    ADD CONSTRAINT "schizophrenia_mars_q10_valid" CHECK (("q10" IS NULL OR "q10" IN ('Oui', 'Non')));
