-- ============================================================================
-- Migration: Create schizophrenia_ybocs table
-- Y-BOCS (Yale-Brown Obsessive-Compulsive Scale)
-- Goodman WK, Price LH, Rasmussen SA, et al. (1989)
-- French adaptation: Sauteraud A. (2005)
-- ============================================================================

-- Create the table
CREATE TABLE IF NOT EXISTS "public"."schizophrenia_ybocs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    
    -- Administration status
    "questionnaire_done" "text",
    
    -- 10 main items (0-4 each)
    -- Section A: Obsessions (Q1-Q5)
    "q1" integer,  -- Time occupied by obsessions
    "q2" integer,  -- Interference from obsessions
    "q3" integer,  -- Distress from obsessions
    "q4" integer,  -- Resistance to obsessions
    "q5" integer,  -- Control over obsessions
    -- Section B: Compulsions (Q6-Q10)
    "q6" integer,  -- Time spent on compulsions
    "q7" integer,  -- Interference from compulsions
    "q8" integer,  -- Distress from compulsions
    "q9" integer,  -- Resistance to compulsions
    "q10" integer, -- Control over compulsions
    
    -- Computed scores
    "obsessions_score" integer,    -- Q1-Q5 sum (0-20)
    "compulsions_score" integer,   -- Q6-Q10 sum (0-20)
    "total_score" integer,         -- 0-40
    "interpretation" "text",
    
    -- Metadata
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE "public"."schizophrenia_ybocs" OWNER TO "postgres";

-- Primary key
ALTER TABLE ONLY "public"."schizophrenia_ybocs"
    ADD CONSTRAINT "schizophrenia_ybocs_pkey" PRIMARY KEY ("id");

-- Unique constraint on visit_id (one response per visit, enables upsert)
ALTER TABLE ONLY "public"."schizophrenia_ybocs"
    ADD CONSTRAINT "schizophrenia_ybocs_visit_id_key" UNIQUE ("visit_id");

-- Foreign key constraints
ALTER TABLE ONLY "public"."schizophrenia_ybocs"
    ADD CONSTRAINT "schizophrenia_ybocs_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."schizophrenia_ybocs"
    ADD CONSTRAINT "schizophrenia_ybocs_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."schizophrenia_ybocs"
    ADD CONSTRAINT "schizophrenia_ybocs_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");

-- Enable Row Level Security
ALTER TABLE "public"."schizophrenia_ybocs" ENABLE ROW LEVEL SECURITY;

-- Patient policies
CREATE POLICY "Patients view own schizophrenia_ybocs" ON "public"."schizophrenia_ybocs"
    FOR SELECT USING (("auth"."uid"() = "patient_id"));

CREATE POLICY "Patients insert own schizophrenia_ybocs" ON "public"."schizophrenia_ybocs"
    FOR INSERT WITH CHECK (("auth"."uid"() = "patient_id"));

CREATE POLICY "Patients update own schizophrenia_ybocs" ON "public"."schizophrenia_ybocs"
    FOR UPDATE USING (("auth"."uid"() = "patient_id"));

-- Professional policies
CREATE POLICY "Professionals view schizophrenia_ybocs" ON "public"."schizophrenia_ybocs"
    FOR SELECT USING ((EXISTS ( SELECT 1
       FROM "public"."user_profiles"
      WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));

CREATE POLICY "Professionals insert schizophrenia_ybocs" ON "public"."schizophrenia_ybocs"
    FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
       FROM "public"."user_profiles"
      WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));

CREATE POLICY "Professionals update schizophrenia_ybocs" ON "public"."schizophrenia_ybocs"
    FOR UPDATE USING ((EXISTS ( SELECT 1
       FROM "public"."user_profiles"
      WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));

-- Grant permissions
GRANT ALL ON TABLE "public"."schizophrenia_ybocs" TO "anon";
GRANT ALL ON TABLE "public"."schizophrenia_ybocs" TO "authenticated";
GRANT ALL ON TABLE "public"."schizophrenia_ybocs" TO "service_role";

-- Add check constraints for valid score ranges (NULL allowed for partial completion)
ALTER TABLE "public"."schizophrenia_ybocs"
    ADD CONSTRAINT "schizophrenia_ybocs_q1_range" CHECK (("q1" IS NULL OR ("q1" >= 0 AND "q1" <= 4)));
ALTER TABLE "public"."schizophrenia_ybocs"
    ADD CONSTRAINT "schizophrenia_ybocs_q2_range" CHECK (("q2" IS NULL OR ("q2" >= 0 AND "q2" <= 4)));
ALTER TABLE "public"."schizophrenia_ybocs"
    ADD CONSTRAINT "schizophrenia_ybocs_q3_range" CHECK (("q3" IS NULL OR ("q3" >= 0 AND "q3" <= 4)));
ALTER TABLE "public"."schizophrenia_ybocs"
    ADD CONSTRAINT "schizophrenia_ybocs_q4_range" CHECK (("q4" IS NULL OR ("q4" >= 0 AND "q4" <= 4)));
ALTER TABLE "public"."schizophrenia_ybocs"
    ADD CONSTRAINT "schizophrenia_ybocs_q5_range" CHECK (("q5" IS NULL OR ("q5" >= 0 AND "q5" <= 4)));
ALTER TABLE "public"."schizophrenia_ybocs"
    ADD CONSTRAINT "schizophrenia_ybocs_q6_range" CHECK (("q6" IS NULL OR ("q6" >= 0 AND "q6" <= 4)));
ALTER TABLE "public"."schizophrenia_ybocs"
    ADD CONSTRAINT "schizophrenia_ybocs_q7_range" CHECK (("q7" IS NULL OR ("q7" >= 0 AND "q7" <= 4)));
ALTER TABLE "public"."schizophrenia_ybocs"
    ADD CONSTRAINT "schizophrenia_ybocs_q8_range" CHECK (("q8" IS NULL OR ("q8" >= 0 AND "q8" <= 4)));
ALTER TABLE "public"."schizophrenia_ybocs"
    ADD CONSTRAINT "schizophrenia_ybocs_q9_range" CHECK (("q9" IS NULL OR ("q9" >= 0 AND "q9" <= 4)));
ALTER TABLE "public"."schizophrenia_ybocs"
    ADD CONSTRAINT "schizophrenia_ybocs_q10_range" CHECK (("q10" IS NULL OR ("q10" >= 0 AND "q10" <= 4)));

-- Subscale and total score range constraints
ALTER TABLE "public"."schizophrenia_ybocs"
    ADD CONSTRAINT "schizophrenia_ybocs_obsessions_score_range" CHECK (("obsessions_score" IS NULL OR ("obsessions_score" >= 0 AND "obsessions_score" <= 20)));
ALTER TABLE "public"."schizophrenia_ybocs"
    ADD CONSTRAINT "schizophrenia_ybocs_compulsions_score_range" CHECK (("compulsions_score" IS NULL OR ("compulsions_score" >= 0 AND "compulsions_score" <= 20)));
ALTER TABLE "public"."schizophrenia_ybocs"
    ADD CONSTRAINT "schizophrenia_ybocs_total_score_range" CHECK (("total_score" IS NULL OR ("total_score" >= 0 AND "total_score" <= 40)));

-- Add check constraint for questionnaire_done field
ALTER TABLE "public"."schizophrenia_ybocs"
    ADD CONSTRAINT "schizophrenia_ybocs_questionnaire_done_valid" CHECK (("questionnaire_done" IS NULL OR "questionnaire_done" IN ('Fait', 'Non fait')));
