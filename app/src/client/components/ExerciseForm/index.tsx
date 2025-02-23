import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { BsFiletypeAi } from 'react-icons/bs';
import { AVAILABLE_MODELS } from '../../../shared/constants';
import {
  createExercise,
  generateExercise,
  getLandingPageTry,
  getUploadURL,
  useQuery,
} from 'wasp/client/operations';
import FormModal from './FormModal';
import {
  ExerciseFormContentSettings,
  ExerciseFormGenerationSettings,
  LandingPageTryResult,
} from '../../../shared/types';
import { Link } from 'react-router-dom';
import FileUploadArea from './FileUploadArea';
import { Exercise } from 'wasp/entities';

// Initial states moved outside component to avoid recreation
const initialExerciseSettings: ExerciseFormContentSettings = {
  exerciseName: '',
  setExerciseName: () => {},
  exerciseLength: 'Auto',
  setExerciseLength: () => {},
  exerciseLevel: 'Auto', 
  setExerciseLevel: () => {},
  priorKnowledge: [],
  setPriorKnowledge: () => {},
  topics: [],
  setTopics: () => {},
};

const initialAdvancedSettings: ExerciseFormGenerationSettings = {
  scanImages: false,
  setScanImages: () => {},
  selectedModel: AVAILABLE_MODELS[0],
  setSelectedModel: () => {},
  includeSummary: false,
  setIncludeSummary: () => {},
  includeMCQuiz: false,
  setIncludeMCQuiz: () => {},
};

