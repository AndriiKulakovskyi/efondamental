-- Migration: Add CRP, Glycemie, Hemoglobine Glyquee, and Rapport Total/HDL fields to Biological Assessment
-- Description: Adds CRP, Glycémie à jeûn with unit selection, Hémoglobine glyquée, and computed Rapport Total/HDL
-- Date: 2025-12-02

-- Add new fields to the responses_biological_assessment table
ALTER TABLE responses_biological_assessment
ADD COLUMN IF NOT EXISTS crp DECIMAL(5,2) CHECK (crp >= 0 AND crp <= 50), -- mg/L
ADD COLUMN IF NOT EXISTS glycemie_a_jeun DECIMAL(5,2) CHECK (glycemie_a_jeun >= 0 AND glycemie_a_jeun <= 50),
ADD COLUMN IF NOT EXISTS glycemie_a_jeun_unit VARCHAR(10) CHECK (glycemie_a_jeun_unit IN ('mmol_L', 'g_L')),
ADD COLUMN IF NOT EXISTS hemoglobine_glyquee DECIMAL(5,2) CHECK (hemoglobine_glyquee >= 0 AND hemoglobine_glyquee <= 50), -- %
ADD COLUMN IF NOT EXISTS rapport_total_hdl DECIMAL(5,2); -- Computed: cholesterol_total / hdl

-- Add comments for documentation
COMMENT ON COLUMN responses_biological_assessment.crp IS 'C-Reactive Protein in mg/L (range: 0-50)';
COMMENT ON COLUMN responses_biological_assessment.glycemie_a_jeun IS 'Fasting blood glucose (Glycémie à jeûn). Value between 0 and 50. Unit specified in glycemie_a_jeun_unit';
COMMENT ON COLUMN responses_biological_assessment.glycemie_a_jeun_unit IS 'Unit for Glycémie à jeûn: mmol/L or g/L';
COMMENT ON COLUMN responses_biological_assessment.hemoglobine_glyquee IS 'Glycated hemoglobin (HbA1c) in % (range: 0-50). Shown when Glycémie à jeûn > 7 mmol/L or > 1.26 g/L';
COMMENT ON COLUMN responses_biological_assessment.rapport_total_hdl IS 'Computed ratio: Cholestérol total / Cholestérol HDL';

