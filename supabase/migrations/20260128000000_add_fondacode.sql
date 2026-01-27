-- Add fondacode column to patients table
ALTER TABLE "public"."patients" ADD COLUMN IF NOT EXISTS "fondacode" character varying(10);

-- Add unique constraint to ensure fondacode uniqueness
ALTER TABLE "public"."patients" ADD CONSTRAINT "patients_fondacode_key" UNIQUE ("fondacode");

-- Create function to generate a random 6-digit suffix
CREATE OR REPLACE FUNCTION generate_fondacode_suffix()
RETURNS TEXT AS $$
BEGIN
  RETURN LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Create function to generate complete fondacode
-- Format: CC (center code) + PP (pathology code) + RRRRRR (random 6 digits)
CREATE OR REPLACE FUNCTION generate_fondacode(
  p_center_id UUID,
  p_pathology_id UUID
)
RETURNS TEXT AS $$
DECLARE
  v_center_code TEXT;
  v_pathology_code TEXT;
  v_suffix TEXT;
  v_fondacode TEXT;
  v_exists BOOLEAN;
  v_attempts INTEGER := 0;
  v_max_attempts INTEGER := 100;
BEGIN
  -- Get center code (should be 2 digits)
  SELECT code INTO v_center_code
  FROM centers
  WHERE id = p_center_id;
  
  IF v_center_code IS NULL THEN
    RAISE EXCEPTION 'Center does not have a code assigned';
  END IF;
  
  -- Ensure center code is exactly 2 characters (pad with 0 if needed)
  v_center_code := LPAD(v_center_code, 2, '0');
  
  -- Get pathology code (should be 2 digits)
  SELECT code INTO v_pathology_code
  FROM pathologies
  WHERE id = p_pathology_id;
  
  IF v_pathology_code IS NULL THEN
    RAISE EXCEPTION 'Pathology does not have a code assigned';
  END IF;
  
  -- Ensure pathology code is exactly 2 characters (pad with 0 if needed)
  v_pathology_code := LPAD(v_pathology_code, 2, '0');
  
  -- Generate unique fondacode with random suffix
  LOOP
    v_suffix := generate_fondacode_suffix();
    v_fondacode := v_center_code || v_pathology_code || v_suffix;
    
    -- Check if this fondacode already exists
    SELECT EXISTS(
      SELECT 1 FROM patients WHERE fondacode = v_fondacode
    ) INTO v_exists;
    
    EXIT WHEN NOT v_exists;
    
    v_attempts := v_attempts + 1;
    IF v_attempts >= v_max_attempts THEN
      RAISE EXCEPTION 'Unable to generate unique fondacode after % attempts', v_max_attempts;
    END IF;
  END LOOP;
  
  RETURN v_fondacode;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function to auto-generate fondacode on patient insert
CREATE OR REPLACE FUNCTION set_patient_fondacode()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.fondacode IS NULL THEN
    NEW.fondacode := generate_fondacode(NEW.center_id, NEW.pathology_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate fondacode before insert
DROP TRIGGER IF EXISTS trigger_set_patient_fondacode ON patients;
CREATE TRIGGER trigger_set_patient_fondacode
  BEFORE INSERT ON patients
  FOR EACH ROW
  EXECUTE FUNCTION set_patient_fondacode();
