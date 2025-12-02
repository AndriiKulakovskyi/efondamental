-- Migration: Rename bilirubine_unit to bilirubine_totale_unit
-- Description: Renames the column to follow the naming convention for unit fields (base_field_unit)
-- Date: 2025-12-02

-- Rename the column
ALTER TABLE responses_biological_assessment
RENAME COLUMN bilirubine_unit TO bilirubine_totale_unit;

-- Update comment
COMMENT ON COLUMN responses_biological_assessment.bilirubine_totale_unit IS 'Unit for Bilirubine totale: µmol/L, mmol/L, or mg/L';

