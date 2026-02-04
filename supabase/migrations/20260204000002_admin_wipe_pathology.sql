-- Admin-only wipe of clinical data by pathology (all centers)
-- Hard-deletes patients, cascading visits and questionnaire responses.
-- Also returns linked patient auth user IDs for API to delete.

CREATE OR REPLACE FUNCTION public.admin_wipe_pathology_preview(p_pathology_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_admin boolean;
  patients_count integer;
  visits_count integer;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM public.user_profiles up
    WHERE up.id = auth.uid()
      AND up.role = 'administrator'
      AND up.active = true
  )
  INTO is_admin;

  IF NOT is_admin THEN
    RAISE EXCEPTION 'Access denied - Admin only';
  END IF;

  SELECT COUNT(*)
  INTO patients_count
  FROM public.patients p
  WHERE p.pathology_id = p_pathology_id;

  SELECT COUNT(*)
  INTO visits_count
  FROM public.visits v
  JOIN public.patients p ON p.id = v.patient_id
  WHERE p.pathology_id = p_pathology_id;

  RETURN jsonb_build_object(
    'pathology_id', p_pathology_id,
    'patients', patients_count,
    'visits', visits_count
  );
END;
$$;

REVOKE ALL ON FUNCTION public.admin_wipe_pathology_preview(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_wipe_pathology_preview(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_wipe_pathology(p_pathology_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_admin boolean;
  patients_count integer;
  visits_count integer;
  patient_user_ids uuid[];
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM public.user_profiles up
    WHERE up.id = auth.uid()
      AND up.role = 'administrator'
      AND up.active = true
  )
  INTO is_admin;

  IF NOT is_admin THEN
    RAISE EXCEPTION 'Access denied - Admin only';
  END IF;

  -- Capture counts before delete
  SELECT COUNT(*)
  INTO patients_count
  FROM public.patients p
  WHERE p.pathology_id = p_pathology_id;

  SELECT COUNT(*)
  INTO visits_count
  FROM public.visits v
  JOIN public.patients p ON p.id = v.patient_id
  WHERE p.pathology_id = p_pathology_id;

  -- Capture linked auth users (patient portal accounts)
  SELECT ARRAY_AGG(DISTINCT p.user_id) FILTER (WHERE p.user_id IS NOT NULL)
  INTO patient_user_ids
  FROM public.patients p
  WHERE p.pathology_id = p_pathology_id;

  -- Hard delete patients; visits + responses are deleted via ON DELETE CASCADE FKs
  DELETE FROM public.patients p
  WHERE p.pathology_id = p_pathology_id;

  RETURN jsonb_build_object(
    'pathology_id', p_pathology_id,
    'patients_deleted', patients_count,
    'visits_deleted', visits_count,
    'patient_user_ids', COALESCE(to_jsonb(patient_user_ids), '[]'::jsonb)
  );
END;
$$;

REVOKE ALL ON FUNCTION public.admin_wipe_pathology(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_wipe_pathology(uuid) TO authenticated;

