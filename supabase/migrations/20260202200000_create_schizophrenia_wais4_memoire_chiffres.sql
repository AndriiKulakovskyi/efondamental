-- ============================================================================
-- WAIS-IV Mémoire des Chiffres (Digit Span) - Schizophrenia Initial Evaluation
-- Working memory subtest with 3 conditions: Direct, Inverse, Croissant
-- ============================================================================

CREATE TABLE IF NOT EXISTS "public"."schizophrenia_wais4_memoire_chiffres" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "visit_id" UUID REFERENCES "public"."visits"("id") ON DELETE CASCADE NOT NULL UNIQUE,
  "patient_id" UUID REFERENCES "public"."patients"("id") ON DELETE CASCADE NOT NULL,
  
  -- Demographics for scoring (injected from patient profile)
  "patient_age" INTEGER,
  
  -- Test status
  "test_done" BOOLEAN DEFAULT FALSE,
  
  -- ==========================================
  -- Ordre Direct (Forward) - 8 items, 2 trials each
  -- ==========================================
  "rad_wais_mcod_1a" INTEGER CHECK ("rad_wais_mcod_1a" IN (0, 1)),
  "rad_wais_mcod_1b" INTEGER CHECK ("rad_wais_mcod_1b" IN (0, 1)),
  "rad_wais_mcod_2a" INTEGER CHECK ("rad_wais_mcod_2a" IN (0, 1)),
  "rad_wais_mcod_2b" INTEGER CHECK ("rad_wais_mcod_2b" IN (0, 1)),
  "rad_wais_mcod_3a" INTEGER CHECK ("rad_wais_mcod_3a" IN (0, 1)),
  "rad_wais_mcod_3b" INTEGER CHECK ("rad_wais_mcod_3b" IN (0, 1)),
  "rad_wais_mcod_4a" INTEGER CHECK ("rad_wais_mcod_4a" IN (0, 1)),
  "rad_wais_mcod_4b" INTEGER CHECK ("rad_wais_mcod_4b" IN (0, 1)),
  "rad_wais_mcod_5a" INTEGER CHECK ("rad_wais_mcod_5a" IN (0, 1)),
  "rad_wais_mcod_5b" INTEGER CHECK ("rad_wais_mcod_5b" IN (0, 1)),
  "rad_wais_mcod_6a" INTEGER CHECK ("rad_wais_mcod_6a" IN (0, 1)),
  "rad_wais_mcod_6b" INTEGER CHECK ("rad_wais_mcod_6b" IN (0, 1)),
  "rad_wais_mcod_7a" INTEGER CHECK ("rad_wais_mcod_7a" IN (0, 1)),
  "rad_wais_mcod_7b" INTEGER CHECK ("rad_wais_mcod_7b" IN (0, 1)),
  "rad_wais_mcod_8a" INTEGER CHECK ("rad_wais_mcod_8a" IN (0, 1)),
  "rad_wais_mcod_8b" INTEGER CHECK ("rad_wais_mcod_8b" IN (0, 1)),
  
  -- ==========================================
  -- Ordre Inverse (Backward) - 8 items, 2 trials each
  -- ==========================================
  "rad_wais_mcoi_1a" INTEGER CHECK ("rad_wais_mcoi_1a" IN (0, 1)),
  "rad_wais_mcoi_1b" INTEGER CHECK ("rad_wais_mcoi_1b" IN (0, 1)),
  "rad_wais_mcoi_2a" INTEGER CHECK ("rad_wais_mcoi_2a" IN (0, 1)),
  "rad_wais_mcoi_2b" INTEGER CHECK ("rad_wais_mcoi_2b" IN (0, 1)),
  "rad_wais_mcoi_3a" INTEGER CHECK ("rad_wais_mcoi_3a" IN (0, 1)),
  "rad_wais_mcoi_3b" INTEGER CHECK ("rad_wais_mcoi_3b" IN (0, 1)),
  "rad_wais_mcoi_4a" INTEGER CHECK ("rad_wais_mcoi_4a" IN (0, 1)),
  "rad_wais_mcoi_4b" INTEGER CHECK ("rad_wais_mcoi_4b" IN (0, 1)),
  "rad_wais_mcoi_5a" INTEGER CHECK ("rad_wais_mcoi_5a" IN (0, 1)),
  "rad_wais_mcoi_5b" INTEGER CHECK ("rad_wais_mcoi_5b" IN (0, 1)),
  "rad_wais_mcoi_6a" INTEGER CHECK ("rad_wais_mcoi_6a" IN (0, 1)),
  "rad_wais_mcoi_6b" INTEGER CHECK ("rad_wais_mcoi_6b" IN (0, 1)),
  "rad_wais_mcoi_7a" INTEGER CHECK ("rad_wais_mcoi_7a" IN (0, 1)),
  "rad_wais_mcoi_7b" INTEGER CHECK ("rad_wais_mcoi_7b" IN (0, 1)),
  "rad_wais_mcoi_8a" INTEGER CHECK ("rad_wais_mcoi_8a" IN (0, 1)),
  "rad_wais_mcoi_8b" INTEGER CHECK ("rad_wais_mcoi_8b" IN (0, 1)),
  
  -- ==========================================
  -- Ordre Croissant (Ascending) - 8 items, 2 trials each
  -- ==========================================
  "rad_wais_mcoc_1a" INTEGER CHECK ("rad_wais_mcoc_1a" IN (0, 1)),
  "rad_wais_mcoc_1b" INTEGER CHECK ("rad_wais_mcoc_1b" IN (0, 1)),
  "rad_wais_mcoc_2a" INTEGER CHECK ("rad_wais_mcoc_2a" IN (0, 1)),
  "rad_wais_mcoc_2b" INTEGER CHECK ("rad_wais_mcoc_2b" IN (0, 1)),
  "rad_wais_mcoc_3a" INTEGER CHECK ("rad_wais_mcoc_3a" IN (0, 1)),
  "rad_wais_mcoc_3b" INTEGER CHECK ("rad_wais_mcoc_3b" IN (0, 1)),
  "rad_wais_mcoc_4a" INTEGER CHECK ("rad_wais_mcoc_4a" IN (0, 1)),
  "rad_wais_mcoc_4b" INTEGER CHECK ("rad_wais_mcoc_4b" IN (0, 1)),
  "rad_wais_mcoc_5a" INTEGER CHECK ("rad_wais_mcoc_5a" IN (0, 1)),
  "rad_wais_mcoc_5b" INTEGER CHECK ("rad_wais_mcoc_5b" IN (0, 1)),
  "rad_wais_mcoc_6a" INTEGER CHECK ("rad_wais_mcoc_6a" IN (0, 1)),
  "rad_wais_mcoc_6b" INTEGER CHECK ("rad_wais_mcoc_6b" IN (0, 1)),
  "rad_wais_mcoc_7a" INTEGER CHECK ("rad_wais_mcoc_7a" IN (0, 1)),
  "rad_wais_mcoc_7b" INTEGER CHECK ("rad_wais_mcoc_7b" IN (0, 1)),
  "rad_wais_mcoc_8a" INTEGER CHECK ("rad_wais_mcoc_8a" IN (0, 1)),
  "rad_wais_mcoc_8b" INTEGER CHECK ("rad_wais_mcoc_8b" IN (0, 1)),
  
  -- ==========================================
  -- Computed Item Scores (trial_a + trial_b, 0-2)
  -- ==========================================
  "wais_mcod_1" INTEGER CHECK ("wais_mcod_1" >= 0 AND "wais_mcod_1" <= 2),
  "wais_mcod_2" INTEGER CHECK ("wais_mcod_2" >= 0 AND "wais_mcod_2" <= 2),
  "wais_mcod_3" INTEGER CHECK ("wais_mcod_3" >= 0 AND "wais_mcod_3" <= 2),
  "wais_mcod_4" INTEGER CHECK ("wais_mcod_4" >= 0 AND "wais_mcod_4" <= 2),
  "wais_mcod_5" INTEGER CHECK ("wais_mcod_5" >= 0 AND "wais_mcod_5" <= 2),
  "wais_mcod_6" INTEGER CHECK ("wais_mcod_6" >= 0 AND "wais_mcod_6" <= 2),
  "wais_mcod_7" INTEGER CHECK ("wais_mcod_7" >= 0 AND "wais_mcod_7" <= 2),
  "wais_mcod_8" INTEGER CHECK ("wais_mcod_8" >= 0 AND "wais_mcod_8" <= 2),
  
  "wais_mcoi_1" INTEGER CHECK ("wais_mcoi_1" >= 0 AND "wais_mcoi_1" <= 2),
  "wais_mcoi_2" INTEGER CHECK ("wais_mcoi_2" >= 0 AND "wais_mcoi_2" <= 2),
  "wais_mcoi_3" INTEGER CHECK ("wais_mcoi_3" >= 0 AND "wais_mcoi_3" <= 2),
  "wais_mcoi_4" INTEGER CHECK ("wais_mcoi_4" >= 0 AND "wais_mcoi_4" <= 2),
  "wais_mcoi_5" INTEGER CHECK ("wais_mcoi_5" >= 0 AND "wais_mcoi_5" <= 2),
  "wais_mcoi_6" INTEGER CHECK ("wais_mcoi_6" >= 0 AND "wais_mcoi_6" <= 2),
  "wais_mcoi_7" INTEGER CHECK ("wais_mcoi_7" >= 0 AND "wais_mcoi_7" <= 2),
  "wais_mcoi_8" INTEGER CHECK ("wais_mcoi_8" >= 0 AND "wais_mcoi_8" <= 2),
  
  "wais_mcoc_1" INTEGER CHECK ("wais_mcoc_1" >= 0 AND "wais_mcoc_1" <= 2),
  "wais_mcoc_2" INTEGER CHECK ("wais_mcoc_2" >= 0 AND "wais_mcoc_2" <= 2),
  "wais_mcoc_3" INTEGER CHECK ("wais_mcoc_3" >= 0 AND "wais_mcoc_3" <= 2),
  "wais_mcoc_4" INTEGER CHECK ("wais_mcoc_4" >= 0 AND "wais_mcoc_4" <= 2),
  "wais_mcoc_5" INTEGER CHECK ("wais_mcoc_5" >= 0 AND "wais_mcoc_5" <= 2),
  "wais_mcoc_6" INTEGER CHECK ("wais_mcoc_6" >= 0 AND "wais_mcoc_6" <= 2),
  "wais_mcoc_7" INTEGER CHECK ("wais_mcoc_7" >= 0 AND "wais_mcoc_7" <= 2),
  "wais_mcoc_8" INTEGER CHECK ("wais_mcoc_8" >= 0 AND "wais_mcoc_8" <= 2),
  
  -- ==========================================
  -- Computed Section Totals
  -- ==========================================
  "wais_mcod_tot" INTEGER CHECK ("wais_mcod_tot" >= 0 AND "wais_mcod_tot" <= 16),
  "wais_mcoi_tot" INTEGER CHECK ("wais_mcoi_tot" >= 0 AND "wais_mcoi_tot" <= 16),
  "wais_mcoc_tot" INTEGER CHECK ("wais_mcoc_tot" >= 0 AND "wais_mcoc_tot" <= 16),
  
  -- ==========================================
  -- Computed Spans
  -- ==========================================
  "wais_mc_end" INTEGER CHECK ("wais_mc_end" >= 0 AND "wais_mc_end" <= 10),
  "wais_mc_env" INTEGER CHECK ("wais_mc_env" >= 0 AND "wais_mc_env" <= 9),
  "wais_mc_cro" INTEGER CHECK ("wais_mc_cro" >= 0 AND "wais_mc_cro" <= 10),
  "wais_mc_emp" INTEGER,  -- Can be negative (end - env)
  
  -- ==========================================
  -- Computed Span Z-Scores
  -- ==========================================
  "wais_mc_end_std" NUMERIC(5,2),
  "wais_mc_env_std" NUMERIC(5,2),
  "wais_mc_cro_std" NUMERIC(5,2),
  
  -- ==========================================
  -- Computed Total Scores
  -- ==========================================
  "wais_mc_tot" INTEGER CHECK ("wais_mc_tot" >= 0 AND "wais_mc_tot" <= 48),
  "wais_mc_std" INTEGER CHECK ("wais_mc_std" >= 1 AND "wais_mc_std" <= 19),
  "wais_mc_cr" NUMERIC(5,2),
  
  -- ==========================================
  -- Metadata
  -- ==========================================
  "completed_by" UUID REFERENCES "public"."user_profiles"("id"),
  "completed_at" TIMESTAMPTZ DEFAULT NOW(),
  "created_at" TIMESTAMPTZ DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE "public"."schizophrenia_wais4_memoire_chiffres" IS 'WAIS-IV Digit Span responses for schizophrenia initial evaluation';

