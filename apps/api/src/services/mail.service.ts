import { createTransport, Transporter } from 'nodemailer';

export interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class MailService {
  private transporter: Transporter;

  constructor() {
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const secure = process.env.SMTP_SECURE === 'true';
    const user = process.env.SMTP_USER || '';
    const pass = process.env.SMTP_PASS || '';

    this.transporter = createTransport({
      host,
      port,
      secure,
      auth: user && pass ? { user, pass } : undefined,
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  /**
   * Generic mail sending function reused across all email notifications
   */
  public async sendMail(options: SendMailOptions): Promise<boolean> {
    const mailFrom = process.env.MAIL_FROM || 'FH6 Cars Database <noreply@fh6cars.com>';

    console.log('\n======================================================');
    console.log(`📧 [MAIL SERVICE] Sending Email To: ${options.to}`);
    console.log(`📌 [SUBJECT]: ${options.subject}`);
    console.log('======================================================\n');

    try {
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        await this.transporter.sendMail({
          from: mailFrom,
          to: options.to,
          subject: options.subject,
          html: options.html,
          text: options.text || '',
        });
        console.log(`✅ [MAIL SERVICE] Email delivered successfully to ${options.to}`);
      } else {
        console.log(`ℹ️ [MAIL SERVICE] SMTP_USER/SMTP_PASS not set in .env. Email logged above for dev.`);
      }
      return true;
    } catch (err: any) {
      console.error(`⚠️ [MAIL SERVICE ERROR] Failed to send email to ${options.to}:`, err.message);
      return false;
    }
  }

  /**
   * Sends 6-digit password reset verification code
   */
  public async sendVerificationCode(toEmail: string, code: string): Promise<boolean> {
    const subject = 'FH6 Cars Admin — Password Reset Verification Code';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #0097B2; text-align: center; margin-bottom: 8px;">FH6 Cars Database</h2>
        <h4 style="color: #1e293b; text-align: center; margin-top: 0;">Admin Password Reset Request</h4>
        <p style="color: #475569; font-size: 14px; line-height: 1.5;">
          You requested a password reset for your FH6 Cars Admin Portal account. Use the 6-digit verification code below to authorize your password change:
        </p>
        <div style="text-align: center; margin: 24px 0;">
          <span style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #0097B2; background-color: #f0fdfa; padding: 12px 24px; border-radius: 8px; border: 1px solid #ccfbf1; display: inline-block;">
            ${code}
          </span>
        </div>
        <p style="color: #64748b; font-size: 12px; text-align: center; margin-bottom: 0;">
          This verification code will expire in 15 minutes. If you did not request this reset, please ignore this email.
        </p>
      </div>
    `;

    const text = `Your FH6 Admin Password Reset Code is: ${code} (expires in 15 minutes).`;

    return this.sendMail({ to: toEmail, subject, html, text });
  }

  /**
   * Sends security alert notification email when user logs in
   */
  public async sendLoginNotification(toEmail: string, loginTime: Date = new Date(), ipAddress?: string): Promise<boolean> {
    const subject = 'FH6 Cars Admin — Security Alert: New Account Login';
    const formattedTime = loginTime.toUTCString();

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #0097B2; text-align: center; margin-bottom: 8px;">FH6 Cars Database</h2>
        <h4 style="color: #1e293b; text-align: center; margin-top: 0;">Security Alert: New Sign-in Detected</h4>
        <p style="color: #475569; font-size: 14px; line-height: 1.5;">
          A new successful sign-in to your FH6 Cars Admin Portal account occurred.
        </p>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; margin: 16px 0; font-size: 13px; color: #334155;">
          <p style="margin: 4px 0;"><strong>Account:</strong> ${toEmail}</p>
          <p style="margin: 4px 0;"><strong>Date & Time:</strong> ${formattedTime}</p>
          ${ipAddress ? `<p style="margin: 4px 0;"><strong>IP Address:</strong> ${ipAddress}</p>` : ''}
        </div>
        <p style="color: #64748b; font-size: 12px; text-align: center; margin-bottom: 0;">
          If this was you, no action is required. If you did not log in, please reset your admin password immediately.
        </p>
      </div>
    `;

    const text = `Security Alert: A new login to your FH6 Cars Admin account (${toEmail}) occurred at ${formattedTime}.`;

    return this.sendMail({ to: toEmail, subject, html, text });
  }
}
