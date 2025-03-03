import React, { useCallback, useEffect, useState } from 'react';
import { useQuery, getDemoExercise } from 'wasp/client/operations';
import ExerciseResult from '../components/ExerciseResult';
import ExerciseSidebar from '../components/ExerciseSidebar';
import ExerciseTest from '../components/ExerciseTest';
import ExerciseInterface from '../components/ExerciseInterface';
import { ExerciseProvider } from '../contexts/ExerciseContext';
import useExercise from '../hooks/useExercise';
import { AudioTimestamp } from '../utils/AudioController';
import { Option } from 'wasp/entities';

type DemoExerciseResult = {
  id: string;
  createdAt: Date;
  userAgent: string;
  browserLanguage: string | null;
  screenResolution: string | null;
  timezone: string | null;
  exerciseId: string;
  exercise: {
    id: string;
    name: string;
    paragraphSummary: string;
    level: string;
    truncated: boolean;
    no_words: number;
    completed: boolean;
    completedAt: Date | null;
    score: number;
    model: string;
    userEvaluation: number | null;
    userId: string | null;
    topicId: string | null;
    questions: Array<{
      id: string;
      text: string;
      exerciseId: string;
      createdAt: Date;
      options: Option[];
    }>;
    audioTimestamps: AudioTimestamp[];
    lessonText: string;
    cursor: number;
  };
  essay: string;
  formattedEssay: Array<{ mode: "listen" | "type" | "write"; text: string[] }>;
  audioUrl: string;
};

const DemoPage: React.FC = React.memo(() => {
  const [textSize, setTextSize] = useState('2xl');
  const [mode, setMode] = useState<'typing' | 'submitted' | 'test'>('typing');
  const [highlightedNodes, setHighlightedNodes] = useState<number[]>([0]);

  const queryParams = {
    userAgent: window.navigator.userAgent,
    browserLanguage: window.navigator.language,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };

  const { data: demoExercise, isLoading } = useQuery(getDemoExercise, queryParams);

  const { essay, essayList, essayWordCount, essayCharCount, summary, hasQuiz } = useExercise(
    demoExercise?.exercise?.id || '',
    demoExercise?.exercise?.lessonText || '',
    demoExercise?.formattedEssay || [],
    demoExercise?.exercise?.paragraphSummary || '',
    demoExercise?.exercise?.questions || [],
    mode,
    textSize,
    demoExercise?.exercise?.cursor || 0
  );

  // Set audio URL when exercise data changes
  useEffect(() => {
    if (demoExercise?.audioUrl && demoExercise?.exercise?.audioTimestamps) {
      essayList.setAudio(demoExercise.audioUrl, demoExercise.exercise.audioTimestamps);
    }
  }, [demoExercise, essayList]);

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

  const handleSubmitExercise = useCallback(async () => {
    setMode('submitted');
  }, [setMode]);

  const contextValue = {
    essay,
    essayList,
    formattedEssay: demoExercise?.formattedEssay || [],
    essayWordCount,
    essayCharCount,
    mode,
    setMode,
    hasQuiz,
    audioTimestamps: demoExercise?.exercise?.audioTimestamps || [],
    highlightedNodes,
    setHighlightedNodes,
    textSize,
    setTextSize,
    onSubmitExercise: handleSubmitExercise,
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
        {mode === 'submitted' && <ExerciseResult exerciseId={demoExercise?.exercise?.id || ''} />}
        {mode === 'test' && <ExerciseTest title={demoExercise?.exercise?.name || ''} questions={[]} />}
      </div>
    </ExerciseProvider>
  );
});

export default DemoPage;