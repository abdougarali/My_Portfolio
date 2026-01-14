import { Resend } from 'resend';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Check if Resend is configured
export const isEmailConfigured = () => {
  return !!process.env.RESEND_API_KEY;
};

/**
 * Send notification email to admin when someone submits the contact form
 */
export async function sendContactNotification(message: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  if (!isEmailConfigured()) {
    console.warn('⚠️ Email not configured. Skipping notification.');
    return { success: false, error: 'Email not configured' };
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.warn('⚠️ ADMIN_EMAIL not set. Skipping notification.');
    return { success: false, error: 'Admin email not configured' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>', // Use your verified domain
      to: adminEmail,
      subject: `🔔 New Contact: ${message.subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #555; }
            .value { background: white; padding: 10px; border-radius: 5px; margin-top: 5px; }
            .message-box { background: white; padding: 15px; border-left: 4px solid #667eea; margin-top: 10px; }
            .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">📬 New Contact Form Submission</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">From:</div>
                <div class="value">${message.name} &lt;${message.email}&gt;</div>
              </div>
              <div class="field">
                <div class="label">Subject:</div>
                <div class="value">${message.subject}</div>
              </div>
              <div class="field">
                <div class="label">Message:</div>
                <div class="message-box">${message.message.replace(/\n/g, '<br>')}</div>
              </div>
              <div style="margin-top: 20px;">
                <a href="mailto:${message.email}?subject=Re: ${message.subject}" 
                   style="background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                  Reply to ${message.name}
                </a>
              </div>
            </div>
            <div class="footer">
              This email was sent from your portfolio contact form.
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending notification email:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Notification email sent:', data?.id);
    return { success: true, id: data?.id };
  } catch (error: any) {
    console.error('Error sending notification email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send auto-reply email to the person who submitted the contact form
 */
export async function sendAutoReply(to: string, name: string) {
  if (!isEmailConfigured()) {
    console.warn('⚠️ Email not configured. Skipping auto-reply.');
    return { success: false, error: 'Email not configured' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Garali Abdesslem <onboarding@resend.dev>', // Use your verified domain
      to,
      subject: "Thanks for reaching out! 🙏",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
            .social-links { margin-top: 20px; }
            .social-links a { margin: 0 10px; color: #667eea; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Thank You! 🎉</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>Thank you for reaching out! I've received your message and truly appreciate you taking the time to contact me.</p>
              <p>I typically respond within 24-48 hours. In the meantime, feel free to check out my portfolio or connect with me on social media.</p>
              <p>Looking forward to our conversation!</p>
              <p>Best regards,<br><strong>Garali Abdesslem</strong><br>Full Stack Developer</p>
              <div class="social-links" style="text-align: center;">
                <a href="https://github.com/garaliabdesslem">GitHub</a> |
                <a href="https://linkedin.com/in/garaliabdesslem">LinkedIn</a> |
                <a href="https://twitter.com/garaliabdesslem">Twitter</a>
              </div>
            </div>
            <div class="footer">
              This is an automated response. Please don't reply to this email.
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending auto-reply:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Auto-reply sent:', data?.id);
    return { success: true, id: data?.id };
  } catch (error: any) {
    console.error('Error sending auto-reply:', error);
    return { success: false, error: error.message };
  }
}
