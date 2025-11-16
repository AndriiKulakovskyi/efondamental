# eFondaMental - Database Setup Guide

This guide will help you set up a fresh eFondaMental database from scratch.

## Overview

The complete initialization script (`supabase/migrations/000_complete_init.sql`) creates:

- **Database Schema**: All tables, enums, indexes, triggers, and views
- **Row Level Security**: Simplified RLS policies without recursion issues
- **Seed Data**:
  - 4 Pathologies (Bipolar, Schizophrenia, ASD-Asperger, Depression)
  - 35+ Permissions for RBAC
  - 3 Expert Centers (Paris, Lyon, Marseille)
  - Visit templates and modules for Bipolar disorder
  - Sample questionnaires
- **Initial Users**: Admin, managers, and sample doctors

## Setup Process

### Step 1: Create a New Supabase Project (if needed)

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in project details
4. Wait for the project to be ready

### Step 2: Create Auth Users

Before running the SQL script, create these users in the Supabase Dashboard:

1. Go to **Authentication** > **Users** > **Add User**
2. For each user, select **Create new user** and:
   - Enable **Auto Confirm User**
   - Set the email and password

**Required Users:**

| Email | Password | Role | Purpose |
|-------|----------|------|---------|
| admin@fondamental.fr | Password123! | Admin | Platform administrator |
| manager.paris@fondamental.fr | Password123! | Manager | Paris center manager |
| manager.lyon@fondamental.fr | Password123! | Manager | Lyon center manager |
| doctor.paris@fondamental.fr | Password123! | Doctor | Paris healthcare professional |
| doctor.lyon@fondamental.fr | Password123! | Doctor | Lyon healthcare professional |

**Note:** You can change the passwords to something more secure. Just remember them for login.

### Step 3: Run the Initialization Script

1. In your Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `supabase/migrations/000_complete_init.sql`
4. Paste it into the SQL editor
5. Click **Run** or press `Ctrl/Cmd + Enter`

The script will:
- Create all database tables and structures
- Insert seed data
- Create user profiles for the auth users you created
- Display a success message with verification queries

### Step 4: Verify the Setup

After running the script, you should see verification queries at the bottom showing:

- **CENTERS**: 3 centers (Paris, Lyon, Marseille)
- **PATHOLOGIES**: 4 pathologies with colors
- **USER PROFILES**: All users with their roles and centers
- **PERMISSIONS**: Permission counts by category

If any auth users were not found, you'll see warning messages. Go back to Step 2 and create the missing users.

### Step 5: Test Login

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to http://localhost:3000

3. Try logging in with different accounts:
   - **Admin**: admin@fondamental.fr
   - **Paris Manager**: manager.paris@fondamental.fr
   - **Paris Doctor**: doctor.paris@fondamental.fr

## Initial User Credentials

### Admin Access
- **Email**: admin@fondamental.fr
- **Password**: Password123! (or what you set)
- **Access**: http://localhost:3000/admin
- **Capabilities**: Full system access, manage all centers

### Paris Center
- **Manager**: manager.paris@fondamental.fr
- **Doctor**: doctor.paris@fondamental.fr
- **Access**: http://localhost:3000/manager or /professional/[pathology]
- **Pathologies**: All (Bipolar, Schizophrenia, ASD-Asperger, Depression)

### Lyon Center
- **Manager**: manager.lyon@fondamental.fr
- **Doctor**: doctor.lyon@fondamental.fr
- **Access**: http://localhost:3000/manager or /professional/[pathology]
- **Pathologies**: Bipolar, Schizophrenia

### Marseille Center
- **Manager**: manager.marseille@fondamental.fr (optional - create if needed)
- **Pathologies**: Depression, ASD-Asperger

## What's Included

### Database Tables

**Core Tables:**
- `centers` - Expert Centers
- `pathologies` - Mental health pathologies
- `user_profiles` - User profiles with roles
- `permissions` - RBAC permissions
- `user_permissions` - User-specific permissions
- `user_invitations` - Invitation system

**Clinical Tables:**
- `patients` - Patient records
- `visit_templates` - Visit type definitions
- `modules` - Clinical modules within visits
- `questionnaires` - Clinical questionnaires
- `visits` - Patient visits
- `questionnaire_responses` - Patient responses
- `evaluations` - Clinical evaluations
- `recent_accesses` - Recently viewed patients
- `messages` - Secure messaging

**Audit Tables:**
- `audit_logs` - Complete audit trail
- `login_history` - Login tracking

### Seed Data

