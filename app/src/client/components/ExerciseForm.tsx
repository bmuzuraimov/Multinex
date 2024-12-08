import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { HiOutlineInformationCircle } from 'react-icons/hi';
import { BsFiletypeAi } from 'react-icons/bs';
import { BsChevronDown } from 'react-icons/bs';
import { Tooltip } from 'react-tooltip';
import { EXERCISE_LEVELS, EXERCISE_LENGTHS, AVAILABLE_MODELS } from '../../shared/constants';
import { createExercise, countTokens } from 'wasp/client/operations';

const ExerciseForm: React.FC<{ topicId: string | null }> = ({ topicId }) => {
  const [exerciseLength, setExerciseLength] = useState('Long');
  const [exerciseLevel, setExerciseLevel] = useState('Advanced');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[0]);
  const [includeSummary, setIncludeSummary] = useState(false);
  const [includeMCQuiz, setIncludeMCQuiz] = useState(false);

  // Main function to handle file upload and content extraction
  const handleExerciseFileUpload = async (file: File) => {
    if (isUploading) {
      return;
    }

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append('files', file);
      if(!import.meta.env.REACT_APP_DOCUMENT_PARSER_URL) {
        console.error('DOCUMENT_PARSER_URL is not set');
        return;
      }
      const documentParserUrl = import.meta.env.REACT_APP_DOCUMENT_PARSER_URL + '/extract-text';
      const response = await fetch(documentParserUrl, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to extract text from file');
      }

      const responseData = await response.json();
      const fileContent = responseData.text;

      if (!fileContent || fileContent.trim().length < 10) {
        alert('No text found in the file. Please provide a valid file.');
        return;
      }

      // Count tokens required for the file content
      const { tokens, sufficient } = await countTokens({
        content: fileContent,
      });

      if (!sufficient) {
        alert(`You don't have enough tokens to generate this exercise. It requires at least ${tokens} tokens.`);
        return;
      }

      // Confirm the user wants to proceed with the required tokens
      const userConfirmed = window.confirm(
        `Generating this exercise requires at least ${tokens} tokens. Do you want to proceed?`
      );
      if (!userConfirmed) {
        return;
      }

      // Proceed to create the exercise
      const jsonResponse = await createExercise({
        length: exerciseLength,
        level: exerciseLevel,
        content: fileContent,
        topicId: topicId ?? '',
        model: selectedModel,
        includeSummary: includeSummary,
        includeMCQuiz: includeMCQuiz,
      });

      if (!jsonResponse.success) {
        alert(jsonResponse.message);
      }
    } catch (error) {
      console.error('Error during file upload or processing:', error);
      alert('There was an error while processing the file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle files dropped into the dropzone
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        handleExerciseFileUpload(acceptedFiles[0]);
      }
      setIsDragActive(false);
    },
    [
      isUploading,
      exerciseLength,
      exerciseLevel,
      selectedModel,
      includeSummary,
      includeMCQuiz,
    ]
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

  return (
    <div className='relative flex flex-col items-center p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md cursor-pointer space-y-4'>
      <HiOutlineInformationCircle
        className='absolute top-2 right-2 w-6 h-6 text-gray-600 dark:text-gray-400'
        data-multiline
        data-tooltip-id={`my-tooltip-${topicId || 'all'}`}
      />
      <Tooltip
        id={`my-tooltip-${topicId || 'all'}`}
        place='top'
        className='z-99'
        content='Exercise length varies by level; higher levels require more words.'
      />
      <label className='text-sm text-gray-700 dark:text-gray-300'>Length of the Exercise</label>
      <select
        className='w-full p-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:border-blue-400 dark:hover:border-blue-500'
        value={exerciseLength}
        onChange={(e) => setExerciseLength(e.target.value)}
      >
        {Object.entries(EXERCISE_LENGTHS).map(([key, value]) => (
          <option key={key} value={key} className="py-2">
            {value}
          </option>
        ))}
      </select>
      <select
        className='w-full p-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:border-blue-400 dark:hover:border-blue-500'
        value={exerciseLevel} 
        onChange={(e) => setExerciseLevel(e.target.value)}
      >
        {EXERCISE_LEVELS.map((level) => (
          <option key={level} value={level} className="py-2">
            {level}
          </option>
        ))}
      </select>

      <div className='flex items-center justify-center w-full'>
        <div
          {...getRootProps()}
          className={`flex flex-col items-center p-2 justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 ${
            isUploading ? 'opacity-50 cursor-not-allowed' : ''
          } ${isDragActive || dropzoneIsDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/50' : ''}`}
        >
          <input {...getInputProps()} />
          <div className='flex flex-col items-center justify-center pt-5 pb-6'>
            {isUploading ? (
              <>
                <BsFiletypeAi className='w-8 h-8 mb-4 text-teal-500 animate-bounce' />
                <p className='mb-2 text-sm text-gray-500 dark:text-gray-400 text-center'>
                  <span className='font-semibold'>Generating Exercise</span> please wait...
                </p>
              </>
            ) : (
              <>
                <svg
                  className='w-8 h-8 mb-4 text-gray-500 dark:text-gray-400'
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

                <p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>
                  <span className='font-semibold'>Click to upload</span> or drag and drop
                </p>
                <p className='text-xs text-gray-500 dark:text-gray-400'>PDF, PPTX, XLSX, TXT</p>
              </>
            )}
          </div>
        </div>
      </div>
      <div className='w-full'>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className='w-full flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        >
          <span className='border-b border-gray-200 dark:border-gray-700 w-12 mx-2'></span>
          <span>Advanced</span>
          <span className='border-b border-gray-200 dark:border-gray-700 w-12 mx-2'></span>
          <BsChevronDown
            className={`w-3 h-3 transform transition-transform duration-150 ${showAdvanced ? 'rotate-180' : ''}`}
          />
        </button>

        {showAdvanced && (
          <div className='mt-1 px-2 py-1 space-y-2'>
            <select
              className='w-full px-2 py-1 text-xs border border-gray-200 dark:border-gray-700 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              {AVAILABLE_MODELS.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>

            <div className='flex items-center space-x-2'>
              <label className='relative flex items-center cursor-pointer'>
                <input
                  type='checkbox'
                  className='sr-only peer'
                  checked={includeSummary}
                  onChange={(e) => setIncludeSummary(e.target.checked)}
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className='ml-2 text-xs text-gray-600 dark:text-gray-300'>Include Summary</span>
              </label>
            </div>

            <div className='flex items-center space-x-2'>
              <label className='relative flex items-center cursor-pointer'>
                <input
                  type='checkbox'
                  className='sr-only peer'
                  checked={includeMCQuiz} 
                  onChange={(e) => setIncludeMCQuiz(e.target.checked)}
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className='ml-2 text-xs text-gray-600 dark:text-gray-300'>Include MC Quiz</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseForm;
