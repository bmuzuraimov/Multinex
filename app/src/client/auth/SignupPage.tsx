import { SignupForm } from 'wasp/client/auth';
import { Link } from 'react-router-dom';
import { AuthWrapper } from './authWrapper';
import { authAppearance } from './appearance';

export function Signup() {
  return (
    <AuthWrapper>
      <SignupForm appearance={authAppearance} />
      <br />
      <span className='text-sm font-medium text-gray-900 dark:text-gray-100'>
        I already have an account (
        <Link to='/login' className='underline text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300'>
          go to login
        </Link>
        ).
      </span>
      <br />
    </AuthWrapper>
  );
}
