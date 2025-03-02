import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { BsFiletypeAi } from 'react-icons/bs';
import { AVAILABLE_MODELS } from '../../../shared/constants';
import {
  createExercise,
  generateExercise,
  getDemoExercise,
  getUploadURL,
  createDemoExercise,
  useQuery,
} from 'wasp/client/operations';
import FormModal from './FormModal';
import {
  ExerciseFormContentSettings,
  ExerciseFormGenerationSettings,
  SensoryMode,
} from '../../../shared/types';
import { Link } from 'react-router-dom';
import FileUploadArea from './FileUploadArea';
import { Exercise } from 'wasp/entities';
import { AudioTimestamp } from '../../utils/AudioController';
import { ExerciseStatus } from '@prisma/client';

type DemoExerciseResult = {
  id: string;
  createdAt: Date;
  userAgent: string;
  browserLanguage: string | null;
  screenResolution: string | null;
  timezone: string | null;
  exerciseId: string;
  exercise: {
    id: string;
    name: string;
    paragraphSummary: string;
    level: string;
    truncated: boolean;
    no_words: number;
    completed: boolean;
    completedAt: Date | null;
    score: number;
    model: string;
    userEvaluation: number | null;
    userId: string;
    topicId: string | null;
    questions: Array<{
      id: string;
      text: string;
      exerciseId: string;
      createdAt: Date;
      options: Array<{
        id: string;
        text: string;
        isCorrect: boolean;
        questionId: string;
        createdAt: Date;
      }>;
    }>;
    audioTimestamps: AudioTimestamp[];
    lessonText: string;
    cursor: number;
    tokens: any; // Adding missing property
    status: ExerciseStatus;
    createdAt: Date;
  };
  essay: string;
  formattedEssay: Array<{ mode: 'hear' | 'type' | 'write'; text: string[] }>;
  audioUrl: string;
};

const initialExerciseSettings: ExerciseFormContentSettings = {
  sensoryModes: ['type', 'write'] as SensoryMode[],
  setSensoryMods: (value: SensoryMode[]) => {},
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
  sensoryModes: [],
  setSensoryMods: () => {}
};