**Pathologies:**
- Bipolar Disorder (orange: #F59E0B)
- Schizophrenia (purple: #8B5CF6)
- ASD-Asperger (cyan: #06B6D4)
- Depression (blue: #3B82F6)

**Centers:**
- CEF-PARIS (All pathologies)
- CEF-LYON (Bipolar, Schizophrenia)
- CEF-MARSEILLE (Depression, ASD-Asperger)

**Visit Templates (Bipolar):**
- Screening Visit (4 modules)
- Initial Evaluation (5 modules)
- Biannual Follow-up (4 modules)
- Annual Evaluation (5 modules)
- Off-Schedule Visit

**Permissions:**
- 35+ permissions across 6 categories:
  - Patient Management (5)
  - Clinical (8)
  - Statistics (3)
  - User Management (6)
  - Center Management (5)
  - Audit & Security (4)
  - Communication (2)

## Troubleshooting

### Issue: User profiles not created

**Symptoms:** Can't login, or redirected to error page after login

**Solution:**
1. Check if auth users exist:
   ```sql
   SELECT id, email, confirmed_at FROM auth.users;
   ```

2. Check if profiles exist:
   ```sql
   SELECT id, email, role FROM user_profiles;
   ```

3. If auth user exists but profile doesn't, manually create it:
   ```sql
   INSERT INTO user_profiles (id, role, first_name, last_name, email, username, active)
   SELECT 
     id,
     'administrator',
     'System',
     'Administrator',
     'admin@fondamental.fr',
     'admin',
     true
   FROM auth.users 
   WHERE email = 'admin@fondamental.fr';
   ```

### Issue: RLS recursion error

**Symptoms:** "infinite recursion detected in policy for relation user_profiles"

**Solution:** The new script uses simplified RLS policies that avoid recursion. If you still see this:

1. Drop all user_profiles policies:
   ```sql
   DROP POLICY IF EXISTS user_profiles_own_profile ON user_profiles;
   DROP POLICY IF EXISTS user_profiles_admin_all ON user_profiles;
   DROP POLICY IF EXISTS user_profiles_center_view ON user_profiles;
   DROP POLICY IF EXISTS user_profiles_manager_modify ON user_profiles;
   ```

2. Recreate the simple policies (they're in the init script)

### Issue: Can't see patients or data

**Symptoms:** Empty dashboards, no data visible

**Solution:**
1. Verify your user has a center assigned:
   ```sql
   SELECT id, email, role, center_id FROM user_profiles WHERE email = 'your-email@fondamental.fr';
   ```

2. If center_id is NULL and you're not an admin, update it:
   ```sql
   UPDATE user_profiles 
   SET center_id = (SELECT id FROM centers WHERE code = 'CEF-PARIS')
   WHERE email = 'your-email@fondamental.fr';
   ```

### Issue: Need to add more users

**Solution:** Use the invitation system in the app, or manually:

1. Create auth user in Supabase Dashboard
2. Get the UUID from Authentication > Users
3. Insert profile:
   ```sql
   INSERT INTO user_profiles (id, role, center_id, first_name, last_name, email, username, active)
   SELECT 
     'YOUR-AUTH-UUID-HERE',
     'healthcare_professional',
     c.id,
     'First',
     'Last',
     'email@example.com',
     'username',
     true
   FROM centers c WHERE c.code = 'CEF-PARIS';
   ```

## Next Steps

After successful setup:

1. **Explore the Admin Dashboard**
   - Login as admin
   - View centers, users, statistics

2. **Create Sample Patients**
   - Login as a doctor
   - Navigate to your pathology dashboard
   - Create a test patient

3. **Test the Visit Workflow**
   - Create a visit for a patient
   - Fill out questionnaires
   - Complete evaluations

4. **Invite Additional Users**
   - Use the invitation system to add more staff
   - Managers can invite healthcare professionals
   - Admins can invite managers

5. **Customize for Production**
   - Change default passwords
   - Add your real centers and data
   - Configure email settings in Supabase
   - Set up proper authentication flows

## Important Notes

### Security

- **Change default passwords** in production
- **Enable email verification** for new users
- **Review RLS policies** for your security requirements
- **Enable audit logging** in the application

### Data Isolation

- Centers are strictly isolated via RLS
- Users can only see data from their assigned center
- Admins have access to all centers
- Patients are tied to one center only

### Development vs Production

This script is designed for development and testing. For production:

1. Use environment-specific migrations
2. Don't include test users in production seeds
3. Use strong passwords
4. Enable all Supabase security features
5. Set up proper backup and recovery procedures
6. Review and adjust RLS policies as needed

## Support

If you encounter issues not covered here:

1. Check the application logs
2. Review Supabase logs in the Dashboard
3. Verify RLS policies are not blocking legitimate access
4. Check the individual script files in `scripts/` for troubleshooting queries

