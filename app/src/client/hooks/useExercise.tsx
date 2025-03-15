import { useState, useMemo, useEffect, useRef } from 'react';
import { Question } from 'wasp/entities';
import { TextList } from '../components/ExerciseInterface/TextList';
import { updateExercise } from 'wasp/client/operations';

// Create a wrapper to store metadata alongside TextList
interface TextListWrapper {
  instance: TextList;
  formattedEssaySnapshot: string; // JSON stringified formatted essay for comparison
  textSize: string;
}

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
  // Use a ref to store the TextList wrapper
  const textListWrapperRef = useRef<TextListWrapper | null>(null);
  
  // Format the essay for comparison
  const formattedEssaySnapshot = JSON.stringify(formatted_essay);
  
  // Only create a new TextList when formatted_essay or progress_cursor changes
  // or when it doesn't exist yet
  const essay_list = useMemo(() => {
    // If formatted_essay hasn't changed and we already have a TextList instance,
    // just update the text size instead of creating a new instance
    if (textListWrapperRef.current && 
        formattedEssaySnapshot === textListWrapperRef.current.formattedEssaySnapshot) {
      // If text size changed, we still need to create a new instance
      // since TextList doesn't expose a method to update text size
      if (textListWrapperRef.current.textSize !== text_size) {
        const newTextList = new TextList(formatted_essay, text_size, progress_cursor);
        textListWrapperRef.current = {
          instance: newTextList,
          formattedEssaySnapshot,
          textSize: text_size
        };
        return newTextList;
      }
      
      return textListWrapperRef.current.instance;
    }
    
    // Create a new TextList instance if needed
    const newTextList = new TextList(formatted_essay, text_size, progress_cursor);
    textListWrapperRef.current = {
      instance: newTextList,
      formattedEssaySnapshot,
      textSize: text_size
    };
    return newTextList;
  }, [formattedEssaySnapshot, progress_cursor, text_size, formatted_essay]);

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