const ExerciseForm: React.FC<{ topicId: string | null; demo: boolean }> = React.memo(({ topicId, demo = false }) => {
  const [landingPageTry, setLandingPageTry] = useState<LandingPageTryResult | null>(null);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');

  // Query params memoized
  const queryParams = useMemo(() => ({
    userAgent: window.navigator.userAgent,
    browserLanguage: window.navigator.language,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  }), []);

  const { data: landingPageTryData } = useQuery(getLandingPageTry, queryParams, {
    enabled: demo
  });

  // Grouped state for exercise settings with memoized setters
  const [exerciseSettings, setExerciseSettings] = useState<ExerciseFormContentSettings>(() => ({
    ...initialExerciseSettings,
    setExerciseName: (value: string) => setExerciseSettings(prev => ({ ...prev, exerciseName: value })),
    setExerciseLength: (value: string) => setExerciseSettings(prev => ({ ...prev, exerciseLength: value })),
    setExerciseLevel: (value: string) => setExerciseSettings(prev => ({ ...prev, exerciseLevel: value })),
    setPriorKnowledge: (value: string[]) => setExerciseSettings(prev => ({ ...prev, priorKnowledge: value })),
    setTopics: (value: string[]) => setExerciseSettings(prev => ({ ...prev, topics: value })),
  }));

  // Grouped state for advanced settings with memoized setters
  const [advancedSettings, setAdvancedSettings] = useState<ExerciseFormGenerationSettings>(() => ({
    ...initialAdvancedSettings,
    setScanImages: (value: boolean) => setAdvancedSettings(prev => ({ ...prev, scanImages: value })),
    setSelectedModel: (value: string) => setAdvancedSettings(prev => ({ ...prev, selectedModel: value })),
    setIncludeSummary: (value: boolean) => setAdvancedSettings(prev => ({ ...prev, includeSummary: value })),
    setIncludeMCQuiz: (value: boolean) => setAdvancedSettings(prev => ({ ...prev, includeMCQuiz: value })),
  }));

  useEffect(() => {
    if (landingPageTryData) {
      setLandingPageTry(landingPageTryData as LandingPageTryResult);
    }
  }, [landingPageTryData]);

  const resetAllStates = useCallback(() => {
    setIsUploading(false);
    setLoadingStatus('');
    setExercise(null);
    setExerciseSettings(prev => ({
      ...prev,
      exerciseName: '',
      exerciseLength: 'Auto',
      exerciseLevel: 'Auto',
      priorKnowledge: [],
      topics: []
    }));
    setAdvancedSettings(prev => ({
      ...prev,
      scanImages: false,
      selectedModel: AVAILABLE_MODELS[0],
      includeSummary: false,
      includeMCQuiz: false
    }));
  }, []);

  const handleExerciseSettings = useCallback(async () => {
    if (isUploading || !exerciseSettings.topics) return;
    
    setIsUploading(true);
    setLoadingStatus('Generating exercise...');
    
    if (!exercise) {
      throw new Error('Exercise not found');
    }

    try {
      const exerciseResult = await generateExercise({
        exerciseId: exercise.id,
        priorKnowledge: exerciseSettings.priorKnowledge,
        length: exerciseSettings.exerciseLength,
        level: exerciseSettings.exerciseLevel,
        model: advancedSettings.selectedModel,
        includeSummary: advancedSettings.includeSummary,
        includeMCQuiz: advancedSettings.includeMCQuiz,
      });

      if (!exerciseResult?.success) {
        console.error('Failed to generate exercise:', exerciseResult);
      }
    } catch (error) {
      console.error('Error generating exercise:', error);
    } finally {
      resetAllStates();
    }
  }, [exercise, exerciseSettings, advancedSettings, isUploading, resetAllStates]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    
    setIsUploading(true);
    setExerciseSettings(prev => ({ ...prev, exerciseName: file.name }));

    try {
      const exerciseResult = await createExercise({ name: file.name });
      setExercise(exerciseResult);

      if (!exerciseResult?.id) {
        throw new Error('Failed to create exercise - no ID returned');
      }

      setLoadingStatus('Uploading file...');
      const uploadUrlResult = await getUploadURL({
        key: exerciseResult.id,
        fileType: file.type,
      });

      if (!uploadUrlResult?.uploadUrl) {
        throw new Error('Failed to get upload URL');
      }

      const uploadResponse = await fetch(uploadUrlResult.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.statusText}`);
      }

      if (!import.meta.env.REACT_APP_DOCUMENT_PARSER_URL) {
        throw new Error('Document parser URL not found');
      }

      setLoadingStatus('Scanning file...');
      const documentParserUrl = import.meta.env.REACT_APP_DOCUMENT_PARSER_URL + '/get-exercise-topics';
      const formData = new FormData();
      formData.append('fileId', exerciseResult.id);
      formData.append('fileType', file.name.split('.').pop() || '');

      const response = await fetch(documentParserUrl, {
        method: 'POST',
        headers: { accept: 'application/json' },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();
      setExerciseSettings(prev => ({ ...prev, topics: data.topics }));
      setLoadingStatus('Select topics to generate exercise');
    } catch (error) {
      console.error('Error during file processing:', error);
      setLoadingStatus('');
      alert(error instanceof Error ? error.message : 'Failed to process file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, []);

  const renderDemoLink = useMemo(() => (
    <Link
      to={`/demo`}
      className='w-full h-full scale-95 opacity-95 flex flex-col items-center bg-white dark:bg-gray-800 transition-all duration-300 ease-in-out pointer-events-auto'
    >
      <div className='flex h-full items-center justify-center w-full max-w-4xl mx-auto'>
        <div className='flex flex-col items-center p-6 justify-center w-full rounded-xl cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-300'>
          <div className='flex flex-col items-center space-y-4'>
            <div className='p-6 bg-teal-50 dark:bg-teal-900/20 rounded-full'>
              <BsFiletypeAi className='w-12 h-12 text-teal-500' />
            </div>
            <div className='text-center'>
              <p className='text-lg font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Ready to start your exercise: "{landingPageTry?.name}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  ), [landingPageTry?.name]);

  if (demo && landingPageTry?.successful) {
    return renderDemoLink;
  }

  return (
    <div className='w-full h-full scale-95 opacity-95 flex flex-col items-center bg-white dark:bg-gray-800 transition-all duration-300 ease-in-out pointer-events-auto'>
      {!demo || !landingPageTry?.successful ? (
        <FileUploadArea
          onDrop={onDrop}
          isUploading={isUploading}
          isDragActive={isDragActive}
          loadingStatus={loadingStatus}
          setIsDragActive={setIsDragActive}
        />
      ) : renderDemoLink}

      {exerciseSettings.topics.length > 0 && !isUploading && (
        <FormModal
          onGenerate={handleExerciseSettings}
          onDiscard={() => {
            setExerciseSettings(prev => ({ ...prev, topics: [], exerciseName: '' }));
          }}
          loadingStatus={loadingStatus}
          isUploading={isUploading}
          exerciseSettings={exerciseSettings}
          advancedSettings={advancedSettings}
        />
      )}
    </div>
  );
});

export default ExerciseForm;
