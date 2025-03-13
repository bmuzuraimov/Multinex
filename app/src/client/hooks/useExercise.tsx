import { useState, useMemo, useEffect } from 'react';
import { Question } from 'wasp/entities';
import { TextList } from '../components/ExerciseInterface/TextList';
import { updateExercise } from 'wasp/client/operations';

const useExercise = (
  exercise_id: string,
  essay: string, 
  formatted_essay: { mode: string; text: string[] }[],
  paragraph_summary: string,
  questions: Question[],
  default_mode: 'typing' | 'submitted' | 'test',
  text_size: string,
  progress_cursor: number
) => {
  const essay_list = useMemo(
    () => new TextList(formatted_essay, text_size, progress_cursor),
    [formatted_essay, text_size, progress_cursor]
  );

  const [mode, set_mode] = useState<'typing' | 'submitted' | 'test'>(default_mode || 'typing');
  const essay_char_count = useMemo(() => essay.length, [essay]);
  const essay_word_count = useMemo(() => essay.split(' ').length, [essay]);
  const summary = useMemo(() => paragraph_summary?.split('|') || [], [paragraph_summary]);
  const has_quiz = useMemo(() => Boolean(questions?.length), [questions]);

  useEffect(() => {
    const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
      if (mode === 'typing') {
        await updateExercise({
          id: exercise_id!,
          updated_data: {
            cursor: essay_list.getCursor()?.id,
          },
        });
        e.preventDefault();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [mode, exercise_id, essay_list]);

  return {
    essay,
    essay_list,
    mode,
    set_mode,
    summary,
    has_quiz,
    essay_word_count,
    essay_char_count,
  };
};

export default useExercise;
