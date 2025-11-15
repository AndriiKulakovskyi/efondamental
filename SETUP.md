# eFondaMental - Quick Setup Guide

## Fix: "Your project's URL and Key are required" Error

If you're seeing this error, follow these steps:

### Step 1: Verify Your `.env.local` File

Your `.env.local` file should be in the **root directory** of the project (next to `package.json`) and contain:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important Notes:**
- ✅ No quotes around the values
- ✅ No spaces around the `=` sign
- ✅ Replace `xxxxxxxxxxxxx` with your actual project reference
- ✅ Replace the key with your actual **anon public** key from Supabase

### Step 2: Get Your Supabase Credentials

1. Go to your Supabase project: https://supabase.com/dashboard
2. Click on your project
3. Go to **Settings** (gear icon) → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 3: Restart the Development Server

**This is crucial!** Next.js only reads `.env.local` at startup.

```bash
# Stop the current dev server (Ctrl+C)
# Then restart:
npm run dev
```

If using Turbopack (which you are), you might need to clear cache:

```bash
# Stop the server
# Delete the cache
rm -rf .next

# Restart
npm run dev
```

### Step 4: Verify It Works

After restarting, the improved error message will tell you exactly which variable is missing:

```
Missing Supabase environment variables!

Please ensure your .env.local file contains:
NEXT_PUBLIC_SUPABASE_URL=✓ or ✗ MISSING
NEXT_PUBLIC_SUPABASE_ANON_KEY=✓ or ✗ MISSING
```

## Common Issues

### Issue: File exists but still getting error
**Solution**: Restart the dev server. Environment variables are only loaded at startup.

### Issue: Variables show as ✗ MISSING
**Solution**: 
1. Check the file is named exactly `.env.local` (not `.env` or `env.local`)
2. Check the file is in the root directory (same level as `package.json`)
3. Check there are no typos in the variable names
4. Check there are no extra spaces or quotes

### Issue: Using the wrong keys
**Solution**: Make sure you're using:
- ✅ `anon` or `public` key (NOT the `service_role` key)
- ✅ Project URL (NOT the database connection string)

## Complete Setup Checklist

- [ ] Created Supabase project
- [ ] Copied Project URL to `.env.local`
- [ ] Copied anon/public key to `.env.local`
- [ ] File is named exactly `.env.local`
- [ ] File is in root directory (next to `package.json`)
- [ ] No quotes around values
- [ ] No spaces around `=`
- [ ] Restarted dev server with `npm run dev`
- [ ] Ran database migration (`001_initial_schema.sql`)
- [ ] Ran seed data (`seed.sql`)

## Example `.env.local` File

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY5OTk5OTk5OSwiZXhwIjoyMDE1NTc1OTk5fQ.abcdefghijklmnopqrstuvwxyz1234567890
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Still Having Issues?

1. Check the terminal for the detailed error message (it now shows which variable is missing)
2. Verify your Supabase project is active
3. Make sure you're using the correct API keys (from the API settings page)
4. Try creating a fresh `.env.local` file from scratch

## Next Steps After Setup

Once your environment variables are working:

1. **Run Database Migrations**:
   - Open Supabase SQL Editor
   - Run `supabase/migrations/001_initial_schema.sql`
   - Run `supabase/seed.sql`

2. **Create Admin User**:
   - Go to Supabase Authentication
   - Create a new user
   - Add a user profile in the SQL editor

3. **Start Using the Platform**:
   - Login at `http://localhost:3000/auth/login`
   - Use the admin dashboard at `http://localhost:3000/admin`

## Support

For more information:
- See `README.md` for general documentation
- See `DEPLOYMENT.md` for deployment instructions
- See `IMPLEMENTATION.md` for technical details

