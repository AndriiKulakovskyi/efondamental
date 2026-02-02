-- ============================================================================
-- Migration: Create schizophrenia_wais4_efficience table
-- Schizophrenia Initial Evaluation - Neuropsy Module - WAIS-IV Subgroup
-- Denney 2015 QI Estimation and Barona Index (Gregory, 1987)
-- ============================================================================

-- Create the schizophrenia_wais4_efficience table
CREATE TABLE IF NOT EXISTS "public"."schizophrenia_wais4_efficience" (
  -- Primary key and foreign keys
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "visit_id" UUID REFERENCES "public"."visits"("id") ON DELETE CASCADE NOT NULL UNIQUE,
  "patient_id" UUID REFERENCES "public"."patients"("id") ON DELETE CASCADE NOT NULL,
  
  -- Denney inputs (subtest standard scores, 1-19)
  "info_std" INTEGER CHECK ("info_std" BETWEEN 1 AND 19),
  "wais_simi_std" INTEGER CHECK ("wais_simi_std" BETWEEN 1 AND 19),
  "wais_mat_std" INTEGER CHECK ("wais_mat_std" BETWEEN 1 AND 19),
  "compl_im_std" INTEGER CHECK ("compl_im_std" BETWEEN 1 AND 19),
  "wais_mc_std" INTEGER CHECK ("wais_mc_std" BETWEEN 1 AND 19),
  "wais_arith_std" INTEGER CHECK ("wais_arith_std" BETWEEN 1 AND 19),
  "wais_cod_std" INTEGER CHECK ("wais_cod_std" BETWEEN 1 AND 19),
  
  -- Denney computed indices - QI (Full Scale IQ)
  "qi_sum_std" INTEGER,
  "qi_indice" INTEGER,
  "qi_rang" TEXT,
  "qi_ci95" TEXT,
  "qi_interpretation" TEXT,
  
  -- Denney computed indices - ICV (Verbal Comprehension Index)
  "icv_sum_std" INTEGER,
  "icv_indice" INTEGER,
  "icv_rang" TEXT,
  "icv_ci95" TEXT,
  "icv_interpretation" TEXT,
  
  -- Denney computed indices - IRP (Perceptual Reasoning Index)
  "irp_sum_std" INTEGER,
  "irp_indice" INTEGER,
  "irp_rang" TEXT,
  "irp_ci95" TEXT,
  "irp_interpretation" TEXT,
  
  -- Denney computed indices - IMT (Working Memory Index)
  "imt_sum_std" INTEGER,
  "imt_indice" INTEGER,
  "imt_rang" TEXT,
  "imt_ci95" TEXT,
  "imt_interpretation" TEXT,
  
  -- Denney computed indices - IVT (Processing Speed Index)
  "ivt_sum_std" INTEGER,
  "ivt_indice" INTEGER,
  "ivt_rang" TEXT,
  "ivt_ci95" TEXT,
  "ivt_interpretation" TEXT,
  
  -- Barona section
  "barona_test_done" BOOLEAN DEFAULT false,
  "rad_barona_profession" INTEGER CHECK ("rad_barona_profession" BETWEEN 1 AND 7),
  "rad_barona_etude" INTEGER CHECK ("rad_barona_etude" BETWEEN 1 AND 7),
  "barona_qit_attendu" NUMERIC(5,2),
  "barona_qit_difference" NUMERIC(5,2),
  
  -- Metadata
  "completed_by" UUID REFERENCES "public"."user_profiles"("id"),
  "completed_at" TIMESTAMPTZ DEFAULT NOW(),
  "created_at" TIMESTAMPTZ DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS "idx_schizophrenia_wais4_efficience_visit_id" ON "public"."schizophrenia_wais4_efficience"("visit_id");
CREATE INDEX IF NOT EXISTS "idx_schizophrenia_wais4_efficience_patient_id" ON "public"."schizophrenia_wais4_efficience"("patient_id");
CREATE INDEX IF NOT EXISTS "idx_schizophrenia_wais4_efficience_completed_at" ON "public"."schizophrenia_wais4_efficience"("completed_at");

-- Enable Row Level Security
ALTER TABLE "public"."schizophrenia_wais4_efficience" ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS Policies for Patients
-- ============================================================================

-- Patients can view their own responses
CREATE POLICY "Patients view own schizophrenia_wais4_efficience responses"
  ON "public"."schizophrenia_wais4_efficience"
  FOR SELECT
  USING (auth.uid() = patient_id);

-- Patients can insert their own responses
CREATE POLICY "Patients insert own schizophrenia_wais4_efficience responses"
  ON "public"."schizophrenia_wais4_efficience"
  FOR INSERT
  WITH CHECK (auth.uid() = patient_id);

-- Patients can update their own responses
CREATE POLICY "Patients update own schizophrenia_wais4_efficience responses"
  ON "public"."schizophrenia_wais4_efficience"
  FOR UPDATE
  USING (auth.uid() = patient_id);

-- ============================================================================
-- RLS Policies for Healthcare Professionals
-- ============================================================================

-- Professionals can view all responses
CREATE POLICY "Professionals view all schizophrenia_wais4_efficience responses"
  ON "public"."schizophrenia_wais4_efficience"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "public"."user_profiles"
      WHERE "id" = auth.uid()
      AND "role" IN ('healthcare_professional', 'manager', 'administrator')
    )
  );

