-- eFondaMental Platform - Rework État du Patient Table
-- Restructures the table to support DSM-IV symptom checklist

-- ============================================================================
-- État du patient (DSM-IV Symptoms) - Table Restructure
-- ============================================================================

-- Step 1: Drop old columns
ALTER TABLE responses_etat_patient DROP COLUMN IF EXISTS euthymia_severity;
ALTER TABLE responses_etat_patient DROP COLUMN IF EXISTS euthymia_duration;
ALTER TABLE responses_etat_patient DROP COLUMN IF EXISTS mania_severity;
ALTER TABLE responses_etat_patient DROP COLUMN IF EXISTS mania_duration;
ALTER TABLE responses_etat_patient DROP COLUMN IF EXISTS depression_severity;
ALTER TABLE responses_etat_patient DROP COLUMN IF EXISTS depression_duration;
ALTER TABLE responses_etat_patient DROP COLUMN IF EXISTS mixed_severity;
ALTER TABLE responses_etat_patient DROP COLUMN IF EXISTS mixed_duration;
ALTER TABLE responses_etat_patient DROP COLUMN IF EXISTS current_state;
ALTER TABLE responses_etat_patient DROP COLUMN IF EXISTS state_details;

-- Step 2: Add new columns for DSM-IV symptom checklist
-- Depressive symptoms (Q1-Q9) - Values: 0=Non, 1=Oui, 9=Ne sais pas
ALTER TABLE responses_etat_patient ADD COLUMN IF NOT EXISTS q1 INTEGER CHECK (q1 IN (0, 1, 9));
ALTER TABLE responses_etat_patient ADD COLUMN IF NOT EXISTS q1a INTEGER CHECK (q1a IN (0, 1, 9));
ALTER TABLE responses_etat_patient ADD COLUMN IF NOT EXISTS q1b INTEGER CHECK (q1b IN (0, 1, 9));
ALTER TABLE responses_etat_patient ADD COLUMN IF NOT EXISTS q2 INTEGER CHECK (q2 IN (0, 1, 9));
ALTER TABLE responses_etat_patient ADD COLUMN IF NOT EXISTS q3 INTEGER CHECK (q3 IN (0, 1, 9));
ALTER TABLE responses_etat_patient ADD COLUMN IF NOT EXISTS q3a INTEGER CHECK (q3a IN (0, 1, 9));
ALTER TABLE responses_etat_patient ADD COLUMN IF NOT EXISTS q3b INTEGER CHECK (q3b IN (0, 1, 9));
ALTER TABLE responses_etat_patient ADD COLUMN IF NOT EXISTS q4 INTEGER CHECK (q4 IN (0, 1, 9));
ALTER TABLE responses_etat_patient ADD COLUMN IF NOT EXISTS q4a INTEGER CHECK (q4a IN (0, 1, 9));
ALTER TABLE responses_etat_patient ADD COLUMN IF NOT EXISTS q4b INTEGER CHECK (q4b IN (0, 1, 9));
ALTER TABLE responses_etat_patient ADD COLUMN IF NOT EXISTS q5 INTEGER CHECK (q5 IN (0, 1, 9));
ALTER TABLE responses_etat_patient ADD COLUMN IF NOT EXISTS q5a INTEGER CHECK (q5a IN (0, 1, 9));
ALTER TABLE responses_etat_patient ADD COLUMN IF NOT EXISTS q5b INTEGER CHECK (q5b IN (0, 1, 9));
ALTER TABLE responses_etat_patient ADD COLUMN IF NOT EXISTS q6 INTEGER CHECK (q6 IN (0, 1, 9));
ALTER TABLE responses_etat_patient ADD COLUMN IF NOT EXISTS q7 INTEGER CHECK (q7 IN (0, 1, 9));
ALTER TABLE responses_etat_patient ADD COLUMN IF NOT EXISTS q8 INTEGER CHECK (q8 IN (0, 1, 9));
ALTER TABLE responses_etat_patient ADD COLUMN IF NOT EXISTS q8a INTEGER CHECK (q8a IN (0, 1, 9));
ALTER TABLE responses_etat_patient ADD COLUMN IF NOT EXISTS q8b INTEGER CHECK (q8b IN (0, 1, 9));
ALTER TABLE responses_etat_patient ADD COLUMN IF NOT EXISTS q9 INTEGER CHECK (q9 IN (0, 1, 9));

-- Manic symptoms (Q10-Q18) - Values: 0=Non, 1=Oui, 9=Ne sais pas
ALTER TABLE responses_etat_patient ADD COLUMN IF NOT EXISTS q10 INTEGER CHECK (q10 IN (0, 1, 9));
ALTER TABLE responses_etat_patient ADD COLUMN IF NOT EXISTS q11 INTEGER CHECK (q11 IN (0, 1, 9));
ALTER TABLE responses_etat_patient ADD COLUMN IF NOT EXISTS q12 INTEGER CHECK (q12 IN (0, 1, 9));
ALTER TABLE responses_etat_patient ADD COLUMN IF NOT EXISTS q13 INTEGER CHECK (q13 IN (0, 1, 9));
ALTER TABLE responses_etat_patient ADD COLUMN IF NOT EXISTS q14 INTEGER CHECK (q14 IN (0, 1, 9));
ALTER TABLE responses_etat_patient ADD COLUMN IF NOT EXISTS q15 INTEGER CHECK (q15 IN (0, 1, 9));
ALTER TABLE responses_etat_patient ADD COLUMN IF NOT EXISTS q16 INTEGER CHECK (q16 IN (0, 1, 9));
ALTER TABLE responses_etat_patient ADD COLUMN IF NOT EXISTS q17 INTEGER CHECK (q17 IN (0, 1, 9));
ALTER TABLE responses_etat_patient ADD COLUMN IF NOT EXISTS q18 INTEGER CHECK (q18 IN (0, 1, 9));

-- Step 3: Add scoring columns
ALTER TABLE responses_etat_patient ADD COLUMN IF NOT EXISTS depression_count INTEGER;
ALTER TABLE responses_etat_patient ADD COLUMN IF NOT EXISTS mania_count INTEGER;
ALTER TABLE responses_etat_patient ADD COLUMN IF NOT EXISTS interpretation TEXT;

-- Note: Existing RLS policies, triggers, and other metadata remain unchanged

