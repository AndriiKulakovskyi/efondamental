-- ============================================================================
-- Migration: Update DIVA Question Types from BOOLEAN to VARCHAR
-- ============================================================================
-- This migration changes all DIVA symptom questions from BOOLEAN to VARCHAR(10)
-- to support 'oui'/'non' single choice answers instead of checkboxes
-- ============================================================================

DO $$ 
BEGIN
    RAISE NOTICE 'Starting conversion of DIVA fields from BOOLEAN to VARCHAR...';

    -- ========================================================================
    -- Inattention Symptoms (A1a-A1i) - Adult and Childhood
    -- ========================================================================
    ALTER TABLE responses_diva
    ALTER COLUMN a1a_adult TYPE VARCHAR(10),
    ALTER COLUMN a1a_childhood TYPE VARCHAR(10),
    ALTER COLUMN a1b_adult TYPE VARCHAR(10),
    ALTER COLUMN a1b_childhood TYPE VARCHAR(10),
    ALTER COLUMN a1c_adult TYPE VARCHAR(10),
    ALTER COLUMN a1c_childhood TYPE VARCHAR(10),
    ALTER COLUMN a1d_adult TYPE VARCHAR(10),
    ALTER COLUMN a1d_childhood TYPE VARCHAR(10),
    ALTER COLUMN a1e_adult TYPE VARCHAR(10),
    ALTER COLUMN a1e_childhood TYPE VARCHAR(10),
    ALTER COLUMN a1f_adult TYPE VARCHAR(10),
    ALTER COLUMN a1f_childhood TYPE VARCHAR(10),
    ALTER COLUMN a1g_adult TYPE VARCHAR(10),
    ALTER COLUMN a1g_childhood TYPE VARCHAR(10),
    ALTER COLUMN a1h_adult TYPE VARCHAR(10),
    ALTER COLUMN a1h_childhood TYPE VARCHAR(10),
    ALTER COLUMN a1i_adult TYPE VARCHAR(10),
    ALTER COLUMN a1i_childhood TYPE VARCHAR(10);

    RAISE NOTICE 'Converted DIVA inattention symptom columns from BOOLEAN to VARCHAR';

    -- ========================================================================
    -- Hyperactivity/Impulsivity Symptoms (A2a-A2i) - Adult and Childhood
    -- ========================================================================
    ALTER TABLE responses_diva
    ALTER COLUMN a2a_adult TYPE VARCHAR(10),
    ALTER COLUMN a2a_childhood TYPE VARCHAR(10),
    ALTER COLUMN a2b_adult TYPE VARCHAR(10),
    ALTER COLUMN a2b_childhood TYPE VARCHAR(10),
    ALTER COLUMN a2c_adult TYPE VARCHAR(10),
    ALTER COLUMN a2c_childhood TYPE VARCHAR(10),
    ALTER COLUMN a2d_adult TYPE VARCHAR(10),
    ALTER COLUMN a2d_childhood TYPE VARCHAR(10),
    ALTER COLUMN a2e_adult TYPE VARCHAR(10),
    ALTER COLUMN a2e_childhood TYPE VARCHAR(10),
    ALTER COLUMN a2f_adult TYPE VARCHAR(10),
    ALTER COLUMN a2f_childhood TYPE VARCHAR(10),
    ALTER COLUMN a2g_adult TYPE VARCHAR(10),
    ALTER COLUMN a2g_childhood TYPE VARCHAR(10),
    ALTER COLUMN a2h_adult TYPE VARCHAR(10),
    ALTER COLUMN a2h_childhood TYPE VARCHAR(10),
    ALTER COLUMN a2i_adult TYPE VARCHAR(10),
    ALTER COLUMN a2i_childhood TYPE VARCHAR(10);

    RAISE NOTICE 'Converted DIVA hyperactivity/impulsivity symptom columns from BOOLEAN to VARCHAR';

    -- ========================================================================
    -- Scoring Criteria (converted from BOOLEAN to VARCHAR for Oui/Non)
    -- ========================================================================
    ALTER TABLE responses_diva
    ALTER COLUMN criteria_a_inattention_child_gte6 TYPE VARCHAR(10),
    ALTER COLUMN criteria_hi_hyperactivity_child_gte6 TYPE VARCHAR(10),
    ALTER COLUMN criteria_a_inattention_adult_gte6 TYPE VARCHAR(10),
    ALTER COLUMN criteria_hi_hyperactivity_adult_gte6 TYPE VARCHAR(10),
    ALTER COLUMN criteria_b_lifetime_persistence TYPE VARCHAR(10),
    ALTER COLUMN criteria_cd_impairment_childhood TYPE VARCHAR(10),
    ALTER COLUMN criteria_cd_impairment_adult TYPE VARCHAR(10);

    RAISE NOTICE 'Converted DIVA criteria columns from BOOLEAN to VARCHAR';

    -- ========================================================================
    -- Force PostgREST Schema Cache Reload
    -- ========================================================================
    PERFORM pg_sleep(0.5);
    NOTIFY pgrst, 'reload schema';
    PERFORM pg_sleep(0.5);
    NOTIFY pgrst, 'reload config';
    PERFORM pg_sleep(0.5);

    RAISE NOTICE 'PostgREST schema cache reload triggered';
    RAISE NOTICE 'DIVA question type conversion completed successfully';

END $$;

