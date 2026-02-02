-- ============================================================================
-- Migration: Create schizophrenia_commissions table
-- Schizophrenia Initial Evaluation - Neuropsy Module - Bloc 2
-- Test des Commissions - Errand planning/executive function assessment
-- ============================================================================

-- Create the schizophrenia_commissions table
CREATE TABLE IF NOT EXISTS "public"."schizophrenia_commissions" (
  -- Primary key and foreign keys
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "visit_id" UUID REFERENCES "public"."visits"("id") ON DELETE CASCADE NOT NULL UNIQUE,
  "patient_id" UUID REFERENCES "public"."patients"("id") ON DELETE CASCADE NOT NULL,
  
  -- Demographics for scoring calculations
  "patient_age" INTEGER,
  "nsc" INTEGER CHECK ("nsc" IN (0, 1)),  -- Education level: 0=lower, 1=higher
  
  -- Raw inputs
  "com01" INTEGER CHECK ("com01" >= 0),  -- Time in minutes
  "com02" INTEGER CHECK ("com02" >= 0),  -- Unnecessary detours
  "com03" INTEGER CHECK ("com03" >= 0),  -- Schedule violations
  "com04" INTEGER CHECK ("com04" >= 0),  -- Logic errors
  "com05" TEXT,                          -- Errand sequence (free text)
  
  -- Time scores
  "com01s1" VARCHAR(20),                 -- Time percentile
  "com01s2" NUMERIC(5,2),                -- Time Z-score
  
  -- Detours scores
  "com02s1" VARCHAR(20),                 -- Detours percentile
  "com02s2" NUMERIC(5,2),                -- Detours Z-score
  
  -- Schedule violations scores
  "com03s1" VARCHAR(20),                 -- Schedule violations percentile
  "com03s2" NUMERIC(5,2),                -- Schedule violations Z-score
  
  -- Logic errors scores
  "com04s1" VARCHAR(20),                 -- Logic errors percentile
  "com04s2" NUMERIC(5,2),                -- Logic errors Z-score
  
  -- Total errors
  "com04s3" INTEGER,                     -- Total errors (com02 + com03 + com04)
  "com04s4" VARCHAR(20),                 -- Total errors percentile
  "com04s5" NUMERIC(5,2),                -- Total errors Z-score
  
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
CREATE INDEX IF NOT EXISTS "idx_schizophrenia_commissions_visit_id" ON "public"."schizophrenia_commissions"("visit_id");
CREATE INDEX IF NOT EXISTS "idx_schizophrenia_commissions_patient_id" ON "public"."schizophrenia_commissions"("patient_id");
CREATE INDEX IF NOT EXISTS "idx_schizophrenia_commissions_completed_at" ON "public"."schizophrenia_commissions"("completed_at");

-- Enable Row Level Security
ALTER TABLE "public"."schizophrenia_commissions" ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS Policies for Patients
-- ============================================================================

-- Patients can view their own responses
CREATE POLICY "Patients view own schizophrenia_commissions responses"
  ON "public"."schizophrenia_commissions"
  FOR SELECT
  USING (auth.uid() = patient_id);

-- Patients can insert their own responses
CREATE POLICY "Patients insert own schizophrenia_commissions responses"
  ON "public"."schizophrenia_commissions"
  FOR INSERT
  WITH CHECK (auth.uid() = patient_id);

-- Patients can update their own responses
CREATE POLICY "Patients update own schizophrenia_commissions responses"
  ON "public"."schizophrenia_commissions"
  FOR UPDATE
  USING (auth.uid() = patient_id);

-- ============================================================================
-- RLS Policies for Healthcare Professionals
-- ============================================================================

-- Professionals can view all responses
CREATE POLICY "Professionals view all schizophrenia_commissions responses"
  ON "public"."schizophrenia_commissions"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "public"."user_profiles"
      WHERE "id" = auth.uid()
      AND "role" IN ('healthcare_professional', 'manager', 'administrator')
    )
  );

-- Professionals can insert responses
CREATE POLICY "Professionals insert schizophrenia_commissions responses"
  ON "public"."schizophrenia_commissions"
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "public"."user_profiles"
      WHERE "id" = auth.uid()
      AND "role" IN ('healthcare_professional', 'manager', 'administrator')
    )
  );

-- Professionals can update responses
CREATE POLICY "Professionals update schizophrenia_commissions responses"
  ON "public"."schizophrenia_commissions"
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

CREATE OR REPLACE FUNCTION update_schizophrenia_commissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_schizophrenia_commissions_updated_at
  BEFORE UPDATE ON "public"."schizophrenia_commissions"
  FOR EACH ROW
  EXECUTE FUNCTION update_schizophrenia_commissions_updated_at();

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE "public"."schizophrenia_commissions" IS 'Test des Commissions responses for schizophrenia patients - Neuropsy Module Bloc 2. Evaluates planning and executive functions through errand-planning task.';
COMMENT ON COLUMN "public"."schizophrenia_commissions"."nsc" IS 'Education level: 0=lower (<Bac), 1=higher (>=Bac) - used for normative scoring';
COMMENT ON COLUMN "public"."schizophrenia_commissions"."com01" IS 'Completion time in minutes';
COMMENT ON COLUMN "public"."schizophrenia_commissions"."com02" IS 'Number of unnecessary detours';
COMMENT ON COLUMN "public"."schizophrenia_commissions"."com03" IS 'Number of schedule/time violations';
COMMENT ON COLUMN "public"."schizophrenia_commissions"."com04" IS 'Number of logical errors';
COMMENT ON COLUMN "public"."schizophrenia_commissions"."com05" IS 'Recorded errand sequence (free text)';
COMMENT ON COLUMN "public"."schizophrenia_commissions"."com01s1" IS 'Time percentile (based on NSC)';
COMMENT ON COLUMN "public"."schizophrenia_commissions"."com01s2" IS 'Time Z-score (based on age group + NSC)';
COMMENT ON COLUMN "public"."schizophrenia_commissions"."com02s1" IS 'Detours percentile';
COMMENT ON COLUMN "public"."schizophrenia_commissions"."com02s2" IS 'Detours Z-score';
COMMENT ON COLUMN "public"."schizophrenia_commissions"."com03s1" IS 'Schedule violations percentile';
COMMENT ON COLUMN "public"."schizophrenia_commissions"."com03s2" IS 'Schedule violations Z-score';
COMMENT ON COLUMN "public"."schizophrenia_commissions"."com04s1" IS 'Logic errors percentile';
COMMENT ON COLUMN "public"."schizophrenia_commissions"."com04s2" IS 'Logic errors Z-score';
COMMENT ON COLUMN "public"."schizophrenia_commissions"."com04s3" IS 'Total errors (com02 + com03 + com04)';
COMMENT ON COLUMN "public"."schizophrenia_commissions"."com04s4" IS 'Total errors percentile';
COMMENT ON COLUMN "public"."schizophrenia_commissions"."com04s5" IS 'Total errors Z-score';
COMMENT ON COLUMN "public"."schizophrenia_commissions"."test_done" IS 'Flag indicating test was administered (true = done, false = not done)';
