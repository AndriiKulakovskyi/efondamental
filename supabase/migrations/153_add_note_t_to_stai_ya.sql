-- Migration: Add note_t to STAI-YA
-- Description: Adds Note T field to responses_stai_ya table

ALTER TABLE responses_stai_ya
  ADD COLUMN IF NOT EXISTS note_t DECIMAL(5,2);

COMMENT ON COLUMN responses_stai_ya.note_t IS 'Note T (T-score) calculée ou saisie pour le questionnaire STAI-YA';
