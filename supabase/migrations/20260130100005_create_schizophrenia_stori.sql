-- ============================================================================
-- Migration: Create schizophrenia_stori table
-- Date: 2026-01-30
-- Description: STORI (Stages of Recovery Instrument) for psychological recovery assessment
-- 50 items, 5 recovery stages (Andresen model), 6-point Likert scale (0-5)
-- ============================================================================

-- Create table
CREATE TABLE IF NOT EXISTS "public"."schizophrenia_stori" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    
    -- Administration status
    "questionnaire_done" "text",
    
    -- 50 questions (0-5 each, 6-point Likert scale)
    "q1" integer, "q2" integer, "q3" integer, "q4" integer, "q5" integer,
    "q6" integer, "q7" integer, "q8" integer, "q9" integer, "q10" integer,
    "q11" integer, "q12" integer, "q13" integer, "q14" integer, "q15" integer,
    "q16" integer, "q17" integer, "q18" integer, "q19" integer, "q20" integer,
    "q21" integer, "q22" integer, "q23" integer, "q24" integer, "q25" integer,
    "q26" integer, "q27" integer, "q28" integer, "q29" integer, "q30" integer,
    "q31" integer, "q32" integer, "q33" integer, "q34" integer, "q35" integer,
    "q36" integer, "q37" integer, "q38" integer, "q39" integer, "q40" integer,
    "q41" integer, "q42" integer, "q43" integer, "q44" integer, "q45" integer,
    "q46" integer, "q47" integer, "q48" integer, "q49" integer, "q50" integer,
    
    -- Stage scores (0-50 each, sum of 10 items per stage)
    "stori_etap1" integer,  -- Moratoire (items 1,6,11,16,21,26,31,36,41,46)
    "stori_etap2" integer,  -- Conscience (items 2,7,12,17,22,27,32,37,42,47)
    "stori_etap3" integer,  -- Préparation (items 3,8,13,18,23,28,33,38,43,48)
    "stori_etap4" integer,  -- Reconstruction (items 4,9,14,19,24,29,34,39,44,49)
    "stori_etap5" integer,  -- Croissance (items 5,10,15,20,25,30,35,40,45,50)
    
    -- Dominant stage (1-5)
    "dominant_stage" integer,
    "interpretation" "text",
    
    -- Metadata
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE "public"."schizophrenia_stori" OWNER TO "postgres";

-- Primary key
ALTER TABLE ONLY "public"."schizophrenia_stori"
    ADD CONSTRAINT "schizophrenia_stori_pkey" PRIMARY KEY ("id");

-- Unique constraint on visit_id (enables upsert)
ALTER TABLE ONLY "public"."schizophrenia_stori"
    ADD CONSTRAINT "schizophrenia_stori_visit_id_key" UNIQUE ("visit_id");

-- Foreign keys
ALTER TABLE ONLY "public"."schizophrenia_stori"
    ADD CONSTRAINT "schizophrenia_stori_visit_id_fkey" 
    FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."schizophrenia_stori"
    ADD CONSTRAINT "schizophrenia_stori_patient_id_fkey" 
    FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."schizophrenia_stori"
    ADD CONSTRAINT "schizophrenia_stori_completed_by_fkey" 
    FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");

-- Indexes
CREATE INDEX IF NOT EXISTS "schizophrenia_stori_patient_id_idx" 
    ON "public"."schizophrenia_stori" ("patient_id");

CREATE INDEX IF NOT EXISTS "schizophrenia_stori_visit_id_idx" 
    ON "public"."schizophrenia_stori" ("visit_id");

