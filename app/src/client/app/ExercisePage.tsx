import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, getExerciseById, updateExercise } from 'wasp/client/operations';
import ExerciseResult from '../components/ExerciseResult';
import ExerciseSidebar from '../components/ExerciseSidebar';
import ExerciseTest from '../components/ExerciseTest';
import ExerciseInterface from '../components/ExerciseInterface';
import { ExerciseProvider } from '../contexts/ExerciseContext';
import useExercise from '../hooks/useExercise';

const ExercisePage: React.FC = React.memo(() => {
  const { exerciseId } = useParams();
  const [textSize, setTextSize] = useState('xl');
  const [mode, setMode] = useState<'typing' | 'submitted' | 'test'>('typing');
  const [highlightedNodes, setHighlightedNodes] = useState<number[]>([0]);
  const { data: exercise, isLoading } = useQuery(getExerciseById, {
    exerciseId: exerciseId!,
  });


  const { essay, essayList, essayWordCount, essayCharCount, summary, hasQuiz } = useExercise(
    exerciseId!,
    exercise?.essay || '',
    exercise?.formattedEssay || [],
    exercise?.paragraphSummary || '',
    exercise?.questions || [],
    mode,
    textSize,
    exercise?.cursor || 0
  );

  // Set audio URL when exercise data changes
  useEffect(() => {
    if (exercise?.audioUrl && exercise?.audioTimestamps) {
      essayList.setAudio(exercise.audioUrl, exercise.audioTimestamps as { word: string; start: number; end: number }[]);
    }
  }, [exercise]);

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

  // Exercise submission handler
  const handleSubmitExercise = useCallback(async () => {
    const score = 100;
    await updateExercise({
      id: exerciseId!,
      updated_data: {
        completed: true,
        cursor: 0,
        score,
        completedAt: new Date(),
      },
    });

    setMode('submitted');
  }, [essay.length, exerciseId]);

  const contextValue = {
    essay,
    essayList,
    formattedEssay: exercise?.formattedEssay || [],
    essayWordCount,
    essayCharCount,
    mode,
    setMode,
    hasQuiz,
    audioTimestamps: exercise?.audioTimestamps || [],
    highlightedNodes,
    setHighlightedNodes,
    // UI references and settings
    textSize,
    setTextSize,
    onSubmitExercise: handleSubmitExercise,

    // Additional metadata
    summary,
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <ExerciseProvider value={contextValue}>
      <div className='relative'>
        {mode === 'typing' && (
          <div className='relative flex flex-row h-full'>
            <ExerciseSidebar />
            <ExerciseInterface />
          </div>
        )}
        {mode === 'submitted' && <ExerciseResult exerciseId={exerciseId!} />}
        {mode === 'test' && <ExerciseTest title={exercise?.name ?? ''} questions={exercise?.questions ?? []} />}
      </div>
    </ExerciseProvider>
  );
});

export default ExercisePage;
