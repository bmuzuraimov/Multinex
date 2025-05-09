import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useAction, getExercise, updateExercise } from 'wasp/client/operations';
import ExerciseResult from './components/ExerciseResult';
import ExerciseSidebar from './components/ExerciseSidebar';
import ExerciseTest from './components/ExerciseTest';
import ExerciseInterface from './components/ExerciseInterface';
import ExerciseEditor from './components/ExerciseEditor';
import { ExerciseProvider } from '../../../contexts/ExerciseContext';
import useExercise from '../../../hooks/useExercise';
import CardSkeleton from '../../../components/CardSkeleton';
import DefaultLayout from '../../layouts/DefaultLayout';
import useLocalStorage from '../../../hooks/useLocalStorage';
import { useAuth } from 'wasp/client/auth';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

// Import shadcn components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../shadcn/components/ui/dialog';
import { Button } from '../../../shadcn/components/ui/button';

const Exercise: React.FC = React.memo(() => {
  const { exerciseId } = useParams();
  const { data: user } = useAuth();
  const navigate = useNavigate();
  const [text_size, setTextSize] = useLocalStorage('text_size', 'xl');
  const [exercise_mode, setExerciseMode] = useState<'typing' | 'submitted' | 'test' | 'editing'>('typing');
  const [highlighted_nodes, setHighlightedNodes] = useState<number[]>([0]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const {
    data: exerciseResponse,
    isLoading: is_exercise_loading,
    refetch: refetch_exercise,
  } = useQuery(getExercise, {
    exercise_id: exerciseId!,
  }) as { data: any; isLoading: boolean; refetch: () => void };
  const updateExerciseAction = useAction(updateExercise);

  useEffect(() => {
    if (!user) {
      const redirectTimer = setTimeout(() => {
        setShowLoginModal(true);
        toast.info('Session expired. Please log in to continue.');
      }, 1200000); // 90 seconds

      return () => clearTimeout(redirectTimer);
    }
  }, [user, navigate]);
  const exercise = exerciseResponse?.success ? (exerciseResponse.data as any) : null;
  const { essay, essay_list, essay_char_count, essay_word_count, has_quiz } = useExercise(
    exerciseId!,
    exercise?.essay || '',
    exercise?.formatted_essay || [],
    exercise?.questions.map((question: any) => ({
      ...question,
      exercise_id: question.exercise_id,
      created_at: question.created_at,
    })) || [],
    exercise_mode,
    text_size,
    exercise?.cursor || 0
  );


  // Only set up audio once when it becomes available
  useEffect(() => {
    const audioUrl = exercise?.audio_url;
    const audioTimestamps = exercise?.audio_timestamps;

    if (audioUrl && audioTimestamps && essay_list) {
      essay_list.setAudio(audioUrl, audioTimestamps as { word: string; start: number; end: number }[]);
    }
  }, [exercise?.audio_url, exercise?.audio_timestamps, essay_list]);

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
    const updated_exercise = await updateExerciseAction({
      id: exerciseId!,
      updated_data: {
        completed: true,
        cursor: 0,
        completed_at: new Date(),
      },
    });
    console.log('updated_exercise', updated_exercise);
    setExerciseMode('submitted');
  }, [exerciseId]);

  // Extract course information if available
  const courseId = exercise?.topic?.course?.id;
  const courseName = exercise?.topic?.course?.name;
  const topicTerms = exercise?.modules?.topic_terms;

  // Memoize the context value to prevent unnecessary recreations
  const context_value = useMemo(
    () => ({
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
      lesson_text: exercise?.lesson_text,
      course_id: courseId,
      course_name: courseName,
      topic_terms: topicTerms,
    }),
    [
      essay,
      essay_list,
      exercise?.formatted_essay,
      essay_word_count,
      essay_char_count,
      exercise_mode,
      has_quiz,
      exercise?.audio_timestamps,
      highlighted_nodes,
      text_size,
      handleExerciseSubmission,
      exercise?.lesson_text,
      courseId,
      courseName,
      topicTerms,
    ]
  );

  return (
    <ExerciseProvider value={context_value}>
      <Dialog open={showLoginModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-manrope font-bold text-primary-900">Session Expired</DialogTitle>
            <DialogDescription className="text-gray-600">
              Your session has expired. Please log in again to continue your exercise.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2 sm:space-x-4">
            <Button asChild>
              <Link to="/login">Log In</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className='relative'>
        {exercise_mode === 'typing' && (
          <div className='relative flex flex-row h-full'>
            <ExerciseSidebar />
            {is_exercise_loading ? <CardSkeleton rows={40} blocksPerRow={1} /> : <ExerciseInterface />}
          </div>
        )}
        {exercise_mode === 'submitted' && <ExerciseResult exerciseId={exerciseId!} />}
        {exercise_mode === 'test' && (
          <ExerciseTest title={exercise?.name ?? ''} questions={exercise?.questions ?? []} />
        )}
        {exercise_mode === 'editing' && (
          <div className='relative flex flex-row h-full'>
            <ExerciseSidebar />
            <ExerciseEditor exerciseId={exerciseId!} isOwner={user?.id === exercise?.user_id} />
          </div>
        )}
      </div>
    </ExerciseProvider>
  );
});

export default DefaultLayout(Exercise, { showFooter: false });
