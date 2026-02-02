-- ============================================================================
-- Migration: Create schizophrenia_wais4_criteria table
-- Schizophrenia Initial Evaluation - Neuropsy Module - WAIS-IV Subgroup
-- Pre-evaluation screening to determine patient eligibility for neuropsychological testing
-- ============================================================================

-- Create the schizophrenia_wais4_criteria table
CREATE TABLE IF NOT EXISTS "public"."schizophrenia_wais4_criteria" (
  -- Primary key and foreign keys
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "visit_id" UUID REFERENCES "public"."visits"("id") ON DELETE CASCADE NOT NULL UNIQUE,
  "patient_id" UUID REFERENCES "public"."patients"("id") ON DELETE CASCADE NOT NULL,
  
  -- General Information
  "date_neuropsychologie" DATE,
  "neuro_age" INTEGER CHECK ("neuro_age" >= 16 AND "neuro_age" <= 90),
  "rad_dernier_eval" VARCHAR(50),
  "annees_etudes" NUMERIC(4,1) CHECK ("annees_etudes" >= 0 AND "annees_etudes" <= 30),
  
  -- Clinical Criteria (0/1 radio values)
  "rad_neuro_lang" INTEGER CHECK ("rad_neuro_lang" IN (0, 1)),
  "rad_neuro_normo" INTEGER CHECK ("rad_neuro_normo" IN (0, 1)),
  "rad_neuro_dalt" INTEGER CHECK ("rad_neuro_dalt" IN (0, 1)),
  "rad_neuro_tbaud" INTEGER CHECK ("rad_neuro_tbaud" IN (0, 1)),
  "rad_neuro_sismo" INTEGER CHECK ("rad_neuro_sismo" IN (0, 1)),
  "rad_abs_ep_3month" INTEGER CHECK ("rad_abs_ep_3month" IN (0, 1)),
  "chk_sismo_choix" TEXT,
  "rad_neuro_psychotrope" INTEGER CHECK ("rad_neuro_psychotrope" IN (0, 1)),
  
  -- Acceptance for evaluation
  "accepted_for_neuropsy_evaluation" BOOLEAN,
  
  -- Metadata
  "completed_by" UUID REFERENCES "public"."user_profiles"("id"),
  "completed_at" TIMESTAMPTZ DEFAULT NOW(),
  "created_at" TIMESTAMPTZ DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS "idx_schizophrenia_wais4_criteria_visit_id" ON "public"."schizophrenia_wais4_criteria"("visit_id");
CREATE INDEX IF NOT EXISTS "idx_schizophrenia_wais4_criteria_patient_id" ON "public"."schizophrenia_wais4_criteria"("patient_id");
CREATE INDEX IF NOT EXISTS "idx_schizophrenia_wais4_criteria_completed_at" ON "public"."schizophrenia_wais4_criteria"("completed_at");

-- Enable Row Level Security
ALTER TABLE "public"."schizophrenia_wais4_criteria" ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS Policies for Patients
-- ============================================================================

-- Patients can view their own responses
CREATE POLICY "Patients view own schizophrenia_wais4_criteria responses"
  ON "public"."schizophrenia_wais4_criteria"
  FOR SELECT
  USING (auth.uid() = patient_id);

-- Patients can insert their own responses
CREATE POLICY "Patients insert own schizophrenia_wais4_criteria responses"
  ON "public"."schizophrenia_wais4_criteria"
  FOR INSERT
  WITH CHECK (auth.uid() = patient_id);

-- Patients can update their own responses
CREATE POLICY "Patients update own schizophrenia_wais4_criteria responses"
  ON "public"."schizophrenia_wais4_criteria"
  FOR UPDATE
  USING (auth.uid() = patient_id);

-- ============================================================================
-- RLS Policies for Healthcare Professionals
-- ============================================================================

-- Professionals can view all responses
CREATE POLICY "Professionals view all schizophrenia_wais4_criteria responses"
  ON "public"."schizophrenia_wais4_criteria"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "public"."user_profiles"
      WHERE "id" = auth.uid()
      AND "role" IN ('healthcare_professional', 'manager', 'administrator')
    )
  );

-- Professionals can insert responses
CREATE POLICY "Professionals insert schizophrenia_wais4_criteria responses"
  ON "public"."schizophrenia_wais4_criteria"
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "public"."user_profiles"
      WHERE "id" = auth.uid()
      AND "role" IN ('healthcare_professional', 'manager', 'administrator')
    )
  );

-- Professionals can update responses
CREATE POLICY "Professionals update schizophrenia_wais4_criteria responses"
  ON "public"."schizophrenia_wais4_criteria"
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

CREATE OR REPLACE FUNCTION update_schizophrenia_wais4_criteria_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_schizophrenia_wais4_criteria_updated_at
  BEFORE UPDATE ON "public"."schizophrenia_wais4_criteria"
  FOR EACH ROW
  EXECUTE FUNCTION update_schizophrenia_wais4_criteria_updated_at();

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE "public"."schizophrenia_wais4_criteria" IS 'WAIS-IV Clinical Criteria responses for schizophrenia patients - Neuropsy Module. Pre-evaluation screening for neuropsychological testing eligibility.';
COMMENT ON COLUMN "public"."schizophrenia_wais4_criteria"."date_neuropsychologie" IS 'Date when the neuropsychological test battery is administered';
COMMENT ON COLUMN "public"."schizophrenia_wais4_criteria"."neuro_age" IS 'Patient age at the day of evaluation - used for normative scoring';
COMMENT ON COLUMN "public"."schizophrenia_wais4_criteria"."annees_etudes" IS 'Number of years of formal education - used for normative stratification';
COMMENT ON COLUMN "public"."schizophrenia_wais4_criteria"."rad_neuro_normo" IS 'Clinical state compatible with cognitive test administration (1=Yes, 0=No)';
COMMENT ON COLUMN "public"."schizophrenia_wais4_criteria"."accepted_for_neuropsy_evaluation" IS 'Final eligibility decision for neuropsychological evaluation';
