import React, { useCallback, useEffect, useState } from 'react';
import { useQuery, getDemoExercise } from 'wasp/client/operations';
import ExerciseResult from '../components/ExerciseInterface/ExerciseResult';
import ExerciseSidebar from '../components/ExerciseInterface/ExerciseSidebar';
import ExerciseTest from '../components/ExerciseInterface/ExerciseTest';
import ExerciseInterface from '../components/ExerciseInterface';
import { ExerciseProvider } from '../contexts/ExerciseContext';
import useExercise from '../hooks/useExercise';

const CreateDemoPage: React.FC = React.memo(() => {
  const [text_size, setTextSize] = useState('xl');
  const [mode, set_mode] = useState<'typing' | 'submitted' | 'test'>('typing');
  const [highlighted_nodes, set_highlighted_nodes] = useState<number[]>([0]);

  const query_params = {
    user_agent: window.navigator.userAgent,
    browser_language: window.navigator.language, 
    screen_resolution: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };

  const { data: demo_exercise, isLoading } = useQuery(getDemoExercise, query_params);

  const { 
    essay,
    essay_list,
    essay_word_count,
    essay_char_count,
    summary,
    has_quiz
  } = useExercise(
    demo_exercise?.exercise?.id || '',
    demo_exercise?.exercise?.lesson_text || '',
    demo_exercise?.formatted_essay || [],
    demo_exercise?.exercise?.paragraph_summary || '',
    demo_exercise?.exercise?.questions.map(q => ({
      ...q,
      exercise_id: q.exercise_id,
      created_at: q.created_at
    })) || [],
    mode,
    text_size,
    demo_exercise?.exercise?.cursor || 0
  );

  useEffect(() => {
    if (demo_exercise?.audio_url && demo_exercise?.exercise?.audio_timestamps) {
      essay_list.setAudio(demo_exercise.audio_url, demo_exercise.exercise.audio_timestamps);
    }
  }, [demo_exercise, essay_list]);

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
    set_mode('submitted');
  }, [set_mode]);

  const context_value = {
    essay,
    essay_list,
    formatted_essay: demo_exercise?.formatted_essay || [],
    essay_word_count,
    essay_char_count,
    mode,
    set_mode,
    has_quiz,
    audio_timestamps: demo_exercise?.exercise?.audio_timestamps || [],
    highlighted_nodes,
    set_highlighted_nodes,
    text_size,
    set_text_size: setTextSize,
    submit_exercise: handleSubmitExercise,
    summary,
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <ExerciseProvider value={context_value}>
      <div className='relative'>
        {mode === 'typing' && (
          <div className='relative flex flex-row h-full'>
            <ExerciseSidebar />
            <ExerciseInterface />
          </div>
        )}
        {mode === 'submitted' && <ExerciseResult exerciseId={demo_exercise?.exercise?.id || ''} />}
        {mode === 'test' && <ExerciseTest title={demo_exercise?.exercise?.name || ''} questions={[]} />}
      </div>
    </ExerciseProvider>
  );
});

export default CreateDemoPage;