# Supabase Email Template Configuration for Patient Invitations

## Overview
This guide explains how to configure Supabase email templates for patient invitations to the eFondaMental platform.

## Step-by-Step Configuration

### 1. Access Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Email Templates**

### 2. Configure Invite User Template
The patient invitation uses the "Invite User" email template.

1. Select **"Invite user"** template from the list
2. Update the template with the following:

#### Subject Line:
```
Invitation to join eFondaMental Patient Portal
```

#### Email Body (HTML):
```html
<h2>Welcome to eFondaMental</h2>

<p>Hello {{ .Data.first_name }} {{ .Data.last_name }},</p>

<p>You have been invited to join the eFondaMental Patient Portal by your healthcare team at your Expert Center.</p>

<h3>What is eFondaMental?</h3>
<p>eFondaMental is a secure platform that allows you to:</p>
<ul>
  <li>View your scheduled appointments</li>
  <li>Complete self-assessment questionnaires</li>
  <li>Track your treatment progress</li>
  <li>Communicate securely with your healthcare team</li>
</ul>

<h3>Create Your Account</h3>
<p>To get started, please click the button below to create your account. This invitation is valid for 7 days.</p>

<p style="margin: 30px 0;">
  <a href="{{ .ConfirmationURL }}" 
     style="background-color: #1e293b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
    Accept Invitation & Create Account
  </a>
</p>

<p><strong>Or copy and paste this link into your browser:</strong><br>
{{ .ConfirmationURL }}</p>

<h3>Need Help?</h3>
<p>If you have any questions or didn't request this invitation, please contact your Expert Center.</p>

<p>Best regards,<br>
The eFondaMental Team</p>

<hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">

<p style="font-size: 12px; color: #64748b;">
  This is an automated email from eFondaMental. Please do not reply to this email.
  This invitation will expire in 7 days.
</p>
```

### 3. Configure SMTP Settings (Optional)

If you want to use custom email address instead of Supabase default:

1. Go to **Project Settings** → **Auth**
2. Scroll to **SMTP Settings**
3. Configure your SMTP provider:
   - **Sender email**: noreply@fondamental.fr
   - **Sender name**: eFondaMental
   - **Host**: Your SMTP host
   - **Port**: 587 (or your provider's port)
   - **Username**: Your SMTP username
   - **Password**: Your SMTP password

Popular SMTP Providers:
- **SendGrid**: smtp.sendgrid.net
- **Mailgun**: smtp.mailgun.org
- **Amazon SES**: email-smtp.region.amazonaws.com
- **Postmark**: smtp.postmarkapp.com

### 4. Test the Configuration

1. Create a test patient with your own email address
2. Check your inbox for the invitation email
3. Verify the email contains:
   - Patient's name
   - Invitation link
   - Clear instructions
   - Proper branding

### 5. Configure Redirect URLs

1. Go to **Authentication** → **URL Configuration**
2. Add allowed redirect URLs:
   ```
   http://localhost:3000/auth/invite/*
   https://your-domain.com/auth/invite/*
   ```
3. Set **Site URL**: `https://your-domain.com` (or `http://localhost:3000` for dev)

### 6. Email Template Variables

Available variables in Supabase email templates:

- `{{ .Email }}` - Recipient's email address
- `{{ .ConfirmationURL }}` - Invitation acceptance URL (includes token)
- `{{ .Data.first_name }}` - From invitation metadata
- `{{ .Data.last_name }}` - From invitation metadata
- `{{ .Data.role }}` - User role (patient)
- `{{ .Data.invitation_url }}` - Custom invitation URL with token
- `{{ .Data.is_patient_invitation }}` - Boolean flag

### 7. Customization Tips

#### Personalization:
- Use patient's name in greeting
- Mention their specific center if available
- Include center contact information

#### Branding:
- Add your center's logo (hosted image URL)
- Use your center's color scheme
- Include footer with center information

#### Clear CTAs:
- Make the "Accept Invitation" button prominent
- Use action-oriented language
- Explain what happens after clicking

#### Mobile-Friendly:
- Use responsive design
- Large, tappable buttons
- Readable font sizes

## Example Email Template (Advanced)

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #334155; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <div style="background-color: #1e293b; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 24px;">eFondaMental</h1>
    <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Expert Center for Psychiatric Disorders</p>
  </div>
  
  <div style="background-color: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px;">
    <h2 style="color: #1e293b; margin-top: 0;">Welcome to Your Patient Portal</h2>
    
    <p>Hello <strong>{{ .Data.first_name }} {{ .Data.last_name }}</strong>,</p>
    
    <p>Your healthcare team has invited you to join the eFondaMental Patient Portal - a secure platform to support your care.</p>
    
    <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #1e293b;">What You Can Do:</h3>
      <ul style="margin: 10px 0; padding-left: 20px;">
        <li>View your scheduled appointments</li>
        <li>Complete self-assessment questionnaires</li>
        <li>Track your progress over time</li>
        <li>Communicate securely with your care team</li>
      </ul>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{ .ConfirmationURL }}" 
         style="background-color: #1e293b; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; font-size: 16px;">
        Accept Invitation & Create Account
      </a>
    </div>
    
    <p style="font-size: 14px; color: #64748b;">
      Or copy and paste this link into your browser:<br>
      <span style="word-break: break-all;">{{ .ConfirmationURL }}</span>
    </p>
    
    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px; color: #92400e;">
        <strong>Important:</strong> This invitation will expire in 7 days. Please create your account before then.
      </p>
    </div>
    
    <h3 style="color: #1e293b;">Need Help?</h3>
    <p style="font-size: 14px;">
      If you have any questions or didn't expect this invitation, please contact your Expert Center.
    </p>
    
    <p style="margin-top: 30px;">
      Best regards,<br>
      <strong>Your eFondaMental Care Team</strong>
    </p>
  </div>
  
  <div style="text-align: center; padding: 20px; font-size: 12px; color: #94a3b8;">
    <p>This is an automated email from eFondaMental. Please do not reply to this email.</p>
    <p>© 2024 FondaMental. All rights reserved.</p>
  </div>
  
</body>
</html>
```

## Testing Checklist

- [ ] Email arrives in inbox (not spam)
- [ ] Patient name displays correctly
- [ ] Invitation link works
- [ ] Email is mobile-friendly
- [ ] Branding is consistent
- [ ] All links are clickable
- [ ] Expiration warning is clear
- [ ] Contact information is visible

## Troubleshooting

### Email Not Received
1. Check Supabase logs: **Authentication** → **Logs**
2. Verify email is not in spam folder
3. Confirm SMTP settings are correct
4. Check rate limits (Supabase has daily email limits)

### Email Goes to Spam
1. Configure SPF, DKIM, DMARC records for your domain
2. Use a reputable SMTP provider
3. Avoid spam trigger words
4. Include unsubscribe link if required

### Styling Not Working
1. Use inline CSS only (not external stylesheets)
2. Test in multiple email clients
3. Keep design simple and responsive
4. Avoid complex layouts

## Next Steps

After configuring the email template:
1. Run migration 005 to add patient_id to invitations
2. The application will automatically send invitations when patients with emails are created
3. Monitor the invitation acceptance rate
4. Adjust email content based on user feedback

