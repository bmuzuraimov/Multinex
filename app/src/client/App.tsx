import { useAuth } from 'wasp/client/auth';
import { updateUser } from 'wasp/client/operations';
import { Outlet, useNavigate } from 'react-router-dom';
import './Main.css';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: user } = useAuth();

  // Redirect new users to onboarding if onboarding_complete is false/null
  useEffect(() => {
    if (user && user.onboarding_complete === false) {
      navigate('/onboarding');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      const lastSeenAt = new Date(user.last_active);
      const today = new Date();
      if (today.getTime() - lastSeenAt.getTime() > 5 * 60 * 1000) {
        updateUser({ last_active: today });
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
      <Toaster
        position='top-center'
        richColors
        toastOptions={{
          classNames: {
            toast: 'toast',
            title: 'title',
            description: 'description',
            actionButton: 'action-button !bg-primary-500',
            cancelButton: 'cancel-button',
            closeButton: 'close-button',
          },
        }}
      />
      <div className='min-h-screen font-manrope'>
        <Outlet />
      </div>
      <div id='modal-root'></div>
    </>
  );
}
