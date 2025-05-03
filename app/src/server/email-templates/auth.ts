import { EmailTemplateFactory } from './components/EmailTemplateFactory';
import { VerificationEmail } from './auth/VerificationEmail';
import { PasswordResetEmail } from './auth/PasswordResetEmail';
import { WelcomeEmail } from './auth/WelcomeEmail';

export const verificationEmailContent = ({ 
  verificationLink, 
  user
}: { 
  verificationLink: string; 
  user?: { username?: string; email?: string; } 
}) => 
  EmailTemplateFactory.createTemplate(VerificationEmail, { 
    verification_link: verificationLink,
    user_name: user?.username || user?.email?.split('@')[0] || 'there'
  });

export const passwordResetEmailContent = ({ passwordResetLink }: { passwordResetLink: string }) => 
  EmailTemplateFactory.createTemplate(PasswordResetEmail, { passwordResetLink });

interface WelcomeEmailParams {
  user_id: string;
  user_name: string;
  user_email: string;
  login_link: string;
}

export const welcomeEmail = (params: WelcomeEmailParams) =>
  EmailTemplateFactory.createTemplate(WelcomeEmail, params);
