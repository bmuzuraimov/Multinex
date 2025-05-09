import React, { useCallback, useEffect, useState } from 'react';
import { useQuery, getDemoExercise } from 'wasp/client/operations';
import ExerciseResult from '../../../user/pages/Exercise/components/ExerciseResult';
import ExerciseSidebar from '../../../user/pages/Exercise/components/ExerciseSidebar';
import ExerciseTest from '../../../user/pages/Exercise/components/ExerciseTest';
import ExerciseInterface from '../../../user/pages/Exercise/components/ExerciseInterface';
import ExerciseEditor from '../../../user/pages/Exercise/components/ExerciseEditor';
import { ExerciseProvider } from '../../../contexts/ExerciseContext';
import useExercise from '../../../hooks/useExercise';
import DefaultLayout from '../../layouts/DefaultLayout';
import useLocalStorage from '../../../hooks/useLocalStorage';

const CreateDemo: React.FC = React.memo(() => {
  const [text_size, setTextSize] = useLocalStorage('text_size', 'xl');
  const [mode, set_mode] = useState<'typing' | 'submitted' | 'test' | 'editing'>('typing');
  const [highlighted_nodes, set_highlighted_nodes] = useState<number[]>([0]);

  const {
    data: response,
    isLoading,
    error,
  } = useQuery(getDemoExercise, {
    user_agent: window.navigator.userAgent,
    browser_language: window.navigator.language,
    screen_resolution: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  const demo_exercise = response?.data;

  // Extract course information if available from the demo exercise
  const courseId = demo_exercise?.exercise?.course?.id;
  const courseName = demo_exercise?.exercise?.course?.name;

  const { essay, essay_list, essay_word_count, essay_char_count, has_quiz } = useExercise(
    demo_exercise?.exercise?.id || '',
    demo_exercise?.exercise?.lesson_text || '',
    demo_exercise?.formatted_essay || [],
    demo_exercise?.exercise?.questions?.map((q: any) => ({
      ...q,
      exercise_id: q.exercise_id,
      created_at: q.created_at,
      options: q.options || [],
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
    lesson_text: demo_exercise?.exercise?.lesson_text || '',
    course_id: courseId,
    course_name: courseName,
    topic_terms: demo_exercise?.exercise?.modules?.topic_terms || [],
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading demo exercise</div>;

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
        {mode === 'test' && (
          <ExerciseTest
            title={demo_exercise?.exercise?.name || ''}
            questions={demo_exercise?.exercise?.questions || []}
          />
        )}
        {mode === 'editing' && (
          <div className='relative flex flex-row h-full'>
            <ExerciseSidebar />
            <ExerciseEditor exerciseId={demo_exercise?.exercise?.id || ''} isOwner={false} />
          </div>
        )}
      </div>
    </ExerciseProvider>
  );
});

export default DefaultLayout(CreateDemo, { showFooter: false });
