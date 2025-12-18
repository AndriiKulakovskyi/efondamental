-- ============================================================================
-- eFondaMental Platform - Add Neuropsychological Evaluation Acceptance
-- ============================================================================
-- This migration adds a new field to WAIS-III and WAIS-IV Clinical Criteria
-- questionnaires to track whether patient is accepted for neuropsychological
-- evaluation. This field will control conditional display of subsequent
-- neuropsychological questionnaires.
-- ============================================================================

-- Add acceptance field to WAIS-IV Clinical Criteria
ALTER TABLE responses_wais4_criteria 
ADD COLUMN accepted_for_neuropsy_evaluation INTEGER CHECK (accepted_for_neuropsy_evaluation IN (0, 1));

-- Add acceptance field to WAIS-III Clinical Criteria
ALTER TABLE responses_wais3_criteria 
ADD COLUMN accepted_for_neuropsy_evaluation INTEGER CHECK (accepted_for_neuropsy_evaluation IN (0, 1));

-- Add comments for documentation
COMMENT ON COLUMN responses_wais4_criteria.accepted_for_neuropsy_evaluation IS 
'Patient accepted for neuropsychological evaluation (0=No, 1=Yes). Controls conditional display of subsequent WAIS-IV neuropsychological questionnaires.';

COMMENT ON COLUMN responses_wais3_criteria.accepted_for_neuropsy_evaluation IS 
'Patient accepted for neuropsychological evaluation (0=No, 1=Yes). Controls conditional display of subsequent WAIS-III neuropsychological questionnaires.';

