-- eFondaMental Platform - Boolean Fields Audit
-- This script identifies all BOOLEAN columns in questionnaire response tables
-- Run this to identify fields that may need conversion to VARCHAR for 'oui'/'non' values

-- ============================================================================
-- Query to find all BOOLEAN columns in response tables
-- ============================================================================

SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public'
    AND table_name LIKE 'responses_%'
    AND data_type = 'boolean'
ORDER BY 
    table_name, 
    column_name;

-- ============================================================================
-- Expected Results (based on analysis)
-- ============================================================================

-- responses_diva: 36 BOOLEAN fields
--   - a1a_adult, a1a_childhood (Inattention symptoms 1a-1i: 18 fields)
--   - a2a_adult, a2a_childhood (Hyperactivity symptoms 2a-2i: 18 fields)
--   - criteria_a_inattention_child_gte6
--   - criteria_hi_hyperactivity_child_gte6
--   - criteria_a_inattention_adult_gte6
--   - criteria_hi_hyperactivity_adult_gte6
--   - criteria_b_lifetime_persistence
--   - criteria_cd_impairment_childhood
--   - criteria_cd_impairment_adult
--   - criteria_e_better_explained
--   Total: 36 fields

-- responses_tobacco: 1 BOOLEAN field
--   - has_substitution

-- Other tables may have BOOLEAN fields that need review

-- ============================================================================
-- Action Items Based on Results
-- ============================================================================

-- For each BOOLEAN field found, determine:
-- 1. Is it used with 'oui'/'non' options in the UI?
-- 2. Does the TypeScript interface define it as 'oui' | 'non'?
-- 3. Is there transformation logic in the service layer?

-- If answer to #1 or #2 is YES but #3 is NO:
--   EITHER: Convert to VARCHAR(10) (recommended for French UI)
--   OR: Add transformation logic in service layer (like DIVA)

-- ============================================================================
-- Example Conversion Script (if needed)
-- ============================================================================

-- Uncomment and modify for each field that needs conversion:

/*
ALTER TABLE responses_tobacco 
ALTER COLUMN has_substitution TYPE VARCHAR(10) 
USING CASE 
  WHEN has_substitution = TRUE THEN 'oui'
  WHEN has_substitution = FALSE THEN 'non'
  ELSE NULL
END;

-- Add constraint
ALTER TABLE responses_tobacco
ADD CONSTRAINT has_substitution_check 
CHECK (has_substitution IN ('oui', 'non', NULL));

-- Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';
SELECT pg_sleep(2);
NOTIFY pgrst, 'reload config';
*/