const ExerciseForm: React.FC<{ topicId: string | null; demo: boolean }> = React.memo(
  ({ topicId, demo = false }) => {
    const [demoExercise, setDemoExercise] = useState<DemoExerciseResult | null>(null);
    const [exercise, setExercise] = useState<Exercise | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isDragActive, setIsDragActive] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState('');
    const [processingFile, setProcessingFile] = useState(false);

    // Memoized query params
    const queryParams = useMemo(
      () => ({
        userAgent: window.navigator.userAgent,
        browserLanguage: window.navigator.language,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }),
      []
    );

    const { data: demoExerciseData } = useQuery(getDemoExercise, queryParams, {
      enabled: demo && !processingFile,
    });

    // Grouped state for exercise settings
    const [exerciseSettings, setExerciseSettings] = useState<ExerciseFormContentSettings>(() => ({
      ...initialExerciseSettings,
      setExerciseName: (value: string) =>
        setExerciseSettings((prev: ExerciseFormContentSettings) => ({ ...prev, exerciseName: value })),

      setExerciseLength: (value: string) =>
        setExerciseSettings((prev: ExerciseFormContentSettings) => ({ ...prev, exerciseLength: value })),

      setExerciseLevel: (value: string) =>
        setExerciseSettings((prev: ExerciseFormContentSettings) => ({ ...prev, exerciseLevel: value })),

      setPriorKnowledge: (value: string[]) =>
        setExerciseSettings((prev: ExerciseFormContentSettings) => ({ ...prev, priorKnowledge: value })),

      setTopics: (value: string[]) =>
        setExerciseSettings((prev: ExerciseFormContentSettings) => ({ ...prev, topics: value })),

      setSensoryMods: (value: SensoryMode[]) =>
        setExerciseSettings((prev: ExerciseFormContentSettings) => ({ ...prev, sensoryModes: value })),
    }));

    // Grouped state for advanced settings
    const [advancedSettings, setAdvancedSettings] =
      useState<ExerciseFormGenerationSettings>(() => ({
        ...initialAdvancedSettings,
        setScanImages: (value: boolean) =>
          setAdvancedSettings((prev) => ({ ...prev, scanImages: value })),

        setSelectedModel: (value: string) =>
          setAdvancedSettings((prev) => ({ ...prev, selectedModel: value })),

        setIncludeSummary: (value: boolean) =>
          setAdvancedSettings((prev) => ({ ...prev, includeSummary: value })),

        setIncludeMCQuiz: (value: boolean) =>
          setAdvancedSettings((prev) => ({ ...prev, includeMCQuiz: value })),
      }));

    useEffect(() => {
      if (demoExerciseData && !processingFile) {
        setDemoExercise(demoExerciseData as DemoExerciseResult);
      }
    }, [demoExerciseData, processingFile]);

    const resetAllStates = useCallback(() => {
      setIsUploading(false);
      setLoadingStatus('');
      setExercise(null);
      setExerciseSettings((prev) => ({
        ...prev,
        exerciseName: '',
        exerciseLength: 'Auto',
        exerciseLevel: 'Auto',
        priorKnowledge: [],
        topics: [],
        sensoryModes: ['listen', 'type', 'write'],
      }));
      setAdvancedSettings((prev) => ({
        ...prev,
        scanImages: false,
        selectedModel: AVAILABLE_MODELS[0],
        includeSummary: false,
        includeMCQuiz: false,
      }));
    }, []);

    // Handle the "Generate Exercise" button
    const handleExerciseSettings = useCallback(async () => {
      if (isUploading || !exerciseSettings.topics) return;
      setIsUploading(true);
      setLoadingStatus('Generating exercise...');

      if (!exercise) {
        throw new Error('Exercise not found');
      }

      try {
        const exerciseData = {
          exerciseId: exercise.id,
          name: exerciseSettings.exerciseName,
          priorKnowledge: exerciseSettings.priorKnowledge,
          length: exerciseSettings.exerciseLength,
          level: exerciseSettings.exerciseLevel,
          model: advancedSettings.selectedModel,
          includeSummary: advancedSettings.includeSummary,
          includeMCQuiz: advancedSettings.includeMCQuiz,
          // Pass the user's selected modes to the backend
          sensoryModes: exerciseSettings.sensoryModes,
        };

        const exerciseResult = await generateExercise(exerciseData);

        if (!exerciseResult?.success) {
          console.error('Failed to generate exercise:', exerciseResult);
        }
      } catch (error) {
        console.error('Error generating exercise:', error);
      } finally {
        setProcessingFile(false);
        resetAllStates();
      }
    }, [
      exercise,
      exerciseSettings,
      advancedSettings,
      isUploading,
      resetAllStates,
    ]);

    // Handle file drop
    const onDrop = useCallback(
      async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;
        const file = acceptedFiles[0];

        setIsUploading(true);
        setProcessingFile(true);
        setExerciseSettings((prev) => ({ ...prev, exerciseName: file.name }));

        try {
          const exerciseResult = await createExercise({ name: file.name, topicId: topicId });
          if (demo) {
            await createDemoExercise({
              exerciseId: exerciseResult.id,
              userAgent: queryParams.userAgent,
              browserLanguage: queryParams.browserLanguage,
              screenResolution: queryParams.screenResolution,
              timezone: queryParams.timezone,
            });
          }

          setExercise(exerciseResult);

          if (!exerciseResult?.id) {
            throw new Error('Failed to create exercise - no ID returned');
          }

          // Upload file
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

          // Now parse topics from doc
          if (!import.meta.env.REACT_APP_DOCUMENT_PARSER_URL) {
            throw new Error('Document parser URL not found');
          }

          setLoadingStatus('Scanning file...');
          const documentParserUrl =
            import.meta.env.REACT_APP_DOCUMENT_PARSER_URL + '/get-exercise-topics';
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
          setExerciseSettings((prev) => ({ ...prev, topics: data.topics }));
          setLoadingStatus('Select topics to generate exercise');
        } catch (error: any) {
          console.error('Error during file processing:', error);
          setLoadingStatus('');
          alert(
            error instanceof Error
              ? error.message
              : 'Failed to process file. Please try again.'
          );
        } finally {
          setIsUploading(false);
        }
      },
      [demo, queryParams, topicId]
    );

    const renderDemoLink = useMemo(
      () => (
        <Link
          to={`/demo`}
          className="w-full h-full scale-95 opacity-95 flex flex-col items-center bg-white dark:bg-gray-800 transition-all duration-300 ease-in-out pointer-events-auto"
        >
          <div className="flex h-full items-center justify-center w-full max-w-4xl mx-auto">
            <div className="flex flex-col items-center p-6 justify-center w-full rounded-xl cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-300">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-6 bg-teal-50 dark:bg-teal-900/20 rounded-full">
                  <BsFiletypeAi className="w-12 h-12 text-teal-500" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ready to start your exercise: "{demoExercise?.exercise?.name}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ),
      [demoExercise]
    );

    if (demo && demoExercise && !processingFile) {
      return renderDemoLink;
    }

    return (
      <div className="w-full h-full scale-95 opacity-95 flex flex-col items-center bg-white dark:bg-gray-800 transition-all duration-300 ease-in-out pointer-events-auto">
        {!demo || !demoExercise || processingFile ? (
          <FileUploadArea
            onDrop={onDrop}
            isUploading={isUploading}
            isDragActive={isDragActive}
            loadingStatus={loadingStatus}
            setIsDragActive={setIsDragActive}
          />
        ) : (
          renderDemoLink
        )}

        {exerciseSettings.topics.length > 0 && !isUploading && (
          <FormModal
            onGenerate={handleExerciseSettings}
            onDiscard={() => {
              // Clear out topics and reset name if user discards
              setExerciseSettings((prev) => ({ ...prev, topics: [], exerciseName: '' }));
            }}
            loadingStatus={loadingStatus}
            isUploading={isUploading}
            exerciseSettings={exerciseSettings}
            advancedSettings={advancedSettings}
          />
        )}
      </div>
    );
  }
);

export default ExerciseForm;
