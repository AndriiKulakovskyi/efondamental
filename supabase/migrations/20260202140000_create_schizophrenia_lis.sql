-- ============================================================================
-- Migration: Create schizophrenia_lis table
-- Schizophrenia Initial Evaluation - Neuropsy Module - Bloc 2
-- LIS (Lecture d'Intentions Sociales) - Social cognition test
-- ============================================================================

-- Create the schizophrenia_lis table
CREATE TABLE IF NOT EXISTS "public"."schizophrenia_lis" (
  -- Primary key and foreign keys
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "visit_id" UUID REFERENCES "public"."visits"("id") ON DELETE CASCADE NOT NULL UNIQUE,
  "patient_id" UUID REFERENCES "public"."patients"("id") ON DELETE CASCADE NOT NULL,
  
  -- Film A: L'amende
  "lis_a1" INTEGER CHECK ("lis_a1" >= 1 AND "lis_a1" <= 4),
  "lis_a2" INTEGER CHECK ("lis_a2" >= 1 AND "lis_a2" <= 4),
  "lis_a3" INTEGER CHECK ("lis_a3" >= 1 AND "lis_a3" <= 4),
  "lis_a4" INTEGER CHECK ("lis_a4" >= 1 AND "lis_a4" <= 4),
  "lis_a5" INTEGER CHECK ("lis_a5" >= 1 AND "lis_a5" <= 4),
  
  -- Film B: Le hoquet
  "lis_b1" INTEGER CHECK ("lis_b1" >= 1 AND "lis_b1" <= 4),
  "lis_b2" INTEGER CHECK ("lis_b2" >= 1 AND "lis_b2" <= 4),
  "lis_b3" INTEGER CHECK ("lis_b3" >= 1 AND "lis_b3" <= 4),
  "lis_b4" INTEGER CHECK ("lis_b4" >= 1 AND "lis_b4" <= 4),
  "lis_b5" INTEGER CHECK ("lis_b5" >= 1 AND "lis_b5" <= 4),
  
  -- Film C: La blessure
  "lis_c1" INTEGER CHECK ("lis_c1" >= 1 AND "lis_c1" <= 4),
  "lis_c2" INTEGER CHECK ("lis_c2" >= 1 AND "lis_c2" <= 4),
  "lis_c3" INTEGER CHECK ("lis_c3" >= 1 AND "lis_c3" <= 4),
  "lis_c4" INTEGER CHECK ("lis_c4" >= 1 AND "lis_c4" <= 4),
  "lis_c5" INTEGER CHECK ("lis_c5" >= 1 AND "lis_c5" <= 4),
  
  -- Film D: Le col remonté
  "lis_d1" INTEGER CHECK ("lis_d1" >= 1 AND "lis_d1" <= 4),
  "lis_d2" INTEGER CHECK ("lis_d2" >= 1 AND "lis_d2" <= 4),
  "lis_d3" INTEGER CHECK ("lis_d3" >= 1 AND "lis_d3" <= 4),
  "lis_d4" INTEGER CHECK ("lis_d4" >= 1 AND "lis_d4" <= 4),
  "lis_d5" INTEGER CHECK ("lis_d5" >= 1 AND "lis_d5" <= 4),
  
  -- Film E: Les cafés
  "lis_e1" INTEGER CHECK ("lis_e1" >= 1 AND "lis_e1" <= 4),
  "lis_e2" INTEGER CHECK ("lis_e2" >= 1 AND "lis_e2" <= 4),
  "lis_e3" INTEGER CHECK ("lis_e3" >= 1 AND "lis_e3" <= 4),
  "lis_e4" INTEGER CHECK ("lis_e4" >= 1 AND "lis_e4" <= 4),
  "lis_e5" INTEGER CHECK ("lis_e5" >= 1 AND "lis_e5" <= 4),
  
  -- Film F: La salle de bain
  "lis_f1" INTEGER CHECK ("lis_f1" >= 1 AND "lis_f1" <= 4),
  "lis_f2" INTEGER CHECK ("lis_f2" >= 1 AND "lis_f2" <= 4),
  "lis_f3" INTEGER CHECK ("lis_f3" >= 1 AND "lis_f3" <= 4),
  "lis_f4" INTEGER CHECK ("lis_f4" >= 1 AND "lis_f4" <= 4),
  "lis_f5" INTEGER CHECK ("lis_f5" >= 1 AND "lis_f5" <= 4),
  
  -- Computed score (total deviation from normative values)
  "lis_score" NUMERIC(6,2),
  
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
CREATE INDEX IF NOT EXISTS "idx_schizophrenia_lis_visit_id" ON "public"."schizophrenia_lis"("visit_id");
CREATE INDEX IF NOT EXISTS "idx_schizophrenia_lis_patient_id" ON "public"."schizophrenia_lis"("patient_id");
CREATE INDEX IF NOT EXISTS "idx_schizophrenia_lis_completed_at" ON "public"."schizophrenia_lis"("completed_at");

-- Enable Row Level Security
ALTER TABLE "public"."schizophrenia_lis" ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS Policies for Patients
-- ============================================================================

-- Patients can view their own responses
CREATE POLICY "Patients view own schizophrenia_lis responses"
  ON "public"."schizophrenia_lis"
  FOR SELECT
  USING (auth.uid() = patient_id);

-- Patients can insert their own responses
CREATE POLICY "Patients insert own schizophrenia_lis responses"
  ON "public"."schizophrenia_lis"
  FOR INSERT
  WITH CHECK (auth.uid() = patient_id);

-- Patients can update their own responses
CREATE POLICY "Patients update own schizophrenia_lis responses"
  ON "public"."schizophrenia_lis"
  FOR UPDATE
  USING (auth.uid() = patient_id);

-- ============================================================================
-- RLS Policies for Healthcare Professionals
-- ============================================================================

-- Professionals can view all responses
CREATE POLICY "Professionals view all schizophrenia_lis responses"
  ON "public"."schizophrenia_lis"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "public"."user_profiles"
      WHERE "id" = auth.uid()
      AND "role" IN ('healthcare_professional', 'manager', 'administrator')
    )
  );

-- Professionals can insert responses
CREATE POLICY "Professionals insert schizophrenia_lis responses"
  ON "public"."schizophrenia_lis"
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "public"."user_profiles"
      WHERE "id" = auth.uid()
      AND "role" IN ('healthcare_professional', 'manager', 'administrator')
    )
  );

-- Professionals can update responses
CREATE POLICY "Professionals update schizophrenia_lis responses"
  ON "public"."schizophrenia_lis"
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

CREATE OR REPLACE FUNCTION update_schizophrenia_lis_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_schizophrenia_lis_updated_at
  BEFORE UPDATE ON "public"."schizophrenia_lis"
  FOR EACH ROW
  EXECUTE FUNCTION update_schizophrenia_lis_updated_at();

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE "public"."schizophrenia_lis" IS 'LIS (Lecture d''Intentions Sociales) responses for schizophrenia patients - Neuropsy Module Bloc 2. Evaluates social cognition through film scenarios.';
COMMENT ON COLUMN "public"."schizophrenia_lis"."lis_a1" IS 'Film A item 1 response (1-4 scale)';
COMMENT ON COLUMN "public"."schizophrenia_lis"."lis_score" IS 'Total deviation score from normative values (lower = better social cognition)';
COMMENT ON COLUMN "public"."schizophrenia_lis"."test_done" IS 'Flag indicating test was administered (true = done, false = not done)';
