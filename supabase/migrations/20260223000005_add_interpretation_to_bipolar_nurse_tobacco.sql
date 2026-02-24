-- Migration: Add interpretation column to bipolar_nurse_tobacco table
-- Date: 2026-02-23
-- Description: Adds the interpretation column to store tobacco assessment interpretation

-- Add interpretation column
ALTER TABLE public.bipolar_nurse_tobacco
ADD COLUMN IF NOT EXISTS interpretation text;

-- Add comment
COMMENT ON COLUMN public.bipolar_nurse_tobacco.interpretation IS 'Interpretation of tobacco assessment';
