import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const DefaultLayout = (Component: React.ComponentType<any>) => {
  return function DefaultLayout(props: any) {
    return (
      <>
        <NavBar />
        <Component {...props} />
        <Footer />
      </>
    );
  };
};

export default DefaultLayout;