import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Joyride, { CallBackProps, STATUS, Step, ACTIONS } from 'react-joyride';
import { updateUser } from 'wasp/client/operations';
import { useAuth } from 'wasp/client/auth';
import useColorMode from '../hooks/useColorMode';
import useTour from '../hooks/useTour';
import { JOYRIDE_STYLES, TOUR_STEPS } from '../../shared/constants/tour';
import { toast } from 'sonner';

const UserTour: React.FC<{
  user_id: string;
}> = ({ user_id }) => {
  const { data: user } = useAuth();
  const { runTour, tourIndex, setTourIndex, stopTour } = useTour();
  const [color_mode] = useColorMode();
  const navigate = useNavigate();
  const location = useLocation();
  const [steps, setSteps] = useState<Step[]>([]);
  const [targetElementsVerified, setTargetElementsVerified] = useState(false);
  const verificationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const navigationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const verificationAttemptsRef = useRef(0);
  const hasNavigatedRef = useRef<Record<string, boolean>>({});
  const isLastStep = tourIndex === TOUR_STEPS.length - 1;

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (verificationTimerRef.current) clearTimeout(verificationTimerRef.current);
      if (navigationTimerRef.current) clearTimeout(navigationTimerRef.current);
    };
  }, []);

  // Set current active step
  useEffect(() => {
    if (runTour && tourIndex >= 0 && tourIndex < TOUR_STEPS.length) {
      // Only show the current step with any needed modifications
      const currentStep = { ...TOUR_STEPS[tourIndex] };
      
      // For the last step, ensure spotlight clicks are enabled
      if (isLastStep) {
        currentStep.spotlightClicks = true;
      }
      
      setSteps([currentStep]);
      
      // Reset verification when step changes
      setTargetElementsVerified(false);
      verificationAttemptsRef.current = 0;
    }
  }, [tourIndex, isLastStep, runTour]);

  // Verify target elements exist before showing tour step
  useEffect(() => {
    if (!runTour || tourIndex < 0 || tourIndex >= TOUR_STEPS.length) {
      return;
    }

    const currentStep = TOUR_STEPS[tourIndex];
    
    // Body target always exists and needs no verification
    if (currentStep.target === 'body') {
      setTargetElementsVerified(true);
      return;
    }
    
    // For specific DOM targets, verify they exist
    const checkElementExists = () => {
      if (verificationAttemptsRef.current >= 10) {
        console.warn(`Tour step ${tourIndex} target "${currentStep.target}" not found after multiple attempts`);
        
        // If we're stuck on an element that doesn't exist, try to recover
        if (tourIndex > 0) {
          // Go back to previous step
          setTourIndex(tourIndex - 1);
        } else {
          // Just skip verification for the first step - show it anyway
          setTargetElementsVerified(true);
        }
        return;
      }

      const targetElement = document.querySelector(currentStep.target as string);
      if (targetElement) {
        console.log(`[UserTour] Tour element "${currentStep.target}" found`);
        setTargetElementsVerified(true);
        verificationAttemptsRef.current = 0;
      } else {
        verificationAttemptsRef.current += 1;
        console.log(`[UserTour] Tour element "${currentStep.target}" not found. Attempt ${verificationAttemptsRef.current}`);
        
        // Exponential backoff for retries (max 2000ms)
        const retryDelay = Math.min(2000, 500 * Math.pow(1.5, verificationAttemptsRef.current - 1));
        
        verificationTimerRef.current = setTimeout(checkElementExists, retryDelay);
      }
    };
    
    // Start verification
    checkElementExists();
    
    return () => {
      if (verificationTimerRef.current) {
        clearTimeout(verificationTimerRef.current);
      }
    };
  }, [runTour, tourIndex, location.pathname, setTourIndex]);

  // Handle route navigation based on tour steps
  useEffect(() => {
    if (!runTour || !user_id) return;

    // Map step indexes to required routes
    const stepRoutes: Record<number, string> = {
      0: '/', // Welcome step - home page
      1: '/', // Courses tab on home page
      2: `/course/welcome-course-${user_id}`, // Course page
      3: `/course/welcome-course-${user_id}`, // Course page
      4: `/course/welcome-course-${user_id}` // Course page
    };

    const currentStep = tourIndex;
    const expectedRoute = stepRoutes[currentStep];
    
    // Only navigate if we're on the wrong route and haven't tried this navigation already
    if (expectedRoute && !location.pathname.includes(expectedRoute) && !hasNavigatedRef.current[`${currentStep}-${expectedRoute}`]) {
      console.log(`[UserTour] Step ${currentStep} requires route ${expectedRoute}, navigating...`);
      
      // Mark this navigation as attempted
      hasNavigatedRef.current[`${currentStep}-${expectedRoute}`] = true;
      
      try {
        navigate(expectedRoute, { replace: true });
      } catch (error) {
        console.error('[UserTour] Navigation error during tour:', error);
        toast.error('Failed to navigate to the required page');
      }
    }
  }, [runTour, tourIndex, user_id, location.pathname, navigate]);

  // Handles all tour callbacks
  const handleTourCallback = async (data: CallBackProps) => {
    const { status, action, type } = data;
    
    console.log(`[UserTour] Tour callback: status=${status}, action=${action}, type=${type}, tourIndex=${tourIndex}, isLastStep=${isLastStep}`);

    // Handle any finish condition
    if (status === STATUS.FINISHED || 
        (isLastStep && action === ACTIONS.NEXT) || 
        (isLastStep && type === 'step:after')) {
      console.log('[UserTour] Tour finished condition met, ending tour');
      await handleTourEnd(STATUS.FINISHED);
      return;
    }

    // Handle skip/close
    if (action === ACTIONS.CLOSE || status === STATUS.SKIPPED) {
      console.log('[UserTour] Tour skipped or closed');
      await handleTourEnd(STATUS.SKIPPED);
      return;
    }

    // Handle step navigation for non-last steps
    if (type === 'step:after') {
      // Next button pressed
      if (action === ACTIONS.NEXT && !isLastStep) {
        setTourIndex(tourIndex + 1);
      } 
      // Back button pressed
      else if (action === ACTIONS.PREV && tourIndex > 0) {
        setTourIndex(tourIndex - 1);
      }
      
      // Reset verification state for new step
      setTargetElementsVerified(false);
      verificationAttemptsRef.current = 0;
    }
  };

  // Handle tour end (whether finished or skipped)
  const handleTourEnd = async (status: string) => {
    console.log('[UserTour] Ending tour with status:', status);
    
    // First, stop the tour UI by setting runTour to false
    stopTour();
    setTourIndex(0);
    
    try {
      // Update user's tour status to completed
      console.log('[UserTour] Setting tour_complete to TRUE');
      const updateResult = await updateUser({
        tour_complete: true,
      });
      
      console.log('[UserTour] Tour completed and user status updated:', updateResult);
      
      // Navigate to welcome exercise after completion (only if finished, not if skipped)
      if (status === STATUS.FINISHED && user_id) {
        try {
          navigate(`/exercise/welcome-exercise-${user_id}`, { replace: true });
        } catch (error) {
          console.error('Navigation error after tour completion:', error);
          toast.error('Failed to navigate to welcome exercise');
        }
      }
    } catch (error) {
      console.error('Error updating tour status:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update tour status');
    }
  };
  // Don't render anything if tour isn't running or target verification hasn't completed
  if (user?.tour_complete || !runTour || !targetElementsVerified || steps.length === 0) {
    return null;
  }

  return (
    <Joyride
      steps={steps}
      stepIndex={0} // Always 0 since we're only showing one step at a time
      run={runTour}
      callback={handleTourCallback}
      continuous
      showSkipButton
      showProgress
      disableOverlayClose
      scrollToFirstStep
      scrollOffset={100}
      spotlightClicks={isLastStep} // Enable spotlight clicks on last step
      locale={{
        back: 'Previous',
        close: 'Skip',
        last: isLastStep ? 'Finish' : 'Next',
        next: isLastStep ? 'Finish' : 'Next',
        skip: 'Skip Tour',
      }}
      styles={JOYRIDE_STYLES(color_mode as 'dark' | 'light')}
    />
  );
};

export default UserTour;
