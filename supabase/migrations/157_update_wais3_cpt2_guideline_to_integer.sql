-- ============================================================================
-- eFondaMental Platform - Update WAIS-III CPT II V.5 Guideline Columns
-- ============================================================================
-- This migration updates the guideline columns from TEXT to INTEGER
-- to support the new single_choice question type with numeric codes (1-8)
-- ============================================================================

-- Update guideline columns to INTEGER type with CHECK constraints
ALTER TABLE responses_wais3_cpt2 
  ALTER COLUMN cpt2_omissions_guideline TYPE INTEGER USING cpt2_omissions_guideline::INTEGER,
  ADD CONSTRAINT cpt2_omissions_guideline_check CHECK (cpt2_omissions_guideline IS NULL OR cpt2_omissions_guideline BETWEEN 1 AND 8);

ALTER TABLE responses_wais3_cpt2 
  ALTER COLUMN cpt2_comissions_guideline TYPE INTEGER USING cpt2_comissions_guideline::INTEGER,
  ADD CONSTRAINT cpt2_comissions_guideline_check CHECK (cpt2_comissions_guideline IS NULL OR cpt2_comissions_guideline BETWEEN 1 AND 8);

ALTER TABLE responses_wais3_cpt2 
  ALTER COLUMN cpt2_hitrt_guideline TYPE INTEGER USING cpt2_hitrt_guideline::INTEGER,
  ADD CONSTRAINT cpt2_hitrt_guideline_check CHECK (cpt2_hitrt_guideline IS NULL OR cpt2_hitrt_guideline BETWEEN 1 AND 8);

ALTER TABLE responses_wais3_cpt2 
  ALTER COLUMN cpt2_hitrtstder_guideline TYPE INTEGER USING cpt2_hitrtstder_guideline::INTEGER,
  ADD CONSTRAINT cpt2_hitrtstder_guideline_check CHECK (cpt2_hitrtstder_guideline IS NULL OR cpt2_hitrtstder_guideline BETWEEN 1 AND 8);

ALTER TABLE responses_wais3_cpt2 
  ALTER COLUMN cpt2_variability_guideline TYPE INTEGER USING cpt2_variability_guideline::INTEGER,
  ADD CONSTRAINT cpt2_variability_guideline_check CHECK (cpt2_variability_guideline IS NULL OR cpt2_variability_guideline BETWEEN 1 AND 8);

ALTER TABLE responses_wais3_cpt2 
  ALTER COLUMN cpt2_detectability_guideline TYPE INTEGER USING cpt2_detectability_guideline::INTEGER,
  ADD CONSTRAINT cpt2_detectability_guideline_check CHECK (cpt2_detectability_guideline IS NULL OR cpt2_detectability_guideline BETWEEN 1 AND 8);

ALTER TABLE responses_wais3_cpt2 
  ALTER COLUMN cpt2_responsestyle_guideline TYPE INTEGER USING cpt2_responsestyle_guideline::INTEGER,
  ADD CONSTRAINT cpt2_responsestyle_guideline_check CHECK (cpt2_responsestyle_guideline IS NULL OR cpt2_responsestyle_guideline BETWEEN 1 AND 8);

ALTER TABLE responses_wais3_cpt2 
  ALTER COLUMN cpt2_perseverations_guideline TYPE INTEGER USING cpt2_perseverations_guideline::INTEGER,
  ADD CONSTRAINT cpt2_perseverations_guideline_check CHECK (cpt2_perseverations_guideline IS NULL OR cpt2_perseverations_guideline BETWEEN 1 AND 8);

ALTER TABLE responses_wais3_cpt2 
  ALTER COLUMN cpt2_hitrtblockchange_guideline TYPE INTEGER USING cpt2_hitrtblockchange_guideline::INTEGER,
  ADD CONSTRAINT cpt2_hitrtblockchange_guideline_check CHECK (cpt2_hitrtblockchange_guideline IS NULL OR cpt2_hitrtblockchange_guideline BETWEEN 1 AND 8);

ALTER TABLE responses_wais3_cpt2 
  ALTER COLUMN cpt2_hitseblockchange_guideline TYPE INTEGER USING cpt2_hitseblockchange_guideline::INTEGER,
  ADD CONSTRAINT cpt2_hitseblockchange_guideline_check CHECK (cpt2_hitseblockchange_guideline IS NULL OR cpt2_hitseblockchange_guideline BETWEEN 1 AND 8);

ALTER TABLE responses_wais3_cpt2 
  ALTER COLUMN cpt2_hitrtisichange_guideline TYPE INTEGER USING cpt2_hitrtisichange_guideline::INTEGER,
  ADD CONSTRAINT cpt2_hitrtisichange_guideline_check CHECK (cpt2_hitrtisichange_guideline IS NULL OR cpt2_hitrtisichange_guideline BETWEEN 1 AND 8);

ALTER TABLE responses_wais3_cpt2 
  ALTER COLUMN cpt2_hitseisichange_guideline TYPE INTEGER USING cpt2_hitseisichange_guideline::INTEGER,
  ADD CONSTRAINT cpt2_hitseisichange_guideline_check CHECK (cpt2_hitseisichange_guideline IS NULL OR cpt2_hitseisichange_guideline BETWEEN 1 AND 8);

