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
  <title>Bienvenue sur eFondaMental</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f1f5f9;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 32px 40px; text-align: center; border-bottom: 1px solid #e2e8f0;">
              <div style="font-size: 24px; font-weight: 700; color: #1e293b;">
                Fondation <span style="color: #FF4A3F;">FondaMental</span>
              </div>
            </td>
          </tr>
          
          <!-- Icon -->
          <tr>
            <td style="padding: 40px 40px 20px 40px; text-align: center;">
              <img src="https://cdn-icons-png.flaticon.com/512/2913/2913564.png" width="80" height="80" alt="Bienvenue" style="display: inline-block; border: 0; opacity: 0.9;">
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 0 40px 40px 40px;">
              <h1 style="margin: 0 0 24px 0; font-size: 28px; font-weight: 700; color: #1e293b; text-align: center;">
                Bienvenue, votre compte est pret !
              </h1>
              
              <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #475569;">
                Bonjour <strong>${params.firstName} ${params.lastName}</strong>,
              </p>
              
              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #475569;">
                Votre equipe soignante vient de creer votre espace patient sur <strong>eFondaMental</strong>.
              </p>
              
              <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 1.6; color: #475569;">
                Vous pouvez des maintenant acceder a votre tableau de bord pour consulter vos prochains rendez-vous et completer vos questionnaires de suivi medical.
              </p>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${params.invitationUrl}" style="background-color: #FF4A3F; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 12px; display: inline-block; box-shadow: 0 4px 6px rgba(255, 74, 63, 0.25);">
                  Activer mon compte
                </a>
              </div>
              
              <p style="margin: 24px 0 0 0; font-size: 14px; line-height: 1.6; color: #64748b; text-align: center;">
                Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
                <a href="${params.invitationUrl}" style="color: #FF4A3F; text-decoration: none; word-break: break-all;">${params.invitationUrl}</a>
              </p>
            </td>
          </tr>
          
          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 0;">
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #94a3b8;">
                2025 Fondation FondaMental - Reseau de Centres Experts
              </p>
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                Vous recevez cet email car vous etes inscrit dans un parcours de soin eFondaMental.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
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
        subject: 'Bienvenue sur eFondaMental - Activez votre compte patient',
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
