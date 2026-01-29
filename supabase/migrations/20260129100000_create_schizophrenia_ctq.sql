-- ============================================================================
-- Migration: Create schizophrenia_ctq table
-- CTQ (Childhood Trauma Questionnaire) - Short Form (CTQ-SF)
-- Bernstein & Fink, 1998
-- ============================================================================

-- Create the table
CREATE TABLE IF NOT EXISTS "public"."schizophrenia_ctq" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    
    -- Administration status
    "questionnaire_done" "text",
    
    -- Raw question responses (28 questions, 1-5 scale)
    -- Note: Q2, Q5, Q7, Q13, Q19, Q26, Q28 are reverse-scored during computation (6 - value)
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
    "q19" integer,
    "q20" integer,
    "q21" integer,
    "q22" integer,
    "q23" integer,
    "q24" integer,
    "q25" integer,
    "q26" integer,
    "q27" integer,
    "q28" integer,
    
    -- Computed subscale scores (5-25 range) - matching bipolar CTQ naming convention
    "emotional_abuse_score" integer,
    "physical_abuse_score" integer,
    "sexual_abuse_score" integer,
    "emotional_neglect_score" integer,
    "physical_neglect_score" integer,
    
    -- Severity levels for each subscale
    "emotional_abuse_severity" "text",
    "physical_abuse_severity" "text",
    "sexual_abuse_severity" "text",
    "emotional_neglect_severity" "text",
    "physical_neglect_severity" "text",
    
    -- Denial/Minimization scale (3-15 range, sum of Q10+Q16+Q22 raw values)
    "denial_score" integer,
    "minimization_score" integer,
    
    -- Total score (25-125)
    "total_score" integer,
    "interpretation" "text",
    
    -- Metadata
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE "public"."schizophrenia_ctq" OWNER TO "postgres";

-- Primary key
ALTER TABLE ONLY "public"."schizophrenia_ctq"
    ADD CONSTRAINT "schizophrenia_ctq_pkey" PRIMARY KEY ("id");

-- Unique constraint on visit_id (one response per visit)
ALTER TABLE ONLY "public"."schizophrenia_ctq"
    ADD CONSTRAINT "schizophrenia_ctq_visit_id_key" UNIQUE ("visit_id");

-- Foreign key constraints
ALTER TABLE ONLY "public"."schizophrenia_ctq"
    ADD CONSTRAINT "schizophrenia_ctq_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."schizophrenia_ctq"
    ADD CONSTRAINT "schizophrenia_ctq_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."schizophrenia_ctq"
    ADD CONSTRAINT "schizophrenia_ctq_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");

-- Enable Row Level Security
ALTER TABLE "public"."schizophrenia_ctq" ENABLE ROW LEVEL SECURITY;

-- Patient policies
CREATE POLICY "Patients view own schizophrenia_ctq" ON "public"."schizophrenia_ctq"
    FOR SELECT USING (("auth"."uid"() = "patient_id"));

CREATE POLICY "Patients insert own schizophrenia_ctq" ON "public"."schizophrenia_ctq"
    FOR INSERT WITH CHECK (("auth"."uid"() = "patient_id"));

CREATE POLICY "Patients update own schizophrenia_ctq" ON "public"."schizophrenia_ctq"
    FOR UPDATE USING (("auth"."uid"() = "patient_id"));

-- Professional policies
CREATE POLICY "Professionals view schizophrenia_ctq" ON "public"."schizophrenia_ctq"
    FOR SELECT USING ((EXISTS ( SELECT 1
       FROM "public"."user_profiles"
      WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));

CREATE POLICY "Professionals insert schizophrenia_ctq" ON "public"."schizophrenia_ctq"
    FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
       FROM "public"."user_profiles"
      WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));

