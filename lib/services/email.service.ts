// eFondaMental Platform - Email Service
// Handles email sending via Resend API

import { Resend } from 'resend';

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail(params: SendEmailParams): Promise<boolean> {
  const resendApiKey = process.env.RESEND_API_KEY;

  console.log('[EMAIL SERVICE] Starting email send process...');
  console.log('[EMAIL SERVICE] To:', params.to);
  console.log('[EMAIL SERVICE] Subject:', params.subject);
  console.log('[EMAIL SERVICE] API Key configured:', resendApiKey ? 'YES ✓' : 'NO ✗');

  if (!resendApiKey) {
    console.error(`
      ❌ RESEND_API_KEY not configured in environment variables
      
      To fix:
      1. Add to .env.local:
         RESEND_API_KEY=re_your_key_from_resend_dashboard
      2. Restart server: npm run dev
      
      Email would be sent to: ${params.to}
    `);
    return false;
  }

  try {
    console.log('[EMAIL SERVICE] Initializing Resend client...');
    const resend = new Resend(resendApiKey);

    console.log('[EMAIL SERVICE] Sending email via Resend API...');
    const { data, error } = await resend.emails.send({
      from: params.from || 'eFondaMental <onboarding@resend.dev>',
      to: params.to,
      subject: params.subject,
      html: params.html,
    });

    if (error) {
      console.error('[EMAIL SERVICE] ❌ Resend API error:', error);
      console.error('[EMAIL SERVICE] Error details:', JSON.stringify(error, null, 2));
      return false;
    }

    console.log(`
      ✅ EMAIL SENT SUCCESSFULLY!
      Email ID: ${data?.id}
      To: ${params.to}
      Subject: ${params.subject}
    `);
    return true;
  } catch (error) {
    console.error('[EMAIL SERVICE] ❌ Exception while sending email:', error);
    if (error instanceof Error) {
      console.error('[EMAIL SERVICE] Error message:', error.message);
      console.error('[EMAIL SERVICE] Error stack:', error.stack);
    }
    return false;
  }
}

// ============================================================================
// EMAIL TEMPLATES
// ============================================================================

export function getPatientInvitationEmailHtml(params: {
  firstName: string;
  lastName: string;
  invitationUrl: string;
}): string {
  return `
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
    
    <p>Hello <strong>${params.firstName} ${params.lastName}</strong>,</p>
    
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
      <a href="${params.invitationUrl}" 
         style="background-color: #1e293b; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; font-size: 16px;">
        Accept Invitation & Create Account
      </a>
    </div>
    
    <p style="font-size: 14px; color: #64748b;">
      Or copy and paste this link into your browser:<br>
      <span style="word-break: break-all;">${params.invitationUrl}</span>
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
    <p style="margin-top: 5px;">This invitation will expire in 7 days.</p>
  </div>
  
</body>
</html>
  `.trim();
}

export async function sendPatientInvitation(params: {
  email: string;
  firstName: string;
  lastName: string;
  invitationUrl: string;
}): Promise<boolean> {
  const html = getPatientInvitationEmailHtml(params);
  
  return await sendEmail({
    to: params.email,
    subject: 'Invitation to join eFondaMental Patient Portal',
    html,
  });
}

