-- ============================================================================
-- Migration: Create schizophrenia_tmt table
-- Schizophrenia Initial Evaluation - Neuropsy Module - Bloc 2
-- Trail Making Test (TMT) - Reitan (1955)
-- ============================================================================

-- Create the schizophrenia_tmt table
CREATE TABLE IF NOT EXISTS "public"."schizophrenia_tmt" (
  -- Primary key and foreign keys
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "visit_id" UUID REFERENCES "public"."visits"("id") ON DELETE CASCADE NOT NULL UNIQUE,
  "patient_id" UUID REFERENCES "public"."patients"("id") ON DELETE CASCADE NOT NULL,
  
  -- Demographics for scoring calculations
  "patient_age" INTEGER,
  "years_of_education" NUMERIC(4,1),
  
  -- Part A raw inputs
  "tmta_tps" INTEGER CHECK ("tmta_tps" >= 0),          -- Time in seconds
  "tmta_err" INTEGER CHECK ("tmta_err" >= 0),          -- Uncorrected errors
  "tmta_cor" INTEGER CHECK ("tmta_cor" >= 0),          -- Corrected errors
  
  -- Part B raw inputs
  "tmtb_tps" INTEGER CHECK ("tmtb_tps" >= 0),          -- Time in seconds
  "tmtb_err" INTEGER CHECK ("tmtb_err" >= 0),          -- Uncorrected errors
  "tmtb_cor" INTEGER CHECK ("tmtb_cor" >= 0),          -- Corrected errors
  "tmtb_err_persev" INTEGER CHECK ("tmtb_err_persev" >= 0),  -- Perseverative errors
  
  -- Computed totals
  "tmta_errtot" INTEGER,                               -- Part A total errors (err + cor)
  "tmtb_errtot" INTEGER,                               -- Part B total errors (err + cor)
  "tmt_b_a_tps" INTEGER,                               -- B-A time difference
  "tmt_b_a_err" INTEGER,                               -- B-A error difference
  
  -- Part A standardized scores
  "tmta_tps_z" NUMERIC(5,2),                           -- Z-score for time
  "tmta_tps_pc" VARCHAR(20),                           -- Percentile for time
  "tmta_errtot_z" NUMERIC(5,2),                        -- Z-score for total errors
  "tmta_errtot_pc" VARCHAR(20),                        -- Percentile for total errors
  
  -- Part B standardized scores
  "tmtb_tps_z" NUMERIC(5,2),                           -- Z-score for time
  "tmtb_tps_pc" VARCHAR(20),                           -- Percentile for time
  "tmtb_errtot_z" NUMERIC(5,2),                        -- Z-score for total errors
  "tmtb_errtot_pc" VARCHAR(20),                        -- Percentile for total errors
  "tmtb_err_persev_z" NUMERIC(5,2),                    -- Z-score for perseverative errors
  "tmtb_err_persev_pc" VARCHAR(20),                    -- Percentile for perseverative errors
  
  -- B-A difference standardized scores
  "tmt_b_a_tps_z" NUMERIC(5,2),                        -- Z-score for time difference
  "tmt_b_a_tps_pc" VARCHAR(20),                        -- Percentile for time difference
  "tmt_b_a_err_z" NUMERIC(5,2),                        -- Z-score for error difference
  "tmt_b_a_err_pc" VARCHAR(20),                        -- Percentile for error difference
  
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
CREATE INDEX IF NOT EXISTS "idx_schizophrenia_tmt_visit_id" ON "public"."schizophrenia_tmt"("visit_id");
CREATE INDEX IF NOT EXISTS "idx_schizophrenia_tmt_patient_id" ON "public"."schizophrenia_tmt"("patient_id");
CREATE INDEX IF NOT EXISTS "idx_schizophrenia_tmt_completed_at" ON "public"."schizophrenia_tmt"("completed_at");

-- Enable Row Level Security
ALTER TABLE "public"."schizophrenia_tmt" ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS Policies for Patients
-- ============================================================================

-- Patients can view their own responses
CREATE POLICY "Patients view own schizophrenia_tmt responses"
  ON "public"."schizophrenia_tmt"
  FOR SELECT
  USING (auth.uid() = patient_id);

-- Patients can insert their own responses
CREATE POLICY "Patients insert own schizophrenia_tmt responses"
  ON "public"."schizophrenia_tmt"
  FOR INSERT
  WITH CHECK (auth.uid() = patient_id);

-- Patients can update their own responses
CREATE POLICY "Patients update own schizophrenia_tmt responses"
  ON "public"."schizophrenia_tmt"
  FOR UPDATE
  USING (auth.uid() = patient_id);

-- ============================================================================
-- RLS Policies for Healthcare Professionals
-- ============================================================================

-- Professionals can view all responses
CREATE POLICY "Professionals view all schizophrenia_tmt responses"
  ON "public"."schizophrenia_tmt"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "public"."user_profiles"
      WHERE "id" = auth.uid()
      AND "role" IN ('healthcare_professional', 'manager', 'administrator')
    )
  );

