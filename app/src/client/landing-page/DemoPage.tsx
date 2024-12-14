import ExerciseResult from '../components/ExerciseResult';
import { getDemoExercise, useQuery } from 'wasp/client/operations';
import useParagraphIndex from '../hooks/useParagraphIndex';
import ExerciseSidebar from '../components/ExerciseSidebar';
import ExerciseTest from '../components/ExerciseTest';
import useExercise from '../hooks/useExercise';
import useKeyboard from '../hooks/useKeyboard';
import usePlayback from '../hooks/usePlayback';
import TypingInterface from '../components/TypingInterface';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function DemoPage() {
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

  const [speed, setSpeed] = useState(400);
  const exerciseId = 'demo';
  const { data: exercise, isLoading: isExerciseLoading, refetch } = useQuery(getDemoExercise);
  const raw_essay = useMemo(() => exercise?.lessonText || 'Essay not found!', [exercise]);
  
  const {
    essay,
    progress,
    currentCharacterIndex,
    setCurrentCharacterIndex,
    errorIndices,
    setErrorIndices,
    keyboardState,
    setKeyboardState,
    mode,
    setMode,
    essayCharsRef,
  } = useExercise(raw_essay);

  const paragraphIndex = useParagraphIndex(essay, currentCharacterIndex);
  const essay_length = useMemo(() => essay.split(' ').length, [essay]);
  const [keyboardVisible, , toggleKeyboard] = useKeyboard();
  const summary = useMemo(() => (exercise?.paragraphSummary ? exercise.paragraphSummary.split('|') : []), [exercise]);

  const onSubmitExercise = useCallback(async () => {
    const score = 100 - Math.round((errorIndices.length / essay.length) * 100);
    setMode('submitted');
  }, [errorIndices, essay, setMode]);

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
        <ExerciseResult exerciseId={exerciseId} essay={essay} errorIndices={errorIndices} setMode={setMode} />
      )}
      {mode === 'test' && (
        <ExerciseTest title={exercise?.name ?? ''} questions={exercise?.questions ?? []} setMode={setMode} />
      )}
    </div>
  );
}
