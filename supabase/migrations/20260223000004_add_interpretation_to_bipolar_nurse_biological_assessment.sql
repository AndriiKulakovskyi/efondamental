-- Migration: Add interpretation column to bipolar_nurse_biological_assessment table
-- Date: 2026-02-23
-- Description: Adds the interpretation column to store biological assessment interpretation

-- Add interpretation column
ALTER TABLE public.bipolar_nurse_biological_assessment
ADD COLUMN IF NOT EXISTS interpretation text;

-- Add comment
COMMENT ON COLUMN public.bipolar_nurse_biological_assessment.interpretation IS 'Interpretation of biological assessment results';
