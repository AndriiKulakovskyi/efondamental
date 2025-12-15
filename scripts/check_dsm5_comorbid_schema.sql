-- Diagnostic script to check responses_dsm5_comorbid table structure
-- Run this in your Supabase SQL Editor to see what columns actually exist

-- 1. List all columns in the table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'responses_dsm5_comorbid'
ORDER BY ordinal_position;

-- 2. Check specifically for anxiety-related columns
SELECT 
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'responses_dsm5_comorbid'
AND column_name LIKE '%panic%'
OR column_name LIKE '%agoraphobia%'
ORDER BY column_name;

-- 3. Check for eating disorder columns
SELECT 
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'responses_dsm5_comorbid'
AND (column_name LIKE '%eating%' OR column_name LIKE '%anorexia%' OR column_name LIKE '%bulimia%')
ORDER BY column_name;

-- 4. Check for DIVA columns (should be mostly gone except diva_evaluated)
SELECT 
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'responses_dsm5_comorbid'
AND column_name LIKE '%diva%'
ORDER BY column_name;