COMMENT ON COLUMN "public"."schizophrenia_wais4_memoire_chiffres"."patient_age" IS 'Patient age at evaluation (injected from patient profile, used for normative scoring)';
COMMENT ON COLUMN "public"."schizophrenia_wais4_memoire_chiffres"."wais_mcod_tot" IS 'Total Ordre Direct score (0-16)';
COMMENT ON COLUMN "public"."schizophrenia_wais4_memoire_chiffres"."wais_mcoi_tot" IS 'Total Ordre Inverse score (0-16)';
COMMENT ON COLUMN "public"."schizophrenia_wais4_memoire_chiffres"."wais_mcoc_tot" IS 'Total Ordre Croissant score (0-16)';
COMMENT ON COLUMN "public"."schizophrenia_wais4_memoire_chiffres"."wais_mc_end" IS 'Empan endroit (forward span)';
COMMENT ON COLUMN "public"."schizophrenia_wais4_memoire_chiffres"."wais_mc_env" IS 'Empan envers (backward span)';
COMMENT ON COLUMN "public"."schizophrenia_wais4_memoire_chiffres"."wais_mc_cro" IS 'Empan croissant (ascending span)';
COMMENT ON COLUMN "public"."schizophrenia_wais4_memoire_chiffres"."wais_mc_emp" IS 'Empan difference (endroit - envers)';
COMMENT ON COLUMN "public"."schizophrenia_wais4_memoire_chiffres"."wais_mc_end_std" IS 'Forward span Z-score';
COMMENT ON COLUMN "public"."schizophrenia_wais4_memoire_chiffres"."wais_mc_env_std" IS 'Backward span Z-score';
COMMENT ON COLUMN "public"."schizophrenia_wais4_memoire_chiffres"."wais_mc_cro_std" IS 'Ascending span Z-score';
COMMENT ON COLUMN "public"."schizophrenia_wais4_memoire_chiffres"."wais_mc_tot" IS 'Total raw score (0-48)';
COMMENT ON COLUMN "public"."schizophrenia_wais4_memoire_chiffres"."wais_mc_std" IS 'Age-adjusted standard score (1-19)';
COMMENT ON COLUMN "public"."schizophrenia_wais4_memoire_chiffres"."wais_mc_cr" IS 'Standardized value: (standard_score - 10) / 3';

