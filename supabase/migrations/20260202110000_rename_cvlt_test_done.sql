-- Migration: Rename test_not_done to test_done in schizophrenia_cvlt
-- This aligns the column name with the UI question "Test fait" (Test done)
-- and simplifies the logic by removing the double negative

-- Step 1: Add the new column with inverted default (true means test was done)
ALTER TABLE "public"."schizophrenia_cvlt" 
ADD COLUMN IF NOT EXISTS "test_done" BOOLEAN DEFAULT TRUE;

-- Step 2: Migrate data - invert the values
-- test_not_done = true (test NOT done) → test_done = false
-- test_not_done = false (test done) → test_done = true
UPDATE "public"."schizophrenia_cvlt" 
SET "test_done" = NOT COALESCE("test_done", FALSE);

-- Step 3: Drop the old column
ALTER TABLE "public"."schizophrenia_cvlt" 
DROP COLUMN IF EXISTS "test_not_done";

-- Step 4: Update column comment
COMMENT ON COLUMN "public"."schizophrenia_cvlt"."test_done" IS 'Flag indicating test was administered (true = done, false = not done)';
