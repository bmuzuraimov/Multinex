import { ForgotPasswordForm } from 'wasp/client/auth';
import { AuthWrapper } from './authWrapper';
import { authAppearance } from './appearance';
export function RequestPasswordReset() {
  return (
    <AuthWrapper>
      <ForgotPasswordForm appearance={authAppearance} />
    </AuthWrapper>
  );
}
