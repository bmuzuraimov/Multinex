import React, { useCallback, useEffect, useState } from 'react';
import ExerciseResult from '../../../user/pages/Exercise/components/ExerciseResult';
import ExerciseSidebar from '../../../user/pages/Exercise/components/ExerciseSidebar';
import ExerciseTest from '../../../user/pages/Exercise/components/ExerciseTest';
import ExerciseInterface from '../../../user/pages/Exercise/components/ExerciseInterface';
import ExerciseEditor from '../../../user/pages/Exercise/components/ExerciseEditor';
import { ExerciseProvider } from '../../../contexts/ExerciseContext';
import useExercise from '../../../hooks/useExercise';
import { DEMO_EXERCISE } from '../../../../shared/constants/demo';
import { SensoryMode } from '../../../../shared/types';
import DefaultLayout from '../../layouts/DefaultLayout';

const Demo: React.FC = React.memo(() => {
  const [text_size, setTextSize] = useState('xl');
  const [mode, set_mode] = useState<'typing' | 'submitted' | 'test' | 'editing'>('typing');
  const [highlighted_nodes, set_highlighted_nodes] = useState<number[]>([0]);

  const demo_exercise = DEMO_EXERCISE;
  
  // Use fixed course info for demo
  const courseId = 'welcome-course-1e1bdb1a-2118-4c7f-9989-69112cf0490e';
  const courseName = 'Demo Course';
  
  const { essay, essay_list, essay_word_count, essay_char_count, has_quiz } = useExercise(
    demo_exercise.id || '',
    demo_exercise.lesson_text || '',
    demo_exercise.formatted_essay || [],
    [],
    mode,
    text_size,
    demo_exercise.cursor || 0
  );

  useEffect(() => {
    if (demo_exercise.audio_url && demo_exercise.audio_timestamps) {
      essay_list.setAudio(demo_exercise.audio_url, demo_exercise.audio_timestamps);
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
    formatted_essay: (demo_exercise.formatted_essay || []).map((item) => ({
      ...item,
      mode: item.mode as SensoryMode,
    })),
    essay_word_count,
    essay_char_count,
    mode,
    set_mode,
    has_quiz,
    audio_timestamps: demo_exercise.audio_timestamps || [],
    highlighted_nodes,
    set_highlighted_nodes,
    text_size,
    set_text_size: setTextSize,
    submit_exercise: handleSubmitExercise,
    lesson_text: demo_exercise.lesson_text || '',
    course_id: courseId,
    course_name: courseName,
  };

  return (
    <ExerciseProvider value={context_value}>
      <div className='relative'>
        {mode === 'typing' && (
          <div className='relative flex flex-row h-full'>
            <ExerciseSidebar />
            <ExerciseInterface />
          </div>
        )}
        {mode === 'submitted' && <ExerciseResult exerciseId={demo_exercise.id || ''} />}
        {mode === 'test' && <ExerciseTest title={demo_exercise.name || ''} questions={[]} />}
        {mode === 'editing' && (
          <div className='relative flex flex-row h-full'>
            <ExerciseSidebar />
            <ExerciseEditor exerciseId={demo_exercise.id || ''} />
          </div>
        )}
      </div>
    </ExerciseProvider>
  );
});

export default DefaultLayout(Demo);
