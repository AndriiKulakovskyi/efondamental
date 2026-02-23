-- ============================================================================
-- Migration: Split TAP metadata into per-section columns
-- Each subtest (attention soutenue / flexibilité) can be done at different
-- times by different people, so metadata must be stored separately.
-- ============================================================================

-- Rename existing shared columns to attention-specific
ALTER TABLE schizophrenia_tap RENAME COLUMN examinateur TO attention_examinateur;
ALTER TABLE schizophrenia_tap RENAME COLUMN date_passation TO attention_date_passation;
ALTER TABLE schizophrenia_tap RENAME COLUMN normes TO attention_normes;

-- Add flexibilité-specific metadata columns
ALTER TABLE schizophrenia_tap ADD COLUMN flexibilite_examinateur text;
ALTER TABLE schizophrenia_tap ADD COLUMN flexibilite_date_passation text;
ALTER TABLE schizophrenia_tap ADD COLUMN flexibilite_normes text;

-- Copy existing data to flexibilité columns (for rows that already exist)
UPDATE schizophrenia_tap
SET flexibilite_examinateur = attention_examinateur,
    flexibilite_date_passation = attention_date_passation,
    flexibilite_normes = attention_normes
WHERE attention_examinateur IS NOT NULL
   OR attention_date_passation IS NOT NULL
   OR attention_normes IS NOT NULL;
