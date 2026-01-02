-- ============================================================================
-- Update SCIP Maximum Values and Constraints
-- ============================================================================
-- Updates CHECK constraints and comments to reflect the correct maximum
-- values for each SCIP subtest based on the official scoring:
-- VLT-I: 0-30, WMT: 0-30, VFT: 0-24, VLT-D: 0-10, PST: 0-18
-- ============================================================================

-- Drop old CHECK constraints
ALTER TABLE responses_scip DROP CONSTRAINT IF EXISTS responses_scip_scipv01a_check;
ALTER TABLE responses_scip DROP CONSTRAINT IF EXISTS responses_scip_scipv02a_check;
ALTER TABLE responses_scip DROP CONSTRAINT IF EXISTS responses_scip_scipv03a_check;
ALTER TABLE responses_scip DROP CONSTRAINT IF EXISTS responses_scip_scipv04a_check;
ALTER TABLE responses_scip DROP CONSTRAINT IF EXISTS responses_scip_scipv05a_check;

-- Add new CHECK constraints with correct maximum values
ALTER TABLE responses_scip ADD CONSTRAINT responses_scip_scipv01a_check 
  CHECK (scipv01a >= 0 AND scipv01a <= 30); -- VLT-I: 0-30

ALTER TABLE responses_scip ADD CONSTRAINT responses_scip_scipv02a_check 
  CHECK (scipv02a >= 0 AND scipv02a <= 30); -- WMT: 0-30

ALTER TABLE responses_scip ADD CONSTRAINT responses_scip_scipv03a_check 
  CHECK (scipv03a >= 0 AND scipv03a <= 24); -- VFT: 0-24

ALTER TABLE responses_scip ADD CONSTRAINT responses_scip_scipv04a_check 
  CHECK (scipv04a >= 0 AND scipv04a <= 10); -- VLT-D: 0-10

ALTER TABLE responses_scip ADD CONSTRAINT responses_scip_scipv05a_check 
  CHECK (scipv05a >= 0 AND scipv05a <= 18); -- PST: 0-18

-- Update column comments with correct ranges
COMMENT ON COLUMN responses_scip.scipv01a IS 'Verbal Learning Test - Immediate (VLT-I) - Score saisi (0-30)';
COMMENT ON COLUMN responses_scip.scipv01b IS 'Verbal Learning Test - Immediate (VLT-I) - Z-score: (score - 23.59) / 2.87';
COMMENT ON COLUMN responses_scip.scipv02a IS 'Working Memory Test (WMT) - Score saisi (0-30)';
COMMENT ON COLUMN responses_scip.scipv02b IS 'Working Memory Test (WMT) - Z-score: (score - 20.66) / 2.45';
COMMENT ON COLUMN responses_scip.scipv03a IS 'Verbal Fluency Test (VFT) - Score saisi (0-24)';
COMMENT ON COLUMN responses_scip.scipv03b IS 'Verbal Fluency Test (VFT) - Z-score: (score - 17.44) / 4.74';
COMMENT ON COLUMN responses_scip.scipv04a IS 'Verbal Learning Test - Delayed (VLT-D) - Score saisi (0-10)';
COMMENT ON COLUMN responses_scip.scipv04b IS 'Verbal Learning Test - Delayed (VLT-D) - Z-score: (score - 7.65) / 1.90';
COMMENT ON COLUMN responses_scip.scipv05a IS 'Processing Speed Test (PST) - Score saisi (0-18)';
COMMENT ON COLUMN responses_scip.scipv05b IS 'Processing Speed Test (PST) - Z-score: (score - 14.26) / 2.25';