-- Check constraints for question values (0-5, 6-point Likert scale)
ALTER TABLE "public"."schizophrenia_stori"
    ADD CONSTRAINT schizophrenia_stori_q1_check CHECK (q1 IS NULL OR (q1 >= 0 AND q1 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q2_check CHECK (q2 IS NULL OR (q2 >= 0 AND q2 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q3_check CHECK (q3 IS NULL OR (q3 >= 0 AND q3 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q4_check CHECK (q4 IS NULL OR (q4 >= 0 AND q4 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q5_check CHECK (q5 IS NULL OR (q5 >= 0 AND q5 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q6_check CHECK (q6 IS NULL OR (q6 >= 0 AND q6 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q7_check CHECK (q7 IS NULL OR (q7 >= 0 AND q7 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q8_check CHECK (q8 IS NULL OR (q8 >= 0 AND q8 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q9_check CHECK (q9 IS NULL OR (q9 >= 0 AND q9 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q10_check CHECK (q10 IS NULL OR (q10 >= 0 AND q10 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q11_check CHECK (q11 IS NULL OR (q11 >= 0 AND q11 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q12_check CHECK (q12 IS NULL OR (q12 >= 0 AND q12 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q13_check CHECK (q13 IS NULL OR (q13 >= 0 AND q13 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q14_check CHECK (q14 IS NULL OR (q14 >= 0 AND q14 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q15_check CHECK (q15 IS NULL OR (q15 >= 0 AND q15 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q16_check CHECK (q16 IS NULL OR (q16 >= 0 AND q16 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q17_check CHECK (q17 IS NULL OR (q17 >= 0 AND q17 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q18_check CHECK (q18 IS NULL OR (q18 >= 0 AND q18 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q19_check CHECK (q19 IS NULL OR (q19 >= 0 AND q19 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q20_check CHECK (q20 IS NULL OR (q20 >= 0 AND q20 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q21_check CHECK (q21 IS NULL OR (q21 >= 0 AND q21 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q22_check CHECK (q22 IS NULL OR (q22 >= 0 AND q22 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q23_check CHECK (q23 IS NULL OR (q23 >= 0 AND q23 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q24_check CHECK (q24 IS NULL OR (q24 >= 0 AND q24 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q25_check CHECK (q25 IS NULL OR (q25 >= 0 AND q25 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q26_check CHECK (q26 IS NULL OR (q26 >= 0 AND q26 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q27_check CHECK (q27 IS NULL OR (q27 >= 0 AND q27 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q28_check CHECK (q28 IS NULL OR (q28 >= 0 AND q28 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q29_check CHECK (q29 IS NULL OR (q29 >= 0 AND q29 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q30_check CHECK (q30 IS NULL OR (q30 >= 0 AND q30 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q31_check CHECK (q31 IS NULL OR (q31 >= 0 AND q31 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q32_check CHECK (q32 IS NULL OR (q32 >= 0 AND q32 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q33_check CHECK (q33 IS NULL OR (q33 >= 0 AND q33 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q34_check CHECK (q34 IS NULL OR (q34 >= 0 AND q34 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q35_check CHECK (q35 IS NULL OR (q35 >= 0 AND q35 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q36_check CHECK (q36 IS NULL OR (q36 >= 0 AND q36 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q37_check CHECK (q37 IS NULL OR (q37 >= 0 AND q37 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q38_check CHECK (q38 IS NULL OR (q38 >= 0 AND q38 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q39_check CHECK (q39 IS NULL OR (q39 >= 0 AND q39 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q40_check CHECK (q40 IS NULL OR (q40 >= 0 AND q40 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q41_check CHECK (q41 IS NULL OR (q41 >= 0 AND q41 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q42_check CHECK (q42 IS NULL OR (q42 >= 0 AND q42 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q43_check CHECK (q43 IS NULL OR (q43 >= 0 AND q43 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q44_check CHECK (q44 IS NULL OR (q44 >= 0 AND q44 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q45_check CHECK (q45 IS NULL OR (q45 >= 0 AND q45 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q46_check CHECK (q46 IS NULL OR (q46 >= 0 AND q46 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q47_check CHECK (q47 IS NULL OR (q47 >= 0 AND q47 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q48_check CHECK (q48 IS NULL OR (q48 >= 0 AND q48 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q49_check CHECK (q49 IS NULL OR (q49 >= 0 AND q49 <= 5)),
    ADD CONSTRAINT schizophrenia_stori_q50_check CHECK (q50 IS NULL OR (q50 >= 0 AND q50 <= 5));

-- Check constraints for stage scores (0-50 each)
ALTER TABLE "public"."schizophrenia_stori"
    ADD CONSTRAINT schizophrenia_stori_etap1_check CHECK (stori_etap1 IS NULL OR (stori_etap1 >= 0 AND stori_etap1 <= 50)),
    ADD CONSTRAINT schizophrenia_stori_etap2_check CHECK (stori_etap2 IS NULL OR (stori_etap2 >= 0 AND stori_etap2 <= 50)),
    ADD CONSTRAINT schizophrenia_stori_etap3_check CHECK (stori_etap3 IS NULL OR (stori_etap3 >= 0 AND stori_etap3 <= 50)),
    ADD CONSTRAINT schizophrenia_stori_etap4_check CHECK (stori_etap4 IS NULL OR (stori_etap4 >= 0 AND stori_etap4 <= 50)),
    ADD CONSTRAINT schizophrenia_stori_etap5_check CHECK (stori_etap5 IS NULL OR (stori_etap5 >= 0 AND stori_etap5 <= 50));

-- Check constraint for dominant_stage (1-5)
ALTER TABLE "public"."schizophrenia_stori"
    ADD CONSTRAINT schizophrenia_stori_dominant_stage_check 
    CHECK (dominant_stage IS NULL OR (dominant_stage >= 1 AND dominant_stage <= 5));

-- Enable Row Level Security
ALTER TABLE "public"."schizophrenia_stori" ENABLE ROW LEVEL SECURITY;

-- RLS Policies for patients
CREATE POLICY "Patients view own stori responses" ON "public"."schizophrenia_stori"
    FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Patients insert own stori responses" ON "public"."schizophrenia_stori"
    FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own stori responses" ON "public"."schizophrenia_stori"
    FOR UPDATE USING (auth.uid() = patient_id);

-- RLS Policies for healthcare professionals
CREATE POLICY "Professionals view all stori responses" ON "public"."schizophrenia_stori"
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() 
        AND role IN ('healthcare_professional', 'manager', 'administrator'))
    );

CREATE POLICY "Professionals insert stori responses" ON "public"."schizophrenia_stori"
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() 
        AND role IN ('healthcare_professional', 'manager', 'administrator'))
    );

CREATE POLICY "Professionals update stori responses" ON "public"."schizophrenia_stori"
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() 
        AND role IN ('healthcare_professional', 'manager', 'administrator'))
    );

-- Table comment
COMMENT ON TABLE "public"."schizophrenia_stori" IS 'STORI (Stages of Recovery Instrument) responses for schizophrenia patients - psychological recovery assessment based on Andresen model. 50 items, 5 recovery stages (Moratoire, Conscience, Préparation, Reconstruction, Croissance).';
