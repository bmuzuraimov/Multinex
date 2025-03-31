import { useEffect, useState } from 'react';
import { updateExercise } from 'wasp/client/operations';
import { getExerciseById } from 'wasp/client/operations';

interface ExerciseTimerProps {
  exerciseId: string;
}

const ExerciseTimer: React.FC<ExerciseTimerProps> = ({ exerciseId }) => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeTimer = async () => {
      if (!initialized) {
        try {
          // First check if the exercise already has a started_at value
          const exerciseData = await getExerciseById({ exercise_id: exerciseId });
          
          // Only set started_at if it doesn't already exist
          if (!exerciseData.started_at) {
            await updateExercise({
              id: exerciseId,
              updated_data: {
                started_at: new Date()
              }
            });
            console.log('Exercise timer started');
          } else {
            console.log('Exercise timer already started at:', exerciseData.started_at);
          }
          
          setInitialized(true);
        } catch (error) {
          console.error('Failed to start exercise timer:', error);
        }
      }
    };

    initializeTimer();
  }, [exerciseId, initialized]);

  return null; // This component doesn't render anything
};

export default ExerciseTimer;