import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, getExerciseById, updateExercise } from 'wasp/client/operations';
import ExerciseResult from '../components/ExerciseResult';
import ExerciseSidebar from '../components/ExerciseSidebar';
import ExerciseTest from '../components/ExerciseTest';
import TypingInterface from '../components/TypingInterface';
import { ExerciseProvider } from '../contexts/ExerciseContext';
import useExercise from '../hooks/useExercise';
import usePlayback from '../hooks/usePlayback';

const ExercisePage: React.FC = React.memo(() => {
  const { exerciseId } = useParams();
  const [speed, setSpeed] = useState(400);
  const [textSize, setTextSize] = useState('2xl');
  const [mode, setMode] = useState<'typing' | 'submitted' | 'test'>('typing');

  const { data: exercise, isLoading } = useQuery(getExerciseById, { 
    exerciseId: exerciseId! 
  });

  const {
    essay,
    formattedEssay,
    progress,
    currentCharacterIndex,
    setCurrentCharacterIndex,
    errorIndices,
    setErrorIndices,
    essayCharsRef,
  } = useExercise(exercise?.lessonText || '', mode);

  // Prevent default keyboard behavior
  useEffect(() => {
    const preventDefaultKeys = (e: KeyboardEvent) => {
      if (['Tab', ' ', 'Enter'].includes(e.key)) {
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', preventDefaultKeys);
    return () => document.removeEventListener('keydown', preventDefaultKeys);
  }, []);

  // Derived state
  const essayWordCount = useMemo(() => essay.split(' ').length, [essay]);
  const paragraphSummaries = useMemo(
    () => exercise?.paragraphSummary?.split('|') || [], 
    [exercise]
  );
  const hasQuiz = useMemo(
    () => Boolean(exercise?.questions?.length), 
    [exercise]
  );

  // Exercise submission handler
  const handleSubmitExercise = useCallback(async () => {
    const score = 100 - Math.round((errorIndices.length / essay.length) * 100);
    await updateExercise({ 
      id: exerciseId!,
      updated_data: { 
        completed: true, 
        score,
        completedAt: new Date() 
      }
    });
    setMode('submitted');
  }, [errorIndices.length, essay.length, exerciseId]);

  const { isPlaying, togglePlayback, setAudioTime } = usePlayback({
    essay,
    essayCharsRef,
    setCurrentCharacterIndex,
    onSubmitExercise: handleSubmitExercise,
    speed,
    audioUrl: exercise?.audioUrl || '',
    audioTimestamps: exercise?.audioTimestamps || [],
  });

  const contextValue = {
    // Core essay content
    essay,
    formattedEssay,
    essay_length: essayWordCount,
    
    // Navigation and progress
    currentCharacterIndex,
    setCurrentCharacterIndex,
    progress,
    
    // Exercise state
    mode,
    setMode,
    errorIndices, 
    setErrorIndices,
    hasQuiz,
    
    // Audio playback
    audioTimestamps: exercise?.audioTimestamps || [],
    isPlaying,
    togglePlayback,
    speed,
    setSpeed,
    setAudioTime,
    
    // UI references and settings
    essayCharsRef,
    textSize,
    setTextSize,
    
    // Exercise completion
    onSubmitExercise: handleSubmitExercise,
    
    // Additional metadata
    summary: paragraphSummaries,
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ExerciseProvider value={contextValue}>
      <div className="relative">
        {mode === 'typing' && (
          <div className="relative flex flex-row h-full">
            <ExerciseSidebar />
            <TypingInterface />
          </div>
        )}
        {mode === 'submitted' && <ExerciseResult exerciseId={exerciseId!} />}
        {mode === 'test' && (
          <ExerciseTest 
            title={exercise?.name ?? ''} 
            questions={exercise?.questions ?? []} 
          />
        )}
      </div>
    </ExerciseProvider>
  );
});

export default ExercisePage;
