-- Migration: Update PSQI structure for HH:MM format
-- This migration updates q4_hours_sleep to TEXT to allow HH:MM format

-- 1. Drop the check constraint
ALTER TABLE responses_psqi DROP CONSTRAINT IF EXISTS responses_psqi_q4_hours_sleep_check;

-- 2. Change column type
ALTER TABLE responses_psqi ALTER COLUMN q4_hours_sleep TYPE TEXT;

-- 3. Add column for the calculated decimal value (optional but useful for sorting/filtering)
-- Or we just parse it in the service. Let's just keep it as TEXT for now to match user request.
