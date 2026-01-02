-- Fix AQ-12 check constraints
-- The questionnaire uses a 1-6 scale, not 1-4

-- Drop the old constraints and add new ones with correct range (1-6)
ALTER TABLE responses_aq12 DROP CONSTRAINT IF EXISTS responses_aq12_q1_check;
ALTER TABLE responses_aq12 DROP CONSTRAINT IF EXISTS responses_aq12_q2_check;
ALTER TABLE responses_aq12 DROP CONSTRAINT IF EXISTS responses_aq12_q3_check;
ALTER TABLE responses_aq12 DROP CONSTRAINT IF EXISTS responses_aq12_q4_check;
ALTER TABLE responses_aq12 DROP CONSTRAINT IF EXISTS responses_aq12_q5_check;
ALTER TABLE responses_aq12 DROP CONSTRAINT IF EXISTS responses_aq12_q6_check;
ALTER TABLE responses_aq12 DROP CONSTRAINT IF EXISTS responses_aq12_q7_check;
ALTER TABLE responses_aq12 DROP CONSTRAINT IF EXISTS responses_aq12_q8_check;
ALTER TABLE responses_aq12 DROP CONSTRAINT IF EXISTS responses_aq12_q9_check;
ALTER TABLE responses_aq12 DROP CONSTRAINT IF EXISTS responses_aq12_q10_check;
ALTER TABLE responses_aq12 DROP CONSTRAINT IF EXISTS responses_aq12_q11_check;
ALTER TABLE responses_aq12 DROP CONSTRAINT IF EXISTS responses_aq12_q12_check;

-- Add new constraints with 1-6 range
ALTER TABLE responses_aq12 ADD CONSTRAINT responses_aq12_q1_check CHECK (q1 BETWEEN 1 AND 6);
ALTER TABLE responses_aq12 ADD CONSTRAINT responses_aq12_q2_check CHECK (q2 BETWEEN 1 AND 6);
ALTER TABLE responses_aq12 ADD CONSTRAINT responses_aq12_q3_check CHECK (q3 BETWEEN 1 AND 6);
ALTER TABLE responses_aq12 ADD CONSTRAINT responses_aq12_q4_check CHECK (q4 BETWEEN 1 AND 6);
ALTER TABLE responses_aq12 ADD CONSTRAINT responses_aq12_q5_check CHECK (q5 BETWEEN 1 AND 6);
ALTER TABLE responses_aq12 ADD CONSTRAINT responses_aq12_q6_check CHECK (q6 BETWEEN 1 AND 6);
ALTER TABLE responses_aq12 ADD CONSTRAINT responses_aq12_q7_check CHECK (q7 BETWEEN 1 AND 6);
ALTER TABLE responses_aq12 ADD CONSTRAINT responses_aq12_q8_check CHECK (q8 BETWEEN 1 AND 6);
ALTER TABLE responses_aq12 ADD CONSTRAINT responses_aq12_q9_check CHECK (q9 BETWEEN 1 AND 6);
ALTER TABLE responses_aq12 ADD CONSTRAINT responses_aq12_q10_check CHECK (q10 BETWEEN 1 AND 6);
ALTER TABLE responses_aq12 ADD CONSTRAINT responses_aq12_q11_check CHECK (q11 BETWEEN 1 AND 6);
ALTER TABLE responses_aq12 ADD CONSTRAINT responses_aq12_q12_check CHECK (q12 BETWEEN 1 AND 6);

