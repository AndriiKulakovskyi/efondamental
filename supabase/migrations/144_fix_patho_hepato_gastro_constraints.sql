-- ============================================================================
-- eFondaMental Platform - Fix Pathologies hépato-gastro-entérologiques Constraints
-- ============================================================================
-- This migration fixes the check constraints to use English values ('yes', 'no', 'unknown')
-- to match the questionnaire definition options
-- ============================================================================

-- Drop existing check constraints and recreate with English values
ALTER TABLE responses_patho_hepato_gastro 
  DROP CONSTRAINT IF EXISTS responses_patho_hepato_gastro_q1_1_mici_presence_check,
  DROP CONSTRAINT IF EXISTS responses_patho_hepato_gastro_q1_3_mici_treated_check,
  DROP CONSTRAINT IF EXISTS responses_patho_hepato_gastro_q1_4_mici_balanced_check,
  DROP CONSTRAINT IF EXISTS responses_patho_hepato_gastro_q1_5_mici_type_check,
  DROP CONSTRAINT IF EXISTS responses_patho_hepato_gastro_q2_1_cirrhosis_presence_check,
  DROP CONSTRAINT IF EXISTS responses_patho_hepato_gastro_q2_3_cirrhosis_treated_check,
  DROP CONSTRAINT IF EXISTS responses_patho_hepato_gastro_q2_4_cirrhosis_balanced_check,
  DROP CONSTRAINT IF EXISTS responses_patho_hepato_gastro_q3_1_ulcer_presence_check,
  DROP CONSTRAINT IF EXISTS responses_patho_hepato_gastro_q3_3_ulcer_treated_check,
  DROP CONSTRAINT IF EXISTS responses_patho_hepato_gastro_q3_4_ulcer_balanced_check,
  DROP CONSTRAINT IF EXISTS responses_patho_hepato_gastro_q4_1_hepatitis_presence_check,
  DROP CONSTRAINT IF EXISTS responses_patho_hepato_gastro_q4_3_hepatitis_treatment_type_check;

-- Add new constraints with English values
ALTER TABLE responses_patho_hepato_gastro
  ADD CONSTRAINT responses_patho_hepato_gastro_q1_1_mici_presence_check 
    CHECK (q1_1_mici_presence IN ('yes', 'no', 'unknown')),
  ADD CONSTRAINT responses_patho_hepato_gastro_q1_3_mici_treated_check 
    CHECK (q1_3_mici_treated IN ('yes', 'no')),
  ADD CONSTRAINT responses_patho_hepato_gastro_q1_4_mici_balanced_check 
    CHECK (q1_4_mici_balanced IN ('yes', 'no')),
  ADD CONSTRAINT responses_patho_hepato_gastro_q1_5_mici_type_check 
    CHECK (q1_5_mici_type IN ('crohn', 'rch', 'unknown')),
  ADD CONSTRAINT responses_patho_hepato_gastro_q2_1_cirrhosis_presence_check 
    CHECK (q2_1_cirrhosis_presence IN ('yes', 'no', 'unknown')),
  ADD CONSTRAINT responses_patho_hepato_gastro_q2_3_cirrhosis_treated_check 
    CHECK (q2_3_cirrhosis_treated IN ('yes', 'no')),
  ADD CONSTRAINT responses_patho_hepato_gastro_q2_4_cirrhosis_balanced_check 
    CHECK (q2_4_cirrhosis_balanced IN ('yes', 'no')),
  ADD CONSTRAINT responses_patho_hepato_gastro_q3_1_ulcer_presence_check 
    CHECK (q3_1_ulcer_presence IN ('yes', 'no', 'unknown')),
  ADD CONSTRAINT responses_patho_hepato_gastro_q3_3_ulcer_treated_check 
    CHECK (q3_3_ulcer_treated IN ('yes', 'no')),
  ADD CONSTRAINT responses_patho_hepato_gastro_q3_4_ulcer_balanced_check 
    CHECK (q3_4_ulcer_balanced IN ('yes', 'no')),
  ADD CONSTRAINT responses_patho_hepato_gastro_q4_1_hepatitis_presence_check 
    CHECK (q4_1_hepatitis_presence IN ('yes', 'no', 'unknown')),
  ADD CONSTRAINT responses_patho_hepato_gastro_q4_3_hepatitis_treatment_type_check 
    CHECK (q4_3_hepatitis_treatment_type IN ('neuroleptiques', 'antidepresseurs', 'anticonvulsivants', 'autres'));

