import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ExerciseResult from '../components/ExerciseResult';
import { useParams } from 'react-router-dom'
import { useQuery, getExerciseById, updateExercise } from 'wasp/client/operations';
import useExercise from '../hooks/useExercise';
import useParagraphIndex from '../hooks/useParagraphIndex';
import ExerciseSidebar from '../components/ExerciseSidebar';
import ExerciseTest from '../components/ExerciseTest';
import usePlayback from '../hooks/usePlayback';
import TypingInterface from '../components/TypingInterface';

const ExercisePage: React.FC = React.memo(() => {
  // Prevent default tab, space and enter behavior
  useEffect(() => {
    const preventDefaultKeys = (e: KeyboardEvent) => {
      if (['Tab', ' ', 'Enter'].includes(e.key)) {
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', preventDefaultKeys);

    return () => {
      document.removeEventListener('keydown', preventDefaultKeys);
    };
  }, []);
  const { exerciseId } = useParams();
  const [speed, setSpeed] = useState(400);
  const { data: exercise, isLoading: isExerciseLoading, refetch } = useQuery(getExerciseById, { exerciseId: exerciseId! });
  const raw_essay = useMemo(() => exercise?.lessonText || 'Essay not found!', [exercise]);
  const {
    essay,
    progress,
    currentCharacterIndex,
    setCurrentCharacterIndex,
    errorIndices,
    setErrorIndices,
    mode,
    setMode,
    essayCharsRef,
  } = useExercise(raw_essay, 'prompt');
  const paragraphIndex = useParagraphIndex(essay, currentCharacterIndex);
  const essay_length = useMemo(() => essay.split(' ').length, [essay]);
  const summary = useMemo(() => (exercise?.paragraphSummary ? exercise.paragraphSummary.split('|') : []), [exercise]);
  
  // Handle submit exercise
  const onSubmitExercise = useCallback(async () => {
    const score = 100 - Math.round((errorIndices.length / essay.length) * 100);
    await updateExercise({ id: exerciseId!, updated_data: { completed: true, score, completedAt: new Date() } });
    setMode('submitted');
  }, [errorIndices, essay, exerciseId, updateExercise, setMode]);

  const { isPlaying, togglePlayback } = usePlayback({
    essay: raw_essay,
    essayCharsRef: essayCharsRef,
    setCurrentCharacterIndex: setCurrentCharacterIndex,
    onSubmitExercise: onSubmitExercise,
    speed,
  });
  const hasQuiz = useMemo(() => Boolean(exercise?.questions?.length), [exercise]);

  return (
    <div className='relative'>
      {mode === 'prompt' && (
        <div className='relative flex flex-col h-[calc(100vh-64px)] justify-center items-center mx-auto p-6 bg-gray dark:bg-gray-800 shadow-lg rounded-lg'>
          <div className='absolute top-8 left-8'>
            <button
              onClick={() => window.history.back()}
              className='flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg transition-all shadow-sm border border-gray-200 dark:border-gray-600'
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back
            </button>
          </div>
          <h1 className='text-3xl text-gray-900 dark:text-white'>{exercise?.name}</h1>
          <div
            className='w-1/2 p-4 my-4 bg-white dark:bg-gray-700 text-2xl text-gray-500 dark:text-gray-200 rounded'
            dangerouslySetInnerHTML={{ __html: exercise?.prompt ?? '' }}
          />
          <div className='w-1/3'>
            {hasQuiz && (
              <button
                onClick={() => setMode('test')}
                className='m-2 bg-teal-500 hover:bg-teal-600 text-white py-1 px-6 rounded-full shadow'
              >
                Take Test
              </button>
            )}
            <button
              onClick={() => setMode('typing')}
              className='m-2 float-right bg-green-500 hover:bg-green-600 text-white py-1 px-6 rounded-full shadow'
            >
              Start Exercise
            </button>
          </div>
        </div>
      )}
      {mode === 'typing' && (
        <div className='relative flex flex-row h-full'>
          <ExerciseSidebar
            hasQuiz={hasQuiz}
            paragraphIndex={paragraphIndex}
            summary={summary}
            essay_length={essay_length}
            setMode={setMode}
          />
          <TypingInterface
            essay={essay}
            essayCharsRef={essayCharsRef}
            progress={progress}
            isPlaying={isPlaying}
            togglePlayback={togglePlayback}
            setCurrentCharacterIndex={setCurrentCharacterIndex}
            setSpeed={setSpeed}
            speed={speed}
            currentCharacterIndex={currentCharacterIndex}
            onSubmitExercise={onSubmitExercise}
            setErrorIndices={setErrorIndices}
          />
        </div>
      )}
      {mode === 'submitted' && (
        <ExerciseResult exerciseId={exerciseId!} essay={essay} errorIndices={errorIndices} setMode={setMode} />
      )}
      {mode === 'test' && (
        <ExerciseTest title={exercise?.name ?? ''} questions={exercise?.questions ?? []} setMode={setMode} />
      )}
    </div>
  );
});

export default ExercisePage;
