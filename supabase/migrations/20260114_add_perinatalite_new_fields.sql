-- Migration: Add new fields to perinatalite questionnaire
-- Description: Adds birth environment, obstetric complications, maternal viral infection, and pregnancy events fields
-- Date: 2026-01-14

-- Add new columns to responses_perinatalite table
ALTER TABLE responses_perinatalite
ADD COLUMN IF NOT EXISTS q12_birth_environment VARCHAR(50) CHECK (q12_birth_environment IN ('urbain', 'rural', 'unknown')),
ADD COLUMN IF NOT EXISTS q13_obstetric_complications VARCHAR(20) CHECK (q13_obstetric_complications IN ('yes', 'no', 'unknown')),
ADD COLUMN IF NOT EXISTS q14_maternal_viral_infection VARCHAR(20) CHECK (q14_maternal_viral_infection IN ('yes', 'no', 'unknown')),
ADD COLUMN IF NOT EXISTS q15_maternal_pregnancy_events TEXT[];

-- Add comments for the new columns
COMMENT ON COLUMN responses_perinatalite.q12_birth_environment IS 'Birth environment: urbain, rural, or unknown';
COMMENT ON COLUMN responses_perinatalite.q13_obstetric_complications IS 'Obstetric complications at birth: yes, no, or unknown';
COMMENT ON COLUMN responses_perinatalite.q14_maternal_viral_infection IS 'Maternal viral infection during pregnancy: yes, no, or unknown';
COMMENT ON COLUMN responses_perinatalite.q15_maternal_pregnancy_events IS 'Array of stressful events during pregnancy';
