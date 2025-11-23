-- eFondaMental Platform - Fix YMRS Constraints
-- Updates constraints for YMRS to ensure only specific values are allowed for items 5, 6, 8, 9

-- ============================================================================
-- YMRS (Young Mania Rating Scale) - Constraint Updates
-- ============================================================================

-- Drop existing constraints for q5, q6, q8, q9
ALTER TABLE responses_ymrs DROP CONSTRAINT IF EXISTS responses_ymrs_q5_check;
ALTER TABLE responses_ymrs DROP CONSTRAINT IF EXISTS responses_ymrs_q6_check;
ALTER TABLE responses_ymrs DROP CONSTRAINT IF EXISTS responses_ymrs_q8_check;
ALTER TABLE responses_ymrs DROP CONSTRAINT IF EXISTS responses_ymrs_q9_check;

-- Add new constraints that allow only specific values
-- Q5 (Irritabilité): 0, 2, 4, 6, 8
ALTER TABLE responses_ymrs ADD CONSTRAINT responses_ymrs_q5_check 
    CHECK (q5 IS NULL OR q5 IN (0, 2, 4, 6, 8));

-- Q6 (Discours): 0, 2, 4, 6, 8
ALTER TABLE responses_ymrs ADD CONSTRAINT responses_ymrs_q6_check 
    CHECK (q6 IS NULL OR q6 IN (0, 2, 4, 6, 8));

-- Q8 (Contenu): 0, 2, 4, 6, 8
ALTER TABLE responses_ymrs ADD CONSTRAINT responses_ymrs_q8_check 
    CHECK (q8 IS NULL OR q8 IN (0, 2, 4, 6, 8));

-- Q9 (Comportement agressif): 0, 2, 4, 6, 8
ALTER TABLE responses_ymrs ADD CONSTRAINT responses_ymrs_q9_check 
    CHECK (q9 IS NULL OR q9 IN (0, 2, 4, 6, 8));

