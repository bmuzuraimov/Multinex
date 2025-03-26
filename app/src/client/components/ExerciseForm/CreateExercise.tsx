import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { BsFiletypeAi, BsUpload } from 'react-icons/bs';
import { FiType } from 'react-icons/fi';
import { toast } from 'sonner';
import { useDropzone } from 'react-dropzone';
import { AVAILABLE_MODELS } from '../../../shared/constants';
import {
  createExercise,
  generateExercise,
  getDemoExercise,
  getUploadURL,
  createDemoExercise,
  useQuery,
  getExercisesWithNoTopic,
  generateExerciseFromText,
} from 'wasp/client/operations';
import { useAuth } from 'wasp/client/auth';
import FormModal from './FormModal';
import { ExerciseFormContentSettings, ExerciseFormGenerationSettings, SensoryMode } from '../../../shared/types';
import ExerciseCard from '../ExerciseCard';
import CardSkeleton from '../CardSkeleton';
import { Link } from 'react-router-dom';
import { Exercise } from 'wasp/entities';
import FileUploadArea from './FileUploadArea';
import { AudioTimestamp } from '../../components/ExerciseInterface/AudioController';
import { ExerciseStatus } from '@prisma/client';
import { useNavigate } from 'react-router-dom';

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
    paragraph_summary: string;
    level: string;
    truncated: boolean;
    word_count: number;
    completed: boolean;
    completed_at: Date | null;
    score: number;
    model: string;
    user_evaluation: number | null;
    user_id: string;
    topic_id?: string | null;
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
    tokens: any;
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
  prior_knowledge: [],
  set_prior_knowledge: () => {},
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
  const [is_uploading, setIsUploading] = useState(false);
  const [is_drag_active, setIsDragActive] = useState(false);
  const [loading_status, setLoadingStatus] = useState('');
  const [processing_file, setProcessingFile] = useState(false);
  const [content, setContent] = useState("");
  const [demo_exercise, setDemoExercise] = useState<DemoExerciseResult | null>(null);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const { data: user } = useAuth();
  const { data: exercises, error: exercises_error, isLoading: exercises_loading } = useQuery(getExercisesWithNoTopic);
  const navigate = useNavigate();

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

  const [exercise_settings, setExerciseSettings] = useState<ExerciseFormContentSettings>(() => ({
    ...INITIAL_EXERCISE_SETTINGS,
    set_exercise_name: (value: string) =>
      setExerciseSettings((prev: ExerciseFormContentSettings) => ({ ...prev, exercise_name: value })),

    set_exercise_length: (value: string) =>
      setExerciseSettings((prev: ExerciseFormContentSettings) => ({ ...prev, exercise_length: value })),

    set_exercise_level: (value: string) =>
      setExerciseSettings((prev: ExerciseFormContentSettings) => ({ ...prev, exercise_level: value })),

    set_prior_knowledge: (value: string[]) =>
      setExerciseSettings((prev: ExerciseFormContentSettings) => ({ ...prev, prior_knowledge: value })),

    set_topics: (value: string[]) =>
      setExerciseSettings((prev: ExerciseFormContentSettings) => ({ ...prev, topics: value })),

    set_sensory_modes: (value: SensoryMode[]) =>
      setExerciseSettings((prev: ExerciseFormContentSettings) => ({ ...prev, sensory_modes: value })),
  }));

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
    setContent("");
    setExerciseSettings((prev) => ({
      ...prev,
      exercise_name: '',
      exercise_length: 'Auto',
      exercise_level: 'Auto',
      prior_knowledge: [],
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

  const handleFileExerciseSettings = useCallback(async () => {
    if (is_uploading || !exercise_settings.topics) return;
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
        prior_knowledge: exercise_settings.prior_knowledge,
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
      } else {
        navigate(`/exercise/${exercise.id}`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate exercise');
    } finally {
      setProcessingFile(false);
      resetAllStates();
    }
  }, [exercise, exercise_settings, advanced_settings, is_uploading, resetAllStates, navigate]);

  const handleTextExerciseSettings = useCallback(async () => {
    setIsUploading(true);
    setLoadingStatus('Generating exercise from text...');
    
    try {
      const result = await generateExerciseFromText({
        content: exercise_settings.raw_content || '',
        topic_id: topic_id || null,
        model: advanced_settings.selected_model,
        include_summary: advanced_settings.include_summary,
        include_mc_quiz: advanced_settings.include_mc_quiz,
        sensory_modes: exercise_settings.sensory_modes as SensoryMode[],
        length: exercise_settings.exercise_length,
        level: exercise_settings.exercise_level,
      });
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to generate exercise');
      }
      
      if (result.data) {
        setExercise(result.data);
        
        if (demo) {
          const demoResult = await createDemoExercise({
            exercise_id: result.data.id,
            user_agent: navigator.userAgent,
            browser_language: navigator.language,
            screen_resolution: `${window.screen.width}x${window.screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          });
          
          if (demoResult.success && demoResult.data?.id) {
            navigate(`/demo/${demoResult.data.id}`);
          } else {
            navigate(`/exercise/${result.data.id}`);
          }
        } else {
          navigate(`/exercise/${result.data.id}`);
        }
      }
    } catch (error: any) {
      console.error('Error generating exercise:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process text. Please try again.');
    } finally {
      setIsUploading(false);
      setLoadingStatus('');
      setExerciseSettings((prev) => ({ 
        ...prev, 
        topics: [], 
        exercise_name: '', 
        content_type: undefined,
        raw_content: '' 
      }));
    }
  }, [exercise_settings, advanced_settings, topic_id, demo, navigate, setExerciseSettings]);

  const handleExerciseSettings = useCallback(() => {
    if (exercise_settings.content_type === 'text') {
      handleTextExerciseSettings();
    } else {
      handleFileExerciseSettings();
    }
  }, [exercise_settings.content_type, handleTextExerciseSettings, handleFileExerciseSettings]);

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
        const exercise_result = await createExercise({ name: file.name, topic_id: topic_id || null });
        
        if (!exercise_result.data?.id) {
          toast.error('Failed to create exercise - no ID returned');
          return;
        }
  
        setExercise(exercise_result.data || null);
  
        if (exercise_result.data?.id) {
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
        } else {
          toast.error('Failed to generate exercise - no data returned');
          return;
        }
  
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
    [demo, query_params, resetAllStates, user, topic_id, navigate]
  );

  const handlePasteSubmit = useCallback(async () => {
    if (is_uploading || !content.trim()) {
      if (!content.trim()) {
        toast.error('Please enter some content before generating');
      }
      return;
    }
    
    if (user && user.credits <= 0) {
      toast.info('You do not have any credits left. Please purchase more credits to generate exercises.');
      return;
    }
    
    setExerciseSettings((prev) => ({
      ...prev,
      topics: ['Text Content'],
      exercise_name: 'Generated from Text',
      content_type: 'text',
      raw_content: content,
    }));
  }, [content, is_uploading, user, setExerciseSettings]);

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

  const FileUpload = () => {
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
          const exercise_result = await createExercise({ name: file.name, topic_id: topic_id || null });
          
          if (!exercise_result.data?.id) {
            toast.error('Failed to create exercise - no ID returned');
            return;
          }
  
          setExercise(exercise_result.data || null);
  
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
      [demo, query_params, resetAllStates, user, topic_id, navigate]
    );

    const { getRootProps, getInputProps } = useDropzone({
      onDrop,
      onDragEnter: () => setIsDragActive(true),
      onDragLeave: () => setIsDragActive(false),
      accept: {
        'application/pdf': ['.pdf'],
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
        'text/plain': ['.txt'],
      },
    });

    return (
      <div 
        {...getRootProps()}
        className={`h-full bg-white rounded-xl border-2 border-dashed p-6 transition-all ${
          is_drag_active 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          {is_uploading ? (
            <div className="space-y-4 w-full">
              <div className="text-primary-600 font-medium">{loading_status}</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full animate-pulse" 
                  style={{ width: '50%' }}
                ></div>
              </div>
            </div>
          ) : (
            <>
              <div className="p-3 bg-primary-50 rounded-full mb-4">
                <BsUpload className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                Upload Files
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Drag & drop files here or click to browse
              </p>
              <p className="text-xs text-gray-400">
                Supported formats: PDF, XLSX, TXT
              </p>
            </>
          )}
        </div>
      </div>
    );
  };

  // Add this new component for model selection
  const ModelSelector = ({ 
    selectedModel, 
    setSelectedModel 
  }: { 
    selectedModel: string, 
    setSelectedModel: (model: string) => void 
  }) => {
    return (
      <div className="mb-4">
        <label htmlFor="model-select" className="block text-sm font-medium text-gray-700 mb-1">
          AI Model
        </label>
        <select
          id="model-select"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
        >
          {AVAILABLE_MODELS.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500">
          Select the AI model to use for generating your exercise
        </p>
      </div>
    );
  };

  return (
    <div className="w-full p-6 max-w-7xl mx-auto">
      {demo && demo_exercise && !processing_file ? (
        <div className="flex justify-center">
          {renderDemoLink}
        </div>
      ) : (
        <>
          <div className="flex flex-col lg:flex-row gap-8 mb-8">
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <FiType className="w-5 h-5 text-primary-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Type Notes</h2>
              </div>
              <p className="mb-4 text-gray-600">Convert your notes into an exercise</p>
              <textarea
                id='content'
                className="w-full p-4 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200"
                rows={8}
                placeholder="Type your notes here to convert to an exercise..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              
              <button 
                className="mt-4 w-full px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center gap-2"
                onClick={handlePasteSubmit}
                disabled={is_uploading || !content.trim()}
              >
                {is_uploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Generate Exercise'
                )}
              </button>
            </div>

            <div className="flex items-center justify-center lg:flex-col">
              <div className="w-16 h-px bg-gray-200 lg:w-px lg:h-16"></div>
              <div className="mx-4 text-sm text-gray-500 lg:my-4">OR</div>
              <div className="w-16 h-px bg-gray-200 lg:w-px lg:h-16"></div>
            </div>

            <div className="flex-1">
              <FileUploadArea
                on_drop={onDrop}
                is_uploading={is_uploading}
                is_drag_active={is_drag_active}
                loading_status={loading_status}
                set_is_drag_active={setIsDragActive}
              />
            </div>
          </div>
        </>
      )}

      {exercise_settings.topics.length > 0 && (
        <FormModal
          on_generate={handleExerciseSettings}
          on_discard={() => {
            setExerciseSettings((prev) => ({ 
              ...prev, 
              topics: [], 
              exercise_name: '',
              content_type: undefined,
              raw_content: ''
            }));
          }}
          loading_status={loading_status}
          is_uploading={is_uploading}
          exercise_settings={exercise_settings}
          advanced_settings={advanced_settings}
        />
      )}

      <div className='mt-20'>
        <h2 className="text-lg font-semibold mb-4 text-gray-800 mt-8">Recently Created Exercises (Last 4 Hours)</h2>
        
        <div className='overflow-x-auto pb-4 hide-scrollbar w-full'>
          <div className='flex space-x-4 px-1' style={{ width: 'max-content' }}>
            {exercises_loading ? (
              <div className='flex justify-center items-center h-[180px] w-[200px]'>
                <CardSkeleton />
              </div>
            ) : exercises && exercises.length > 0 ? (
              exercises
                .filter((exercise: any) => {
                  // Filter exercises created in the last 4 hours
                  const fourHoursAgo = new Date();
                  fourHoursAgo.setHours(fourHoursAgo.getHours() - 4);
                  return new Date(exercise.created_at) >= fourHoursAgo;
                })
                .map((exercise: any, index: number) => (
                  <div key={exercise.id} className='w-48 flex-shrink-0'>
                    <ExerciseCard exercise={exercise} index={index} />
                  </div>
                ))
            ) : (
              <div className='flex justify-center items-center h-[180px] w-[200px] text-gray-500 text-sm'>
                No recent exercises
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default ExerciseForm;