import { useAuth, LoginForm } from 'wasp/client/auth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthWrapper } from '../layouts/authWrapper';
import { authAppearance } from './appearance';

export default function Login() {
  const navigate = useNavigate();

  const { data: user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/portal');
    }
  }, [user, navigate]);

  return (
    <AuthWrapper>
      <LoginForm appearance={authAppearance}/>
      <br />
      <span className='text-sm font-medium text-gray-900 dark:text-gray-100'>
        Don't have an account yet?{' '}
        <Link to='/signup' className='underline text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300'>
          go to signup
        </Link>
        .
      </span>
      <br />
      <span className='text-sm font-medium text-gray-900 dark:text-gray-100'>
        Forgot your password?{' '}
        <Link to='/request-password-reset' className='underline text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300'>
          reset it
        </Link>
        .
      </span>
    </AuthWrapper>
  );
}
