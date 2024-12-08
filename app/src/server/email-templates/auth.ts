export const verificationEmailContent = ({ verificationLink }: { verificationLink: string }) => ({
  subject: 'Welcome to Typit - Please Verify Your Email',
  text: `
  Welcome to Typit!
  
  Thank you for creating an account with us. To ensure the security of your account and access all features, please verify your email address.
  
  Click here to verify: ${verificationLink}
  
  This verification link will expire in 24 hours. If you did not sign up for a Typit account, please disregard this email.
  
  Need help? Contact our support team at support@typit.app
  
  Best regards,
  The Typit Team
  
  © 2024 Typit. All rights reserved.
    `,
  html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #2D3748;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1A365D; font-size: 28px; margin-bottom: 10px;">Welcome to Typit!</h1>
          <p style="color: #4A5568; font-size: 16px;">Thank you for joining our community</p>
        </div>
        
        <div style="background-color: #F7FAFC; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <p style="margin-bottom: 20px; color: #4A5568;">
            To get started and ensure the security of your account, please verify your email address by clicking the button below:
          </p>
          
          <div style="text-align: center;">
            <a href="${verificationLink}" 
               style="display: inline-block; background-color: #4299E1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0;">
              Verify Email Address
            </a>
          </div>
          
          <p style="font-size: 14px; color: #718096;">
            Or copy and paste this URL into your browser:<br>
            <a href="${verificationLink}" style="color: #4299E1; word-break: break-all;">${verificationLink}</a>
          </p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E2E8F0; font-size: 14px; color: #718096;">
          <p>This verification link will expire in 24 hours.</p>
          <p>If you didn't create a Typit account, please ignore this email or contact our support team.</p>
          <p>Need help? Contact us at <a href="mailto:support@typit.app" style="color: #4299E1;">support@typit.app</a></p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #A0AEC0;">
          <p>© 2024 Typit. All rights reserved.</p>
          <p>Our mailing address: 123 Typit Street, San Francisco, CA 94105</p>
        </div>
      </div>
    `,
});

export const passwordResetEmailContent = ({ passwordResetLink }: { passwordResetLink: string }) => ({
  subject: 'Secure Password Reset Instructions - Typit Account',
  text: `
  Hello from Typit,
  
  We received a request to reset your password. If you made this request, please click the link below:
  
  ${passwordResetLink}
  
  For your security, this password reset link will expire in 1 hour.
  
  If you didn't request this change, please contact our support team immediately at support@typit.app
  
  Best regards,
  The Typit Security Team
  
  © 2024 Typit. All rights reserved.
    `,
  html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #2D3748;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1A365D; font-size: 28px; margin-bottom: 10px;">Password Reset Request</h1>
          <p style="color: #4A5568; font-size: 16px;">Secure Your Typit Account</p>
        </div>
        
        <div style="background-color: #F7FAFC; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <p style="margin-bottom: 20px; color: #4A5568;">
            We received a request to reset the password for your Typit account. To proceed with the password reset, click the secure button below:
          </p>
          
          <div style="text-align: center;">
            <a href="${passwordResetLink}" 
               style="display: inline-block; background-color: #4299E1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0;">
              Reset Password
            </a>
          </div>
          
          <p style="font-size: 14px; color: #718096;">
            Or copy and paste this URL into your browser:<br>
            <a href="${passwordResetLink}" style="color: #4299E1; word-break: break-all;">${passwordResetLink}</a>
          </p>
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background-color: #FFF5F5; border-radius: 8px; font-size: 14px; color: #718096;">
          <p style="color: #C53030; font-weight: bold;">Security Notice:</p>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>This link will expire in 1 hour</li>
            <li>If you didn't request this password reset, please contact us immediately</li>
            <li>Never share your password reset link with anyone</li>
          </ul>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E2E8F0; font-size: 14px; color: #718096;">
          <p>Need help? Contact our security team at <a href="mailto:support@typit.app" style="color: #4299E1;">support@typit.app</a></p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #A0AEC0;">
          <p>© 2024 Typit. All rights reserved.</p>
          <p>Our mailing address: 123 Typit Street, San Francisco, CA 94105</p>
        </div>
      </div>
    `,
});
