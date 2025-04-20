import { useState, useCallback, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useQuery, useAction, generateExercise, getDemoExercise, getUploadURL, createExercise, createDemoExercise } from 'wasp/client/operations';
import { useAuth } from 'wasp/client/auth';
import { AVAILABLE_MODELS } from '../../../../shared/constants';
import { Exercise } from 'wasp/entities';
import { 
  ExerciseFormContentSettings, 
  ExerciseFormGenerationSettings, 
  DemoExerciseResult, 
  INITIAL_EXERCISE_SETTINGS, 
  INITIAL_ADVANCED_SETTINGS 
} from './types';

export interface QueryParams {
  user_agent: string;
  browser_language: string;
  screen_resolution: string;
  timezone: string;
}

export const useExerciseForm = (topic_id: string | null, demo: boolean = false) => {
  const [demo_exercise, setDemoExercise] = useState<DemoExerciseResult | null>(null);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [is_uploading, setIsUploading] = useState(false);
  const [is_drag_active, setIsDragActive] = useState(false);
  const [loading_status, setLoadingStatus] = useState('');
  const [processing_file, setProcessingFile] = useState(false);
  const { data: user } = useAuth();
  
  // Initialize actions
  const generateExerciseAction = useAction(generateExercise);
  const createExerciseAction = useAction(createExercise);
  const createDemoExerciseAction = useAction(createDemoExercise);
  const getUploadURLAction = useAction(getUploadURL);
  
  // Memoized query params
  const query_params = useMemo<QueryParams>(
    () => ({
      user_agent: window.navigator.userAgent,
      browser_language: window.navigator.language,
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }),
    []
  );

  // Get demo exercise if in demo mode
  const { data: response, isLoading, error } = useQuery(
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
  const demo_exercise_data = response?.data;

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
  }));

  // Grouped state for advanced settings
  const [advanced_settings, setAdvancedSettings] = useState<ExerciseFormGenerationSettings>(() => ({
    ...INITIAL_ADVANCED_SETTINGS,
    selected_model: AVAILABLE_MODELS[0],
    set_scan_images: (value: boolean) => setAdvancedSettings((prev) => ({ ...prev, scan_images: value })),

    set_selected_model: (value: string) => setAdvancedSettings((prev) => ({ ...prev, selected_model: value })),

    set_include_mc_quiz: (value: boolean) => setAdvancedSettings((prev) => ({ ...prev, include_mc_quiz: value })),
  }));

  // Update demo exercise when data changes
  useEffect(() => {
    if (demo_exercise_data && !processing_file) {
      setDemoExercise(demo_exercise_data as unknown as DemoExerciseResult);
    }
  }, [demo_exercise_data, processing_file]);

  // Reset all form states
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
    }));
    setAdvancedSettings((prev) => ({
      ...prev,
      scan_images: false,
      selected_model: AVAILABLE_MODELS[0],
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
        include_mc_quiz: advanced_settings.include_mc_quiz,
      };

      const exercise_result = await generateExerciseAction(exercise_data);

      if (!exercise_result?.success) {
        toast.error(exercise_result.message as string);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate exercise');
    } finally {
      setProcessingFile(false);
      resetAllStates();
    }
  }, [exercise, exercise_settings, advanced_settings, is_uploading, resetAllStates, generateExerciseAction]);

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
        const exercise_result = await createExerciseAction({ name: file.name, topic_id: topic_id });
        
        if (!exercise_result.data?.id) {
          toast.error('Failed to create exercise - no ID returned');
          return;
        }

        setExercise(exercise_result.data || null);

        // If demo is true, create demo exercise
        if (demo) {
          const demo_result = await createDemoExerciseAction({
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
        const upload_url_result = await getUploadURLAction({
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
    [demo, query_params, topic_id, resetAllStates, user, createExerciseAction, createDemoExerciseAction, getUploadURLAction]
  );

  const handleDiscardTopics = useCallback(() => {
    // Clear out topics and reset name if user discards
    setExerciseSettings((prev) => ({ ...prev, topics: [], exercise_name: '' }));
  }, []);

  return {
    demo_exercise,
    exercise,
    is_uploading,
    is_drag_active,
    loading_status,
    processing_file,
    exercise_settings,
    advanced_settings,
    onDrop,
    setIsDragActive: setIsDragActive,
    handleExerciseSettings,
    handleDiscardTopics,
    isLoading
  };
}; 