import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { updateCurrentUser } from 'wasp/client/operations';
import { useAuth } from 'wasp/client/auth';
import useColorMode from '../hooks/useColorMode';
import useLocalStorage from '../hooks/useLocalStorage';

interface UserTourProps {
  userId: string;
}

const UserTour: React.FC<UserTourProps> = ({ userId }) => {
  const [runTour, setRunTour] = useLocalStorage('runTour', false);
  const [colorMode] = useColorMode();
  const { data: user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useLocalStorage('stepIndex', 0);

  useEffect(() => {
    if (user && !user.tourCompleted) {
      setRunTour(true);
    }
  }, [user, isLoading, setRunTour]);

  const tourSteps: Step[] = [
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

  const handleJoyrideCallback = async (data: CallBackProps) => {
    const { status, index, action, type } = data;

    if (type === 'step:after') {
      setStepIndex(index + (action === 'next' ? 1 : -1));
    }

    if (action === 'next' && index === 2) {
      navigate(`/course/welcome-course-${userId}`, { replace: true });
    } else if (action === 'prev' && index === 3) {
      navigate('/', { replace: true });
    }

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRunTour(false);
      setStepIndex(0);
      try {
        await updateCurrentUser({
          tourCompleted: true,
        });
        if(status === STATUS.FINISHED) {
          navigate(`/exercise/welcome-exercise-${userId}`, { replace: true });
        }
      } catch (error) {
        console.error('Error updating tour status:', error);
      }
    }
  };

  return (
    <Joyride
      steps={tourSteps}
      run={runTour}
      stepIndex={stepIndex}
      callback={handleJoyrideCallback}
      continuous
      showSkipButton
      showProgress
      disableOverlayClose
      scrollToFirstStep
      scrollOffset={100}
      locale={{
        back: 'Previous',
        close: 'Close',
        last: 'Finish',
        next: 'Next',
        skip: 'Skip Tour',
      }}
      styles={{
        options: {
          arrowColor: colorMode === 'dark' ? '#141E30' : '#ffffff',
          backgroundColor: colorMode === 'dark' ? '#141E30' : '#ffffff',
          textColor: colorMode === 'dark' ? '#f0f4f8' : '#374151',
          width: 500,
          zIndex: 50,
          primaryColor: colorMode === 'dark' ? '#66efc9' : '#05c49b',
        },
        buttonNext: {
          backgroundColor: colorMode === 'dark' ? '#66efc9' : '#05c49b',
          color: colorMode === 'dark' ? '#141E30' : '#ffffff',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.5rem',
          fontFamily: 'Satoshi, sans-serif',
          fontSize: '0.875rem',
          boxShadow: colorMode === 'dark' ? '0 4px 6px -1px rgba(0, 0, 0, 0.2)' : '0 1px 3px 0 rgb(0 0 0 / 0.1)'
        },
        buttonBack: {
          color: colorMode === 'dark' ? '#f0f4f8' : '#374151',
          marginRight: 16,
          fontFamily: 'Satoshi, sans-serif',
          fontSize: '0.875rem'
        },
        buttonSkip: {
          color: colorMode === 'dark' ? '#74b4ff' : '#134fff',
          fontFamily: 'Satoshi, sans-serif',
          fontSize: '0.875rem'
        },
        tooltip: {
          borderRadius: '1rem',
          padding: '1.5rem',
          boxShadow: colorMode === 'dark' 
            ? '0 10px 15px -3px rgba(0, 0, 0, 0.3)' 
            : '0 10px 15px -3px rgb(0 0 0 / 0.1)',
          fontFamily: 'Montserrat, sans-serif'
        },
        tooltipContent: {
          padding: '0.75rem 0',
          fontSize: '0.875rem',
          lineHeight: '1.5'
        },
        tooltipFooter: {
          marginTop: '1rem',
          paddingTop: '1rem',
          borderTop: colorMode === 'dark' ? '1px solid #2d3748' : '1px solid #e5e7eb'
        }
      }}
    />
  );
};

export default UserTour;
