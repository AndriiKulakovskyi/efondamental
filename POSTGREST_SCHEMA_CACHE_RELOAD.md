# PostgREST Schema Cache Reload Required

## Problem

After running the migration `112_fix_mdq_scoring_columns.sql`, the errors persist because **PostgREST (Supabase's API layer) has cached the old database schema**.

The errors show:
- First: "Could not find the 'interpretation' column" 
- Then: "Could not find the 'total_score' column"

This is because PostgREST's cache is stale and doesn't know about the new columns.

---

## Solution: Reload PostgREST Schema Cache

### Method 1: Supabase Dashboard (Recommended)

1. **Go to your Supabase Project Dashboard**
2. **Navigate to: Project Settings → API**
3. **Look for "Schema Cache" or "Reload schema cache" button**
4. **Click "Reload Schema Cache"** or **"Restart API"**

If you don't see this option:

### Method 2: SQL Command

Run this SQL command in your Supabase SQL Editor:

```sql
NOTIFY pgrst, 'reload schema';
```

### Method 3: Restart Supabase Project

If the above doesn't work:

1. Go to Project Settings → General
2. Find the option to "Pause project" or "Restart project"
3. Pause the project, wait a few seconds, then resume it
4. This forces a complete reload of the API layer

### Method 4: Using Supabase CLI (if running locally)

```bash
# Restart the PostgREST service
npx supabase stop
npx supabase start
```

---

## Verification

After reloading the schema cache:

1. Try submitting the MDQ questionnaire again
2. The error should be resolved
3. The questionnaire should save successfully with the correct scoring

---

## Why This Happens

PostgREST caches the database schema for performance. When you run migrations that alter table structures (add/remove columns), PostgREST doesn't automatically detect these changes. You must manually reload the schema cache to make PostgREST aware of the new schema.

This is a known behavior of PostgREST/Supabase and is documented in their official documentation.
