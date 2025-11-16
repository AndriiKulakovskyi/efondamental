# Email Service Setup Guide

## Overview

eFondaMental uses **[Resend](https://resend.com)** for sending patient invitation emails. Resend is a modern email API with excellent deliverability and a generous free tier (3,000 emails/month).

## Quick Setup (5 Minutes)

### Step 1: Install Resend SDK

The Resend package is already installed in your project:
```bash
npm install resend  # ✅ Already done
```

### Step 2: Get Resend API Key

1. Go to **[resend.com](https://resend.com)** and sign up (free, no credit card required)
2. Verify your email address
3. In the Resend dashboard, go to **[API Keys](https://resend.com/api-keys)**
4. Click **"Create API Key"**
5. Give it a name (e.g., "eFondaMental Development")
6. Copy the key (starts with `re_...`)

### Step 3: Add to Environment Variables

Add to your `.env.local` file:

```bash
RESEND_API_KEY=re_your_api_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Important**: Make sure there are no spaces or quotes around the values!

### Step 4: Restart Development Server

```bash
# Stop the server (Ctrl+C)
npm run dev
```

### Step 5: Test Email Sending

1. Create a patient with **your own email address**
2. Check the terminal output - should see:
   ```
   ✅ Patient invitation email sent successfully!
   ```
3. Check your email inbox (and spam folder)
4. You should receive the invitation email! 📧

## Development vs Production

### Development (Using Resend's Test Domain)

For testing, use Resend's pre-verified domain:
- FROM: `eFondaMental <onboarding@resend.dev>`
- No domain verification needed
- Works immediately
- Free tier: 3,000 emails/month

### Production (Using Your Own Domain)

For production emails from your domain:

#### Step 1: Verify Domain in Resend

1. Go to **[Domains](https://resend.com/domains)** in Resend dashboard
2. Click "Add Domain"
3. Enter your domain: `fondamental.fr`
4. Add the DNS records shown (SPF, DKIM, DMARC):
   ```
   Type: TXT
   Name: @ (or your subdomain)
   Value: [Copy from Resend]
   ```
5. Wait for verification (5-30 minutes)

#### Step 2: Update FROM Address

In `/lib/services/email.service.ts`, update line 27:
```typescript
from: params.from || 'eFondaMental <noreply@fondamental.fr>',
```

### Step 3: Verify Domain (Production Only)

For production emails:

1. In Resend Dashboard, go to **Domains**
2. Click "Add Domain"
3. Enter your domain: `fondamental.fr`
4. Add the DNS records shown (SPF, DKIM, DMARC)
5. Wait for verification (usually 15 minutes)
6. Update FROM address in `lib/services/email.service.ts`:
   ```typescript
   from: 'eFondaMental <noreply@fondamental.fr>'
   ```

### Step 4: Test Email Sending

```bash
# Restart your dev server to load new env variables
npm run dev
```

Then:
1. Create a patient with YOUR email address
2. Check your inbox for the invitation
3. Should arrive within seconds! ✅

### Resend Free Tier Limits:
- 3,000 emails/month
- 100 emails/day
- Perfect for testing and small deployments

---

## Option 2: Supabase Edge Function (Advanced)

If you prefer to use Supabase Edge Functions instead:

### Step 1: Install Supabase CLI

```bash
npm install -g supabase
supabase login
supabase init
```

### Step 2: Create Edge Function

```bash
supabase functions new send-invitation
```

### Step 3: Implement Function

In `supabase/functions/send-invitation/index.ts`:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  try {
    const { email, firstName, lastName, invitationUrl } = await req.json()

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'eFondaMental <noreply@fondamental.fr>',
        to: email,
        subject: 'Invitation to join eFondaMental Patient Portal',
        html: `
          <h2>Welcome ${firstName} ${lastName}</h2>
          <p>You've been invited to join eFondaMental.</p>
          <a href="${invitationUrl}">Accept Invitation</a>
        `,
      }),
    })

    const data = await response.json()
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    })
  }
})
```

### Step 4: Deploy Function

```bash
supabase functions deploy send-invitation --no-verify-jwt
```

### Step 5: Set Environment Variable

```bash
supabase secrets set RESEND_API_KEY=re_your_key_here
```

### Step 6: Update Code to Call Edge Function

In `/lib/services/user-provisioning.service.ts`, replace `sendPatientInvitationEmail`:

```typescript
async function sendPatientInvitationEmail(
  data: PatientInvitationEmailData
): Promise<void> {
  const invitationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/invite/${data.token}`;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  
  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/send-invitation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        invitationUrl,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send invitation via Edge Function');
    }

    console.log('Invitation email sent via Edge Function');
  } catch (error) {
    console.error('Error sending invitation:', error);
    throw error;
  }
}
```

---

## 🎯 Recommended Approach: Direct Resend Integration

**I've already implemented this** in `/lib/services/email.service.ts`. Here's what to do:

### Quick Setup (5 minutes):

1. **Get Resend API Key**:
   - Sign up at [resend.com](https://resend.com)
   - Get your API key from dashboard
   - It's free for 3,000 emails/month!

2. **Add to `.env.local`**:
   ```bash
   RESEND_API_KEY=re_your_api_key_here
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

3. **Restart Dev Server**:
   ```bash
   npm run dev
   ```

4. **Test**:
   - Create a patient with YOUR email
   - Check your inbox
   - Should receive professional invitation email! ✅

### Update the Email Sending Function:

<function_calls>
<invoke name="search_replace">
<parameter name="file_path">/Users/andriikulakovskyi/Documents/Projets/FondaMental/efondamental/lib/services/user-provisioning.service.ts
