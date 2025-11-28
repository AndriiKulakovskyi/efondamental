-- ============================================================================
-- eFondaMental Platform - Update Test des Commissions Column Comments
-- ============================================================================
-- This migration updates column comments for documentation purposes only.
-- No schema changes - just documentation to reflect the updated field meanings.
-- ============================================================================

-- Update column comments
COMMENT ON COLUMN responses_test_commissions.nsc IS 'Niveau etude (0: < baccalaureat, 1: >= baccalaureat)';
COMMENT ON COLUMN responses_test_commissions.com01 IS 'Temps de realisation (en minutes)';
COMMENT ON COLUMN responses_test_commissions.com02 IS 'Nombre de detours inutiles';
COMMENT ON COLUMN responses_test_commissions.com03 IS 'Nombre de trajets avec non respect des horaires';
COMMENT ON COLUMN responses_test_commissions.com04 IS 'Nombre d''erreurs logiques';
COMMENT ON COLUMN responses_test_commissions.com05 IS 'Sequence des commissions realisees par le patient';
COMMENT ON COLUMN responses_test_commissions.com01s1 IS 'Percentile pour le temps';
COMMENT ON COLUMN responses_test_commissions.com01s2 IS 'Note z pour le temps';
COMMENT ON COLUMN responses_test_commissions.com02s1 IS 'Percentile pour les detours';
COMMENT ON COLUMN responses_test_commissions.com02s2 IS 'Note z pour les detours';
COMMENT ON COLUMN responses_test_commissions.com03s1 IS 'Percentile pour le non respect des horaires';
COMMENT ON COLUMN responses_test_commissions.com03s2 IS 'Note z pour le non respect des horaires';
COMMENT ON COLUMN responses_test_commissions.com04s1 IS 'Percentile pour les erreurs logiques';
COMMENT ON COLUMN responses_test_commissions.com04s2 IS 'Note z pour les erreurs logiques';
COMMENT ON COLUMN responses_test_commissions.com04s3 IS 'Nombre d''erreurs total (COM02 + COM03 + COM04)';
COMMENT ON COLUMN responses_test_commissions.com04s4 IS 'Percentile pour le total des erreurs';
COMMENT ON COLUMN responses_test_commissions.com04s5 IS 'Note z pour le total des erreurs';