CREATE POLICY "Professionals update schizophrenia_ctq" ON "public"."schizophrenia_ctq"
    FOR UPDATE USING ((EXISTS ( SELECT 1
       FROM "public"."user_profiles"
      WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));

-- Grant permissions
GRANT ALL ON TABLE "public"."schizophrenia_ctq" TO "anon";
GRANT ALL ON TABLE "public"."schizophrenia_ctq" TO "authenticated";
GRANT ALL ON TABLE "public"."schizophrenia_ctq" TO "service_role";

-- Add check constraints for valid score ranges (NULL allowed for partial completion)
ALTER TABLE "public"."schizophrenia_ctq"
    ADD CONSTRAINT "schizophrenia_ctq_q1_range" CHECK (("q1" IS NULL OR ("q1" >= 1 AND "q1" <= 5)));
ALTER TABLE "public"."schizophrenia_ctq"
    ADD CONSTRAINT "schizophrenia_ctq_q2_range" CHECK (("q2" IS NULL OR ("q2" >= 1 AND "q2" <= 5)));
ALTER TABLE "public"."schizophrenia_ctq"
    ADD CONSTRAINT "schizophrenia_ctq_q3_range" CHECK (("q3" IS NULL OR ("q3" >= 1 AND "q3" <= 5)));
ALTER TABLE "public"."schizophrenia_ctq"
    ADD CONSTRAINT "schizophrenia_ctq_q4_range" CHECK (("q4" IS NULL OR ("q4" >= 1 AND "q4" <= 5)));
ALTER TABLE "public"."schizophrenia_ctq"
    ADD CONSTRAINT "schizophrenia_ctq_q5_range" CHECK (("q5" IS NULL OR ("q5" >= 1 AND "q5" <= 5)));
ALTER TABLE "public"."schizophrenia_ctq"
    ADD CONSTRAINT "schizophrenia_ctq_q6_range" CHECK (("q6" IS NULL OR ("q6" >= 1 AND "q6" <= 5)));
ALTER TABLE "public"."schizophrenia_ctq"
    ADD CONSTRAINT "schizophrenia_ctq_q7_range" CHECK (("q7" IS NULL OR ("q7" >= 1 AND "q7" <= 5)));
ALTER TABLE "public"."schizophrenia_ctq"
    ADD CONSTRAINT "schizophrenia_ctq_q8_range" CHECK (("q8" IS NULL OR ("q8" >= 1 AND "q8" <= 5)));
ALTER TABLE "public"."schizophrenia_ctq"
    ADD CONSTRAINT "schizophrenia_ctq_q9_range" CHECK (("q9" IS NULL OR ("q9" >= 1 AND "q9" <= 5)));
ALTER TABLE "public"."schizophrenia_ctq"
    ADD CONSTRAINT "schizophrenia_ctq_q10_range" CHECK (("q10" IS NULL OR ("q10" >= 1 AND "q10" <= 5)));
ALTER TABLE "public"."schizophrenia_ctq"
    ADD CONSTRAINT "schizophrenia_ctq_q11_range" CHECK (("q11" IS NULL OR ("q11" >= 1 AND "q11" <= 5)));
ALTER TABLE "public"."schizophrenia_ctq"
    ADD CONSTRAINT "schizophrenia_ctq_q12_range" CHECK (("q12" IS NULL OR ("q12" >= 1 AND "q12" <= 5)));
ALTER TABLE "public"."schizophrenia_ctq"
    ADD CONSTRAINT "schizophrenia_ctq_q13_range" CHECK (("q13" IS NULL OR ("q13" >= 1 AND "q13" <= 5)));
ALTER TABLE "public"."schizophrenia_ctq"
    ADD CONSTRAINT "schizophrenia_ctq_q14_range" CHECK (("q14" IS NULL OR ("q14" >= 1 AND "q14" <= 5)));
ALTER TABLE "public"."schizophrenia_ctq"
    ADD CONSTRAINT "schizophrenia_ctq_q15_range" CHECK (("q15" IS NULL OR ("q15" >= 1 AND "q15" <= 5)));
ALTER TABLE "public"."schizophrenia_ctq"
    ADD CONSTRAINT "schizophrenia_ctq_q16_range" CHECK (("q16" IS NULL OR ("q16" >= 1 AND "q16" <= 5)));
ALTER TABLE "public"."schizophrenia_ctq"
    ADD CONSTRAINT "schizophrenia_ctq_q17_range" CHECK (("q17" IS NULL OR ("q17" >= 1 AND "q17" <= 5)));
ALTER TABLE "public"."schizophrenia_ctq"
    ADD CONSTRAINT "schizophrenia_ctq_q18_range" CHECK (("q18" IS NULL OR ("q18" >= 1 AND "q18" <= 5)));
ALTER TABLE "public"."schizophrenia_ctq"
    ADD CONSTRAINT "schizophrenia_ctq_q19_range" CHECK (("q19" IS NULL OR ("q19" >= 1 AND "q19" <= 5)));
ALTER TABLE "public"."schizophrenia_ctq"
    ADD CONSTRAINT "schizophrenia_ctq_q20_range" CHECK (("q20" IS NULL OR ("q20" >= 1 AND "q20" <= 5)));
ALTER TABLE "public"."schizophrenia_ctq"
    ADD CONSTRAINT "schizophrenia_ctq_q21_range" CHECK (("q21" IS NULL OR ("q21" >= 1 AND "q21" <= 5)));
ALTER TABLE "public"."schizophrenia_ctq"
    ADD CONSTRAINT "schizophrenia_ctq_q22_range" CHECK (("q22" IS NULL OR ("q22" >= 1 AND "q22" <= 5)));
ALTER TABLE "public"."schizophrenia_ctq"
    ADD CONSTRAINT "schizophrenia_ctq_q23_range" CHECK (("q23" IS NULL OR ("q23" >= 1 AND "q23" <= 5)));
ALTER TABLE "public"."schizophrenia_ctq"
    ADD CONSTRAINT "schizophrenia_ctq_q24_range" CHECK (("q24" IS NULL OR ("q24" >= 1 AND "q24" <= 5)));
ALTER TABLE "public"."schizophrenia_ctq"
    ADD CONSTRAINT "schizophrenia_ctq_q25_range" CHECK (("q25" IS NULL OR ("q25" >= 1 AND "q25" <= 5)));
ALTER TABLE "public"."schizophrenia_ctq"
    ADD CONSTRAINT "schizophrenia_ctq_q26_range" CHECK (("q26" IS NULL OR ("q26" >= 1 AND "q26" <= 5)));
ALTER TABLE "public"."schizophrenia_ctq"
    ADD CONSTRAINT "schizophrenia_ctq_q27_range" CHECK (("q27" IS NULL OR ("q27" >= 1 AND "q27" <= 5)));
ALTER TABLE "public"."schizophrenia_ctq"
    ADD CONSTRAINT "schizophrenia_ctq_q28_range" CHECK (("q28" IS NULL OR ("q28" >= 1 AND "q28" <= 5)));

-- Subscale score range constraints (5-25, NULL allowed)
ALTER TABLE "public"."schizophrenia_ctq"
    ADD CONSTRAINT "schizophrenia_ctq_physical_abuse_score_range" CHECK (("physical_abuse_score" IS NULL OR ("physical_abuse_score" >= 5 AND "physical_abuse_score" <= 25)));
ALTER TABLE "public"."schizophrenia_ctq"
    ADD CONSTRAINT "schizophrenia_ctq_emotional_neglect_score_range" CHECK (("emotional_neglect_score" IS NULL OR ("emotional_neglect_score" >= 5 AND "emotional_neglect_score" <= 25)));
ALTER TABLE "public"."schizophrenia_ctq"
    ADD CONSTRAINT "schizophrenia_ctq_physical_neglect_score_range" CHECK (("physical_neglect_score" IS NULL OR ("physical_neglect_score" >= 5 AND "physical_neglect_score" <= 25)));
ALTER TABLE "public"."schizophrenia_ctq"
    ADD CONSTRAINT "schizophrenia_ctq_sexual_abuse_score_range" CHECK (("sexual_abuse_score" IS NULL OR ("sexual_abuse_score" >= 5 AND "sexual_abuse_score" <= 25)));
ALTER TABLE "public"."schizophrenia_ctq"
    ADD CONSTRAINT "schizophrenia_ctq_emotional_abuse_score_range" CHECK (("emotional_abuse_score" IS NULL OR ("emotional_abuse_score" >= 5 AND "emotional_abuse_score" <= 25)));

-- Denial/minimization score range constraint (3-15, NULL allowed)
ALTER TABLE "public"."schizophrenia_ctq"
    ADD CONSTRAINT "schizophrenia_ctq_denial_score_range" CHECK (("denial_score" IS NULL OR ("denial_score" >= 3 AND "denial_score" <= 15)));
ALTER TABLE "public"."schizophrenia_ctq"
    ADD CONSTRAINT "schizophrenia_ctq_minimization_score_range" CHECK (("minimization_score" IS NULL OR ("minimization_score" >= 3 AND "minimization_score" <= 15)));

-- Total score range constraint (25-125, NULL allowed)
ALTER TABLE "public"."schizophrenia_ctq"
    ADD CONSTRAINT "schizophrenia_ctq_total_score_range" CHECK (("total_score" IS NULL OR ("total_score" >= 25 AND "total_score" <= 125)));

-- Severity level constraints
ALTER TABLE "public"."schizophrenia_ctq"
    ADD CONSTRAINT "schizophrenia_ctq_physical_abuse_severity_valid" CHECK (("physical_abuse_severity" IS NULL OR "physical_abuse_severity" IN ('no_trauma', 'low', 'moderate', 'severe')));
ALTER TABLE "public"."schizophrenia_ctq"
    ADD CONSTRAINT "schizophrenia_ctq_emotional_neglect_severity_valid" CHECK (("emotional_neglect_severity" IS NULL OR "emotional_neglect_severity" IN ('no_trauma', 'low', 'moderate', 'severe')));
ALTER TABLE "public"."schizophrenia_ctq"
    ADD CONSTRAINT "schizophrenia_ctq_physical_neglect_severity_valid" CHECK (("physical_neglect_severity" IS NULL OR "physical_neglect_severity" IN ('no_trauma', 'low', 'moderate', 'severe')));
ALTER TABLE "public"."schizophrenia_ctq"
    ADD CONSTRAINT "schizophrenia_ctq_sexual_abuse_severity_valid" CHECK (("sexual_abuse_severity" IS NULL OR "sexual_abuse_severity" IN ('no_trauma', 'low', 'moderate', 'severe')));
ALTER TABLE "public"."schizophrenia_ctq"
    ADD CONSTRAINT "schizophrenia_ctq_emotional_abuse_severity_valid" CHECK (("emotional_abuse_severity" IS NULL OR "emotional_abuse_severity" IN ('no_trauma', 'low', 'moderate', 'severe')));
