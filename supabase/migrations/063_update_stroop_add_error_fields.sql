-- ============================================================================
-- eFondaMental Platform - Update Stroop Test with Error Fields
-- ============================================================================
-- This migration adds error fields to the Stroop Test table
-- ============================================================================

-- Add error columns for each section
ALTER TABLE responses_stroop
ADD COLUMN IF NOT EXISTS stroop_w_cor INTEGER CHECK (stroop_w_cor IS NULL OR stroop_w_cor >= 0),
ADD COLUMN IF NOT EXISTS stroop_w_err INTEGER CHECK (stroop_w_err IS NULL OR stroop_w_err >= 0),
ADD COLUMN IF NOT EXISTS stroop_c_cor INTEGER CHECK (stroop_c_cor IS NULL OR stroop_c_cor >= 0),
ADD COLUMN IF NOT EXISTS stroop_c_err INTEGER CHECK (stroop_c_err IS NULL OR stroop_c_err >= 0),
ADD COLUMN IF NOT EXISTS stroop_cw_cor INTEGER CHECK (stroop_cw_cor IS NULL OR stroop_cw_cor >= 0),
ADD COLUMN IF NOT EXISTS stroop_cw_err INTEGER CHECK (stroop_cw_err IS NULL OR stroop_cw_err >= 0);

