-- ============================================================================
-- Migration: Create schizophrenia_wurs25 table
-- Date: 2026-01-30
-- Description: WURS-25 (Wender Utah Rating Scale) for retrospective ADHD assessment
-- Clinical cutoff: ≥46 (96% sensitivity/specificity)
-- ============================================================================

-- Create table
CREATE TABLE IF NOT EXISTS "public"."schizophrenia_wurs25" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    
    -- Administration status
    "questionnaire_done" "text",
    
    -- 25 questions (0-4 each, from original WURS items 3-59)
    "q1" integer,   -- Item 3: Attention
    "q2" integer,   -- Item 4: Anxiety/Mood
    "q3" integer,   -- Item 5: Hyperactivity
    "q4" integer,   -- Item 6: Attention
    "q5" integer,   -- Item 7: Impulsivity/Temper
    "q6" integer,   -- Item 9: Impulsivity/Temper
    "q7" integer,   -- Item 10: Attention
    "q8" integer,   -- Item 11: Behavioral
    "q9" integer,   -- Item 12: Anxiety/Mood
    "q10" integer,  -- Item 15: Behavioral
    "q11" integer,  -- Item 16: Self-esteem
    "q12" integer,  -- Item 17: Impulsivity/Temper
    "q13" integer,  -- Item 20: Anxiety/Mood
    "q14" integer,  -- Item 21: Impulsivity/Temper
    "q15" integer,  -- Item 24: Impulsivity/Temper
    "q16" integer,  -- Item 25: Behavioral
    "q17" integer,  -- Item 26: Self-esteem
    "q18" integer,  -- Item 27: Impulsivity/Temper
    "q19" integer,  -- Item 28: Behavioral
    "q20" integer,  -- Item 29: Social
    "q21" integer,  -- Item 40: Social
    "q22" integer,  -- Item 41: Behavioral
    "q23" integer,  -- Item 51: Academic
    "q24" integer,  -- Item 56: Academic
    "q25" integer,  -- Item 59: Academic
    
    -- Computed scores
    "total_score" integer,
    "adhd_likely" boolean,
    "interpretation" "text",
    
    -- Metadata
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE "public"."schizophrenia_wurs25" OWNER TO "postgres";

-- Primary key
ALTER TABLE ONLY "public"."schizophrenia_wurs25"
    ADD CONSTRAINT "schizophrenia_wurs25_pkey" PRIMARY KEY ("id");

-- Unique constraint on visit_id (enables upsert)
ALTER TABLE ONLY "public"."schizophrenia_wurs25"
    ADD CONSTRAINT "schizophrenia_wurs25_visit_id_key" UNIQUE ("visit_id");

-- Foreign keys
ALTER TABLE ONLY "public"."schizophrenia_wurs25"
    ADD CONSTRAINT "schizophrenia_wurs25_visit_id_fkey" 
    FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."schizophrenia_wurs25"
    ADD CONSTRAINT "schizophrenia_wurs25_patient_id_fkey" 
    FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."schizophrenia_wurs25"
    ADD CONSTRAINT "schizophrenia_wurs25_completed_by_fkey" 
    FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");

-- Indexes
CREATE INDEX IF NOT EXISTS "schizophrenia_wurs25_patient_id_idx" 
    ON "public"."schizophrenia_wurs25" ("patient_id");

CREATE INDEX IF NOT EXISTS "schizophrenia_wurs25_visit_id_idx" 
    ON "public"."schizophrenia_wurs25" ("visit_id");

