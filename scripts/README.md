# Scripts Directory

## Notice: Setup Scripts Consolidated

All SQL setup scripts have been consolidated into a single comprehensive initialization file.

**For database setup, please refer to:**

📄 **Main Setup File**: `supabase/migrations/000_complete_init.sql`

📚 **Documentation**: `DATABASE_SETUP.md` - Comprehensive setup guide with troubleshooting

## Quick Setup

### Step 1: Create Auth Users in Supabase Dashboard
**Authentication > Users > Add User** (Enable Auto Confirm)

```
admin@fondamental.fr
manager.paris@fondamental.fr
manager.lyon@fondamental.fr
doctor.paris@fondamental.fr
doctor.lyon@fondamental.fr
```

All with password: `Password123!` (change in production)

### Step 2: Run Initialization Script
**SQL Editor > New Query**

Copy and run the entire contents of: `supabase/migrations/000_complete_init.sql`

### Step 3: Login and Use
Visit http://localhost:3000 and login with any user.

---

## What Happened to the Old Scripts?

The following scripts were removed as their functionality is now integrated into `000_complete_init.sql`:

- ❌ `init-users.sql` - User creation now in main script
- ❌ `fix-rls-complete.sql` - RLS fixes applied in main script
- ❌ `fix-rls-policies.sql` - RLS fixes applied in main script
- ❌ `create-admin-profile-manual.sql` - Functionality in main script
- ❌ `diagnose-auth-issue.sql` - Troubleshooting info in documentation

The consolidated script provides:
- ✅ Complete database schema
- ✅ All seed data
- ✅ User profile creation
- ✅ Fixed RLS policies (no recursion)
- ✅ Automatic verification
- ✅ Better error handling

---

For detailed instructions, see **`DATABASE_SETUP.md`** in the project root.
