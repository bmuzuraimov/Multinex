import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, getExerciseById, updateExercise } from 'wasp/client/operations';
import ExerciseResult from '../components/ExerciseInterface/ExerciseResult';
import ExerciseSidebar from '../components/ExerciseInterface/ExerciseSidebar';
import ExerciseTest from '../components/ExerciseInterface/ExerciseTest';
import ExerciseInterface from '../components/ExerciseInterface';
import { ExerciseProvider } from '../contexts/ExerciseContext';
import useExercise from '../hooks/useExercise';

const ExercisePage: React.FC = React.memo(() => {
  const { exerciseId } = useParams();
  const [text_size, setTextSize] = useState('xl');
  const [exercise_mode, setExerciseMode] = useState<'typing' | 'submitted' | 'test'>('typing');
  const [highlighted_nodes, setHighlightedNodes] = useState<number[]>([0]);
  const { data: exercise, isLoading } = useQuery(getExerciseById, {
    exercise_id: exerciseId!,
  });
  const { 
    essay, 
    essay_list, 
    essay_char_count, 
    essay_word_count, 
    summary, 
    has_quiz 
  } = useExercise(
    exerciseId!,
    exercise?.essay || '',
    exercise?.formatted_essay || [],
    exercise?.paragraph_summary || '',
    exercise?.questions.map(question => ({
      ...question,
      exercise_id: question.exercise_id,
      created_at: question.created_at
    })) || [],
    exercise_mode,
    text_size,
    exercise?.cursor || 0
  );

  useEffect(() => {
    if (exercise?.audio_url && exercise?.audio_timestamps) {
      essay_list.setAudio(exercise.audio_url, exercise.audio_timestamps as { word: string; start: number; end: number }[]);
    }
  }, [exercise]);

  useEffect(() => {
    const preventDefaultKeyboardBehavior = (event: KeyboardEvent) => {
      if (['Tab', ' ', 'Enter'].includes(event.key)) {
        event.preventDefault();
      }
    };

    document.addEventListener('keydown', preventDefaultKeyboardBehavior);
    return () => document.removeEventListener('keydown', preventDefaultKeyboardBehavior);
  }, []);

  const handleExerciseSubmission = useCallback(async () => {
    const PERFECT_SCORE = 100;
    await updateExercise({
      id: exerciseId!,
      updated_data: {
        completed: true,
        cursor: 0,
        score: PERFECT_SCORE,
        completed_at: new Date(),
      },
    });

    setExerciseMode('submitted');
  }, [essay.length, exerciseId]);

  const context_value = {
    essay,
    essay_list,
    formatted_essay: exercise?.formatted_essay || [],
    essay_word_count,
    essay_char_count,
    mode: exercise_mode,
    set_mode: setExerciseMode,
    has_quiz,
    audio_timestamps: exercise?.audio_timestamps || [],
    highlighted_nodes: highlighted_nodes,
    set_highlighted_nodes: setHighlightedNodes,
    text_size: text_size,
    set_text_size: setTextSize,
    submit_exercise: handleExerciseSubmission,
    summary,
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <ExerciseProvider value={context_value}>
      <div className='relative'>
        {exercise_mode === 'typing' && (
          <div className='relative flex flex-row h-full'>
            <ExerciseSidebar />
            <ExerciseInterface />
          </div>
        )}
        {exercise_mode === 'submitted' && <ExerciseResult exerciseId={exerciseId!} />}
        {exercise_mode === 'test' && <ExerciseTest title={exercise?.name ?? ''} questions={exercise?.questions ?? []} />}
      </div>
    </ExerciseProvider>
  );
});

export default ExercisePage;
