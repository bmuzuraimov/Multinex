import { Step } from 'react-joyride';

export const TOUR_STEPS: Step[] = [
    {
      target: 'body',
      content: (
        <div className='text-center font-montserrat'>
          <h2 className='text-title-lg font-manrope font-bold mb-4 text-primary-900 dark:text-primary-100'>Welcome to Multinex!</h2>
          <p className='mb-4 text-gray-600 dark:text-gray-300'>This quick tour will guide you through the platform's key features.</p>
          <p className='text-secondary-600 dark:text-secondary-300 font-satoshi'>
            Click <strong>Next</strong> to proceed.
          </p>
        </div>
      ),
      placement: 'center',
      disableOverlay: false,
      disableBeacon: true,
    },
    {
      target: '.tour-step-1',
      content: "Here are your courses! We've created a demo course for you to get started. Click 'Next' to proceed.",
      spotlightClicks: true,
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '.tour-step-2',
      content: 'Create sections here to organize your course content into chapters.',
      spotlightClicks: true,
      placement: 'bottom',
      event: 'hover',
      disableBeacon: true,
    },
    {
      target: '.tour-step-3',
      content: 'Each section can contain multiple exercises in a structured sequence.',
      spotlightClicks: true,
      placement: 'bottom',
      event: 'hover',
      disableBeacon: true,
    },
    {
      target: '.shadow-md',
      content: "Let's walk through the demo exercise to get you started!",
      spotlightClicks: true,
      placement: 'auto',
      disableBeacon: true,
    },
  ];

export const JOYRIDE_STYLES = (color_mode: 'dark' | 'light') => ({
  options: {
    arrowColor: color_mode === 'dark' ? '#141E30' : '#ffffff',
    backgroundColor: color_mode === 'dark' ? '#141E30' : '#ffffff',
    textColor: color_mode === 'dark' ? '#f0f4f8' : '#374151',
    width: 500,
    zIndex: 50,
    primaryColor: color_mode === 'dark' ? '#66efc9' : '#05c49b',
  },
  buttonNext: {
    backgroundColor: color_mode === 'dark' ? '#66efc9' : '#05c49b',
    color: color_mode === 'dark' ? '#141E30' : '#ffffff',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    fontFamily: 'Satoshi, sans-serif',
    fontSize: '0.875rem',
    boxShadow: color_mode === 'dark' ? '0 4px 6px -1px rgba(0, 0, 0, 0.2)' : '0 1px 3px 0 rgb(0 0 0 / 0.1)',
  },
  buttonBack: {
    color: color_mode === 'dark' ? '#f0f4f8' : '#374151',
    marginRight: 16,
    fontFamily: 'Satoshi, sans-serif',
    fontSize: '0.875rem',
  },
  buttonSkip: {
    color: color_mode === 'dark' ? '#74b4ff' : '#134fff',
    fontFamily: 'Satoshi, sans-serif',
    fontSize: '0.875rem',
  },
  tooltip: {
    borderRadius: '1rem',
    padding: '1.5rem',
    boxShadow: color_mode === 'dark' ? '0 10px 15px -3px rgba(0, 0, 0, 0.3)' : '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    fontFamily: 'Montserrat, sans-serif',
  },
  tooltipContent: {
    padding: '0.75rem 0',
    fontSize: '0.875rem',
    lineHeight: '1.5',
  },
  tooltipFooter: {
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: color_mode === 'dark' ? '1px solid #2d3748' : '1px solid #e5e7eb',
  },
});
