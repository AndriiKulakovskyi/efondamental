-- Add subscale score columns to CTI (Circadian Type Inventory) table
-- CTI has two subscales:
-- - Flexibility/Rigidity: items 2, 4, 6, 8, 10 (range 5-25)
-- - Languid/Vigorous: items 1, 3, 5, 7, 9, 11 (range 6-30)

-- Add flexibility_score column
ALTER TABLE responses_cti 
ADD COLUMN IF NOT EXISTS flexibility_score INTEGER;

-- Add languid_score column
ALTER TABLE responses_cti 
ADD COLUMN IF NOT EXISTS languid_score INTEGER;

-- Add comments for documentation
COMMENT ON COLUMN responses_cti.flexibility_score IS 'Flexibility/Rigidity subscale score (items 2,4,6,8,10). Range: 5-25. Higher = more flexible.';
COMMENT ON COLUMN responses_cti.languid_score IS 'Languid/Vigorous subscale score (items 1,3,5,7,9,11). Range: 6-30. Higher = more languid.';

