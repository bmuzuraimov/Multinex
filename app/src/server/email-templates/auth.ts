import { EmailTemplateFactory } from './components/EmailTemplateFactory';
import { VerificationEmail } from './auth/VerificationEmail';
import { PasswordResetEmail } from './auth/PasswordResetEmail';
import { WelcomeEmail } from './auth/WelcomeEmail';

export const verificationEmailContent = ({ verificationLink }: { verificationLink: string }) => 
  EmailTemplateFactory.createTemplate(VerificationEmail, { verificationLink });

export const passwordResetEmailContent = ({ passwordResetLink }: { passwordResetLink: string }) => 
  EmailTemplateFactory.createTemplate(PasswordResetEmail, { passwordResetLink });

interface WelcomeEmailParams {
  userId: string;
  userName: string;
  userEmail: string;
  loginLink: string;
}

export const welcomeEmail = (params: WelcomeEmailParams) =>
  EmailTemplateFactory.createTemplate(WelcomeEmail, params);