-- Professionals can insert responses
CREATE POLICY "Professionals insert schizophrenia_tmt responses"
  ON "public"."schizophrenia_tmt"
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "public"."user_profiles"
      WHERE "id" = auth.uid()
      AND "role" IN ('healthcare_professional', 'manager', 'administrator')
    )
  );

-- Professionals can update responses
CREATE POLICY "Professionals update schizophrenia_tmt responses"
  ON "public"."schizophrenia_tmt"
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

CREATE OR REPLACE FUNCTION update_schizophrenia_tmt_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_schizophrenia_tmt_updated_at
  BEFORE UPDATE ON "public"."schizophrenia_tmt"
  FOR EACH ROW
  EXECUTE FUNCTION update_schizophrenia_tmt_updated_at();

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE "public"."schizophrenia_tmt" IS 'Trail Making Test (TMT) responses for schizophrenia patients - Neuropsy Module Bloc 2. Reference: Reitan (1955).';
COMMENT ON COLUMN "public"."schizophrenia_tmt"."tmta_tps" IS 'Part A completion time in seconds';
COMMENT ON COLUMN "public"."schizophrenia_tmt"."tmta_err" IS 'Part A uncorrected errors';
COMMENT ON COLUMN "public"."schizophrenia_tmt"."tmta_cor" IS 'Part A self-corrected errors';
COMMENT ON COLUMN "public"."schizophrenia_tmt"."tmtb_tps" IS 'Part B completion time in seconds';
COMMENT ON COLUMN "public"."schizophrenia_tmt"."tmtb_err" IS 'Part B uncorrected errors';
COMMENT ON COLUMN "public"."schizophrenia_tmt"."tmtb_cor" IS 'Part B self-corrected errors';
COMMENT ON COLUMN "public"."schizophrenia_tmt"."tmtb_err_persev" IS 'Part B perseverative errors (continuing same category instead of alternating)';
COMMENT ON COLUMN "public"."schizophrenia_tmt"."tmta_errtot" IS 'Part A total errors (uncorrected + corrected)';
COMMENT ON COLUMN "public"."schizophrenia_tmt"."tmtb_errtot" IS 'Part B total errors (uncorrected + corrected)';
COMMENT ON COLUMN "public"."schizophrenia_tmt"."tmt_b_a_tps" IS 'B-A time difference in seconds (measures isolated executive function)';
COMMENT ON COLUMN "public"."schizophrenia_tmt"."tmt_b_a_err" IS 'B-A error difference (measures isolated executive function)';
COMMENT ON COLUMN "public"."schizophrenia_tmt"."tmta_tps_z" IS 'Z-score for Part A time (positive = better performance)';
COMMENT ON COLUMN "public"."schizophrenia_tmt"."tmta_tps_pc" IS 'Percentile for Part A time';
COMMENT ON COLUMN "public"."schizophrenia_tmt"."tmtb_tps_z" IS 'Z-score for Part B time (positive = better performance)';
COMMENT ON COLUMN "public"."schizophrenia_tmt"."tmtb_tps_pc" IS 'Percentile for Part B time';
COMMENT ON COLUMN "public"."schizophrenia_tmt"."tmtb_err_persev_z" IS 'Z-score for Part B perseverative errors';
COMMENT ON COLUMN "public"."schizophrenia_tmt"."tmtb_err_persev_pc" IS 'Percentile for Part B perseverative errors';
COMMENT ON COLUMN "public"."schizophrenia_tmt"."tmt_b_a_tps_z" IS 'Z-score for B-A time difference';
COMMENT ON COLUMN "public"."schizophrenia_tmt"."tmt_b_a_tps_pc" IS 'Percentile for B-A time difference';
COMMENT ON COLUMN "public"."schizophrenia_tmt"."test_done" IS 'Flag indicating test was administered (true = done, false = not done)';
