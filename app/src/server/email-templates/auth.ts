import { EmailTemplateFactory } from './components/EmailTemplateFactory';
import { VerificationEmail } from './auth/VerificationEmail';
import { PasswordResetEmail } from './auth/PasswordResetEmail';

export const verificationEmailContent = ({ verificationLink }: { verificationLink: string }) => 
  EmailTemplateFactory.createTemplate(VerificationEmail, { verificationLink });

export const passwordResetEmailContent = ({ passwordResetLink }: { passwordResetLink: string }) => 
  EmailTemplateFactory.createTemplate(PasswordResetEmail, { passwordResetLink });
