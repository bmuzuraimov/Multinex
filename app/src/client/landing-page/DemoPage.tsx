import ExerciseResult from '../components/ExerciseResult';
import { useQuery, getLandingPageTry } from 'wasp/client/operations';
import ExerciseSidebar from '../components/ExerciseSidebar';
import ExerciseTest from '../components/ExerciseTest';
import useExercise from '../hooks/useExercise';
import usePlayback from '../hooks/usePlayback';
import TypingInterface from '../components/TypingInterface';
import { useCallback, useEffect, useMemo, useState } from 'react';
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

  const [speed, setSpeed] = useState(400);
  const [textSize, setTextSize] = useState('2xl');
  const userAgent = window.navigator.userAgent;
  const browserLanguage = window.navigator.language;
  const screenResolution = `${window.screen.width}x${window.screen.height}`;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const { data: landingPageTry } = useQuery(getLandingPageTry, {
    userAgent,
    browserLanguage,
    screenResolution,
    timezone,
  });
  const raw_essay = useMemo(() => landingPageTry?.lessonText || 'Essay not found!', [landingPageTry]);
  const {
    essay,
    formattedEssay,
    progress,
    currentCharacterIndex,
    setCurrentCharacterIndex,
    errorIndices,
    setErrorIndices,
    mode,
    setMode,
    essayCharsRef,
  } = useExercise(raw_essay, 'typing');

  const essay_length = useMemo(() => essay.split(' ').length, [essay]);
  const summary = useMemo(
    () => (landingPageTry?.paragraphSummary ? landingPageTry.paragraphSummary.split('|') : []),
    [landingPageTry]
  );

  const onSubmitExercise = useCallback(async () => {
    const score = 100 - Math.round((errorIndices.length / essay.length) * 100);
    setMode('submitted');
  }, [errorIndices, essay, setMode]);

  const { isPlaying, togglePlayback, setAudioTime } = usePlayback({
    essay: raw_essay,
    essayCharsRef: essayCharsRef,
    setCurrentCharacterIndex: setCurrentCharacterIndex,
    onSubmitExercise: onSubmitExercise,
    speed,
    audioUrl: '',
    audioTimestamps: landingPageTry?.audioTimestamps || [],
  });

  const contextValue = {
    essay,
    formattedEssay,
    progress,
    currentCharacterIndex,
    setCurrentCharacterIndex,
    errorIndices,
    setErrorIndices,
    mode,
    setMode,
    essayCharsRef,
    isPlaying,
    togglePlayback,
    speed,
    setSpeed,
    onSubmitExercise,
    hasQuiz: false,
    summary,
    essay_length,
    textSize,
    setTextSize,
    audioTimestamps: [],
    setAudioTime,
  };

  return (
    <ExerciseProvider value={contextValue}>
      <div className='relative'>
        {mode === 'typing' && (
          <div className='relative flex flex-row h-full'>
            <ExerciseSidebar />
            <TypingInterface />
          </div>
        )}
        {mode === 'submitted' && <ExerciseResult exerciseId={landingPageTry?.id ?? ''} />}
        {mode === 'test' && <ExerciseTest title={''} questions={[]} />}
      </div>
    </ExerciseProvider>
  );
}
