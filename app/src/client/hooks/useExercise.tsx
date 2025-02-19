import { useState, useMemo, useEffect } from 'react';
import { Question } from 'wasp/entities';
import { TextList } from '../utils/TextList';
import { updateExercise } from 'wasp/client/operations';

const useExercise = (
  exerciseId: string,
  essay: string,
  formattedEssay: { mode: string; text: string[] }[],
  paragraphSummary: string,
  questions: Question[],
  defaultMode: 'typing' | 'submitted' | 'test',
  textSize: string,
  progressCursor: number
) => {
  const essayList = useMemo(
    () => new TextList(formattedEssay, textSize, progressCursor),
    [formattedEssay, textSize, progressCursor]
  );
  const [mode, setMode] = useState<'typing' | 'submitted' | 'test'>(defaultMode || 'typing');
  const essayCharCount = useMemo(() => essay.length, [essay]);
  const essayWordCount = useMemo(() => essay.split(' ').length, [essay]);
  const summary = useMemo(() => paragraphSummary?.split('|') || [], [paragraphSummary]);
  const hasQuiz = useMemo(() => Boolean(questions?.length), [questions]);

  useEffect(() => {
    const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
      if (mode === 'typing') {
        await updateExercise({
          id: exerciseId!,
          updated_data: {
            cursor: essayList.getCursor()?.id,
          },
        });
        e.preventDefault();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [mode, exerciseId, essayList]);

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
