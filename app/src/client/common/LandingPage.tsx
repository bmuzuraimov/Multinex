import { memo } from 'react';
import HeroSection from '../components/LandingPage/HeroSection';
import WhyMultinex from '../components/LandingPage/WhyMultinex';
import ExperienceSection from '../components/LandingPage/ExperienceSection';
import FeaturesSection from '../components/LandingPage/FeatureSection';
import FAQSection from '../components/LandingPage/FaqSection';
import FooterSection from '../components/LandingPage/FooterSection';

// Memoize the main content since it's static and doesn't depend on props
const MainContent = memo(() => (
  <main className='bg-white dark:bg-gray-900'>
    <HeroSection />
    <WhyMultinex />
    <ExperienceSection />
    <FeaturesSection />
    <FAQSection />
  </main>
));

MainContent.displayName = 'MainContent';

// Memoize the entire LandingPage component since it's static
const renderLandingPage = memo(() => {
  return (
    <div className='mx-auto max-w-7xl sm:px-6 lg:px-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100'>
      <MainContent />
      <FooterSection />
    </div>
  );
});

renderLandingPage.displayName = 'RenderLandingPage';

export default renderLandingPage;
