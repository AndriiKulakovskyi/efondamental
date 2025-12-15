-- ============================================================================
-- Migration: Remove 'evaluated' field from DIVA questionnaire
-- ============================================================================
-- The 'evaluated' question has been moved to DSM5 Comorbidities Section 5
-- (diva_evaluated field), so we no longer need it in the DIVA table itself
-- ============================================================================

DO $$ 
BEGIN
    RAISE NOTICE 'Removing evaluated field from responses_diva table...';

    -- Drop the evaluated column from responses_diva
    ALTER TABLE responses_diva
    DROP COLUMN IF EXISTS evaluated;

    RAISE NOTICE 'Dropped evaluated column from responses_diva';

    -- ========================================================================
    -- Force PostgREST Schema Cache Reload
    -- ========================================================================
    PERFORM pg_sleep(0.5);
    NOTIFY pgrst, 'reload schema';
    PERFORM pg_sleep(0.5);
    NOTIFY pgrst, 'reload config';
    PERFORM pg_sleep(0.5);

    RAISE NOTICE 'PostgREST schema cache reload triggered';
    RAISE NOTICE 'DIVA evaluated field removal completed successfully';

END $$;

