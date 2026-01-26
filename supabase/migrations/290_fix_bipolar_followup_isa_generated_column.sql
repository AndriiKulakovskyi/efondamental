-- ============================================================================
-- Migration: Fix bipolar_followup_isa Generated Column
-- ============================================================================
-- Convert total_score from a PostgreSQL generated column to a regular column.
-- All scores must be computed by the application, not the database.
-- ============================================================================

-- Step 1: Drop the generated total_score column
ALTER TABLE bipolar_followup_isa DROP COLUMN IF EXISTS total_score;

-- Step 2: Add total_score back as a regular INTEGER column
ALTER TABLE bipolar_followup_isa ADD COLUMN total_score INTEGER;

-- Step 3: Backfill existing data by computing the score from q1-q5 values
-- Score = sum of q1_life_worth + q2_wish_death + q3_thoughts + q4_plan + q5_attempt
UPDATE bipolar_followup_isa
SET total_score = COALESCE(q1_life_worth, 0) + COALESCE(q2_wish_death, 0) + 
                  COALESCE(q3_thoughts, 0) + COALESCE(q4_plan, 0) + COALESCE(q5_attempt, 0);

-- Add comment for documentation
COMMENT ON COLUMN bipolar_followup_isa.total_score IS 'Total ISA score (0-5). Computed by the application as sum of q1-q5 binary values.';
