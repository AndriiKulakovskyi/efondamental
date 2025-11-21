-- eFondaMental Platform - Fix Amenorrhea Fields in DSM5 Comorbid
-- Change from BOOLEAN to VARCHAR to match questionnaire specification

-- ============================================================================
-- Update Amenorrhea Fields
-- ============================================================================

-- Change anorexia_restrictive_amenorrhea from BOOLEAN to VARCHAR
ALTER TABLE responses_dsm5_comorbid
ALTER COLUMN anorexia_restrictive_amenorrhea TYPE VARCHAR(20) USING 
    CASE 
        WHEN anorexia_restrictive_amenorrhea = true THEN 'oui'
        WHEN anorexia_restrictive_amenorrhea = false THEN 'non'
        ELSE NULL
    END;

-- Add CHECK constraint
ALTER TABLE responses_dsm5_comorbid
ADD CONSTRAINT responses_dsm5_comorbid_anorexia_restrictive_amenorrhea_check 
    CHECK (anorexia_restrictive_amenorrhea IN ('oui', 'non'));

-- Change anorexia_bulimic_amenorrhea from BOOLEAN to VARCHAR  
ALTER TABLE responses_dsm5_comorbid
ALTER COLUMN anorexia_bulimic_amenorrhea TYPE VARCHAR(20) USING 
    CASE 
        WHEN anorexia_bulimic_amenorrhea = true THEN 'oui'
        WHEN anorexia_bulimic_amenorrhea = false THEN 'non'
        ELSE NULL
    END;

-- Add CHECK constraint
ALTER TABLE responses_dsm5_comorbid
ADD CONSTRAINT responses_dsm5_comorbid_anorexia_bulimic_amenorrhea_check 
    CHECK (anorexia_bulimic_amenorrhea IN ('oui', 'non'));

COMMENT ON COLUMN responses_dsm5_comorbid.anorexia_restrictive_amenorrhea IS 'Amenorrhea for restrictive anorexia: oui or non';
COMMENT ON COLUMN responses_dsm5_comorbid.anorexia_bulimic_amenorrhea IS 'Amenorrhea for bulimic anorexia: oui or non';


