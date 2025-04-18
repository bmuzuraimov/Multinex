import { memo } from 'react';
import HeroSection from '../../components/LandingPage/HeroSection';
import WhyMultinex from '../../components/LandingPage/WhyMultinex';
import ComparisonSection from '../../components/LandingPage/ComparisonSection';
import FeaturesSection from '../../components/LandingPage/FeatureSection';
import FAQSection from '../../components/LandingPage/FaqSection';
import DefaultLayout from '../layouts/DefaultLayout';

// Memoize the entire LandingPage component since it's static
const LandingPage = memo(() => {
  return (
    <div className='mx-auto max-w-7xl sm:px-6 lg:px-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100'>
      <HeroSection />
      <ComparisonSection />
      <WhyMultinex />
      <FeaturesSection />
      <FAQSection />
    </div>
  );
});

export default DefaultLayout(LandingPage);
