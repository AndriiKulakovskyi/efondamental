// eFondaMental Platform - Email Service
// Handles email sending via NotificationAPI

import notificationapi from 'notificationapi-node-server-sdk';

// Initialize NotificationAPI
const clientId = process.env.NOTIFICATIONAPI_CLIENT_ID;
const clientSecret = process.env.NOTIFICATIONAPI_CLIENT_SECRET;

let isInitialized = false;

function initNotificationApi() {
  if (isInitialized) return true;
  
  if (!clientId || !clientSecret) {
    console.error(`
      NOTIFICATIONAPI credentials not configured
      
      To fix:
      1. Add to .env.local:
         NOTIFICATIONAPI_CLIENT_ID=your_client_id
         NOTIFICATIONAPI_CLIENT_SECRET=your_client_secret
      2. Restart server: npm run dev
    `);
    return false;
  }

  notificationapi.init(clientId, clientSecret, {
    baseURL: 'https://api.eu.notificationapi.com'
  });
  
  isInitialized = true;
  return true;
}

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  notificationType?: string;
}

export async function sendEmail(params: SendEmailParams): Promise<boolean> {
  console.log('[EMAIL SERVICE] Starting email send process...');
  console.log('[EMAIL SERVICE] To:', params.to);
  console.log('[EMAIL SERVICE] Subject:', params.subject);
  console.log('[EMAIL SERVICE] NotificationAPI configured:', clientId ? 'YES' : 'NO');

  if (!initNotificationApi()) {
    console.error(`
      NotificationAPI not configured properly
      Email would be sent to: ${params.to}
    `);
    return false;
  }

  try {
    console.log('[EMAIL SERVICE] Sending email via NotificationAPI...');
    
    const response = await notificationapi.send({
      type: params.notificationType || 'efondamental_user_created',
      to: {
        id: params.to,
        email: params.to
      },
      email: {
        subject: params.subject,
        html: params.html
      }
    });

    console.log(`
      EMAIL SENT SUCCESSFULLY!
      To: ${params.to}
      Subject: ${params.subject}
      Response: ${JSON.stringify(response)}
    `);
    return true;
  } catch (error) {
    console.error('[EMAIL SERVICE] Exception while sending email:', error);
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
  console.log('[EMAIL SERVICE] Sending patient invitation...');
  console.log('[EMAIL SERVICE] To:', params.email);
  console.log('[EMAIL SERVICE] Client ID:', clientId ? clientId.substring(0, 10) + '...' : 'NOT SET');

  if (!initNotificationApi()) {
    console.error(`
      NotificationAPI not configured properly
      Email would be sent to: ${params.email}
      Invitation URL: ${params.invitationUrl}
    `);
    return false;
  }

  try {
    const html = getPatientInvitationEmailHtml(params);
    
    console.log('[EMAIL SERVICE] Calling notificationapi.send with type: efondamental_user_created');
    
    // NotificationAPI send returns a promise that resolves when email is queued
    await notificationapi.send({
      type: 'efondamental_user_created',
      to: {
        id: params.email,
        email: params.email
      },
      email: {
        subject: 'Invitation to join eFondaMental Patient Portal',
        html: html
      }
    });

    console.log(`
      PATIENT INVITATION EMAIL SENT SUCCESSFULLY!
      To: ${params.email}
      Name: ${params.firstName} ${params.lastName}
    `);
    return true;
  } catch (error: unknown) {
    console.error('[EMAIL SERVICE] Exception while sending patient invitation:', error);
    
    // Handle specific NotificationAPI errors
    if (error && typeof error === 'object') {
      const err = error as Record<string, unknown>;
      if (err.response) {
        console.error('[EMAIL SERVICE] API Response error:', err.response);
      }
      if (err.message) {
        console.error('[EMAIL SERVICE] Error message:', err.message);
      }
      if (err.status) {
        console.error('[EMAIL SERVICE] Status code:', err.status);
      }
    }
    
    return false;
  }
}
