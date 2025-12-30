-- ============================================================================
-- eFondaMental Platform - Update Fluences Verbales Tables
-- ============================================================================
-- This migration adds missing fields (perseverations, clusters, switches)
-- and changes percentile columns from INTEGER to TEXT to support ranges
-- Applied to both responses_fluences_verbales and responses_wais3_fluences_verbales
-- ============================================================================

-- ============================================================================
-- responses_fluences_verbales: Add missing fields
-- ============================================================================

-- Add missing Letter P fields
ALTER TABLE responses_fluences_verbales
    ADD COLUMN IF NOT EXISTS fv_p_persev INTEGER CHECK (fv_p_persev IS NULL OR fv_p_persev >= 0),
    ADD COLUMN IF NOT EXISTS fv_p_cluster_tot INTEGER CHECK (fv_p_cluster_tot IS NULL OR fv_p_cluster_tot >= 0),
    ADD COLUMN IF NOT EXISTS fv_p_cluster_taille DECIMAL(5,2) CHECK (fv_p_cluster_taille IS NULL OR fv_p_cluster_taille >= 0),
    ADD COLUMN IF NOT EXISTS fv_p_switch_tot INTEGER CHECK (fv_p_switch_tot IS NULL OR fv_p_switch_tot >= 0);

-- Add missing Animal category fields
ALTER TABLE responses_fluences_verbales
    ADD COLUMN IF NOT EXISTS fv_anim_persev INTEGER CHECK (fv_anim_persev IS NULL OR fv_anim_persev >= 0),
    ADD COLUMN IF NOT EXISTS fv_anim_cluster_tot INTEGER CHECK (fv_anim_cluster_tot IS NULL OR fv_anim_cluster_tot >= 0),
    ADD COLUMN IF NOT EXISTS fv_anim_cluster_taille DECIMAL(5,2) CHECK (fv_anim_cluster_taille IS NULL OR fv_anim_cluster_taille >= 0),
    ADD COLUMN IF NOT EXISTS fv_anim_switch_tot INTEGER CHECK (fv_anim_switch_tot IS NULL OR fv_anim_switch_tot >= 0);

-- Change percentile columns from INTEGER to TEXT (to support ranges like "25 - 50")
ALTER TABLE responses_fluences_verbales
    ALTER COLUMN fv_p_tot_correct_pc TYPE TEXT,
    ALTER COLUMN fv_anim_tot_correct_pc TYPE TEXT;

-- ============================================================================
-- responses_wais3_fluences_verbales: Add missing fields
-- ============================================================================

-- Add missing Letter P fields
ALTER TABLE responses_wais3_fluences_verbales
    ADD COLUMN IF NOT EXISTS fv_p_persev INTEGER CHECK (fv_p_persev IS NULL OR fv_p_persev >= 0),
    ADD COLUMN IF NOT EXISTS fv_p_cluster_tot INTEGER CHECK (fv_p_cluster_tot IS NULL OR fv_p_cluster_tot >= 0),
    ADD COLUMN IF NOT EXISTS fv_p_cluster_taille DECIMAL(5,2) CHECK (fv_p_cluster_taille IS NULL OR fv_p_cluster_taille >= 0),
    ADD COLUMN IF NOT EXISTS fv_p_switch_tot INTEGER CHECK (fv_p_switch_tot IS NULL OR fv_p_switch_tot >= 0);

-- Add missing Animal category fields
ALTER TABLE responses_wais3_fluences_verbales
    ADD COLUMN IF NOT EXISTS fv_anim_persev INTEGER CHECK (fv_anim_persev IS NULL OR fv_anim_persev >= 0),
    ADD COLUMN IF NOT EXISTS fv_anim_cluster_tot INTEGER CHECK (fv_anim_cluster_tot IS NULL OR fv_anim_cluster_tot >= 0),
    ADD COLUMN IF NOT EXISTS fv_anim_cluster_taille DECIMAL(5,2) CHECK (fv_anim_cluster_taille IS NULL OR fv_anim_cluster_taille >= 0),
    ADD COLUMN IF NOT EXISTS fv_anim_switch_tot INTEGER CHECK (fv_anim_switch_tot IS NULL OR fv_anim_switch_tot >= 0);

-- Change percentile columns from INTEGER to TEXT
ALTER TABLE responses_wais3_fluences_verbales
    ALTER COLUMN fv_p_tot_correct_pc TYPE TEXT,
    ALTER COLUMN fv_anim_tot_correct_pc TYPE TEXT;

-- ============================================================================
-- Add comments for documentation
-- ============================================================================

COMMENT ON COLUMN responses_fluences_verbales.fv_p_persev IS 'Perseverations for letter P';
COMMENT ON COLUMN responses_fluences_verbales.fv_p_cluster_tot IS 'Number of clusters for letter P';
COMMENT ON COLUMN responses_fluences_verbales.fv_p_cluster_taille IS 'Average cluster size for letter P (decimal)';
COMMENT ON COLUMN responses_fluences_verbales.fv_p_switch_tot IS 'Number of switches for letter P';
COMMENT ON COLUMN responses_fluences_verbales.fv_anim_persev IS 'Perseverations for animal category';
COMMENT ON COLUMN responses_fluences_verbales.fv_anim_cluster_tot IS 'Number of clusters for animal category';
COMMENT ON COLUMN responses_fluences_verbales.fv_anim_cluster_taille IS 'Average cluster size for animal category (decimal)';
COMMENT ON COLUMN responses_fluences_verbales.fv_anim_switch_tot IS 'Number of switches for animal category';
COMMENT ON COLUMN responses_fluences_verbales.fv_p_tot_correct_pc IS 'Percentile for letter P (can be range like "25 - 50" or boundary like "> 95")';
COMMENT ON COLUMN responses_fluences_verbales.fv_anim_tot_correct_pc IS 'Percentile for animal category (can be range like "25 - 50" or boundary like "> 95")';

COMMENT ON COLUMN responses_wais3_fluences_verbales.fv_p_persev IS 'Perseverations for letter P';
COMMENT ON COLUMN responses_wais3_fluences_verbales.fv_p_cluster_tot IS 'Number of clusters for letter P';
COMMENT ON COLUMN responses_wais3_fluences_verbales.fv_p_cluster_taille IS 'Average cluster size for letter P (decimal)';
COMMENT ON COLUMN responses_wais3_fluences_verbales.fv_p_switch_tot IS 'Number of switches for letter P';
COMMENT ON COLUMN responses_wais3_fluences_verbales.fv_anim_persev IS 'Perseverations for animal category';
COMMENT ON COLUMN responses_wais3_fluences_verbales.fv_anim_cluster_tot IS 'Number of clusters for animal category';
COMMENT ON COLUMN responses_wais3_fluences_verbales.fv_anim_cluster_taille IS 'Average cluster size for animal category (decimal)';
COMMENT ON COLUMN responses_wais3_fluences_verbales.fv_anim_switch_tot IS 'Number of switches for animal category';
COMMENT ON COLUMN responses_wais3_fluences_verbales.fv_p_tot_correct_pc IS 'Percentile for letter P (can be range like "25 - 50" or boundary like "> 95")';
COMMENT ON COLUMN responses_wais3_fluences_verbales.fv_anim_tot_correct_pc IS 'Percentile for animal category (can be range like "25 - 50" or boundary like "> 95")';

