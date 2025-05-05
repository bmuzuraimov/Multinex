import React from 'react';
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
      isFixed: true,
    },
    {
      target: '.tour-step-1',
      content: (
        <div className='font-montserrat'>
          <h3 className='text-base font-bold mb-2'>Your Courses</h3>
          <p>This is your learning portal! We've created a demo course to help you get started.</p>
          <p className='mt-2 text-sm text-secondary-600 dark:text-secondary-300'>Click "Next" to go to your demo course.</p>
        </div>
      ),
      spotlightClicks: false,
      placement: 'bottom',
      disableBeacon: true,
      placementBeacon: 'bottom',
      floaterProps: {
        hideArrow: false,
        disableAnimation: false,
      },
    },
    {
      target: '.tour-step-2',
      content: (
        <div className='font-montserrat'>
          <h3 className='text-base font-bold mb-2'>Course Sections</h3>
          <p>Once you're in a course, you can create sections to organize your course content into chapters.</p>
          <p className='mt-2 text-sm text-secondary-600 dark:text-secondary-300'>Each section can contain multiple exercises.</p>
        </div>
      ),
      spotlightClicks: false,
      placement: 'bottom',
      disableBeacon: true,
      placementBeacon: 'top-end',
    },
    {
      target: '.tour-step-3',
      content: (
        <div className='font-montserrat'>
          <h3 className='text-base font-bold mb-2'>Section Content</h3>
          <p>Each section contains exercises arranged in a logical sequence.</p>
          <p className='mt-2 text-sm text-secondary-600 dark:text-secondary-300'>You can add, edit, or rearrange exercises within a section.</p>
        </div>
      ),
      spotlightClicks: false,
      placement: 'top',
      disableBeacon: true,
      placementBeacon: 'top-start',
    },
    {
      target: '.tour-exercise-card',
      content: (
        <div className='font-montserrat'>
          <h3 className='text-base font-bold mb-2'>Exercises</h3>
          <p>Each exercise card represents a learning activity for your students.</p>
          <p className='mt-2 text-sm'>Let's check out our demo exercise to see how it works!</p>
          <p className='mt-2 text-xs text-secondary-600 dark:text-secondary-300'>(Click on the exercise card to continue)</p>
        </div>
      ),
      spotlightClicks: true,
      placement: 'bottom',
      disableBeacon: true,
      floaterProps: {
        disableAnimation: false,
        hideArrow: false,
      },
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
    overlayColor: 'rgba(0, 0, 0, 0.5)',
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
