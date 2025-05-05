import { useCallback, useEffect } from 'react';
import { updateUser } from 'wasp/client/operations';
import { useAuth } from 'wasp/client/auth';
import useLocalStorage from './useLocalStorage';
import { toast } from 'sonner';

interface UseTourReturn {
  runTour: boolean;
  tourIndex: number;
  startTour: () => Promise<void>;
  stopTour: () => void;
  resetTour: () => Promise<void>;
  setTourIndex: (index: number) => void;
}

/**
 * Hook to manage the user tour state and provide control functions
 * @returns {UseTourReturn} Tour state and control functions
 */
const useTour = (): UseTourReturn => {
  const { data: user, isLoading } = useAuth();
  const [runTour, setRunTour] = useLocalStorage('run_tour', false);
  const [tourIndex, setTourIndex] = useLocalStorage('step_index', 0);

  // Auto-start tour for new users who haven't seen it yet
  useEffect(() => {
    // Only attempt to start the tour when user data is loaded
    if (!isLoading && user && user.tour_complete === false && !runTour) {
      // Start the tour automatically for new users
      console.log('[useTour] Auto-starting tour for new user:', user.id);
      setRunTour(true);
      setTourIndex(0);
    }
  }, [user, isLoading, runTour, setRunTour, setTourIndex]);

  /**
   * Starts or resumes the tour
   */
  const startTour = async (): Promise<void> => {
    console.log('[useTour] Manually starting tour');
    setRunTour(true);
    setTourIndex(0);
    
    // If user has completed the tour, reset the status
    if (user?.tour_complete) {
      try {
        console.log('[useTour] Resetting tour_complete to false');
        await updateUser({
          tour_complete: false,
        });
      } catch (error) {
        toast.error('Failed to reset tour status');
        console.error('[useTour] Error updating tour status:', error);
      }
    }
  };

  /**
   * Stops the tour without updating the tour_complete status
   * Note: The actual setting of tour_complete is handled by the
   * UserTour component's handleTourEnd function
   */
  const stopTour = useCallback((): void => {
    console.log('[useTour] Stopping tour (UI only, not updating tour_complete)');
    setRunTour(false);
    setTourIndex(0);
    // We don't update the tour_complete status here anymore
    // because that's handled by handleTourEnd in UserTour.tsx
  }, [setRunTour, setTourIndex]);

  /**
   * Resets the tour to the beginning and marks it as not complete
   */
  const resetTour = async (): Promise<void> => {
    console.log('[useTour] Resetting tour');
    setTourIndex(0);
    setRunTour(true);
    
    try {
      console.log('[useTour] Setting tour_complete to false');
      const response = await updateUser({
        tour_complete: false,
      });
      if(response.success) {
        toast.success('Tour reset successfully');
        window.location.href = '/portal';
      } else {
        toast.error('Failed to reset tour status');
        console.error('[useTour] Error resetting tour:', response.message);
      }
    } catch (error) {
      toast.error('Failed to reset tour status');
      console.error('[useTour] Error resetting tour:', error);
    }
  };

  return {
    runTour,
    tourIndex,
    startTour,
    stopTour,
    resetTour,
    setTourIndex,
  };
};

export default useTour; 