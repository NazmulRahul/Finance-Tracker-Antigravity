const nodemailer = require('nodemailer');

/**
 * Enhanced mailer utility based on user preference.
 * Handles dynamic port/security and provides themed templates.
 */

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  secure: parseInt(process.env.EMAIL_PORT || '587', 10) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false // Helps with some SMTP providers
  }
});

/**
 * Generic send function
 */
const sendEmail = async (options) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

/**
 * Specialized verification email
 */
const sendVerificationEmail = async ({ to, username, verificationLink }) => {
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
      <h2 style="color: #38bdf8;">Hello, ${username}!</h2>
      <p>Thank you for registering with <strong>Antigravity Finance</strong>. Please click the link below to verify your email address and activate your account:</p>
      <p style="text-align: center;">
        <a href="${verificationLink}" style="display: inline-block; padding: 12px 24px; margin: 20px 0; font-size: 16px; color: #ffffff; background-color: #38bdf8; border-radius: 8px; text-decoration: none; font-weight: bold;">
          Verify Email Address
        </a>
      </p>
      <p style="font-size: 14px; color: #94a3b8;">If you did not register for an account, please ignore this email.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 12px; color: #94a3b8;">Best regards,<br>The Antigravity Team</p>
    </div>
  `;

  await sendEmail({
    email: to,
    subject: 'Verify Your Email Address - Antigravity',
    html
  });
};

/**
 * Specialized reset password email
 */
const sendResetPasswordEmail = async ({ to, resetLink }) => {
    const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
      <h2 style="color: #f43f5e;">Password Reset Request</h2>
      <p>You are receiving this because you (or someone else) requested a password reset for your account.</p>
      <p style="text-align: center;">
        <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; margin: 20px 0; font-size: 16px; color: #ffffff; background-color: #f43f5e; border-radius: 8px; text-decoration: none; font-weight: bold;">
          Reset Password
        </a>
      </p>
      <p style="font-size: 14px; color: #94a3b8;">If you did not request this, please ignore this email and your password will remain unchanged.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 12px; color: #94a3b8;">Best regards,<br>The Antigravity Team</p>
    </div>
  `;

  await sendEmail({
    email: to,
    subject: 'Password Reset Request - Antigravity',
    html
  });
}

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendResetPasswordEmail
};