-- ============================================================================
-- Indexes
-- ============================================================================

CREATE INDEX IF NOT EXISTS "idx_schizo_wais4_mc_patient_id" 
ON "public"."schizophrenia_wais4_memoire_chiffres"("patient_id");

CREATE INDEX IF NOT EXISTS "idx_schizo_wais4_mc_visit_id" 
ON "public"."schizophrenia_wais4_memoire_chiffres"("visit_id");

-- ============================================================================
-- Row Level Security
-- ============================================================================

ALTER TABLE "public"."schizophrenia_wais4_memoire_chiffres" ENABLE ROW LEVEL SECURITY;

-- Patient policies
CREATE POLICY "Patients view own responses" ON "public"."schizophrenia_wais4_memoire_chiffres"
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Patients insert own responses" ON "public"."schizophrenia_wais4_memoire_chiffres"
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own responses" ON "public"."schizophrenia_wais4_memoire_chiffres"
  FOR UPDATE USING (auth.uid() = patient_id);

-- Professional policies
CREATE POLICY "Professionals view all responses" ON "public"."schizophrenia_wais4_memoire_chiffres"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "public"."user_profiles" 
      WHERE id = auth.uid() 
      AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
  );

CREATE POLICY "Professionals insert responses" ON "public"."schizophrenia_wais4_memoire_chiffres"
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM "public"."user_profiles" 
      WHERE id = auth.uid() 
      AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
  );

CREATE POLICY "Professionals update responses" ON "public"."schizophrenia_wais4_memoire_chiffres"
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM "public"."user_profiles" 
      WHERE id = auth.uid() 
      AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
  );

-- ============================================================================
-- Trigger for updated_at
-- ============================================================================

CREATE TRIGGER "set_schizo_wais4_mc_updated_at"
  BEFORE UPDATE ON "public"."schizophrenia_wais4_memoire_chiffres"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
