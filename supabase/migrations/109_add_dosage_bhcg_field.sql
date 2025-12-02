-- Migration: Add dosage_bhcg field to Biological Assessment
-- Description: Adds Dosage des bHCG (UI) field to the bHCG section (formerly Prolactine)
-- Date: 2025-12-02

-- Add new field to the responses_biological_assessment table
ALTER TABLE responses_biological_assessment
ADD COLUMN IF NOT EXISTS dosage_bhcg DECIMAL(10,2) CHECK (dosage_bhcg >= 0);

-- Add comment for documentation
COMMENT ON COLUMN responses_biological_assessment.dosage_bhcg IS 'Dosage des bHCG (UI) - For women of childbearing age only';

