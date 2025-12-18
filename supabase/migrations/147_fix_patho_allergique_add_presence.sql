-- ============================================================================
-- eFondaMental Platform - Fix Pathologies allergiques et inflammatoires
-- ============================================================================
-- This migration adds the missing q0_presence column for the main presence
-- question in the allergic and inflammatory pathologies questionnaire.
-- ============================================================================

-- Add the presence column
ALTER TABLE responses_patho_allergique
ADD COLUMN IF NOT EXISTS q0_presence TEXT CHECK (q0_presence IN ('yes', 'no', 'unknown'));

-- Add comment
COMMENT ON COLUMN responses_patho_allergique.q0_presence IS 'Main presence question: Pathologies allergiques et inflammatoires (Oui/Non/Ne sais pas)';

