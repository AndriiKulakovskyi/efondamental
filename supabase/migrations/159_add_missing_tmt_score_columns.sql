-- ============================================================================
-- Add missing TMT score columns to WAIS-III and regular TMT tables
-- ============================================================================
-- This migration adds missing percentile columns and B-A error difference scores
-- Percentiles are stored as TEXT to support ranges like "25 - 50", "> 95", "< 5"
-- ============================================================================

-- ============================================================================
-- responses_wais3_tmt: Add missing columns
-- ============================================================================

-- Change existing percentile columns from INTEGER to TEXT
ALTER TABLE responses_wais3_tmt 
    ALTER COLUMN tmta_tps_pc TYPE TEXT,
    ALTER COLUMN tmtb_tps_pc TYPE TEXT;

-- Add missing percentile columns
ALTER TABLE responses_wais3_tmt
    ADD COLUMN IF NOT EXISTS tmta_errtot_pc TEXT,
    ADD COLUMN IF NOT EXISTS tmtb_errtot_pc TEXT,
    ADD COLUMN IF NOT EXISTS tmtb_err_persev_pc TEXT,
    ADD COLUMN IF NOT EXISTS tmt_b_a_tps_pc TEXT,
    ADD COLUMN IF NOT EXISTS tmt_b_a_err_pc TEXT;

-- Add missing B-A error difference columns
ALTER TABLE responses_wais3_tmt
    ADD COLUMN IF NOT EXISTS tmt_b_a_err INTEGER,
    ADD COLUMN IF NOT EXISTS tmt_b_a_err_z DECIMAL(5,2);

-- ============================================================================
-- responses_tmt: Add missing columns (for consistency)
-- ============================================================================

-- Change existing percentile columns from INTEGER to TEXT (if they exist)
DO $$ 
BEGIN
    -- Check if tmta_tps_pc exists and is INTEGER
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'responses_tmt' 
        AND column_name = 'tmta_tps_pc' 
        AND data_type = 'integer'
    ) THEN
        ALTER TABLE responses_tmt ALTER COLUMN tmta_tps_pc TYPE TEXT;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'responses_tmt' 
        AND column_name = 'tmtb_tps_pc' 
        AND data_type = 'integer'
    ) THEN
        ALTER TABLE responses_tmt ALTER COLUMN tmtb_tps_pc TYPE TEXT;
    END IF;
END $$;

-- Add missing percentile columns to responses_tmt
ALTER TABLE responses_tmt
    ADD COLUMN IF NOT EXISTS tmta_errtot_pc TEXT,
    ADD COLUMN IF NOT EXISTS tmtb_errtot_pc TEXT,
    ADD COLUMN IF NOT EXISTS tmtb_err_persev_pc TEXT,
    ADD COLUMN IF NOT EXISTS tmt_b_a_tps_pc TEXT,
    ADD COLUMN IF NOT EXISTS tmt_b_a_err_pc TEXT;

-- Add missing B-A error difference columns to responses_tmt
ALTER TABLE responses_tmt
    ADD COLUMN IF NOT EXISTS tmt_b_a_err INTEGER,
    ADD COLUMN IF NOT EXISTS tmt_b_a_err_z DECIMAL(5,2);

-- ============================================================================
-- Add comments for clarity
-- ============================================================================

COMMENT ON COLUMN responses_wais3_tmt.tmta_errtot_pc IS 'Percentile for Part A total errors (can be range like "25 - 50" or "> 95")';
COMMENT ON COLUMN responses_wais3_tmt.tmtb_errtot_pc IS 'Percentile for Part B total errors (can be range like "25 - 50" or "> 95")';
COMMENT ON COLUMN responses_wais3_tmt.tmtb_err_persev_pc IS 'Percentile for perseverative errors (can be range like "25 - 50" or "> 95")';
COMMENT ON COLUMN responses_wais3_tmt.tmt_b_a_tps_pc IS 'Percentile for B-A time difference (can be range like "25 - 50" or "> 95")';
COMMENT ON COLUMN responses_wais3_tmt.tmt_b_a_err IS 'Error difference B - A (executive function index)';
COMMENT ON COLUMN responses_wais3_tmt.tmt_b_a_err_z IS 'Z-score for B-A error difference';
COMMENT ON COLUMN responses_wais3_tmt.tmt_b_a_err_pc IS 'Percentile for B-A error difference (can be range like "25 - 50" or "> 95")';

COMMENT ON COLUMN responses_tmt.tmta_errtot_pc IS 'Percentile for Part A total errors (can be range like "25 - 50" or "> 95")';
COMMENT ON COLUMN responses_tmt.tmtb_errtot_pc IS 'Percentile for Part B total errors (can be range like "25 - 50" or "> 95")';
COMMENT ON COLUMN responses_tmt.tmtb_err_persev_pc IS 'Percentile for perseverative errors (can be range like "25 - 50" or "> 95")';
COMMENT ON COLUMN responses_tmt.tmt_b_a_tps_pc IS 'Percentile for B-A time difference (can be range like "25 - 50" or "> 95")';
COMMENT ON COLUMN responses_tmt.tmt_b_a_err IS 'Error difference B - A (executive function index)';
COMMENT ON COLUMN responses_tmt.tmt_b_a_err_z IS 'Z-score for B-A error difference';
COMMENT ON COLUMN responses_tmt.tmt_b_a_err_pc IS 'Percentile for B-A error difference (can be range like "25 - 50" or "> 95")';

