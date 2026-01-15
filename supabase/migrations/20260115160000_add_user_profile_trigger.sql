-- Create a function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  default_role public.user_role := 'healthcare_professional';
  meta_role text;
BEGIN
  -- Extract role from metadata if exists
  meta_role := NEW.raw_user_meta_data->>'role';
  
  -- Defensive check for the role enum cast
  IF meta_role IS NOT NULL AND meta_role <> '' THEN
    BEGIN
      -- Use explicit cast with schema to avoid path issues
      default_role := meta_role::public.user_role;
    EXCEPTION WHEN OTHERS THEN
      -- Fallback to default if cast fails
      RAISE WARNING 'Failed to cast role % to user_role, using default', meta_role;
      default_role := 'healthcare_professional';
    END;
  END IF;

  INSERT INTO public.user_profiles (
    id,
    email,
    role,
    first_name,
    last_name,
    active,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    default_role,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    true,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, auth;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
