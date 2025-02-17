import { useAuth } from 'wasp/client/auth';
import { updateCurrentUser } from 'wasp/client/operations';
import { Outlet, useNavigate } from 'react-router-dom';
import './Main.css';
import AppNavBar from './components/AppNavBar';
import NavBar from './components/NavBar';
import { useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: user } = useAuth();

  const isAuthPage = useMemo(() => {
    return !['/', '/login', '/signup', '/about', '/public-courses'].includes(location.pathname);
  }, [location]);

  // Redirect new users to onboarding if onBoardingCompleted is false/null
  useEffect(() => {
    if (user && user.onBoardingCompleted === false) { 
      navigate('/portal/onboarding');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      const lastSeenAt = new Date(user.lastActiveTimestamp);
      const today = new Date();
      if (today.getTime() - lastSeenAt.getTime() > 5 * 60 * 1000) {
        updateCurrentUser({ lastActiveTimestamp: today });
      }
    }
  }, [user]);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView();
      }
    }
  }, [location]);

  return (
    <>
      <div className='min-h-screen dark:text-white dark:bg-gray-900'>
        {isAuthPage ? <AppNavBar /> : <NavBar />}
        <div className='font-manrope'><Outlet /></div>
      </div>
      <div id="modal-root"></div>
    </>
  );
}
