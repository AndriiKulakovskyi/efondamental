-- Rework Alda questionnaire table to match new structure
-- Add screening question (q0) and rename fields (a_score -> qa, b1-b5 -> qb1-qb5)

-- Rename columns to match new naming convention
ALTER TABLE responses_alda
RENAME COLUMN a_score TO qa;

ALTER TABLE responses_alda
RENAME COLUMN b1 TO qb1;

ALTER TABLE responses_alda
RENAME COLUMN b2 TO qb2;

ALTER TABLE responses_alda
RENAME COLUMN b3 TO qb3;

ALTER TABLE responses_alda
RENAME COLUMN b4 TO qb4;

ALTER TABLE responses_alda
RENAME COLUMN b5 TO qb5;

-- Add screening question column
ALTER TABLE responses_alda
ADD COLUMN q0 INTEGER CHECK (q0 IN (0, 1));

-- Update constraints for qa (Criterion A: 0-10)
ALTER TABLE responses_alda
DROP CONSTRAINT IF EXISTS responses_alda_a_score_check;

ALTER TABLE responses_alda
ADD CONSTRAINT qa_check CHECK (qa BETWEEN 0 AND 10);

-- Update constraints for Criterion B items (0-2)
ALTER TABLE responses_alda
DROP CONSTRAINT IF EXISTS responses_alda_b1_check,
DROP CONSTRAINT IF EXISTS responses_alda_b2_check,
DROP CONSTRAINT IF EXISTS responses_alda_b3_check,
DROP CONSTRAINT IF EXISTS responses_alda_b4_check,
DROP CONSTRAINT IF EXISTS responses_alda_b5_check;

ALTER TABLE responses_alda
ADD CONSTRAINT qb1_check CHECK (qb1 BETWEEN 0 AND 2),
ADD CONSTRAINT qb2_check CHECK (qb2 BETWEEN 0 AND 2),
ADD CONSTRAINT qb3_check CHECK (qb3 BETWEEN 0 AND 2),
ADD CONSTRAINT qb4_check CHECK (qb4 BETWEEN 0 AND 2),
ADD CONSTRAINT qb5_check CHECK (qb5 BETWEEN 0 AND 2);

-- Add comments
COMMENT ON COLUMN responses_alda.q0 IS 'Screening: Is patient currently treated with lithium? (0=No, 1=Yes)';
COMMENT ON COLUMN responses_alda.qa IS 'Criterion A: Degree of clinical improvement (0-10)';
COMMENT ON COLUMN responses_alda.qb1 IS 'Criterion B1: Number of episodes before treatment (0-2)';
COMMENT ON COLUMN responses_alda.qb2 IS 'Criterion B2: Frequency of episodes before treatment (0-2)';
COMMENT ON COLUMN responses_alda.qb3 IS 'Criterion B3: Duration of treatment (0-2)';
COMMENT ON COLUMN responses_alda.qb4 IS 'Criterion B4: Compliance during stability period (0-2)';
COMMENT ON COLUMN responses_alda.qb5 IS 'Criterion B5: Use of additional medication (0-2)';

