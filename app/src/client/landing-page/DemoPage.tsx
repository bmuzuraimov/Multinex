import ExerciseResult from '../components/ExerciseResult';
import { useQuery, getLandingPageTry } from 'wasp/client/operations';
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
  const userAgent = window.navigator.userAgent;
  const browserLanguage = window.navigator.language;
  const colorDepth = window.screen.colorDepth;
  const screenResolution = `${window.screen.width}x${window.screen.height}`;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const { data: landingPageTry } = useQuery(getLandingPageTry, {userAgent, browserLanguage, colorDepth, screenResolution, timezone});
  const raw_essay = useMemo(() => landingPageTry?.lessonText || 'Essay not found!', [landingPageTry]);
  
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
  } = useExercise(raw_essay, 'typing');

  const paragraphIndex = useParagraphIndex(essay, currentCharacterIndex);
  const essay_length = useMemo(() => essay.split(' ').length, [essay]);
  const [keyboardVisible, , toggleKeyboard] = useKeyboard();
  const summary = useMemo(() => (landingPageTry?.paragraphSummary ? landingPageTry.paragraphSummary.split('|') : []), [landingPageTry]);

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

  const hasQuiz = false;

  return (
    <div className='relative'>
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
        <ExerciseResult exerciseId={landingPageTry?.id ?? ''} essay={essay} errorIndices={errorIndices} setMode={setMode} />
      )}
      {mode === 'test' && (
        <ExerciseTest title={''} questions={[]} setMode={setMode} />
      )}
    </div>
  );
}
