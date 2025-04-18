import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { BsFiletypeAi } from 'react-icons/bs';
import { toast } from 'sonner';
import { AVAILABLE_MODELS } from '../../../shared/constants';

import {
  createExercise,
  generateExercise,
  getDemoExercise,
  getUploadURL,
  createDemoExercise,
  useQuery,
} from 'wasp/client/operations';
import { useAuth } from 'wasp/client/auth';
import FormModal from './FormModal';
import { ExerciseFormContentSettings, ExerciseFormGenerationSettings, SensoryMode } from '../../../shared/types';
import { Link } from 'react-router-dom';
import FileUploadArea from './FileUploadArea';
import { Exercise } from 'wasp/entities';
import { AudioTimestamp } from '../ExerciseInterface/AudioController';
import { ExerciseStatus } from '@prisma/client';

type DemoExerciseResult = {
  id: string;
  created_at: Date;
  user_agent: string;
  browser_language: string | null;
  screen_resolution: string | null;
  timezone: string | null;
  exercise_id: string;
  exercise: {
    id: string;
    name: string;
    level: string;
    truncated: boolean;
    word_count: number;
    completed: boolean;
    completed_at: Date | null;
    model: string;
    user_evaluation: number | null;
    user_id: string;
    topic_id: string | null;
    questions: Array<{
      id: string;
      text: string;
      exercise_id: string;
      created_at: Date;
      options: Array<{
        id: string;
        text: string;
        is_correct: boolean;
        question_id: string;
        created_at: Date;
      }>;
    }>;
    audio_timestamps: AudioTimestamp[];
    lesson_text: string;
    cursor: number;
    tokens: any; // Adding missing property
    status: ExerciseStatus;
    created_at: Date;
  };
  essay: string;
  formatted_essay: Array<{ mode: SensoryMode; text: string[] }>;
  audio_url: string;
};

const INITIAL_EXERCISE_SETTINGS: ExerciseFormContentSettings = {
  sensory_modes: ['type', 'write'] as SensoryMode[],
  set_sensory_modes: (value: SensoryMode[]) => {},
  exercise_name: '',
  set_exercise_name: () => {},
  exercise_length: 'Auto',
  set_exercise_length: () => {},
  exercise_level: 'Auto',
  set_exercise_level: () => {},
  selected_topics: [],
  set_selected_topics: () => {},
  topics: [],
  set_topics: () => {},
};

const INITIAL_ADVANCED_SETTINGS: ExerciseFormGenerationSettings = {
  scan_images: false,
  set_scan_images: () => {},
  selected_model: AVAILABLE_MODELS[0],
  set_selected_model: () => {},
  include_summary: false,
  set_include_summary: () => {},
  include_mc_quiz: false,
  set_include_mc_quiz: () => {},
  sensory_modes: [],
  set_sensory_modes: () => {},
};

