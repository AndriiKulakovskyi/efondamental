-- ============================================================================
-- Migration: Create schizophrenia_wais4_similitudes table
-- Schizophrenia Initial Evaluation - Neuropsy Module - WAIS-IV Subgroup
-- Verbal comprehension subtest assessing abstract verbal reasoning
-- ============================================================================

-- Create the schizophrenia_wais4_similitudes table
CREATE TABLE IF NOT EXISTS "public"."schizophrenia_wais4_similitudes" (
  -- Primary key and foreign keys
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "visit_id" UUID REFERENCES "public"."visits"("id") ON DELETE CASCADE NOT NULL UNIQUE,
  "patient_id" UUID REFERENCES "public"."patients"("id") ON DELETE CASCADE NOT NULL,
  
  -- Test status
  "test_done" BOOLEAN DEFAULT true,
  
  -- 18 item scores (0-2 each)
  "item_1" INTEGER CHECK ("item_1" BETWEEN 0 AND 2),   -- Framboise-Groseille
  "item_2" INTEGER CHECK ("item_2" BETWEEN 0 AND 2),   -- Cheval-Tigre
  "item_3" INTEGER CHECK ("item_3" BETWEEN 0 AND 2),   -- Carottes-Épinards
  "item_4" INTEGER CHECK ("item_4" BETWEEN 0 AND 2),   -- Jaune-Bleu
  "item_5" INTEGER CHECK ("item_5" BETWEEN 0 AND 2),   -- Piano-Tambour
  "item_6" INTEGER CHECK ("item_6" BETWEEN 0 AND 2),   -- Poème-Statue
  "item_7" INTEGER CHECK ("item_7" BETWEEN 0 AND 2),   -- Bourgeon-Bébé
  "item_8" INTEGER CHECK ("item_8" BETWEEN 0 AND 2),   -- Miel-Lait
  "item_9" INTEGER CHECK ("item_9" BETWEEN 0 AND 2),   -- Nourriture-Carburant
  "item_10" INTEGER CHECK ("item_10" BETWEEN 0 AND 2), -- Cube-Cylindre
  "item_11" INTEGER CHECK ("item_11" BETWEEN 0 AND 2), -- Nez-Langue
  "item_12" INTEGER CHECK ("item_12" BETWEEN 0 AND 2), -- Soie-Laine
  "item_13" INTEGER CHECK ("item_13" BETWEEN 0 AND 2), -- Éolienne-Barrage
  "item_14" INTEGER CHECK ("item_14" BETWEEN 0 AND 2), -- Éphémère-Permanent
  "item_15" INTEGER CHECK ("item_15" BETWEEN 0 AND 2), -- Inondation-Sécheresse
  "item_16" INTEGER CHECK ("item_16" BETWEEN 0 AND 2), -- Sédentaire-Nomade
  "item_17" INTEGER CHECK ("item_17" BETWEEN 0 AND 2), -- Autoriser-Interdire
  "item_18" INTEGER CHECK ("item_18" BETWEEN 0 AND 2), -- Réalité-Rêve
  
  -- Computed scores
  "total_raw_score" INTEGER CHECK ("total_raw_score" BETWEEN 0 AND 36), -- Sum of all items
  "standard_score" INTEGER CHECK ("standard_score" BETWEEN 1 AND 19),   -- Age-adjusted standard score
  "standardized_value" NUMERIC(5,2),                                    -- Z-score: (standard_score - 10) / 3
  
  -- Metadata
  "completed_by" UUID REFERENCES "public"."user_profiles"("id"),
  "completed_at" TIMESTAMPTZ DEFAULT NOW(),
  "created_at" TIMESTAMPTZ DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS "idx_schizophrenia_wais4_similitudes_visit_id" ON "public"."schizophrenia_wais4_similitudes"("visit_id");
CREATE INDEX IF NOT EXISTS "idx_schizophrenia_wais4_similitudes_patient_id" ON "public"."schizophrenia_wais4_similitudes"("patient_id");
CREATE INDEX IF NOT EXISTS "idx_schizophrenia_wais4_similitudes_completed_at" ON "public"."schizophrenia_wais4_similitudes"("completed_at");

-- Enable Row Level Security
ALTER TABLE "public"."schizophrenia_wais4_similitudes" ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS Policies for Patients
-- ============================================================================

-- Patients can view their own responses
CREATE POLICY "Patients view own schizophrenia_wais4_similitudes responses"
  ON "public"."schizophrenia_wais4_similitudes"
  FOR SELECT
  USING (auth.uid() = patient_id);

-- Patients can insert their own responses
CREATE POLICY "Patients insert own schizophrenia_wais4_similitudes responses"
  ON "public"."schizophrenia_wais4_similitudes"
  FOR INSERT
  WITH CHECK (auth.uid() = patient_id);

-- Patients can update their own responses
CREATE POLICY "Patients update own schizophrenia_wais4_similitudes responses"
  ON "public"."schizophrenia_wais4_similitudes"
  FOR UPDATE
  USING (auth.uid() = patient_id);

-- ============================================================================
-- RLS Policies for Healthcare Professionals
-- ============================================================================

-- Professionals can view all responses
CREATE POLICY "Professionals view all schizophrenia_wais4_similitudes responses"
  ON "public"."schizophrenia_wais4_similitudes"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "public"."user_profiles"
      WHERE "id" = auth.uid()
      AND "role" IN ('healthcare_professional', 'manager', 'administrator')
    )
  );

