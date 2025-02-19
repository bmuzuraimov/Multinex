import ExerciseResult from '../components/ExerciseResult';
import { useQuery, getLandingPageTry } from 'wasp/client/operations';
import ExerciseSidebar from '../components/ExerciseSidebar';
import ExerciseTest from '../components/ExerciseTest';
import useExercise from '../hooks/useExercise';
import ExerciseInterface from '../components/ExerciseInterface';
import { useCallback, useEffect, useState } from 'react';
import { ExerciseProvider } from '../contexts/ExerciseContext';

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

  const [textSize, setTextSize] = useState('2xl');
  const userAgent = window.navigator.userAgent;
  const browserLanguage = window.navigator.language;
  const screenResolution = `${window.screen.width}x${window.screen.height}`;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const { data: landingPageTry, isLoading } = useQuery(getLandingPageTry, {
    userAgent,
    browserLanguage,
    screenResolution,
    timezone,
  });
  const {
    essay,
    essayList,
    essayWordCount,
    essayCharCount,
    mode,
    setMode,
    summary,
    hasQuiz,
  } = useExercise(landingPageTry?.id || '', landingPageTry?.essay || '', landingPageTry?.formattedEssay || [], landingPageTry?.paragraphSummary || '', landingPageTry?.questions || [], 'typing', textSize, landingPageTry?.cursor || 0);

  const onSubmitExercise = useCallback(async () => {
    setMode('submitted');
  }, [essayCharCount, setMode]);

  const contextValue = {
    essay,
    essayList,
    formattedEssay: landingPageTry?.formattedEssay || [],
    mode,
    setMode,
    onSubmitExercise,
    hasQuiz: false,
    summary,
    essayWordCount,
    essayCharCount,
    textSize,
    setTextSize,
    audioTimestamps: [],
  };

  return (
    <ExerciseProvider value={contextValue}>
      <div className='relative'>
        {mode === 'typing' && (
          <div className='relative flex flex-row h-full'>
            <ExerciseSidebar />
            <ExerciseInterface />
          </div>
        )}
        {mode === 'submitted' && <ExerciseResult exerciseId={landingPageTry?.id ?? ''} />}
        {mode === 'test' && <ExerciseTest title={''} questions={[]} />}
      </div>
    </ExerciseProvider>
  );
}
