-- Migration: Add attempt count and violent/serious attempt questions
-- to bipolar_followup_suicide_behavior table
-- These are TEXT columns to support '>20' option values

ALTER TABLE public.bipolar_followup_suicide_behavior
    ADD COLUMN IF NOT EXISTS q0_ts_since_last_visit TEXT,
    ADD COLUMN IF NOT EXISTS q0_attempt_count TEXT,
    ADD COLUMN IF NOT EXISTS q0_violent_attempts TEXT,
    ADD COLUMN IF NOT EXISTS q0_violent_count TEXT,
    ADD COLUMN IF NOT EXISTS q0_serious_attempts TEXT,
    ADD COLUMN IF NOT EXISTS q0_serious_count TEXT;
