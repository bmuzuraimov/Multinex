import Essay from '../components/Essay';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import ExerciseResult from '../components/ExerciseResult';
import { getDemoExercise, useQuery } from 'wasp/client/operations';
import useParagraphIndex from '../hooks/useParagraphIndex';
import { updateExercise } from 'wasp/client/operations';
import { ENGLISH_LAYOUT } from '../../shared/constants';
import ExerciseSidebar from '../components/ExerciseSidebar';
import ExerciseTest from '../components/ExerciseTest';
import useExercise from '../hooks/useExercise';
import { useEffect } from 'react';

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
  const exerciseId = 'props.match.params.exerciseId';
  const { data: exercise, isLoading: isExerciseLoading, refetch } = useQuery(getDemoExercise);
  const raw_essay = exercise?.lessonText || 'Essay not found!';
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
  const essay_length = essay.split(' ').length;

  // Start of paragraph summary
  const summary = exercise?.paragraphSummary.split('|') ?? [];
  // End of paragraph summary

  const onKeyPress = async (button: string) => {
    const currentCharacterElement = essayCharsRef.current[currentCharacterIndex];
    const nextCharacterElement = essayCharsRef.current[currentCharacterIndex + 1];
    (currentCharacterElement as HTMLElement)?.scrollIntoView({ behavior: 'smooth', block: 'center' });

    if (currentCharacterIndex + 1 === essay.length) {
      const score = 100 - Math.round((errorIndices.length / essay.split('').length) * 100);
      updateExercise({ id: exerciseId, updated_data: { completed: true, score, completedAt: new Date() } });
      setMode('submitted');
    }

    // Remove styling from all previously styled elements if backspace was pressed
    if (button === '{backspace}') {
      if (currentCharacterIndex === 0) return;
      const prevCharacterElement = essayCharsRef.current[currentCharacterIndex - 1];
      (prevCharacterElement as HTMLElement)?.classList.remove(
        'bg-lime-200',
        'dark:bg-lime-800',
        'bg-red-200',
        'dark:bg-red-800',
        'bg-yellow-200',
        'dark:bg-yellow-800',
        'border-b-4',
        'border-sky-400',
        'dark:border-white'
      );
      (currentCharacterElement as HTMLElement)?.classList.remove('border-b-4', 'border-sky-400', 'dark:border-white');
      (prevCharacterElement as HTMLElement)?.classList.add('border-b-4', 'border-sky-400', 'dark:border-white');
      setCurrentCharacterIndex(currentCharacterIndex - 1);
      const nextChar = essay[currentCharacterIndex - 1];
      if (/[A-Z~!#$%^&*()_+{}|:"<>?]/.test(nextChar)) {
        if (keyboardState === 'default') {
          setKeyboardState('shift');
        }
      } else {
        if (keyboardState === 'shift') {
          setKeyboardState('default');
        }
      }
      let highlightAdd = nextChar;
      let highlightRemove = essay[currentCharacterIndex];
      if (highlightAdd == ' ') highlightAdd = '{space}';

      if (highlightRemove == ' ') highlightRemove = '{space}';
      keyboardRef.current?.removeButtonTheme(
        highlightRemove,
        document.documentElement.classList.contains('dark') ? 'bg-blue-800' : 'bg-blue-200'
      );
      keyboardRef.current?.addButtonTheme(
        highlightAdd,
        document.documentElement.classList.contains('dark') ? 'bg-blue-800' : 'bg-blue-200'
      );
      return;
    }
    const isCorrect =
      button === essay[currentCharacterIndex] ||
      (button === '{space}' && essay[currentCharacterIndex] === ' ') ||
      (button === '{enter}' && essay[currentCharacterIndex] === '\n');
    // Apply correct or incorrect styling based on comparison
    if (isCorrect) {
      if (errorIndices.includes(currentCharacterIndex)) {
        (currentCharacterElement as HTMLElement)?.classList.add('bg-yellow-200', 'dark:bg-yellow-800');
      } else {
        (currentCharacterElement as HTMLElement)?.classList.add('bg-lime-200', 'dark:bg-lime-800');
      }
      (currentCharacterElement as HTMLElement)?.classList.remove(
        'bg-red-200',
        'dark:bg-red-800',
        'border-b-4',
        'border-sky-400',
        'dark:border-white'
      );
    } else {
      setErrorIndices((prevIndices) => [...prevIndices, currentCharacterIndex]);
      (currentCharacterElement as HTMLElement)?.classList.add('bg-red-200', 'dark:bg-red-800');
      (currentCharacterElement as HTMLElement)?.classList.remove(
        'bg-lime-200',
        'dark:bg-lime-800',
        'border-b-4',
        'border-sky-400',
        'dark:border-white'
      );
    }
    (nextCharacterElement as HTMLElement)?.classList.add('border-b-4', 'border-sky-400', 'dark:border-white');
    setCurrentCharacterIndex((prevIndex) => prevIndex + 1);
    if (currentCharacterIndex + 1 < essay.length) {
      const nextChar = essay[currentCharacterIndex + 1];
      if (/[A-Z~!#$%^&*()_+{}|:"<>?]/.test(nextChar)) {
        // Check if nextChar is an alphabet character (A-Z)
        if (keyboardState === 'default') {
          setKeyboardState('shift');
        }
      } else {
        if (keyboardState === 'shift') {
          setKeyboardState('default');
        }
      }
      let highlightAdd = nextChar;
      let highlightRemove = essay[currentCharacterIndex];

      if (highlightAdd == ' ') highlightAdd = '{space}';

      if (highlightRemove == ' ') highlightRemove = '{space}';

      keyboardRef.current?.removeButtonTheme(
        highlightRemove,
        document.documentElement.classList.contains('dark') ? 'bg-blue-800' : 'bg-blue-200'
      );
      keyboardRef.current?.addButtonTheme(
        highlightAdd,
        document.documentElement.classList.contains('dark') ? 'bg-blue-800' : 'bg-blue-200'
      );
    }
  };

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
            <button
              onClick={() => setMode('test')}
              className='m-2 bg-teal-500 hover:bg-teal-600 text-white py-1 px-6 rounded-full shadow'
            >
              Take Test
            </button>
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
            paragraphIndex={paragraphIndex}
            hasQuiz={false}
            summary={summary}
            essay_length={essay_length}
            setMode={setMode}
          />
          <div className='w-full h-[calc(100vh-64px)] flex flex-col'>
            <div className='relative flex-1 w-5/6 h-2/3 pt-8 pb-4 mx-auto leading-10'>
              <p className='h-full overflow-y-auto'>
                <Essay
                  essay={essay}
                  essayCharsRef={essayCharsRef}
                  setCurrentCharacterIndex={setCurrentCharacterIndex}
                  setKeyboardState={setKeyboardState}
                />
              </p>
              <div
                className='absolute -bottom-0 left-0 right-0 bg-blue-600 h-1 rounded-full'
                style={{ width: progress + '%' }}
              ></div>
            </div>
            <div className='flex-1 h-1/3 bg-white dark:bg-gray-800'>
              <div className='w-5/6 h-full mx-auto'>
                <style>
                  {`
                    .dark .simple-keyboard {
                      background-color: rgb(31, 41, 55);
                      border-radius: 0.5rem;
                    }
                    .dark .simple-keyboard .hg-button {
                      background-color: rgb(55, 65, 81);
                      color: rgb(229, 231, 235);
                      border: none;
                      box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
                    }
                    .dark .simple-keyboard .hg-button:hover {
                      background-color: rgb(75, 85, 99);
                    }
                    .dark .simple-keyboard .hg-button.hg-activeButton {
                      background-color: rgb(55, 65, 81);
                    }
                  `}
                </style>
                <Keyboard
                  keyboardRef={(r) => (keyboardRef.current = r)}
                  onKeyPress={onKeyPress}
                  theme='hg-theme-default hg-layout-default'
                  layoutName={keyboardState}
                  layout={ENGLISH_LAYOUT}
                  physicalKeyboardHighlight={true}
                  physicalKeyboardHighlightPress={true}
                  physicalKeyboardHighlightTextColor={'yellow'}
                />
              </div>
            </div>
          </div>
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
