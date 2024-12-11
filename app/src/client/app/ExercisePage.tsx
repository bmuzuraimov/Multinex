import { RouteComponentProps } from 'react-router-dom';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import 'react-simple-keyboard/build/css/index.css';
import ExerciseResult from '../components/ExerciseResult';
import { useQuery, getExerciseById, updateExercise } from 'wasp/client/operations';
import { useAuth } from 'wasp/client/auth';
import useExercise from '../hooks/useExercise';
import useParagraphIndex from '../hooks/useParagraphIndex';
import useKeyboard from '../hooks/useKeyboard';
import ExerciseSidebar from '../components/ExerciseSidebar';
import ExerciseTest from '../components/ExerciseTest';
import usePlayback from '../hooks/usePlayback';
import TypingInterface from '../components/TypingInterface';

const ExercisePage: React.FC<RouteComponentProps<{ exerciseId: string }>> = React.memo(({ match }) => {
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
  const exerciseId = match.params.exerciseId;
  const [speed, setSpeed] = useState(400);
  const { data: currentUser } = useAuth();
  const { data: exercise, isLoading: isExerciseLoading, refetch } = useQuery(getExerciseById, { exerciseId });
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
    keyboardRef,
    essayCharsRef,
  } = useExercise(raw_essay);
  const paragraphIndex = useParagraphIndex(essay, currentCharacterIndex);
  const essay_length = useMemo(() => essay.split(' ').length, [essay]);
  const [keyboardVisible, , toggleKeyboard] = useKeyboard();
  const summary = useMemo(() => (exercise?.paragraphSummary ? exercise.paragraphSummary.split('|') : []), [exercise]);
  
  // Handle submit exercise
  const onSubmitExercise = useCallback(async () => {
    const score = 100 - Math.round((errorIndices.length / essay.length) * 100);
    await updateExercise({ id: exerciseId, updated_data: { completed: true, score, completedAt: new Date() } });
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

  const skipParagraph = useCallback(() => {
    // Find next paragraph start
    let nextIndex = currentCharacterIndex;
    while (nextIndex < essay.length && essay[nextIndex] !== '\n') {
      nextIndex++;
    }
    nextIndex++; // Move past the newline

    // Clear highlights from current to next paragraph
    for (let i = currentCharacterIndex; i < nextIndex; i++) {
      const charElement = essayCharsRef.current[i];
      if (charElement) {
        charElement.classList.remove(
          'bg-lime-200',
          'dark:bg-lime-800',
          'bg-red-200',
          'dark:bg-red-800',
          'border-b-4',
          'border-sky-400',
          'dark:border-white'
        );
      }
    }

    setCurrentCharacterIndex(nextIndex);

    // Add cursor to new position
    const nextCharElement = essayCharsRef.current[nextIndex];
    nextCharElement?.classList.add('border-b-4', 'border-sky-400', 'dark:border-white');
  }, [currentCharacterIndex, essay, essayCharsRef, setCurrentCharacterIndex]);

  const onKeyPress = useCallback(
    async (button: string) => {
      const currentCharacterElement = essayCharsRef.current[currentCharacterIndex];
      const nextCharacterElement = essayCharsRef.current[currentCharacterIndex + 1];
      (currentCharacterElement as HTMLElement)?.scrollIntoView({ behavior: 'smooth', block: 'center' });

      if (currentCharacterIndex + 1 === essay.length) {
        onSubmitExercise();
      }

      if (button === '{backspace}') {
        if (currentCharacterIndex === 0) return;
        const prevCharacterElement = essayCharsRef.current[currentCharacterIndex - 1];
        const classesToRemove = [
          'bg-lime-200',
          'dark:bg-lime-800',
          'bg-red-200',
          'dark:bg-red-800',
          'border-b-4',
          'border-sky-400',
          'dark:border-white',
        ] as const;
        const currentClassesToRemove = ['border-b-4', 'border-sky-400', 'dark:border-white'];
        prevCharacterElement?.classList.remove(...classesToRemove);
        currentCharacterElement?.classList.remove(...currentClassesToRemove);
        prevCharacterElement?.classList.add('border-b-4', 'border-sky-400', 'dark:border-white');
        setCurrentCharacterIndex(currentCharacterIndex - 1);

        const nextChar = essay[currentCharacterIndex - 1];
        setKeyboardState((prevState) =>
          /[A-Z~!#$%^&*()_+{}|:"<>?]/.test(nextChar)
            ? prevState === 'default'
              ? 'shift'
              : prevState
            : prevState === 'shift'
              ? 'default'
              : prevState
        );

        let highlightAdd = nextChar === ' ' ? '{space}' : nextChar;
        let highlightRemove = essay[currentCharacterIndex] === ' ' ? '{space}' : essay[currentCharacterIndex];

        keyboardRef.current?.removeButtonTheme(
          highlightRemove,
          document.documentElement.classList.contains('dark') ? 'bg-blue-800' : 'bg-blue-300'
        );
        keyboardRef.current?.addButtonTheme(
          highlightAdd,
          document.documentElement.classList.contains('dark') ? 'bg-blue-800' : 'bg-blue-300'
        );
        return;
      }

      if (button === '{tab}') {
        // Find the start of the current word
        let wordStart = currentCharacterIndex;
        while (wordStart > 0 && essay[wordStart - 1] !== ' ' && essay[wordStart - 1] !== '\n') {
          wordStart--;
        }
        // Find the end of the current word
        let wordEnd = currentCharacterIndex;
        while (wordEnd < essay.length && essay[wordEnd] !== ' ' && essay[wordEnd] !== '\n') {
          wordEnd++;
        }

        // Remove old highlight from current character
        const currentCharElement = essayCharsRef.current[currentCharacterIndex];
        if (currentCharElement) {
          currentCharElement.classList.remove('border-b-4', 'border-sky-400', 'dark:border-white');
        }

        // Highlight the entire word
        for (let i = wordStart; i < wordEnd; i++) {
          const charElement = essayCharsRef.current[i];
          if (charElement) {
            charElement.classList.add('bg-lime-200', 'dark:bg-lime-800');
            charElement.classList.remove(
              'bg-red-200',
              'dark:bg-red-800',
              'border-b-4',
              'border-sky-400',
              'dark:border-white'
            );
          }
        }

        // Update progress
        const newProgress = (wordEnd / essay.length) * 100;
        setKeyboardState('default');
        setKeyboardState((prev) => prev); // Trigger re-render if necessary

        // Update character index
        setCurrentCharacterIndex(wordEnd);

        // Add border bottom to next character
        const nextCharElement = essayCharsRef.current[wordEnd];
        if (nextCharElement) {
          nextCharElement.classList.add('border-b-4', 'border-sky-400', 'dark:border-white');
        }

        // Update keyboard themes for the next character
        if (wordEnd < essay.length) {
          const nextChar = essay[wordEnd];
          setKeyboardState((prevState) =>
            /[A-Z~!#$%^&*()_+{}|:"<>?]/.test(nextChar)
              ? prevState === 'default'
                ? 'shift'
                : prevState
              : prevState === 'shift'
                ? 'default'
                : prevState
          );

          let highlightAdd = nextChar === ' ' ? '{space}' : nextChar;
          let highlightRemove = essay[wordEnd - 1] === ' ' ? '{space}' : essay[wordEnd - 1];

          keyboardRef.current?.removeButtonTheme(
            highlightRemove,
            document.documentElement.classList.contains('dark') ? 'bg-blue-800' : 'bg-blue-300'
          );
          keyboardRef.current?.addButtonTheme(
            highlightAdd,
            document.documentElement.classList.contains('dark') ? 'bg-blue-800' : 'bg-blue-300'
          );
        }

        return;
      }

      const isCorrect =
        button === essay[currentCharacterIndex] ||
        (button === '{space}' && essay[currentCharacterIndex] === ' ') ||
        (button === '{enter}' && essay[currentCharacterIndex] === '\n');

      if (isCorrect) {
        currentCharacterElement?.classList.add('bg-lime-200', 'dark:bg-lime-800');
        currentCharacterElement?.classList.remove(
          'bg-red-200',
          'dark:bg-red-800',
          'border-b-4',
          'border-sky-400',
          'dark:border-white'
        );
      } else {
        setErrorIndices((prevIndices) => [...prevIndices, currentCharacterIndex]);
        currentCharacterElement?.classList.add('bg-red-200', 'dark:bg-red-800');
        currentCharacterElement?.classList.remove(
          'bg-lime-200',
          'dark:bg-lime-800',
          'border-b-4',
          'border-sky-400',
          'dark:border-white'
        );
      }

      nextCharacterElement?.classList.add('border-b-4', 'border-sky-400', 'dark:border-white');
      setCurrentCharacterIndex((prevIndex) => prevIndex + 1);

      if (currentCharacterIndex + 1 < essay.length) {
        const nextChar = essay[currentCharacterIndex + 1];
        setKeyboardState((prevState) =>
          /[A-Z~!#$%^&*()_+{}|:"<>?]/.test(nextChar)
            ? prevState === 'default'
              ? 'shift'
              : prevState
            : prevState === 'shift'
              ? 'default'
              : prevState
        );

        let highlightAdd = nextChar === ' ' ? '{space}' : nextChar;
        let highlightRemove = essay[currentCharacterIndex] === ' ' ? '{space}' : essay[currentCharacterIndex];

        keyboardRef.current?.removeButtonTheme(
          highlightRemove,
          document.documentElement.classList.contains('dark') ? 'bg-blue-800' : 'bg-blue-300'
        );
        keyboardRef.current?.addButtonTheme(
          highlightAdd,
          document.documentElement.classList.contains('dark') ? 'bg-blue-800' : 'bg-blue-300'
        );
      }
    },
    [
      essay,
      currentCharacterIndex,
      errorIndices,
      essayCharsRef,
      keyboardRef,
      keyboardState,
      setKeyboardState,
      setCurrentCharacterIndex,
      setErrorIndices,
      setMode,
      exercise,
      exerciseId,
      currentUser,
    ]
  );

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
            keyboardVisible={keyboardVisible}
            keyboardRef={keyboardRef}
            onKeyPress={onKeyPress}
            keyboardState={keyboardState}
            isPlaying={isPlaying}
            togglePlayback={togglePlayback}
            skipParagraph={skipParagraph}
            setKeyboardState={setKeyboardState}
            setCurrentCharacterIndex={setCurrentCharacterIndex}
            setSpeed={setSpeed}
            speed={speed}
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
});

export default ExercisePage;
