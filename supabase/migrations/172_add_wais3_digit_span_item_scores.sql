-- ============================================================================
-- eFondaMental Platform - WAIS-III Digit Span Item Scores Migration
-- ============================================================================
-- This migration adds individual item score columns to the WAIS-III Digit Span
-- table to store computed scores for each item (trial 1 + trial 2)
-- ============================================================================

-- Add item score columns for Ordre Direct (8 items)
ALTER TABLE responses_wais3_digit_span
ADD COLUMN IF NOT EXISTS wais3_mcod_1 INTEGER,
ADD COLUMN IF NOT EXISTS wais3_mcod_2 INTEGER,
ADD COLUMN IF NOT EXISTS wais3_mcod_3 INTEGER,
ADD COLUMN IF NOT EXISTS wais3_mcod_4 INTEGER,
ADD COLUMN IF NOT EXISTS wais3_mcod_5 INTEGER,
ADD COLUMN IF NOT EXISTS wais3_mcod_6 INTEGER,
ADD COLUMN IF NOT EXISTS wais3_mcod_7 INTEGER,
ADD COLUMN IF NOT EXISTS wais3_mcod_8 INTEGER;

-- Add item score columns for Ordre Inverse (7 items)
ALTER TABLE responses_wais3_digit_span
ADD COLUMN IF NOT EXISTS wais3_mcoi_1 INTEGER,
ADD COLUMN IF NOT EXISTS wais3_mcoi_2 INTEGER,
ADD COLUMN IF NOT EXISTS wais3_mcoi_3 INTEGER,
ADD COLUMN IF NOT EXISTS wais3_mcoi_4 INTEGER,
ADD COLUMN IF NOT EXISTS wais3_mcoi_5 INTEGER,
ADD COLUMN IF NOT EXISTS wais3_mcoi_6 INTEGER,
ADD COLUMN IF NOT EXISTS wais3_mcoi_7 INTEGER;

-- Add comments for documentation
COMMENT ON COLUMN responses_wais3_digit_span.wais3_mcod_1 IS 'Note a l''item 1 - Ordre Direct (somme essai 1 + essai 2)';
COMMENT ON COLUMN responses_wais3_digit_span.wais3_mcod_2 IS 'Note a l''item 2 - Ordre Direct (somme essai 1 + essai 2)';
COMMENT ON COLUMN responses_wais3_digit_span.wais3_mcod_3 IS 'Note a l''item 3 - Ordre Direct (somme essai 1 + essai 2)';
COMMENT ON COLUMN responses_wais3_digit_span.wais3_mcod_4 IS 'Note a l''item 4 - Ordre Direct (somme essai 1 + essai 2)';
COMMENT ON COLUMN responses_wais3_digit_span.wais3_mcod_5 IS 'Note a l''item 5 - Ordre Direct (somme essai 1 + essai 2)';
COMMENT ON COLUMN responses_wais3_digit_span.wais3_mcod_6 IS 'Note a l''item 6 - Ordre Direct (somme essai 1 + essai 2)';
COMMENT ON COLUMN responses_wais3_digit_span.wais3_mcod_7 IS 'Note a l''item 7 - Ordre Direct (somme essai 1 + essai 2)';
COMMENT ON COLUMN responses_wais3_digit_span.wais3_mcod_8 IS 'Note a l''item 8 - Ordre Direct (somme essai 1 + essai 2)';
COMMENT ON COLUMN responses_wais3_digit_span.wais3_mcoi_1 IS 'Note a la serie 1 - Ordre Inverse (somme essai 1 + essai 2)';
COMMENT ON COLUMN responses_wais3_digit_span.wais3_mcoi_2 IS 'Note a la serie 2 - Ordre Inverse (somme essai 1 + essai 2)';
COMMENT ON COLUMN responses_wais3_digit_span.wais3_mcoi_3 IS 'Note a la serie 3 - Ordre Inverse (somme essai 1 + essai 2)';
COMMENT ON COLUMN responses_wais3_digit_span.wais3_mcoi_4 IS 'Note a la serie 4 - Ordre Inverse (somme essai 1 + essai 2)';
COMMENT ON COLUMN responses_wais3_digit_span.wais3_mcoi_5 IS 'Note a la serie 5 - Ordre Inverse (somme essai 1 + essai 2)';
COMMENT ON COLUMN responses_wais3_digit_span.wais3_mcoi_6 IS 'Note a la serie 6 - Ordre Inverse (somme essai 1 + essai 2)';
COMMENT ON COLUMN responses_wais3_digit_span.wais3_mcoi_7 IS 'Note a la serie 7 - Ordre Inverse (somme essai 1 + essai 2)';

