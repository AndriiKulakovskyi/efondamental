-- eFondaMental Platform - Update DSM5 Comorbid Questionnaire Structure
-- This migration aligns the database with application changes:
-- 1. Section 1: New panic disorder structure with type selection
-- 2. Section 3: Single eating disorder type selection
-- 3. Section 5: Remove detailed DIVA assessment (keep only evaluation question)

-- ============================================================================
-- SECTION 1: ANXIETY DISORDERS - Update Panic Disorder Structure
-- ============================================================================

-- Add new panic disorder fields if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'responses_dsm5_comorbid' 
        AND column_name = 'panic_disorder_present'
    ) THEN
        ALTER TABLE responses_dsm5_comorbid
        ADD COLUMN panic_disorder_present VARCHAR(20) CHECK (panic_disorder_present IN ('oui', 'non', 'ne_sais_pas'));
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'responses_dsm5_comorbid' 
        AND column_name = 'panic_disorder_type'
    ) THEN
        ALTER TABLE responses_dsm5_comorbid
        ADD COLUMN panic_disorder_type VARCHAR(30) CHECK (panic_disorder_type IN ('sans_agoraphobie', 'avec_agoraphobie'));
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'responses_dsm5_comorbid' 
        AND column_name = 'panic_disorder_age_debut'
    ) THEN
        ALTER TABLE responses_dsm5_comorbid
        ADD COLUMN panic_disorder_age_debut INTEGER CHECK (panic_disorder_age_debut BETWEEN 0 AND 120);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'responses_dsm5_comorbid' 
        AND column_name = 'panic_disorder_symptoms_past_month'
    ) THEN
        ALTER TABLE responses_dsm5_comorbid
        ADD COLUMN panic_disorder_symptoms_past_month VARCHAR(20) CHECK (panic_disorder_symptoms_past_month IN ('oui', 'non'));
    END IF;
END $$;

-- Drop old panic disorder fields (without and with agoraphobia) if they exist
ALTER TABLE responses_dsm5_comorbid
DROP COLUMN IF EXISTS panic_no_agoraphobia_present,
DROP COLUMN IF EXISTS panic_no_agoraphobia_age_debut,
DROP COLUMN IF EXISTS panic_no_agoraphobia_symptoms_past_month,
DROP COLUMN IF EXISTS panic_with_agoraphobia_present,
DROP COLUMN IF EXISTS panic_with_agoraphobia_age_debut,
DROP COLUMN IF EXISTS panic_with_agoraphobia_symptoms_past_month;

-- ============================================================================
-- SECTION 3: EATING DISORDERS - Add Single Type Selection
-- ============================================================================

-- Add eating disorder type field (single choice) if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'responses_dsm5_comorbid' 
        AND column_name = 'eating_disorder_type'
    ) THEN
        ALTER TABLE responses_dsm5_comorbid
        ADD COLUMN eating_disorder_type VARCHAR(50) CHECK (eating_disorder_type IN (
            'anorexia_restrictive',
            'anorexia_bulimic',
            'bulimia',
            'binge_eating',
            'eating_unspecified',
            'night_eating'
        ));
    END IF;
END $$;

-- Convert amenorrhea fields from BOOLEAN to VARCHAR for consistency (if they exist)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'responses_dsm5_comorbid' 
        AND column_name = 'anorexia_restrictive_amenorrhea'
        AND data_type = 'boolean'
    ) THEN
        ALTER TABLE responses_dsm5_comorbid
        ALTER COLUMN anorexia_restrictive_amenorrhea TYPE VARCHAR(10) USING 
            CASE 
                WHEN anorexia_restrictive_amenorrhea = true THEN 'oui'
                WHEN anorexia_restrictive_amenorrhea = false THEN 'non'
                ELSE NULL
            END;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'responses_dsm5_comorbid' 
        AND column_name = 'anorexia_bulimic_amenorrhea'
        AND data_type = 'boolean'
    ) THEN
        ALTER TABLE responses_dsm5_comorbid
        ALTER COLUMN anorexia_bulimic_amenorrhea TYPE VARCHAR(10) USING 
            CASE 
                WHEN anorexia_bulimic_amenorrhea = true THEN 'oui'
                WHEN anorexia_bulimic_amenorrhea = false THEN 'non'
                ELSE NULL
            END;
    END IF;
END $$;

-- ============================================================================
-- SECTION 5: ADHD/DIVA - Remove Detailed Assessment Fields
-- ============================================================================

-- Drop all DIVA inattention symptom fields (A1a-A1i)
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

-- Drop all DIVA hyperactivity/impulsivity symptom fields (A2a-A2i)
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

-- Drop DIVA totals
ALTER TABLE responses_dsm5_comorbid
DROP COLUMN IF EXISTS diva_total_inattention_adult,
DROP COLUMN IF EXISTS diva_total_inattention_childhood,
DROP COLUMN IF EXISTS diva_total_hyperactivity_adult,
DROP COLUMN IF EXISTS diva_total_hyperactivity_childhood;

-- Drop DIVA criteria fields
ALTER TABLE responses_dsm5_comorbid
DROP COLUMN IF EXISTS diva_criteria_a_inattention_gte6,
DROP COLUMN IF EXISTS diva_criteria_a_hyperactivity_gte6,
DROP COLUMN IF EXISTS diva_criteria_b_lifetime_persistence,
DROP COLUMN IF EXISTS diva_criteria_cd_impairment_childhood,
DROP COLUMN IF EXISTS diva_criteria_cd_impairment_adult,
DROP COLUMN IF EXISTS diva_criteria_e_better_explained,
DROP COLUMN IF EXISTS diva_criteria_e_explanation;

-- Drop DIVA collateral information fields
ALTER TABLE responses_dsm5_comorbid
DROP COLUMN IF EXISTS diva_collateral_parents,
DROP COLUMN IF EXISTS diva_collateral_partner,
DROP COLUMN IF EXISTS diva_collateral_school_reports,
DROP COLUMN IF EXISTS diva_collateral_details;

-- Drop DIVA diagnosis field
ALTER TABLE responses_dsm5_comorbid
DROP COLUMN IF EXISTS diva_diagnosis;

-- ============================================================================
-- Add comments
-- ============================================================================

DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'responses_dsm5_comorbid' 
        AND column_name = 'panic_disorder_present'
    ) THEN
        COMMENT ON COLUMN responses_dsm5_comorbid.panic_disorder_present IS 'Section 1: Panic disorder presence (replaces separate with/without agoraphobia fields)';
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'responses_dsm5_comorbid' 
        AND column_name = 'panic_disorder_type'
    ) THEN
        COMMENT ON COLUMN responses_dsm5_comorbid.panic_disorder_type IS 'Section 1: Type of panic disorder (sans_agoraphobie or avec_agoraphobie)';
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'responses_dsm5_comorbid' 
        AND column_name = 'eating_disorder_type'
    ) THEN
        COMMENT ON COLUMN responses_dsm5_comorbid.eating_disorder_type IS 'Section 3: Single selection for eating disorder type';
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'responses_dsm5_comorbid' 
        AND column_name = 'diva_evaluated'
    ) THEN
        COMMENT ON COLUMN responses_dsm5_comorbid.diva_evaluated IS 'Section 5: Only stores if DIVA was evaluated. Detailed DIVA assessment moved to separate Medical Evaluation section';
    END IF;
END $$;

COMMENT ON TABLE responses_dsm5_comorbid IS 'DSM5 Comorbidities questionnaire responses. Section 5 (ADHD) now only tracks if DIVA evaluation was done; detailed DIVA assessment is in Medical Evaluation section.';

