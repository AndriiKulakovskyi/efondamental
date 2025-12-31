-- ============================================================================
-- eFondaMental Platform - Rename WAIS-IV Digit Span Fields
-- ============================================================================
-- This migration renames all trial fields in responses_wais4_digit_span
-- to include 'wais4_' prefix, completely separating them from WAIS-III fields.
-- This prevents computation conflicts in the frontend renderer.
-- ============================================================================

-- Rename Ordre Direct (Forward) fields - 16 fields total
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcod_1a TO wais4_mcod_1a;
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcod_1b TO wais4_mcod_1b;
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcod_2a TO wais4_mcod_2a;
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcod_2b TO wais4_mcod_2b;
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcod_3a TO wais4_mcod_3a;
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcod_3b TO wais4_mcod_3b;
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcod_4a TO wais4_mcod_4a;
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcod_4b TO wais4_mcod_4b;
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcod_5a TO wais4_mcod_5a;
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcod_5b TO wais4_mcod_5b;
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcod_6a TO wais4_mcod_6a;
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcod_6b TO wais4_mcod_6b;
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcod_7a TO wais4_mcod_7a;
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcod_7b TO wais4_mcod_7b;
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcod_8a TO wais4_mcod_8a;
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcod_8b TO wais4_mcod_8b;

-- Rename Ordre Inverse (Backward) fields - 16 fields total
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcoi_1a TO wais4_mcoi_1a;
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcoi_1b TO wais4_mcoi_1b;
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcoi_2a TO wais4_mcoi_2a;
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcoi_2b TO wais4_mcoi_2b;
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcoi_3a TO wais4_mcoi_3a;
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcoi_3b TO wais4_mcoi_3b;
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcoi_4a TO wais4_mcoi_4a;
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcoi_4b TO wais4_mcoi_4b;
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcoi_5a TO wais4_mcoi_5a;
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcoi_5b TO wais4_mcoi_5b;
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcoi_6a TO wais4_mcoi_6a;
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcoi_6b TO wais4_mcoi_6b;
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcoi_7a TO wais4_mcoi_7a;
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcoi_7b TO wais4_mcoi_7b;
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcoi_8a TO wais4_mcoi_8a;
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcoi_8b TO wais4_mcoi_8b;

-- Rename Ordre Croissant (Sequencing) fields - 16 fields total
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcoc_1a TO wais4_mcoc_1a;
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcoc_1b TO wais4_mcoc_1b;
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcoc_2a TO wais4_mcoc_2a;
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcoc_2b TO wais4_mcoc_2b;
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcoc_3a TO wais4_mcoc_3a;
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcoc_3b TO wais4_mcoc_3b;
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcoc_4a TO wais4_mcoc_4a;
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcoc_4b TO wais4_mcoc_4b;
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcoc_5a TO wais4_mcoc_5a;
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcoc_5b TO wais4_mcoc_5b;
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcoc_6a TO wais4_mcoc_6a;
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcoc_6b TO wais4_mcoc_6b;
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcoc_7a TO wais4_mcoc_7a;
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcoc_7b TO wais4_mcoc_7b;
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcoc_8a TO wais4_mcoc_8a;
ALTER TABLE responses_wais4_digit_span RENAME COLUMN mcoc_8b TO wais4_mcoc_8b;

-- Note: Computed score fields (wais_mcod_*, wais_mcoi_*, etc.) remain unchanged
-- as they already have proper prefixes and are not shared with WAIS-III

