-- Migration: Add interpretation column to bipolar_nurse_blood_pressure table
-- Date: 2026-02-23
-- Description: Adds the interpretation column to store blood pressure assessment interpretation

-- Add interpretation column
ALTER TABLE public.bipolar_nurse_blood_pressure
ADD COLUMN IF NOT EXISTS interpretation text;

-- Add comment
COMMENT ON COLUMN public.bipolar_nurse_blood_pressure.interpretation IS 'Interpretation of blood pressure measurements including orthostatic hypotension analysis';
