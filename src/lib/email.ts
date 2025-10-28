import nodemailer from "nodemailer";

// Email configuration interface
interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

// Create transporter
const createTransporter = () => {
  const config: EmailConfig = {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
  };

  return nodemailer.createTransport(config);
};

// Email templates
const emailTemplates = {
  verification: (token: string, firstName: string) => ({
    subject: "Verify Your Email - Jashore University",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Jashore University</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Science & Technology</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Email Verification Required</h2>
          
          <p style="color: #666; line-height: 1.6;">Hello ${firstName},</p>
          
          <p style="color: #666; line-height: 1.6;">
            Welcome to Jashore University of Science and Technology! 
            Thank you for registering with us. To complete your registration, 
            please verify your email address by clicking the button below.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}" 
               style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; font-size: 14px;">
            If the button doesn't work, you can copy and paste this link into your browser:
          </p>
          <p style="color: #667eea; word-break: break-all; font-size: 14px;">
            ${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            This email was sent from Jashore University of Science and Technology.<br>
            If you didn't register for an account, please ignore this email.
          </p>
        </div>
      </div>
    `,
  }),

  passwordReset: (token: string, firstName: string) => ({
    subject: "Password Reset Request - Jashore University",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Jashore University</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Science & Technology</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Password Reset Request</h2>
          
          <p style="color: #666; line-height: 1.6;">Hello ${firstName},</p>
          
          <p style="color: #666; line-height: 1.6;">
            We received a request to reset your password for your Jashore University account. 
            If you made this request, click the button below to reset your password.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}" 
               style="background: #e74c3c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; font-size: 14px;">
            If the button doesn't work, you can copy and paste this link into your browser:
          </p>
          <p style="color: #e74c3c; word-break: break-all; font-size: 14px;">
            ${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}
          </p>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="color: #856404; margin: 0; font-size: 14px;">
              <strong>Important:</strong> This link will expire in 1 hour for security reasons.
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            If you didn't request a password reset, please ignore this email.<br>
            Your password will remain unchanged.
          </p>
        </div>
      </div>
    `,
  }),
};

// Email sending functions
export const sendVerificationEmail = async (
  email: string,
  token: string,
  firstName: string
) => {
  try {
    const transporter = createTransporter();
    const template = emailTemplates.verification(token, firstName);

    const mailOptions = {
      from: `"Jashore University" <${
        process.env.SMTP_FROM || process.env.SMTP_USER
      }>`,
      to: email,
      subject: template.subject,
      html: template.html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Verification email sent:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const sendPasswordResetEmail = async (
  email: string,
  token: string,
  firstName: string
) => {
  try {
    const transporter = createTransporter();
    const template = emailTemplates.passwordReset(token, firstName);

    const mailOptions = {
      from: `"Jashore University" <${
        process.env.SMTP_FROM || process.env.SMTP_USER
      }>`,
      to: email,
      subject: template.subject,
      html: template.html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// Test email configuration
export const testEmailConfiguration = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log("Email configuration is valid");
    return { success: true, message: "Email configuration is valid" };
  } catch (error) {
    console.error("Email configuration test failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
