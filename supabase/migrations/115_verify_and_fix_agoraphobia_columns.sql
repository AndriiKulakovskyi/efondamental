-- Verify and fix agoraphobia_no_panic columns
-- These columns should exist but PostgREST can't find them

-- First, let's ensure these columns exist
DO $$ 
BEGIN
    -- Add agoraphobia_no_panic_present if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'responses_dsm5_comorbid' 
        AND column_name = 'agoraphobia_no_panic_present'
    ) THEN
        ALTER TABLE responses_dsm5_comorbid
        ADD COLUMN agoraphobia_no_panic_present VARCHAR(20) CHECK (agoraphobia_no_panic_present IN ('oui', 'non', 'ne_sais_pas'));
        RAISE NOTICE 'Added agoraphobia_no_panic_present column';
    ELSE
        RAISE NOTICE 'agoraphobia_no_panic_present column already exists';
    END IF;

    -- Add agoraphobia_no_panic_age_debut if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'responses_dsm5_comorbid' 
        AND column_name = 'agoraphobia_no_panic_age_debut'
    ) THEN
        ALTER TABLE responses_dsm5_comorbid
        ADD COLUMN agoraphobia_no_panic_age_debut INTEGER CHECK (agoraphobia_no_panic_age_debut BETWEEN 0 AND 120);
        RAISE NOTICE 'Added agoraphobia_no_panic_age_debut column';
    ELSE
        RAISE NOTICE 'agoraphobia_no_panic_age_debut column already exists';
    END IF;

    -- Add agoraphobia_no_panic_symptoms_past_month if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'responses_dsm5_comorbid' 
        AND column_name = 'agoraphobia_no_panic_symptoms_past_month'
    ) THEN
        ALTER TABLE responses_dsm5_comorbid
        ADD COLUMN agoraphobia_no_panic_symptoms_past_month VARCHAR(20) CHECK (agoraphobia_no_panic_symptoms_past_month IN ('oui', 'non', 'ne_sais_pas'));
        RAISE NOTICE 'Added agoraphobia_no_panic_symptoms_past_month column';
    ELSE
        RAISE NOTICE 'agoraphobia_no_panic_symptoms_past_month column already exists';
    END IF;
END $$;

-- Force PostgREST to reload its schema cache
NOTIFY pgrst, 'reload schema';

-- Verify columns exist
DO $$
DECLARE
    col_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO col_count
    FROM information_schema.columns 
    WHERE table_name = 'responses_dsm5_comorbid' 
    AND column_name IN ('agoraphobia_no_panic_present', 'agoraphobia_no_panic_age_debut', 'agoraphobia_no_panic_symptoms_past_month');
    
    RAISE NOTICE 'Found % agoraphobia_no_panic columns', col_count;
    
    IF col_count = 3 THEN
        RAISE NOTICE 'All agoraphobia_no_panic columns verified successfully';
    ELSE
        RAISE WARNING 'Expected 3 agoraphobia_no_panic columns but found %', col_count;
    END IF;
END $$;

