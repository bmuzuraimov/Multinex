import React, { useState, useEffect, useId } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { updateUserById } from 'wasp/client/operations';
import { useAuth } from 'wasp/client/auth';
import useColorMode from '../hooks/useColorMode';

interface UserTourProps {
  userId: string;
}

const UserTour: React.FC<UserTourProps> = ({ userId }) => {
  const [runTour, setRunTour] = useState<boolean>(false);
  const [colorMode, setColorMode] = useColorMode();
  const { data: user, isLoading } = useAuth();
  // ✅ Fetch `tourCompleted` from Backend
  useEffect(() => {
    const fetchUserTourStatus = async () => {
      try {
        if (user && !user.tourCompleted) {
          setRunTour(true); // ✅ Run tour if not completed
        }
      } catch (error) {
        console.error('Error fetching user tour status:', error);
      }
    };

    fetchUserTourStatus();
  }, [user, isLoading]);

  // ✅ Define Tour Steps
  const tourSteps: Step[] = [
    {
      target: 'body',
      content: (
        <div className='text-center dark:text-white'>
          <h2 className='text-2xl font-bold mb-2 dark:text-white'>Welcome to Your Portal!</h2>
          <p className='mb-4 dark:text-gray-400'>This quick tour will guide you through the platform’s key features.</p>
          <p className='text-gray-400'>
            Click <strong>Next</strong> to proceed or <strong>Skip</strong> to exit the tour.
          </p>
        </div>
      ),
      placement: 'center',
      disableOverlay: true,
    },
    { target: '.text-title-xxl', content: 'Welcome to your courses! Here you can see all the courses you are managing.', placement: 'bottom' },
    { target: '.shadow-card', content: 'This is where your courses are displayed. You can edit or delete them here.', placement: 'top' },
    { target: '.grid-cols-1.mb-12', content: 'Here are exercises that have not been assigned to any course yet.', placement: 'top' },
    { target: '.cursor-pointer', content: 'Click here to create a new course and start adding exercises!', placement: 'right' },
    // { target: '.course-card', content: 'This is a course card! Click to explore.', placement: 'bottom' },
  ];

  // ✅ Handle Tour Completion (Update Database)
  const handleJoyrideCallback = async (data: CallBackProps) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRunTour(false);
      try {
        await updateUserById({
          id: userId,
          data: { tourCompleted: true }, // ✅ Update DB to mark tour as completed
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
      callback={handleJoyrideCallback}
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
          color: colorMode === 'dark' ? '#f0f4f8' : '#00000',
        },
        buttonSkip: {
          color: colorMode === 'dark' ? '#008080' : '#00000',
        },
      }}
    />
  );
};

export default UserTour;
