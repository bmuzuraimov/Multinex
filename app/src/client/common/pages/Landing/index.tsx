import { memo, useEffect } from 'react';
import HeroSection from './components/HeroSection';
import WhyMultinex from './components/WhyMultinex';
import FeaturesSection from './components/FeatureSection';
import FAQSection from './components/FaqSection';
import CodePreviewSection from './components/CodePreviewSection';
import DefaultLayout from '../../layouts/DefaultLayout';

// Memoize the entire Landing component since it's static
const Landing = memo(() => {
  // Disable tab key navigation on this page
  useEffect(() => {
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
      }
    };

    // Add event listener when component mounts
    document.addEventListener('keydown', handleTabKey);

    // Clean up event listener when component unmounts
    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, []);

  return (
    <div className='mx-auto max-w-7xl sm:px-6 lg:px-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100'>
      <HeroSection />
      <CodePreviewSection />
      <WhyMultinex />
      <FeaturesSection />
      <FAQSection />
    </div>
  );
});

export default DefaultLayout(Landing);