-- Check constraints for question values (0-4)
ALTER TABLE "public"."schizophrenia_wurs25"
    ADD CONSTRAINT schizophrenia_wurs25_q1_check CHECK (q1 IS NULL OR (q1 >= 0 AND q1 <= 4)),
    ADD CONSTRAINT schizophrenia_wurs25_q2_check CHECK (q2 IS NULL OR (q2 >= 0 AND q2 <= 4)),
    ADD CONSTRAINT schizophrenia_wurs25_q3_check CHECK (q3 IS NULL OR (q3 >= 0 AND q3 <= 4)),
    ADD CONSTRAINT schizophrenia_wurs25_q4_check CHECK (q4 IS NULL OR (q4 >= 0 AND q4 <= 4)),
    ADD CONSTRAINT schizophrenia_wurs25_q5_check CHECK (q5 IS NULL OR (q5 >= 0 AND q5 <= 4)),
    ADD CONSTRAINT schizophrenia_wurs25_q6_check CHECK (q6 IS NULL OR (q6 >= 0 AND q6 <= 4)),
    ADD CONSTRAINT schizophrenia_wurs25_q7_check CHECK (q7 IS NULL OR (q7 >= 0 AND q7 <= 4)),
    ADD CONSTRAINT schizophrenia_wurs25_q8_check CHECK (q8 IS NULL OR (q8 >= 0 AND q8 <= 4)),
    ADD CONSTRAINT schizophrenia_wurs25_q9_check CHECK (q9 IS NULL OR (q9 >= 0 AND q9 <= 4)),
    ADD CONSTRAINT schizophrenia_wurs25_q10_check CHECK (q10 IS NULL OR (q10 >= 0 AND q10 <= 4)),
    ADD CONSTRAINT schizophrenia_wurs25_q11_check CHECK (q11 IS NULL OR (q11 >= 0 AND q11 <= 4)),
    ADD CONSTRAINT schizophrenia_wurs25_q12_check CHECK (q12 IS NULL OR (q12 >= 0 AND q12 <= 4)),
    ADD CONSTRAINT schizophrenia_wurs25_q13_check CHECK (q13 IS NULL OR (q13 >= 0 AND q13 <= 4)),
    ADD CONSTRAINT schizophrenia_wurs25_q14_check CHECK (q14 IS NULL OR (q14 >= 0 AND q14 <= 4)),
    ADD CONSTRAINT schizophrenia_wurs25_q15_check CHECK (q15 IS NULL OR (q15 >= 0 AND q15 <= 4)),
    ADD CONSTRAINT schizophrenia_wurs25_q16_check CHECK (q16 IS NULL OR (q16 >= 0 AND q16 <= 4)),
    ADD CONSTRAINT schizophrenia_wurs25_q17_check CHECK (q17 IS NULL OR (q17 >= 0 AND q17 <= 4)),
    ADD CONSTRAINT schizophrenia_wurs25_q18_check CHECK (q18 IS NULL OR (q18 >= 0 AND q18 <= 4)),
    ADD CONSTRAINT schizophrenia_wurs25_q19_check CHECK (q19 IS NULL OR (q19 >= 0 AND q19 <= 4)),
    ADD CONSTRAINT schizophrenia_wurs25_q20_check CHECK (q20 IS NULL OR (q20 >= 0 AND q20 <= 4)),
    ADD CONSTRAINT schizophrenia_wurs25_q21_check CHECK (q21 IS NULL OR (q21 >= 0 AND q21 <= 4)),
    ADD CONSTRAINT schizophrenia_wurs25_q22_check CHECK (q22 IS NULL OR (q22 >= 0 AND q22 <= 4)),
    ADD CONSTRAINT schizophrenia_wurs25_q23_check CHECK (q23 IS NULL OR (q23 >= 0 AND q23 <= 4)),
    ADD CONSTRAINT schizophrenia_wurs25_q24_check CHECK (q24 IS NULL OR (q24 >= 0 AND q24 <= 4)),
    ADD CONSTRAINT schizophrenia_wurs25_q25_check CHECK (q25 IS NULL OR (q25 >= 0 AND q25 <= 4));

-- Check constraint for total_score (0-100)
ALTER TABLE "public"."schizophrenia_wurs25"
    ADD CONSTRAINT schizophrenia_wurs25_total_score_check 
    CHECK (total_score IS NULL OR (total_score >= 0 AND total_score <= 100));

-- Enable Row Level Security
ALTER TABLE "public"."schizophrenia_wurs25" ENABLE ROW LEVEL SECURITY;

-- RLS Policies for patients
CREATE POLICY "Patients view own wurs25 responses" ON "public"."schizophrenia_wurs25"
    FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Patients insert own wurs25 responses" ON "public"."schizophrenia_wurs25"
    FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own wurs25 responses" ON "public"."schizophrenia_wurs25"
    FOR UPDATE USING (auth.uid() = patient_id);

-- RLS Policies for healthcare professionals
CREATE POLICY "Professionals view all wurs25 responses" ON "public"."schizophrenia_wurs25"
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() 
        AND role IN ('healthcare_professional', 'manager', 'administrator'))
    );

CREATE POLICY "Professionals insert wurs25 responses" ON "public"."schizophrenia_wurs25"
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() 
        AND role IN ('healthcare_professional', 'manager', 'administrator'))
    );

CREATE POLICY "Professionals update wurs25 responses" ON "public"."schizophrenia_wurs25"
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() 
        AND role IN ('healthcare_professional', 'manager', 'administrator'))
    );

-- Table comment
COMMENT ON TABLE "public"."schizophrenia_wurs25" IS 'WURS-25 (Wender Utah Rating Scale) responses for schizophrenia patients - retrospective ADHD assessment. Clinical cutoff ≥46 (96% sensitivity/specificity).';
