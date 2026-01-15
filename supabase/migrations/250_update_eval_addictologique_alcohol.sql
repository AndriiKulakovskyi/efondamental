-- ============================================================================
-- Migration: Add heavy drinking frequency fields to Evaluation Addictologique
-- ============================================================================
-- This migration adds new columns for tracking heavy drinking frequency
-- (consumption > 6 standard drinks in one occasion) during lifetime maximum
-- consumption periods.
-- ============================================================================

-- Add heavy drinking frequency field
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS rad_add_alc7b VARCHAR(50) CHECK (rad_add_alc7b IS NULL OR rad_add_alc7b IN ('1_to_7', 'less_than_once'));

-- Add heavy drinking frequency detail (times per week)
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS rad_add_alc7c INTEGER CHECK (rad_add_alc7c IS NULL OR (rad_add_alc7c >= 1 AND rad_add_alc7c <= 7));

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'Added heavy drinking frequency fields (rad_add_alc7b, rad_add_alc7c) to responses_eval_addictologique_sz';
END $$;
