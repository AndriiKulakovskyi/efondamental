-- Migration: Add bmi_category and interpretation columns to bipolar_nurse_physical_params table
-- Date: 2026-02-23
-- Description: Adds bmi_category and interpretation columns to store BMI analysis results

-- Add bmi_category column
ALTER TABLE public.bipolar_nurse_physical_params
ADD COLUMN IF NOT EXISTS bmi_category text;

-- Add interpretation column
ALTER TABLE public.bipolar_nurse_physical_params
ADD COLUMN IF NOT EXISTS interpretation text;

-- Add comments
COMMENT ON COLUMN public.bipolar_nurse_physical_params.bmi_category IS 'BMI category: underweight, normal, overweight, obese_1, obese_2, obese_3';
COMMENT ON COLUMN public.bipolar_nurse_physical_params.interpretation IS 'Interpretation of physical parameters including BMI analysis';
