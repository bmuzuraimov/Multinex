import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const DefaultLayout = (
  Component: React.ComponentType<any>,
  options: {
    showFooter?: boolean;
  } = { showFooter: true }
) => {
  return function DefaultLayout(props: any) {
    return (
      <>
        <NavBar />
        <Component {...props} />
        {options.showFooter !== false && <Footer />}
      </>
    );
  };
};

export default DefaultLayout;
