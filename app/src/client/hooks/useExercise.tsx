import { useState, useMemo } from 'react';
import { Question } from 'wasp/entities';
import { TextList } from '../utils/TextList';

const useExercise = (
  essay: string,
  formattedEssay: { mode: string; text: string[] }[],
  paragraphSummary: string,
  questions: Question[],
  defaultMode: 'typing' | 'submitted' | 'test',
  textSize: string,
  progressCursor: number
) => {
  const essayList = useMemo(() => new TextList(formattedEssay, textSize, progressCursor), [formattedEssay, textSize, progressCursor]);
  const [mode, setMode] = useState<'typing' | 'submitted' | 'test'>(defaultMode || 'typing');
  const essayCharCount = useMemo(() => essay.length, [essay]);
  const essayWordCount = useMemo(() => essay.split(' ').length, [essay]);
  const summary = useMemo(
    () => paragraphSummary?.split('|') || [], 
    [paragraphSummary]
  );
  const hasQuiz = useMemo(
    () => Boolean(questions?.length), 
    [questions]
  );

  return {
    essay,
    essayList,
    mode,
    setMode,
    summary,
    hasQuiz,
    essayWordCount,
    essayCharCount,
  };
};

export default useExercise;
