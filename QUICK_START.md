# eFondaMental - Quick Start Guide

## ⚡ 5-Minute Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env.local` in the root directory:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Set Up Database

**In Supabase SQL Editor**, run in order:

**a) Run Migration:**
```sql
-- Copy and paste entire contents of:
-- supabase/migrations/001_initial_schema.sql
```

**b) Run Seed Data:**
```sql
-- Copy and paste entire contents of:
-- supabase/seed.sql
```

### 4. Create Users in Supabase Auth

**Go to: Authentication → Users → Add User**

Create 4 users (set "Auto Confirm User" to ON for each):

| Email | Password |
|-------|----------|
| `admin@fondamental.fr` | `Password123!` |
| `manager.paris@fondamental.fr` | `Password123!` |
| `manager.lyon@fondamental.fr` | `Password123!` |
| `manager.marseille@fondamental.fr` | `Password123!` |

### 5. Initialize User Profiles

**In Supabase SQL Editor:**
```sql
-- Copy and paste entire contents of:
-- scripts/init-users.sql
```

### 6. Start the Application
```bash
npm run dev
```

### 7. Login!

Go to: `http://localhost:3000/auth/login`

**Admin Login:**
- Email: `admin@fondamental.fr` or Username: `admin`
- Password: `Password123!`

---

## 🎯 What to Do After Login

### As Administrator:
1. Go to `/admin/centers` - See all 3 centers
2. Click on a center - View details
3. Try creating a new center
4. Invite a manager (they'll get an invitation)

### As Manager:
1. View your center dashboard
2. Go to "Professionals" - Invite a healthcare professional
3. View "All Patients" - See center-wide patient overview
4. Check center statistics

### As Healthcare Professional:
1. Select a pathology (Bipolar, Schizophrenia, etc.)
2. Create a new patient
3. Schedule a visit for the patient
4. View the visit and fill out questionnaires
5. See the dynamic conditional logic in action!

### As Patient:
1. View upcoming appointments
2. Complete pending questionnaires
3. Review past visits

---

## 🎨 Platform Features You Can Test

### ✅ Multi-Center Isolation
- Login as Paris manager - you only see Paris patients
- Login as Lyon manager - you only see Lyon patients
- Login as admin - you see all centers

### ✅ Role-Based Access
- Professionals cannot access admin features
- Patients only see their own data
- Managers can view but professionals create

### ✅ Clinical Workflows
- Create patient → Schedule visit → Fill questionnaires
- Dynamic questionnaires with conditional logic
- Track completion progress
- Save and resume questionnaires

### ✅ User Provisioning
- Top-down hierarchy (no public registration)
- Invitation system with secure tokens
- Email/username login
- Magic link authentication

### ✅ Audit & Security
- All actions are logged
- Login history tracked
- Center isolation enforced
- GDPR compliance tools

---

## 📊 Test Data Included

After setup, you'll have:
- ✅ 3 Centers: Paris, Lyon, Marseille
- ✅ 4 Pathologies: Bipolar, Schizophrenia, ASD-Asperger, Depression
- ✅ 35+ Permissions across 7 categories
- ✅ Complete visit template structure for Bipolar (5 visit types, 17 modules)
- ✅ Sample questionnaires with conditional logic
- ✅ 1 Admin + 3 Managers ready to use

---

## 🔗 Key URLs

| URL | Description |
|-----|-------------|
| `/auth/login` | Login page |
| `/admin` | Administrator dashboard |
| `/manager` | Manager dashboard |
| `/professional` | Professional pathology selection |
| `/patient` | Patient portal |

---

## 💡 Quick Tips

1. **Email or Username**: You can login with either email or username
2. **Password Toggle**: Click the eye icon to show/hide password
3. **Recently Viewed**: Patients you view appear in "recently consulted"
4. **Auto-Save**: Questionnaires can save progress
5. **Conditional Logic**: Answer suicide risk question "Yes" to see sub-questionnaire trigger
6. **Search**: All tables have built-in search
7. **Pagination**: Large lists automatically paginate

---

## 🐛 Troubleshooting

### Cannot Login?
- ✅ Check environment variables are set
- ✅ Restart dev server: `rm -rf .next && npm run dev`
- ✅ Verify user exists in both Auth and user_profiles
- ✅ Check user is marked as "active"

### Cannot See Patients?
- ✅ Verify you're in the correct center
- ✅ Check RLS policies are enabled
- ✅ Ensure patients exist for your center/pathology

### Questionnaires Not Showing?
- ✅ Verify visit is scheduled or in-progress
- ✅ Check questionnaire target_role matches your role
- ✅ Ensure modules are linked to visit template

### Environment Variable Errors?
- ✅ File must be named `.env.local` exactly
- ✅ File must be in root directory
- ✅ Use `NEXT_PUBLIC_SUPABASE_ANON_KEY` (not PUBLISHABLE_KEY)
- ✅ Restart dev server after changes

---

## 📚 Documentation

- **QUICK_START.md** - This file (setup in 5 minutes)
- **README.md** - Project overview
- **OPERATIONAL_GUIDE.md** - Complete feature documentation
- **IMPLEMENTATION.md** - Technical implementation details
- **DEPLOYMENT.md** - Production deployment guide
- **SETUP.md** - Troubleshooting environment issues

---

## 🎉 You're Ready!

The platform is fully operational. Create some test patients, schedule visits, and explore all the features!

**Default Admin Login:**
- Email: `admin@fondamental.fr`
- Username: `admin`
- Password: `Password123!`
- Access: http://localhost:3000/admin

**Have fun exploring eFondaMental!** 🚀

