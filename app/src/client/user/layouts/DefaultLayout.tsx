import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import UserTour from '../../components/UserTour';
import { useAuth } from 'wasp/client/auth';

const DefaultLayout = (
  Component: React.ComponentType<any>,
  options: {
    showFooter?: boolean;
  } = { showFooter: true }
) => {
  return function DefaultLayout(props: any) {
    const { data: user } = useAuth();

    return (
      <>
        <NavBar />
        <Component {...props} />
        {options.showFooter !== false && <Footer />}
        {user && <UserTour user_id={user.id} />}
      </>
    );
  };
};

export default DefaultLayout;