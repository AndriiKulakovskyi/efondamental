-- Migration: Add Vitamin D supplementation detail fields
-- Description: Adds product name, date, mode, and dose fields for vitamin D supplementation
-- Date: 2025-12-02

-- Add new fields to the responses_biological_assessment table
ALTER TABLE responses_biological_assessment
ADD COLUMN IF NOT EXISTS vitamin_d_product_name VARCHAR(20) CHECK (vitamin_d_product_name IN ('sterogyl', 'dedrogyl', 'uvedose', 'zymaduo', 'uvesterol', 'zymad', 'autre')),
ADD COLUMN IF NOT EXISTS vitamin_d_supplementation_date DATE,
ADD COLUMN IF NOT EXISTS vitamin_d_supplementation_mode VARCHAR(10) CHECK (vitamin_d_supplementation_mode IN ('ampoule', 'gouttes')),
ADD COLUMN IF NOT EXISTS vitamin_d_supplementation_dose VARCHAR(100);

-- Add comments for documentation
COMMENT ON COLUMN responses_biological_assessment.vitamin_d_product_name IS 'Vitamin D product name: Sterogyl, Dedrogyl, Uvedose, Zymaduo, Uvesterol, Zymad, or Autre';
COMMENT ON COLUMN responses_biological_assessment.vitamin_d_supplementation_date IS 'Date of vitamin D supplementation';
COMMENT ON COLUMN responses_biological_assessment.vitamin_d_supplementation_mode IS 'Mode of supplementation: Ampoule or Gouttes';
COMMENT ON COLUMN responses_biological_assessment.vitamin_d_supplementation_dose IS 'Dose of vitamin D supplementation';

