-- ============================================================================
-- Migration: Create schizophrenia_cvlt table
-- Schizophrenia Initial Evaluation - Neuropsy Module - Bloc 2
-- California Verbal Learning Test (CVLT) - Deweer et al. (2008) French adaptation
-- ============================================================================

-- Create the schizophrenia_cvlt table
CREATE TABLE IF NOT EXISTS "public"."schizophrenia_cvlt" (
  -- Primary key and foreign keys
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "visit_id" UUID REFERENCES "public"."visits"("id") ON DELETE CASCADE NOT NULL UNIQUE,
  "patient_id" UUID REFERENCES "public"."patients"("id") ON DELETE CASCADE NOT NULL,
  
  -- Demographics for scoring calculations
  "patient_age" INTEGER,
  "years_of_education" NUMERIC(4,1),
  "patient_sex" VARCHAR(1) CHECK ("patient_sex" IN ('M', 'F')),
  
  -- Raw inputs: Learning Trials (List A - "Lundi")
  "trial_1" INTEGER CHECK ("trial_1" >= 0 AND "trial_1" <= 16),
  "trial_2" INTEGER CHECK ("trial_2" >= 0 AND "trial_2" <= 16),
  "trial_3" INTEGER CHECK ("trial_3" >= 0 AND "trial_3" <= 16),
  "trial_4" INTEGER CHECK ("trial_4" >= 0 AND "trial_4" <= 16),
  "trial_5" INTEGER CHECK ("trial_5" >= 0 AND "trial_5" <= 16),
  "total_1_5" INTEGER CHECK ("total_1_5" >= 0 AND "total_1_5" <= 80),
  
  -- Raw inputs: List B ("Mardi" - interference)
  "list_b" INTEGER CHECK ("list_b" >= 0 AND "list_b" <= 16),
  
  -- Raw inputs: Short Delay Recall
  "sdfr" INTEGER CHECK ("sdfr" >= 0 AND "sdfr" <= 16),  -- Short Delay Free Recall
  "sdcr" INTEGER CHECK ("sdcr" >= 0 AND "sdcr" <= 16),  -- Short Delay Cued Recall
  
  -- Raw inputs: Long Delay Recall
  "ldfr" INTEGER CHECK ("ldfr" >= 0 AND "ldfr" <= 16),  -- Long Delay Free Recall
  "ldcr" INTEGER CHECK ("ldcr" >= 0 AND "ldcr" <= 16),  -- Long Delay Cued Recall
  
  -- Raw inputs: Clustering Indices
  "semantic_clustering" NUMERIC(5,2),
  "serial_clustering" NUMERIC(5,2),
  
  -- Raw inputs: Errors
  "perseverations" INTEGER CHECK ("perseverations" >= 0),
  "intrusions" INTEGER CHECK ("intrusions" >= 0),
  
  -- Raw inputs: Recognition
  "recognition_hits" INTEGER CHECK ("recognition_hits" >= 0 AND "recognition_hits" <= 16),
  "false_positives" INTEGER CHECK ("false_positives" >= 0 AND "false_positives" <= 28),
  "discriminability" NUMERIC(5,2) CHECK ("discriminability" >= 0 AND "discriminability" <= 100),
  
  -- Raw inputs: Position Effects and Bias
  "primacy" NUMERIC(5,2) CHECK ("primacy" >= 0 AND "primacy" <= 100),
  "recency" NUMERIC(5,2) CHECK ("recency" >= 0 AND "recency" <= 100),
  "response_bias" NUMERIC(5,2),
  
  -- Raw inputs: Other
  "cvlt_delai" INTEGER CHECK ("cvlt_delai" >= 0),  -- Delay in minutes
  
  -- Computed scores: Z-scores (numeric) or Percentiles (string)
  "trial_1_std" NUMERIC(5,2),           -- Z-score (all ages regression)
  "trial_5_std" VARCHAR(20),            -- Z-score or percentile depending on age group
  "total_1_5_std" NUMERIC(5,2),         -- Z-score (all ages regression)
  "list_b_std" NUMERIC(5,2),            -- Z-score (all ages regression)
  "sdfr_std" VARCHAR(20),               -- Z-score or percentile depending on age group
  "sdcr_std" VARCHAR(20),               -- Z-score or percentile depending on age group
  "ldfr_std" VARCHAR(20),               -- Z-score or percentile depending on age group
  "ldcr_std" VARCHAR(20),               -- Z-score or percentile depending on age group
  "semantic_std" VARCHAR(20),           -- Z-score or percentile depending on age group
  "serial_std" VARCHAR(20),             -- Percentile (all ages)
  "persev_std" VARCHAR(20),             -- Percentile (all ages)
  "intru_std" VARCHAR(20),              -- Percentile (all ages)
  "recog_std" VARCHAR(20),              -- Percentile (all ages)
  "false_recog_std" VARCHAR(20),        -- Percentile (all ages)
  "discrim_std" VARCHAR(20),            -- Percentile (all ages)
  "primacy_std" NUMERIC(5,2),           -- Z-score (all ages regression)
  "recency_std" VARCHAR(20),            -- Z-score or 'Non applicable' for age group 1
  "bias_std" NUMERIC(5,2),              -- Z-score (all ages regression)
  
  -- Test status
  "test_done" BOOLEAN DEFAULT TRUE,
  "questionnaire_version" VARCHAR(50),
  
  -- Metadata
  "completed_by" UUID REFERENCES "public"."user_profiles"("id"),
  "completed_at" TIMESTAMPTZ DEFAULT NOW(),
  "created_at" TIMESTAMPTZ DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS "idx_schizophrenia_cvlt_visit_id" ON "public"."schizophrenia_cvlt"("visit_id");
CREATE INDEX IF NOT EXISTS "idx_schizophrenia_cvlt_patient_id" ON "public"."schizophrenia_cvlt"("patient_id");
CREATE INDEX IF NOT EXISTS "idx_schizophrenia_cvlt_completed_at" ON "public"."schizophrenia_cvlt"("completed_at");

-- Enable Row Level Security
ALTER TABLE "public"."schizophrenia_cvlt" ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS Policies for Patients
-- ============================================================================

-- Patients can view their own responses
CREATE POLICY "Patients view own schizophrenia_cvlt responses"
  ON "public"."schizophrenia_cvlt"
  FOR SELECT
  USING (auth.uid() = patient_id);

-- Patients can insert their own responses
CREATE POLICY "Patients insert own schizophrenia_cvlt responses"
  ON "public"."schizophrenia_cvlt"
  FOR INSERT
  WITH CHECK (auth.uid() = patient_id);

-- Patients can update their own responses
CREATE POLICY "Patients update own schizophrenia_cvlt responses"
  ON "public"."schizophrenia_cvlt"
  FOR UPDATE
  USING (auth.uid() = patient_id);

-- ============================================================================
-- RLS Policies for Healthcare Professionals
-- ============================================================================

-- Professionals can view all responses
CREATE POLICY "Professionals view all schizophrenia_cvlt responses"
  ON "public"."schizophrenia_cvlt"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "public"."user_profiles"
      WHERE "id" = auth.uid()
      AND "role" IN ('healthcare_professional', 'manager', 'administrator')
    )
  );

