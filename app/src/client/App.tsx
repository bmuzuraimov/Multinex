import { useAuth } from 'wasp/client/auth';
import { updateCurrentUser } from 'wasp/client/operations';
import { Outlet } from 'react-router-dom'
import './Main.css';
import AppNavBar from './components/AppNavBar';
import { useMemo, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * use this component to wrap all child components
 * this is useful for templates, themes, and context
 */
export default function App({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { data: user } = useAuth();

  const shouldDisplayAppNavBar = useMemo(() => {
    return location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/about' && location.pathname !== '/public-courses';
  }, [location]);

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
        {shouldDisplayAppNavBar && <AppNavBar />}
        <div className='font-manrope'><Outlet /></div>
      </div>
      <div id="modal-root"></div>
    </>
  );
}
