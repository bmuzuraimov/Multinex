import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { BsFiletypeAi } from 'react-icons/bs';
import { AVAILABLE_MODELS } from '../../shared/constants';
import { createExercise, countTokens, getLandingPageTry, createLandingPageTry, useQuery } from 'wasp/client/operations';
import ExerciseFormModal from './ExerciseFormModal';
import { ExerciseFormContentSettings, ExerciseFormGenerationSettings } from '../../shared/types';
import { Link } from 'react-router-dom';
import { LandingPageTry } from 'wasp/entities';

const ExerciseForm: React.FC<{ topicId: string | null; demo: boolean }> = ({ topicId, demo = false }) => {
  const [landingPageTry, setLandingPageTry] = useState<LandingPageTry | null>(null);

  const { data: landingPageTryData } = useQuery(getLandingPageTry, {
    userAgent: window.navigator.userAgent,
    browserLanguage: window.navigator.language,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  useEffect(() => {
    if (demo && landingPageTryData) {
      setLandingPageTry(landingPageTryData);
    }
  }, [demo, landingPageTryData]);

  // Grouped state for exercise settings
  const [exerciseSettings, setExerciseSettings] = useState<ExerciseFormContentSettings>({
    exerciseName: '',
    setExerciseName: (value: string) => {
      setExerciseSettings((prev) => ({ ...prev, exerciseName: value }));
    },
    exerciseLength: 'Auto',
    setExerciseLength: (value: string) => {
      setExerciseSettings((prev) => ({ ...prev, exerciseLength: value }));
    },
    exerciseLevel: 'Auto',
    setExerciseLevel: (value: string) => {
      setExerciseSettings((prev) => ({ ...prev, exerciseLevel: value }));
    },
    priorKnowledge: [],
    setPriorKnowledge: (value: string[]) => {
      setExerciseSettings((prev) => ({ ...prev, priorKnowledge: value }));
    },
    topics: [],
    setTopics: (value: string[]) => {
      setExerciseSettings((prev) => ({ ...prev, topics: value }));
    },
  });

  // Grouped state for advanced settings
  const [advancedSettings, setAdvancedSettings] = useState<ExerciseFormGenerationSettings>({
    scanImages: false,
    setScanImages: (value: boolean) => {
      setAdvancedSettings((prev) => ({ ...prev, scanImages: value }));
    },
    showAdvanced: false,
    setShowAdvanced: (value: boolean) => {
      setAdvancedSettings((prev) => ({ ...prev, showAdvanced: value }));
    },
    selectedModel: AVAILABLE_MODELS[0],
    setSelectedModel: (value: string) => {
      setAdvancedSettings((prev) => ({ ...prev, selectedModel: value }));
    },
    includeSummary: false,
    setIncludeSummary: (value: boolean) => {
      setAdvancedSettings((prev) => ({ ...prev, includeSummary: value }));
    },
    includeMCQuiz: false,
    setIncludeMCQuiz: (value: boolean) => {
      setAdvancedSettings((prev) => ({ ...prev, includeMCQuiz: value }));
    },
  });

  // General states
  const [isUploading, setIsUploading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);

  // Main function to handle file upload and content extraction
  const handleExerciseFileUpload = async () => {
    if (isUploading || !selectedFile || !fileContent) {
      return;
    }

    try {
      setIsUploading(true);

      if (!demo) {
        setLoadingStatus('Calculating required tokens...');
        const { tokens, sufficient } = await countTokens({
          content: fileContent,
        });

        if (!sufficient) {
          alert(`You don't have enough tokens to generate this exercise. It requires at least ${tokens} tokens.`);
          return;
        }
      }

      setLoadingStatus('Generating exercise content...');
      // Proceed to create the exercise
      let jsonResponse;
      if (!demo) {
        jsonResponse = await createExercise({
          name: selectedFile.name,
          length: exerciseSettings.exerciseLength,
          level: exerciseSettings.exerciseLevel,
          content: fileContent,
          topicId: topicId ?? '',
          model: advancedSettings.selectedModel,
          includeSummary: advancedSettings.includeSummary,
          includeMCQuiz: advancedSettings.includeMCQuiz,
          priorKnowledge: exerciseSettings.priorKnowledge.join(','),
        });
      } else {
        jsonResponse = await createLandingPageTry({
          name: selectedFile.name,
          userAgent: window.navigator.userAgent,
          browserLanguage: window.navigator.language,
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          length: exerciseSettings.exerciseLength,
          level: exerciseSettings.exerciseLevel,
          content: fileContent,
          model: advancedSettings.selectedModel,
          includeSummary: advancedSettings.includeSummary,
          includeMCQuiz: advancedSettings.includeMCQuiz,
          priorKnowledge: exerciseSettings.priorKnowledge.join(','),
        });
      }

      if (advancedSettings.includeSummary) {
        setLoadingStatus('Generating summary...');
      }

      if (advancedSettings.includeMCQuiz) {
        setLoadingStatus('Generating multiple choice quiz...');
      }

      if (!jsonResponse.success) {
        alert(jsonResponse.message);
      }
    } catch (error) {
      console.error('Error during exercise generation:', error);
      alert('There was an error while generating the exercise. Please try again.');
    } finally {
      setIsUploading(false);
      setLoadingStatus('');
      setSelectedFile(null);
      setFileContent(null);
      setAdvancedSettings((prev) => ({
        ...prev,
        showAdvanced: false,
        includeSummary: false,
        includeMCQuiz: false,
      }));
      setExerciseSettings((prev) => ({
        ...prev,
        priorKnowledge: [],
        topics: [],
        exerciseName: '',
      }));
    }
  };

  // Handle files dropped into the dropzone
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];

      // Check if file is PPT
      if (file.name.toLowerCase().endsWith('.ppt')) {
        alert('PPT files are not supported. Please convert to PPTX format.');
        return;
      }

      try {
        setIsUploading(true);
        setLoadingStatus('Scanning document and extracting content...');
        setSelectedFile(file);
        exerciseSettings.setExerciseName(file.name);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('scan_images', advancedSettings.scanImages ? 'true' : 'false');

        if (!import.meta.env.REACT_APP_DOCUMENT_PARSER_URL) {
          throw new Error('DOCUMENT_PARSER_URL is not set');
        }

        const documentParserUrl = import.meta.env.REACT_APP_DOCUMENT_PARSER_URL + '/extract-text';
        const response = await fetch(documentParserUrl, {
          method: 'POST',
          headers: {
            accept: 'application/json',
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const responseData = await response.json();
        const extractedContent = responseData.text;
        exerciseSettings.setTopics(responseData.topics);

        if (!extractedContent || extractedContent.trim().length < 10) {
          throw new Error('No text found in the file');
        }

        setFileContent(extractedContent);
        setIsUploading(false);
        setLoadingStatus('');
      } catch (error) {
        console.error('Error during file processing:', error);
        alert(error instanceof Error ? error.message : 'Error processing file. Please try again.');
        setSelectedFile(null);
        setFileContent(null);
        setIsUploading(false);
        setLoadingStatus('');
      }

      setIsDragActive(false);
    },
    [advancedSettings.scanImages]
  );

  // Configure the dropzone to accept multiple file types
  const {
    getRootProps,
    getInputProps,
    isDragActive: dropzoneIsDragActive,
  } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/plain': ['.txt'],
    },
    multiple: false,
    disabled: isUploading,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  if (demo && landingPageTry?.successful) {
    return (
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
                  Ready to start your exercise: "{landingPageTry.name}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className='w-full h-full scale-95 opacity-95 flex flex-col items-center bg-white dark:bg-gray-800 transition-all duration-300 ease-in-out pointer-events-auto'>
      {/* File Upload Area */}
      <div className='flex h-full items-center justify-center w-full max-w-4xl mx-auto'>
        <div
          {...getRootProps()}
          className={`flex flex-col h-full items-center p-6 justify-center w-full rounded-xl cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-300 ${
            isUploading
              ? 'opacity-50 cursor-not-allowed bg-gradient-to-r from-teal-50 via-teal-100 to-teal-50 dark:from-teal-900/30 dark:via-teal-800/30 dark:to-teal-900/30 bg-[length:400%_400%] animate-gradient'
              : ''
          } ${isDragActive || dropzoneIsDragActive ? 'ring-2 ring-teal-500 bg-teal-50 dark:bg-teal-900/50' : ''}`}
        >
          <input {...getInputProps()} />
          <div className='flex flex-col items-center justify-center py-4'>
            {isUploading ? (
              <div className='flex flex-col items-center space-y-4'>
                <div className='relative'>
                  <BsFiletypeAi className='w-12 h-12 text-teal-500 animate-pulse' />
                  <div className='absolute -inset-2 animate-spin-slow rounded-full border-t-2 border-l-2 border-teal-500/30'></div>
                  <div className='absolute -inset-1 animate-spin-reverse-slower rounded-full border-r-2 border-b-2 border-teal-500/20'></div>
                </div>
                <p className='text-lg text-center font-medium text-gray-700 dark:text-gray-300 animate-pulse'>
                  {loadingStatus || 'Processing...'}
                </p>
                <div className='flex space-x-2 mt-2'>
                  <div className='w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:-0.3s]'></div>
                  <div className='w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:-0.15s]'></div>
                  <div className='w-2 h-2 rounded-full bg-teal-500 animate-bounce'></div>
                </div>
              </div>
            ) : (
              <div className='flex flex-col items-center space-y-4'>
                <div className='p-6 bg-teal-50 dark:bg-teal-900/20 rounded-full transition-transform duration-300 hover:scale-105'>
                  <svg
                    className='w-12 h-12 text-teal-500'
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 20 16'
                  >
                    <path
                      stroke='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2'
                    />
                  </svg>
                </div>
                <div className='text-center'>
                  <p className='text-lg font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    <span className='font-semibold hover:text-teal-600 dark:hover:text-teal-400 transition-colors'>
                      Click to upload
                    </span>{' '}
                    or drag and drop
                  </p>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>PDF, PPTX, XLSX, TXT</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedFile && fileContent && !isUploading && (
        <ExerciseFormModal
          selectedFile={selectedFile}
          onGenerate={handleExerciseFileUpload}
          onDiscard={() => {
            setSelectedFile(null);
            setFileContent(null);
          }}
          loadingStatus={loadingStatus}
          isUploading={isUploading}
          exerciseSettings={exerciseSettings}
          advancedSettings={advancedSettings}
          topicId={topicId}
          topics={exerciseSettings.topics}
        />
      )}
    </div>
  );
};

export default ExerciseForm;