const ExerciseForm: React.FC<{ topic_id: string | null; demo: boolean }> = React.memo(({ topic_id, demo = false }) => {
  const [demo_exercise, setDemoExercise] = useState<DemoExerciseResult | null>(null);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [is_uploading, setIsUploading] = useState(false);
  const [is_drag_active, setIsDragActive] = useState(false);
  const [loading_status, setLoadingStatus] = useState('');
  const [processing_file, setProcessingFile] = useState(false);
  const { data: user } = useAuth();
  
  // Memoized query params
  const query_params = useMemo(
    () => ({
      user_agent: window.navigator.userAgent,
      browser_language: window.navigator.language,
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }),
    []
  );


  const { data: demo_exercise_data } = useQuery(
    getDemoExercise,
    {
      user_agent: query_params.user_agent,
      browser_language: query_params.browser_language,
      screen_resolution: query_params.screen_resolution,
      timezone: query_params.timezone,
    },
    {
      enabled: demo && !processing_file,
    }
  );

  // Grouped state for exercise settings
  const [exercise_settings, setExerciseSettings] = useState<ExerciseFormContentSettings>(() => ({
    ...INITIAL_EXERCISE_SETTINGS,
    set_exercise_name: (value: string) =>
      setExerciseSettings((prev: ExerciseFormContentSettings) => ({ ...prev, exercise_name: value })),

    set_exercise_length: (value: string) =>
      setExerciseSettings((prev: ExerciseFormContentSettings) => ({ ...prev, exercise_length: value })),

    set_exercise_level: (value: string) =>
      setExerciseSettings((prev: ExerciseFormContentSettings) => ({ ...prev, exercise_level: value })),

    set_selected_topics: (value: string[]) =>
      setExerciseSettings((prev: ExerciseFormContentSettings) => ({ ...prev, selected_topics: value })),

    set_topics: (value: string[]) =>
      setExerciseSettings((prev: ExerciseFormContentSettings) => ({ ...prev, topics: value })),

    set_sensory_modes: (value: SensoryMode[]) =>
      setExerciseSettings((prev: ExerciseFormContentSettings) => ({ ...prev, sensory_modes: value })),
  }));

  // Grouped state for advanced settings
  const [advanced_settings, setAdvancedSettings] = useState<ExerciseFormGenerationSettings>(() => ({
    ...INITIAL_ADVANCED_SETTINGS,
    set_scan_images: (value: boolean) => setAdvancedSettings((prev) => ({ ...prev, scan_images: value })),

    set_selected_model: (value: string) => setAdvancedSettings((prev) => ({ ...prev, selected_model: value })),

    set_include_summary: (value: boolean) => setAdvancedSettings((prev) => ({ ...prev, include_summary: value })),

    set_include_mc_quiz: (value: boolean) => setAdvancedSettings((prev) => ({ ...prev, include_mc_quiz: value })),
  }));

  useEffect(() => {
    if (demo_exercise_data && !processing_file) {
      setDemoExercise(demo_exercise_data as unknown as DemoExerciseResult);
    }
  }, [demo_exercise_data, processing_file]);

  const resetAllStates = useCallback(() => {
    setIsUploading(false);
    setLoadingStatus('');
    setExercise(null);
    setExerciseSettings((prev) => ({
      ...prev,
      exercise_name: '',
      exercise_length: 'Auto',
      exercise_level: 'Auto',
      selected_topics: [],
      topics: [],
      sensory_modes: ['listen', 'type', 'write'],
    }));
    setAdvancedSettings((prev) => ({
      ...prev,
      scan_images: false,
      selected_model: AVAILABLE_MODELS[0],
      include_summary: false,
      include_mc_quiz: false,
    }));
  }, []);

  // Handle the "Generate Exercise" button
  const handleExerciseSettings = useCallback(async () => {
    if (is_uploading || !exercise_settings.topics || exercise_settings.topics.length === 0) return;
    setIsUploading(true);
    setLoadingStatus('Generating exercise...');

    if (!exercise) {
      toast.error('Exercise not found');
      return;
    }

    try {
      const exercise_data = {
        exercise_id: exercise.id,
        name: exercise_settings.exercise_name,
        selected_topics: exercise_settings.selected_topics,
        length: exercise_settings.exercise_length,
        level: exercise_settings.exercise_level,
        model: advanced_settings.selected_model,
        include_summary: advanced_settings.include_summary,
        include_mc_quiz: advanced_settings.include_mc_quiz,
        sensory_modes: exercise_settings.sensory_modes,
      };

      const exercise_result = await generateExercise(exercise_data);

      if (!exercise_result?.success) {
        toast.error(exercise_result.message as string);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate exercise');
    } finally {
      setProcessingFile(false);
      resetAllStates();
    }
  }, [exercise, exercise_settings, advanced_settings, is_uploading, resetAllStates]);

  // Handle file drop
  const onDrop = useCallback(
    async (accepted_files: File[]) => {
      if (accepted_files.length === 0) return;
      const file = accepted_files[0];

      setIsUploading(true);
      setProcessingFile(true);
      setExerciseSettings((prev) => ({ ...prev, exercise_name: file.name }));

      if (user && user.credits <= 0) {
        toast.info('You do not have any credits left. Please purchase more credits to generate exercises.');
        resetAllStates();
        return;
      }

      try {
        // Create the exercise first
        const exercise_result = await createExercise({ name: file.name, topic_id: topic_id });
        
        if (!exercise_result.data?.id) {
          toast.error('Failed to create exercise - no ID returned');
          return;
        }

        setExercise(exercise_result.data || null);

        // If demo is true, create demo exercise
        if (demo) {
          const demo_result = await createDemoExercise({
            exercise_id: exercise_result.data.id,
            user_agent: query_params.user_agent,
            browser_language: query_params.browser_language,
            screen_resolution: query_params.screen_resolution,
            timezone: query_params.timezone,
          });

          if (!demo_result.success) {
            toast.error('Failed to create demo exercise');
            return;
          }
        }

        // Upload file
        setLoadingStatus('Uploading file...');
        const upload_url_result = await getUploadURL({
          key: exercise_result.data.id,
          file_type: file.type,
        });

        if (!upload_url_result?.upload_url) {
          toast.error('Failed to get upload URL');
          return;
        }

        const upload_response = await fetch(upload_url_result.upload_url, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        });

        if (!upload_response.ok) {
          toast.error(`Upload failed: ${upload_response.statusText}`);
          return;
        }

        // Now parse topics from doc
        if (!import.meta.env.REACT_APP_DOCUMENT_PARSER_URL) {
          toast.error('Document parser URL not found');
          return;
        }

        setLoadingStatus('Scanning file...');
        const document_parser_url = import.meta.env.REACT_APP_DOCUMENT_PARSER_URL + '/api/get-exercise-topics';
        const form_data = new FormData();
        form_data.append('file_id', exercise_result.data.id);
        form_data.append('file_type', file.name.split('.').pop() || '');

        const response = await fetch(document_parser_url, {
          method: 'POST',
          headers: { accept: 'application/json' },
          body: form_data,
        });
        const response_json = await response.json();
        if (!response.ok) {
          toast.error(response_json.message);
          return;
        }

        setExerciseSettings((prev) => ({ ...prev, topics: response_json.data }));
        setLoadingStatus('Select topics to generate exercise');
      } catch (error: any) {
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
          toast.error('Document service is currently unavailable. Please try again later.');
        } else {
          toast.error(error instanceof Error ? error.message : 'Failed to process file. Please try again.');
        }
        setLoadingStatus('');
        setExercise(null);
        resetAllStates();
      } finally {
        setIsUploading(false);
      }
    },
    [demo, query_params, topic_id, resetAllStates, user]
  );

  const renderDemoLink = useMemo(
    () => (
      <Link
        to={`/create-demo`}
        className='w-full h-full flex flex-col items-center bg-white transition-all duration-300 ease-in-out pointer-events-auto'
      >
        <div className='flex h-full items-center justify-center w-full max-w-5xl mx-auto px-6 py-12'>
          <div className='flex flex-col items-center p-8 justify-center w-full rounded-2xl cursor-pointer bg-gradient-to-br from-primary-50 to-white border border-primary-100 shadow-lg hover:shadow-xl transition-all duration-300'>
            <div className='flex flex-col items-center space-y-6'>
              <div className='p-6 bg-primary-50 rounded-full shadow-sm'>
                <BsFiletypeAi className='w-12 h-12 text-primary-500' />
              </div>
              <div className='text-center space-y-2'>
                <h3 className='font-manrope text-title-sm font-semibold text-gray-900'>Ready to start your exercise</h3>
                <p className='font-satoshi text-lg text-primary-900'>"{demo_exercise?.exercise?.name}"</p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    ),
    [demo_exercise]
  );

  if (demo && demo_exercise && !processing_file) {
    return renderDemoLink;
  }

  return (
    <div className='w-full h-full opacity-95 flex flex-col items-center bg-white dark:bg-gray-800 transition-all duration-300 ease-in-out pointer-events-auto'>
      {!demo || !demo_exercise || processing_file ? (
        <FileUploadArea
          on_drop={onDrop}
          is_uploading={is_uploading}
          is_drag_active={is_drag_active}
          loading_status={loading_status}
          set_is_drag_active={setIsDragActive}
        />
      ) : (
        renderDemoLink
      )}

      {exercise_settings.topics && exercise_settings.topics.length > 0 && !is_uploading && (
        <FormModal
          on_generate={handleExerciseSettings}
          on_discard={() => {
            // Clear out topics and reset name if user discards
            setExerciseSettings((prev) => ({ ...prev, topics: [], exercise_name: '' }));
          }}
          loading_status={loading_status}
          is_uploading={is_uploading}
          exercise_settings={exercise_settings}
          advanced_settings={advanced_settings}
        />
      )}
    </div>
  );
});

export default ExerciseForm;