-- Professionals can insert responses
CREATE POLICY "Professionals insert schizophrenia_wais4_similitudes responses"
  ON "public"."schizophrenia_wais4_similitudes"
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "public"."user_profiles"
      WHERE "id" = auth.uid()
      AND "role" IN ('healthcare_professional', 'manager', 'administrator')
    )
  );

-- Professionals can update responses
CREATE POLICY "Professionals update schizophrenia_wais4_similitudes responses"
  ON "public"."schizophrenia_wais4_similitudes"
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

CREATE OR REPLACE FUNCTION update_schizophrenia_wais4_similitudes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_schizophrenia_wais4_similitudes_updated_at
  BEFORE UPDATE ON "public"."schizophrenia_wais4_similitudes"
  FOR EACH ROW
  EXECUTE FUNCTION update_schizophrenia_wais4_similitudes_updated_at();

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE "public"."schizophrenia_wais4_similitudes" IS 'WAIS-IV Similitudes subtest responses for schizophrenia patients - Neuropsy Module. Verbal comprehension test assessing abstract verbal reasoning through analogical thinking.';
COMMENT ON COLUMN "public"."schizophrenia_wais4_similitudes"."test_done" IS 'Whether the test was administered';
COMMENT ON COLUMN "public"."schizophrenia_wais4_similitudes"."item_1" IS 'Item 1: Framboise-Groseille (0-2)';
COMMENT ON COLUMN "public"."schizophrenia_wais4_similitudes"."item_2" IS 'Item 2: Cheval-Tigre (0-2)';
COMMENT ON COLUMN "public"."schizophrenia_wais4_similitudes"."item_3" IS 'Item 3: Carottes-Épinards (0-2)';
COMMENT ON COLUMN "public"."schizophrenia_wais4_similitudes"."item_4" IS 'Item 4: Jaune-Bleu (0-2)';
COMMENT ON COLUMN "public"."schizophrenia_wais4_similitudes"."item_5" IS 'Item 5: Piano-Tambour (0-2)';
COMMENT ON COLUMN "public"."schizophrenia_wais4_similitudes"."item_6" IS 'Item 6: Poème-Statue (0-2)';
COMMENT ON COLUMN "public"."schizophrenia_wais4_similitudes"."item_7" IS 'Item 7: Bourgeon-Bébé (0-2)';
COMMENT ON COLUMN "public"."schizophrenia_wais4_similitudes"."item_8" IS 'Item 8: Miel-Lait (0-2)';
COMMENT ON COLUMN "public"."schizophrenia_wais4_similitudes"."item_9" IS 'Item 9: Nourriture-Carburant (0-2)';
COMMENT ON COLUMN "public"."schizophrenia_wais4_similitudes"."item_10" IS 'Item 10: Cube-Cylindre (0-2)';
COMMENT ON COLUMN "public"."schizophrenia_wais4_similitudes"."item_11" IS 'Item 11: Nez-Langue (0-2)';
COMMENT ON COLUMN "public"."schizophrenia_wais4_similitudes"."item_12" IS 'Item 12: Soie-Laine (0-2)';
COMMENT ON COLUMN "public"."schizophrenia_wais4_similitudes"."item_13" IS 'Item 13: Éolienne-Barrage (0-2)';
COMMENT ON COLUMN "public"."schizophrenia_wais4_similitudes"."item_14" IS 'Item 14: Éphémère-Permanent (0-2)';
COMMENT ON COLUMN "public"."schizophrenia_wais4_similitudes"."item_15" IS 'Item 15: Inondation-Sécheresse (0-2)';
COMMENT ON COLUMN "public"."schizophrenia_wais4_similitudes"."item_16" IS 'Item 16: Sédentaire-Nomade (0-2)';
COMMENT ON COLUMN "public"."schizophrenia_wais4_similitudes"."item_17" IS 'Item 17: Autoriser-Interdire (0-2)';
COMMENT ON COLUMN "public"."schizophrenia_wais4_similitudes"."item_18" IS 'Item 18: Réalité-Rêve (0-2)';
COMMENT ON COLUMN "public"."schizophrenia_wais4_similitudes"."total_raw_score" IS 'Sum of all 18 item scores (0-36)';
COMMENT ON COLUMN "public"."schizophrenia_wais4_similitudes"."standard_score" IS 'Age-adjusted standard score (1-19, mean=10, SD=3)';
COMMENT ON COLUMN "public"."schizophrenia_wais4_similitudes"."standardized_value" IS 'Z-score: (standard_score - 10) / 3';
