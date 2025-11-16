-- ============================================================================
-- eFondaMental Platform - Cleanup Orphaned Data Script
-- ============================================================================
-- Run this script to clean up orphaned records and duplicate data
-- IMPORTANT: Review the SELECT queries first before running DELETE statements
-- ============================================================================

-- ============================================================================
-- 1. FIND ORPHANED AND DUPLICATE DATA
-- ============================================================================

-- Find patients with duplicate MRNs
SELECT 
  medical_record_number, 
  COUNT(*) as count,
  array_agg(id) as patient_ids,
  array_agg(active) as active_statuses,
  array_agg(first_name || ' ' || last_name) as names,
  array_agg(created_at::date) as created_dates
FROM patients
GROUP BY medical_record_number
HAVING COUNT(*) > 1
ORDER BY COUNT(*) DESC;

-- Find pending invitations for inactive patients
SELECT 
  ui.id,
  ui.email,
  ui.created_at,
  ui.expires_at,
  p.first_name,
  p.last_name,
  p.active as patient_active
FROM user_invitations ui
JOIN patients p ON ui.patient_id = p.id
WHERE p.active = false
AND ui.status = 'pending';

-- Find user accounts linked to inactive patients
SELECT 
  up.id as user_id,
  up.email,
  up.first_name,
  up.last_name,
  p.id as patient_id,
  p.active as patient_active,
  up.active as user_active
FROM user_profiles up
JOIN patients p ON p.user_id = up.id
WHERE p.active = false;

-- ============================================================================
-- 2. CANCEL ORPHANED INVITATIONS
-- ============================================================================

-- Cancel pending invitations for inactive patients
UPDATE user_invitations
SET status = 'expired'
WHERE patient_id IN (
  SELECT id FROM patients WHERE active = false
)
AND status = 'pending';

-- Log results
DO $$
DECLARE
  updated_count INT;
BEGIN
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RAISE NOTICE 'Cancelled % orphaned invitations', updated_count;
END $$;

-- ============================================================================
-- 3. CLEAN UP TEST DATA
-- ============================================================================

-- CAUTION: Review before running - this will permanently delete test data
-- Uncomment the DELETE statements after reviewing

-- Find test patients (preview)
SELECT 
  id,
  medical_record_number,
  first_name,
  last_name,
  active,
  created_at
FROM patients
WHERE medical_record_number LIKE 'MRN-TEST%'
OR medical_record_number LIKE 'MRN-BIPOLAR-TEST%'
OR medical_record_number LIKE 'TEST-%'
ORDER BY created_at DESC;

-- Delete inactive test patients (UNCOMMENT TO EXECUTE)
/*
DELETE FROM patients
WHERE (
  medical_record_number LIKE 'MRN-TEST%'
  OR medical_record_number LIKE 'MRN-BIPOLAR-TEST%'
  OR medical_record_number LIKE 'TEST-%'
)
AND active = false;

DO $$
DECLARE
  deleted_count INT;
BEGIN
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RAISE NOTICE 'Deleted % test patient records', deleted_count;
END $$;
*/

-- ============================================================================
-- 4. HANDLE DUPLICATE MRNS (For inactive patients)
-- ============================================================================

-- Strategy: Keep the most recent inactive patient, delete older duplicates
-- CAUTION: This is destructive - review carefully before running

-- Preview: Older inactive duplicates that will be deleted
WITH duplicates AS (
  SELECT 
    medical_record_number,
    id,
    active,
    created_at,
    ROW_NUMBER() OVER (
      PARTITION BY medical_record_number 
      ORDER BY created_at DESC
    ) as rn
  FROM patients
  WHERE active = false
)
SELECT 
  medical_record_number,
  id,
  created_at,
  'WILL BE DELETED' as action
FROM duplicates
WHERE rn > 1
ORDER BY medical_record_number, created_at;

-- Delete older inactive duplicates (UNCOMMENT TO EXECUTE)
/*
WITH duplicates AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (
      PARTITION BY medical_record_number 
      ORDER BY created_at DESC
    ) as rn
  FROM patients
  WHERE active = false
)
DELETE FROM patients
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);

DO $$
DECLARE
  deleted_count INT;
BEGIN
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RAISE NOTICE 'Deleted % duplicate inactive patient records', deleted_count;
END $$;
*/

-- ============================================================================
-- 5. VERIFICATION QUERIES
-- ============================================================================

-- Verify no duplicate MRNs for active patients
SELECT 
  medical_record_number,
  COUNT(*) as count
FROM patients
WHERE active = true
GROUP BY medical_record_number
HAVING COUNT(*) > 1;
-- Should return 0 rows

-- Count inactive patients per MRN
SELECT 
  medical_record_number,
  COUNT(*) as inactive_count
FROM patients
WHERE active = false
GROUP BY medical_record_number
HAVING COUNT(*) > 1
ORDER BY COUNT(*) DESC;

-- Summary statistics
SELECT 
  active,
  COUNT(*) as patient_count,
  COUNT(DISTINCT medical_record_number) as unique_mrns
FROM patients
GROUP BY active;

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Cleanup script review completed';
  RAISE NOTICE 'Review the SELECT query results above';
  RAISE NOTICE 'Uncomment DELETE statements to execute cleanup';
  RAISE NOTICE '========================================';
END $$;

