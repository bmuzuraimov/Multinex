import { memo } from 'react';
import HeroSection from './components/HeroSection';
import WhyMultinex from './components/WhyMultinex';
import FeaturesSection from './components/FeatureSection';
import FAQSection from './components/FaqSection';
import DefaultLayout from '../../layouts/DefaultLayout';

// Memoize the entire Landing component since it's static
const Landing = memo(() => {
  return (
    <div className='mx-auto max-w-7xl sm:px-6 lg:px-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100'>
      <HeroSection />
      <WhyMultinex />
      <FeaturesSection />
      <FAQSection />
    </div>
  );
});

export default DefaultLayout(Landing);
