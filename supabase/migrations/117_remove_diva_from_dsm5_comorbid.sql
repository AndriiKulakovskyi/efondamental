-- ============================================================================
-- Migration: Remove DIVA Assessment Fields from DSM5 Comorbid Responses
-- ============================================================================
-- This migration removes all detailed DIVA questionnaire fields from the
-- responses_dsm5_comorbid table. Only the diva_evaluated field remains.
-- The detailed DIVA assessment will be moved to a separate location.
-- ============================================================================

DO $$ 
BEGIN
    RAISE NOTICE 'Starting removal of DIVA assessment fields from responses_dsm5_comorbid...';

    -- ========================================================================
    -- Drop DIVA Inattention Symptoms (A1a-A1i) - Adult and Childhood
    -- ========================================================================
    ALTER TABLE responses_dsm5_comorbid
    DROP COLUMN IF EXISTS diva_a1a_adult,
    DROP COLUMN IF EXISTS diva_a1a_childhood,
    DROP COLUMN IF EXISTS diva_a1b_adult,
    DROP COLUMN IF EXISTS diva_a1b_childhood,
    DROP COLUMN IF EXISTS diva_a1c_adult,
    DROP COLUMN IF EXISTS diva_a1c_childhood,
    DROP COLUMN IF EXISTS diva_a1d_adult,
    DROP COLUMN IF EXISTS diva_a1d_childhood,
    DROP COLUMN IF EXISTS diva_a1e_adult,
    DROP COLUMN IF EXISTS diva_a1e_childhood,
    DROP COLUMN IF EXISTS diva_a1f_adult,
    DROP COLUMN IF EXISTS diva_a1f_childhood,
    DROP COLUMN IF EXISTS diva_a1g_adult,
    DROP COLUMN IF EXISTS diva_a1g_childhood,
    DROP COLUMN IF EXISTS diva_a1h_adult,
    DROP COLUMN IF EXISTS diva_a1h_childhood,
    DROP COLUMN IF EXISTS diva_a1i_adult,
    DROP COLUMN IF EXISTS diva_a1i_childhood;

    RAISE NOTICE 'Dropped DIVA inattention symptom columns';

    -- ========================================================================
    -- Drop DIVA Hyperactivity/Impulsivity Symptoms (A2a-A2i)
    -- ========================================================================
    ALTER TABLE responses_dsm5_comorbid
    DROP COLUMN IF EXISTS diva_a2a_adult,
    DROP COLUMN IF EXISTS diva_a2a_childhood,
    DROP COLUMN IF EXISTS diva_a2b_adult,
    DROP COLUMN IF EXISTS diva_a2b_childhood,
    DROP COLUMN IF EXISTS diva_a2c_adult,
    DROP COLUMN IF EXISTS diva_a2c_childhood,
    DROP COLUMN IF EXISTS diva_a2d_adult,
    DROP COLUMN IF EXISTS diva_a2d_childhood,
    DROP COLUMN IF EXISTS diva_a2e_adult,
    DROP COLUMN IF EXISTS diva_a2e_childhood,
    DROP COLUMN IF EXISTS diva_a2f_adult,
    DROP COLUMN IF EXISTS diva_a2f_childhood,
    DROP COLUMN IF EXISTS diva_a2g_adult,
    DROP COLUMN IF EXISTS diva_a2g_childhood,
    DROP COLUMN IF EXISTS diva_a2h_adult,
    DROP COLUMN IF EXISTS diva_a2h_childhood,
    DROP COLUMN IF EXISTS diva_a2i_adult,
    DROP COLUMN IF EXISTS diva_a2i_childhood;

    RAISE NOTICE 'Dropped DIVA hyperactivity/impulsivity symptom columns';

    -- ========================================================================
    -- Drop DIVA Totals
    -- ========================================================================
    ALTER TABLE responses_dsm5_comorbid
    DROP COLUMN IF EXISTS diva_total_inattention_adult,
    DROP COLUMN IF EXISTS diva_total_inattention_childhood,
    DROP COLUMN IF EXISTS diva_total_hyperactivity_adult,
    DROP COLUMN IF EXISTS diva_total_hyperactivity_childhood;

    RAISE NOTICE 'Dropped DIVA totals columns';

    -- ========================================================================
    -- Drop DIVA Criteria
    -- ========================================================================
    ALTER TABLE responses_dsm5_comorbid
    DROP COLUMN IF EXISTS diva_criteria_a_inattention_gte6,
    DROP COLUMN IF EXISTS diva_criteria_a_hyperactivity_gte6,
    DROP COLUMN IF EXISTS diva_criteria_b_lifetime_persistence,
    DROP COLUMN IF EXISTS diva_criteria_cd_impairment_childhood,
    DROP COLUMN IF EXISTS diva_criteria_cd_impairment_adult,
    DROP COLUMN IF EXISTS diva_criteria_e_better_explained,
    DROP COLUMN IF EXISTS diva_criteria_e_explanation;

    RAISE NOTICE 'Dropped DIVA criteria columns';

    -- ========================================================================
    -- Drop DIVA Collateral Information
    -- ========================================================================
    ALTER TABLE responses_dsm5_comorbid
    DROP COLUMN IF EXISTS diva_collateral_parents,
    DROP COLUMN IF EXISTS diva_collateral_partner,
    DROP COLUMN IF EXISTS diva_collateral_school_reports,
    DROP COLUMN IF EXISTS diva_collateral_details;

    RAISE NOTICE 'Dropped DIVA collateral information columns';

    -- ========================================================================
    -- Drop DIVA Diagnosis
    -- ========================================================================
    ALTER TABLE responses_dsm5_comorbid
    DROP COLUMN IF EXISTS diva_diagnosis;

    RAISE NOTICE 'Dropped DIVA diagnosis column';

    -- ========================================================================
    -- Force PostgREST Schema Cache Reload
    -- ========================================================================
    PERFORM pg_sleep(0.5);
    NOTIFY pgrst, 'reload schema';
    PERFORM pg_sleep(0.5);
    NOTIFY pgrst, 'reload config';
    PERFORM pg_sleep(0.5);

    RAISE NOTICE 'PostgREST schema cache reload triggered';
    RAISE NOTICE 'DIVA assessment fields successfully removed from responses_dsm5_comorbid';
    RAISE NOTICE 'Only diva_evaluated field remains in Section 5';

END $$;

