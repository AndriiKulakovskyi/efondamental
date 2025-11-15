# Setup Scripts

## Quick Start: Initialize Admin and Managers

### Option 1: Manual Setup (Recommended for First Time)

**Step 1: Create Auth Users in Supabase Dashboard**

1. Go to your Supabase project
2. Navigate to **Authentication** > **Users**
3. Click **Add User** and create:
   - **Admin**: `admin@fondamental.fr` (set a strong password)
   - **Paris Manager**: `manager.paris@fondamental.fr`
   - **Lyon Manager**: `manager.lyon@fondamental.fr`
   - **Marseille Manager**: `manager.marseille@fondamental.fr`

**Step 2: Run the Migration and Seed**

In Supabase SQL Editor:
```sql
-- Run the migration first
-- Copy/paste contents of supabase/migrations/001_initial_schema.sql

-- Then run the seed data
-- Copy/paste contents of supabase/seed.sql
```

**Step 3: Create User Profiles**

1. For each user you created, copy their UUID from the dashboard
2. Open `scripts/init-users.sql`
3. Replace the placeholder UUIDs with actual UUIDs
4. Uncomment the INSERT statements
5. Run the script in SQL Editor

**Step 4: Login**

- Go to `http://localhost:3000/auth/login`
- Login with: `admin@fondamental.fr` (or username: `admin`)
- You're now in the admin dashboard!

---

### Option 2: Use the Invitation System (After Admin is Created)

Once you have an admin user:

1. Login as admin
2. Go to `/admin/centers`
3. Click on a center
4. Click "Add Manager"
5. Fill in the invitation form
6. Manager receives email with secure token
7. Manager accepts invitation and sets password

This is the **recommended approach** for creating users after initial setup.

---

## Files in This Directory

- `init-users.sql` - Template for creating initial user profiles
- `README.md` - This file

---

## Environment Variables Needed

Your `.env.local` should contain:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these from: **Supabase Dashboard > Settings > API**

---

## Troubleshooting

### Can't login after creating users?

Make sure you created BOTH:
1. ✅ Auth user (in Supabase Auth dashboard)
2. ✅ User profile (in user_profiles table via SQL)

### Environment variable errors?

1. Check `.env.local` exists in root directory
2. Verify variable names are correct: `NEXT_PUBLIC_SUPABASE_ANON_KEY` (not PUBLISHABLE_KEY)
3. Restart dev server: `npm run dev`

### Database errors?

1. Make sure migration ran successfully
2. Make sure seed data ran successfully
3. Check Supabase logs for errors

---

## Quick Setup Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Clear Next.js cache if needed
rm -rf .next && npm run dev
```

---

## Default Test Accounts (After Setup)

- **Admin**: `admin@fondamental.fr` / your-password
  - Username: `admin`
  - Access: Full platform access
  
- **Paris Manager**: `manager.paris@fondamental.fr` / your-password
  - Username: `manager.paris`
  - Access: Paris center only
  
- **Lyon Manager**: `manager.lyon@fondamental.fr` / your-password
  - Username: `manager.lyon`
  - Access: Lyon center only

---

## Next Steps After User Creation

1. **Login as admin** → Create/manage centers
2. **Invite managers** → Use invitation system
3. **Managers invite professionals** → Build clinical teams
4. **Professionals create patients** → Start clinical work

