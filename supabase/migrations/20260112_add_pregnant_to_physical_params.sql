-- Migration: Add pregnant field to physical params questionnaire
-- Description: Adds conditional pregnant question for female patients
-- Date: 2026-01-12

-- Add pregnant field to responses_physical_params table
ALTER TABLE responses_physical_params
ADD COLUMN IF NOT EXISTS pregnant VARCHAR(10) CHECK (pregnant IN ('Oui', 'Non'));

-- Update comment
COMMENT ON COLUMN responses_physical_params.pregnant IS 'Pregnancy status - only applicable for female patients';
