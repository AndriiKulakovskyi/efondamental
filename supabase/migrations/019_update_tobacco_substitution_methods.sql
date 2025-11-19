-- Migration: Update Tobacco Substitution Methods
-- Description: Changes individual boolean fields to an array field for multiple substitution methods
-- Date: 2025-11-19

-- Remove old individual substitution columns
ALTER TABLE responses_tobacco 
DROP COLUMN IF EXISTS substitution_e_cigarette,
DROP COLUMN IF EXISTS substitution_champix,
DROP COLUMN IF EXISTS substitution_patch,
DROP COLUMN IF EXISTS substitution_nicorette;

-- Add new array column for multiple substitution methods
ALTER TABLE responses_tobacco 
ADD COLUMN IF NOT EXISTS substitution_methods TEXT[];

-- Add comment for documentation
COMMENT ON COLUMN responses_tobacco.substitution_methods IS 'Array of substitution method codes: e_cigarette, champix, patch, nicorette';

