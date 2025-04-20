import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Joyride, { CallBackProps, STATUS } from 'react-joyride';
import { updateUser } from 'wasp/client/operations';
import { useAuth } from 'wasp/client/auth';
import useColorMode from '../hooks/useColorMode';
import useLocalStorage from '../hooks/useLocalStorage';
import { JOYRIDE_STYLES, TOUR_STEPS } from '../../shared/constants/tour';
import { toast } from 'sonner';
const UserTour: React.FC<{
  user_id: string;
}> = ({ user_id }) => {
  const [run_tour, setRunTour] = useLocalStorage('run_tour', false);
  const [color_mode] = useColorMode();
  const { data: user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [step_index, setStepIndex] = useLocalStorage('step_index', 0);

  useEffect(() => {
    if (user && !user.tour_complete) {
      setRunTour(true);
    }
  }, [user, isLoading, setRunTour]);

  const handleTourCallback = async (data: CallBackProps) => {
    const { status, index, action, type } = data;

    if (type === 'step:after') {
      setStepIndex(index + (action === 'next' ? 1 : -1));
    }

    if (action === 'next' && index === 2) {
      navigate(`/course/welcome-course-${user_id}`, { replace: true });
    } else if (action === 'prev' && index === 3) {
      navigate('/', { replace: true });
    }

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRunTour(false);
      setStepIndex(0);
      try {
        await updateUser({
          tour_complete: true,
        });
        if (status === STATUS.FINISHED) {
          navigate(`/exercise/welcome-exercise-${user_id}`, { replace: true });
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Error updating tour status');
      }
    }
  };

  return (
    <Joyride
      steps={TOUR_STEPS}
      run={run_tour}
      stepIndex={step_index}
      callback={handleTourCallback}
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
      styles={JOYRIDE_STYLES(color_mode as 'dark' | 'light')}
    />
  );
};

export default UserTour;
