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
        <div className='text-center dark:text-white'>
          <h2 className='text-2xl font-bold mb-2'>Welcome to Typit!</h2>
          <p className='mb-4 dark:text-gray-400'>This quick tour will guide you through the platform's key features.</p>
          <p className='text-gray-400'>
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

    // Handle navigation based on step transitions
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
          arrowColor: colorMode === 'dark' ? '#333' : '#f0f4f8',
          backgroundColor: colorMode === 'dark' ? '#141E30' : '#fff',
          textColor: colorMode === 'dark' ? '#f0f4f8' : '#333',
          width: 500,
          zIndex: 9999,
          primaryColor: colorMode === 'dark' ? '#008080' : '#000000',
        },
        buttonNext: {
          backgroundColor: colorMode === 'dark' ? '#008080' : 'black',
          color: colorMode === 'dark' ? '#fff' : 'white',
          padding: '8px 16px',
          borderRadius: '4px',
        },
        buttonBack: {
          color: colorMode === 'dark' ? '#f0f4f8' : '#000000',
          marginRight: 10,
        },
        buttonSkip: {
          color: colorMode === 'dark' ? '#008080' : '#000000',
        },
        tooltip: {
          borderRadius: '8px',
          padding: '16px',
        },
        tooltipContent: {
          padding: '10px 0',
        },
        tooltipFooter: {
          marginTop: '10px',
        },
      }}
    />
  );
};

export default UserTour;