-- Professionals can insert responses
CREATE POLICY "Professionals insert schizophrenia_cvlt responses"
  ON "public"."schizophrenia_cvlt"
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "public"."user_profiles"
      WHERE "id" = auth.uid()
      AND "role" IN ('healthcare_professional', 'manager', 'administrator')
    )
  );

-- Professionals can update responses
CREATE POLICY "Professionals update schizophrenia_cvlt responses"
  ON "public"."schizophrenia_cvlt"
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM "public"."user_profiles"
      WHERE "id" = auth.uid()
      AND "role" IN ('healthcare_professional', 'manager', 'administrator')
    )
  );

-- ============================================================================
-- Trigger for updated_at timestamp
-- ============================================================================

CREATE OR REPLACE FUNCTION update_schizophrenia_cvlt_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_schizophrenia_cvlt_updated_at
  BEFORE UPDATE ON "public"."schizophrenia_cvlt"
  FOR EACH ROW
  EXECUTE FUNCTION update_schizophrenia_cvlt_updated_at();

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE "public"."schizophrenia_cvlt" IS 'California Verbal Learning Test (CVLT) responses for schizophrenia patients - Neuropsy Module Bloc 2. French adaptation by Deweer et al. (2008).';
COMMENT ON COLUMN "public"."schizophrenia_cvlt"."trial_1" IS 'Number of words recalled on Trial 1 of List A (0-16)';
COMMENT ON COLUMN "public"."schizophrenia_cvlt"."trial_5" IS 'Number of words recalled on Trial 5 of List A (0-16)';
COMMENT ON COLUMN "public"."schizophrenia_cvlt"."total_1_5" IS 'Sum of Trials 1-5 (0-80)';
COMMENT ON COLUMN "public"."schizophrenia_cvlt"."list_b" IS 'Number of words recalled from interference list (List B / Mardi)';
COMMENT ON COLUMN "public"."schizophrenia_cvlt"."sdfr" IS 'Short Delay Free Recall - words recalled immediately after List B';
COMMENT ON COLUMN "public"."schizophrenia_cvlt"."sdcr" IS 'Short Delay Cued Recall - words recalled with category cues after List B';
COMMENT ON COLUMN "public"."schizophrenia_cvlt"."ldfr" IS 'Long Delay Free Recall - words recalled after 20 minute delay';
COMMENT ON COLUMN "public"."schizophrenia_cvlt"."ldcr" IS 'Long Delay Cued Recall - words recalled with category cues after delay';
COMMENT ON COLUMN "public"."schizophrenia_cvlt"."semantic_clustering" IS 'Semantic clustering index - measure of category-based recall strategy';
COMMENT ON COLUMN "public"."schizophrenia_cvlt"."serial_clustering" IS 'Serial clustering index - measure of order-based recall strategy';
COMMENT ON COLUMN "public"."schizophrenia_cvlt"."perseverations" IS 'Total repetition errors across all trials';
COMMENT ON COLUMN "public"."schizophrenia_cvlt"."intrusions" IS 'Total intrusion errors (non-list words) across all trials';
COMMENT ON COLUMN "public"."schizophrenia_cvlt"."recognition_hits" IS 'Correct identifications in recognition test (0-16)';
COMMENT ON COLUMN "public"."schizophrenia_cvlt"."false_positives" IS 'False alarms in recognition test (0-28)';
COMMENT ON COLUMN "public"."schizophrenia_cvlt"."discriminability" IS 'Recognition discriminability index (percentage)';
COMMENT ON COLUMN "public"."schizophrenia_cvlt"."primacy" IS 'Percentage of primacy region words recalled';
COMMENT ON COLUMN "public"."schizophrenia_cvlt"."recency" IS 'Percentage of recency region words recalled';
COMMENT ON COLUMN "public"."schizophrenia_cvlt"."response_bias" IS 'Response bias in recognition (tendency to say yes/no)';
COMMENT ON COLUMN "public"."schizophrenia_cvlt"."cvlt_delai" IS 'Delay in minutes between immediate and delayed recall';
COMMENT ON COLUMN "public"."schizophrenia_cvlt"."trial_1_std" IS 'Z-score for Trial 1 (regression-based, all ages)';
COMMENT ON COLUMN "public"."schizophrenia_cvlt"."trial_5_std" IS 'Standardized score for Trial 5 (percentile for ages <70, Z-score for 70+)';
COMMENT ON COLUMN "public"."schizophrenia_cvlt"."total_1_5_std" IS 'Z-score for Trials 1-5 total (regression-based, all ages)';
COMMENT ON COLUMN "public"."schizophrenia_cvlt"."test_done" IS 'Flag indicating test was administered (true = done, false = not done)';
