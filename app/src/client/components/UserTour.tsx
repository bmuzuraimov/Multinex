import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { updateUserById } from 'wasp/client/operations';
import { useAuth } from 'wasp/client/auth';
import useColorMode from '../hooks/useColorMode';

interface UserTourProps {
  userId: string;
}

const UserTour: React.FC<UserTourProps> = ({ userId }) => {
  const [runTour, setRunTour] = useState<boolean>(false);
  const [colorMode] = useColorMode();
  const { data: user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState<number>(0);

  useEffect(() => {
    const fetchUserTourStatus = async () => {
      try {
        if (user && !user.tourCompleted) {
          const savedStep = localStorage.getItem('tourStep');
          if (savedStep !== null) {
            setStepIndex(parseInt(savedStep));
            setRunTour(true);
          } else {
            setStepIndex(0);
            setRunTour(true);
          }
        }
      } catch (error) {
        console.error('Error fetching user tour status:', error);
      }
    };

    fetchUserTourStatus();
  }, [user, isLoading]);

  const tourSteps: Step[] = [
    {
      target: 'body',
      content: (
        <div className='text-center dark:text-white'>
          <h2 className='text-2xl font-bold mb-2'>Welcome to Typit!</h2>
          <p className='mb-4 dark:text-gray-400'>This quick tour will guide you through the platform’s key features.</p>
          <p className='text-gray-400'>Click <strong>Next</strong> to proceed.</p>
        </div>
      ),
      placement: 'center',
      disableOverlay: true,
    },
    {
      target: '.shadow-card',
      content: "Here are your courses! Let's make your first one. Click 'Create New Course' to proceed.",
      spotlightClicks: true,
      placement: 'bottom',
    },
    {
      target: '.backdrop-blur-sm',
      content: "Add an exercise now! Click 'Upload' to proceed.",
      spotlightClicks: true,
      placement: 'bottom',
    },
    {
      target: '.shadow-md',
      content: "This is your Exercise! Click the Exercise icon to proceed.",
      spotlightClicks: true,
      placement: 'auto',
    },
  ];

  const handleJoyrideCallback = async (data: CallBackProps) => {
    const { status, index, action, type } = data;

    if (type === 'step:after' || type === 'error:target_not_found') {
      localStorage.setItem('tourStep', (index + 1).toString());
      setStepIndex(index + 1);
    }

    if (index === 2 && action === 'next') {
      navigate('/course/default-course', { replace: true });
    }

    if (index === 4 && action === 'next') {
      navigate('/exercise/default-exercise', { replace: true });
    }

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRunTour(false);
      localStorage.removeItem('tourStep');
      try {
        await updateUserById({
          id: userId,
          data: { tourCompleted: true },
        });
        navigate('/portal');
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
      spotlightClicks={true}
      continuous
      showSkipButton
      showProgress
      disableOverlayClose
      styles={{
        options: {
          arrowColor: colorMode === 'dark' ? '#333' : '#f0f4f8',
          backgroundColor: colorMode === 'dark' ? '#141E30' : '#fff',
          textColor: colorMode === 'dark' ? '#f0f4f8' : '#333',
          width: 500,
          zIndex: 99,
        },
        buttonNext: {
          backgroundColor: colorMode === 'dark' ? '#008080' : 'black',
          color: colorMode === 'dark' ? '#fff' : 'white',
        },
        buttonBack: {
          color: colorMode === 'dark' ? '#f0f4f8' : '#000000',
        },
        buttonSkip: {
          color: colorMode === 'dark' ? '#008080' : '#000000',
        },
      }}
    />
  );
};

export default UserTour;