-- Professionals can insert responses
CREATE POLICY "Professionals insert schizophrenia_wais4_efficience responses"
  ON "public"."schizophrenia_wais4_efficience"
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "public"."user_profiles"
      WHERE "id" = auth.uid()
      AND "role" IN ('healthcare_professional', 'manager', 'administrator')
    )
  );

-- Professionals can update responses
CREATE POLICY "Professionals update schizophrenia_wais4_efficience responses"
  ON "public"."schizophrenia_wais4_efficience"
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

CREATE OR REPLACE FUNCTION update_schizophrenia_wais4_efficience_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_schizophrenia_wais4_efficience_updated_at
  BEFORE UPDATE ON "public"."schizophrenia_wais4_efficience"
  FOR EACH ROW
  EXECUTE FUNCTION update_schizophrenia_wais4_efficience_updated_at();

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE "public"."schizophrenia_wais4_efficience" IS 'WAIS-IV Efficience Intellectuelle responses for schizophrenia patients - Neuropsy Module. Includes Denney 2015 QI estimation and Barona Index.';
COMMENT ON COLUMN "public"."schizophrenia_wais4_efficience"."info_std" IS 'Information subtest standard score (1-19)';
COMMENT ON COLUMN "public"."schizophrenia_wais4_efficience"."wais_simi_std" IS 'Similitudes subtest standard score (1-19)';
COMMENT ON COLUMN "public"."schizophrenia_wais4_efficience"."wais_mat_std" IS 'Matrices subtest standard score (1-19)';
COMMENT ON COLUMN "public"."schizophrenia_wais4_efficience"."compl_im_std" IS 'Completement d''images subtest standard score (1-19)';
COMMENT ON COLUMN "public"."schizophrenia_wais4_efficience"."wais_mc_std" IS 'Memoire des chiffres subtest standard score (1-19)';
COMMENT ON COLUMN "public"."schizophrenia_wais4_efficience"."wais_arith_std" IS 'Arithmetique subtest standard score (1-19)';
COMMENT ON COLUMN "public"."schizophrenia_wais4_efficience"."wais_cod_std" IS 'Code subtest standard score (1-19)';
COMMENT ON COLUMN "public"."schizophrenia_wais4_efficience"."qi_indice" IS 'Denney Full Scale IQ index value';
COMMENT ON COLUMN "public"."schizophrenia_wais4_efficience"."barona_qit_attendu" IS 'Barona expected IQ based on demographic factors';
COMMENT ON COLUMN "public"."schizophrenia_wais4_efficience"."barona_qit_difference" IS 'Difference between expected (Barona) and observed (Denney) IQ';
