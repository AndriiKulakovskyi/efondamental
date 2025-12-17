-- eFondaMental Platform - C-SSRS Boolean to Integer Migration
-- Converts boolean columns to integer for single_choice compatibility
-- This allows the questionnaire to use single_choice (radio buttons) instead of checkboxes

-- ============================================================================
-- Convert BOOLEAN columns to INTEGER in responses_cssrs
-- ============================================================================

-- q1_wish_dead: BOOLEAN -> INTEGER
ALTER TABLE responses_cssrs 
ALTER COLUMN q1_wish_dead TYPE INTEGER 
USING CASE WHEN q1_wish_dead = true THEN 1 WHEN q1_wish_dead = false THEN 0 ELSE NULL END;

ALTER TABLE responses_cssrs
ADD CONSTRAINT responses_cssrs_q1_wish_dead_check CHECK (q1_wish_dead IN (0, 1));

-- q2_non_specific: BOOLEAN -> INTEGER
ALTER TABLE responses_cssrs 
ALTER COLUMN q2_non_specific TYPE INTEGER 
USING CASE WHEN q2_non_specific = true THEN 1 WHEN q2_non_specific = false THEN 0 ELSE NULL END;

ALTER TABLE responses_cssrs
ADD CONSTRAINT responses_cssrs_q2_non_specific_check CHECK (q2_non_specific IN (0, 1));

-- q3_method_no_intent: BOOLEAN -> INTEGER
ALTER TABLE responses_cssrs 
ALTER COLUMN q3_method_no_intent TYPE INTEGER 
USING CASE WHEN q3_method_no_intent = true THEN 1 WHEN q3_method_no_intent = false THEN 0 ELSE NULL END;

ALTER TABLE responses_cssrs
ADD CONSTRAINT responses_cssrs_q3_method_no_intent_check CHECK (q3_method_no_intent IN (0, 1));

-- q4_intent_no_plan: BOOLEAN -> INTEGER
ALTER TABLE responses_cssrs 
ALTER COLUMN q4_intent_no_plan TYPE INTEGER 
USING CASE WHEN q4_intent_no_plan = true THEN 1 WHEN q4_intent_no_plan = false THEN 0 ELSE NULL END;

ALTER TABLE responses_cssrs
ADD CONSTRAINT responses_cssrs_q4_intent_no_plan_check CHECK (q4_intent_no_plan IN (0, 1));

-- q5_plan_intent: BOOLEAN -> INTEGER
ALTER TABLE responses_cssrs 
ALTER COLUMN q5_plan_intent TYPE INTEGER 
USING CASE WHEN q5_plan_intent = true THEN 1 WHEN q5_plan_intent = false THEN 0 ELSE NULL END;

ALTER TABLE responses_cssrs
ADD CONSTRAINT responses_cssrs_q5_plan_intent_check CHECK (q5_plan_intent IN (0, 1));

-- ============================================================================
-- Update column comments
-- ============================================================================

COMMENT ON COLUMN responses_cssrs.q1_wish_dead IS 'Wish to be dead (0=No, 1=Yes)';
COMMENT ON COLUMN responses_cssrs.q2_non_specific IS 'Non-specific active suicidal thoughts (0=No, 1=Yes)';
COMMENT ON COLUMN responses_cssrs.q3_method_no_intent IS 'Active suicidal ideation with methods without intent (0=No, 1=Yes)';
COMMENT ON COLUMN responses_cssrs.q4_intent_no_plan IS 'Active suicidal ideation with intent without specific plan (0=No, 1=Yes)';
COMMENT ON COLUMN responses_cssrs.q5_plan_intent IS 'Active suicidal ideation with specific plan and intent (0=No, 1=Yes)';

