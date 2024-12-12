import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useDropzone } from 'react-dropzone';
import { HiOutlineInformationCircle } from 'react-icons/hi';
import { BsFiletypeAi } from 'react-icons/bs';
import { BsChevronDown } from 'react-icons/bs';
import { Tooltip } from 'react-tooltip';
import { EXERCISE_LEVELS, EXERCISE_LENGTHS, AVAILABLE_MODELS } from '../../shared/constants';
import { createExercise, countTokens } from 'wasp/client/operations';

const FileModal: React.FC<{
  selectedFile: File;
  onGenerate: () => void;
  onDiscard: () => void;
  loadingStatus: string;
  isUploading: boolean;
  exerciseLength: string;
  setExerciseLength: (value: string) => void;
  exerciseLevel: string;
  setExerciseLevel: (value: string) => void;
  priorKnowledge: string;
  setPriorKnowledge: (value: string) => void;
  showAdvanced: boolean;
  setShowAdvanced: (value: boolean) => void;
  selectedModel: string;
  setSelectedModel: (value: string) => void;
  includeSummary: boolean;
  setIncludeSummary: (value: boolean) => void;
  includeMCQuiz: boolean;
  setIncludeMCQuiz: (value: boolean) => void;
  topicId: string | null;
}> = ({
  selectedFile,
  onGenerate,
  onDiscard,
  loadingStatus,
  isUploading,
  exerciseLength,
  setExerciseLength,
  exerciseLevel,
  setExerciseLevel,
  priorKnowledge,
  setPriorKnowledge,
  showAdvanced,
  setShowAdvanced,
  selectedModel,
  setSelectedModel,
  includeSummary,
  setIncludeSummary,
  includeMCQuiz,
  setIncludeMCQuiz,
  topicId,
}) => {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  return ReactDOM.createPortal(
    <div className='fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full'>
        <div className='flex flex-col items-center space-y-6'>
          <div className='relative p-4 bg-teal-50 dark:bg-teal-900/20 rounded-full'>
            <BsFiletypeAi className='w-12 h-12 text-teal-500' />
          </div>
          <p className='text-lg font-medium text-gray-700 dark:text-gray-300'>{selectedFile.name}</p>
          <div className='flex space-x-4'>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onGenerate();
              }}
              className='px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium'
              disabled={isUploading}
            >
              {isUploading ? loadingStatus : 'Generate Exercise'}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDiscard();
              }}
              className='px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium'
            >
              Discard
            </button>
          </div>
          <div className='w-full max-w-3xl mx-auto space-y-8 overflow-y-auto max-h-[calc(100vh-200px)]'>
            <div className='relative'>
              <HiOutlineInformationCircle
                className='absolute -top-1 right-0 w-6 h-6 text-gray-600 dark:text-gray-400'
                data-multiline
                data-tooltip-id={`my-tooltip-${topicId || 'all'}`}
              />
              <Tooltip
                id={`my-tooltip-${topicId || 'all'}`}
                place='top'
                className='z-99'
                content='Exercise length varies by level; higher levels require more words.'
              />

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                    Length of the Exercise
                  </label>
                  <select
                    className='w-full p-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:border-teal-400 dark:hover:border-teal-500'
                    value={exerciseLength}
                    onChange={(e) => setExerciseLength(e.target.value)}
                  >
                    {Object.entries(EXERCISE_LENGTHS).map(([key, value]) => (
                      <option key={key} value={key} className='py-2'>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                <div className='space-y-2'>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Exercise Level</label>
                  <select
                    className='w-full p-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:border-teal-400 dark:hover:border-teal-500'
                    value={exerciseLevel}
                    onChange={(e) => setExerciseLevel(e.target.value)}
                  >
                    {Object.entries(EXERCISE_LEVELS).map(([key, value]) => (
                      <option key={key} value={key} className='py-2'>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className='w-full space-y-2'>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                Prior Knowledge (Optional)
              </label>
              <textarea
                className='w-full p-4 text-sm border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:border-teal-400 dark:hover:border-teal-500'
                placeholder="List concepts you're already familiar with to exclude them from the exercise..."
                rows={3}
                value={priorKnowledge}
                onChange={(e) => setPriorKnowledge(e.target.value)}
              />
            </div>

            <div className='flex flex-col md:flex-row md:items-center md:justify-around space-y-4 md:space-y-0'>
              <button
                onClick={() => setIncludeSummary(!includeSummary)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  includeSummary 
                    ? 'bg-teal-500 text-white hover:bg-teal-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Include Summary
              </button>

              <button 
                onClick={() => setIncludeMCQuiz(!includeMCQuiz)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  includeMCQuiz
                    ? 'bg-teal-500 text-white hover:bg-teal-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Include MC Quiz
              </button>
            </div>

            <div className='w-full'>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className='w-full flex items-center justify-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 py-2'
              >
                <span className='border-b border-gray-200 dark:border-gray-700 w-16 mx-3'></span>
                <span className='font-medium'>Advanced Options</span>
                <span className='border-b border-gray-200 dark:border-gray-700 w-16 mx-3'></span>
                <BsChevronDown
                  className={`w-4 h-4 transform transition-transform duration-150 ${showAdvanced ? 'rotate-180' : ''}`}
                />
              </button>

              {showAdvanced && (
                <div className='mt-4 p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg'>
                  <div className='space-y-2'>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                      Model Selection
                    </label>
                    <select
                      className='w-full p-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                    >
                      {AVAILABLE_MODELS.map((model) => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    modalRoot
  );
};

const ExerciseForm: React.FC<{ topicId: string | null }> = ({ topicId }) => {
  const [exerciseLength, setExerciseLength] = useState('Long');
  const [exerciseLevel, setExerciseLevel] = useState('Advanced');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[0]);
  const [includeSummary, setIncludeSummary] = useState(false);
  const [includeMCQuiz, setIncludeMCQuiz] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [priorKnowledge, setPriorKnowledge] = useState('');

  // Main function to handle file upload and content extraction
  const handleExerciseFileUpload = async () => {
    if (isUploading || !selectedFile) {
      return;
    }

    // Check if file is PPT
    if (selectedFile.name.toLowerCase().endsWith('.ppt')) {
      alert('PPT files are not supported. Please convert to PPTX format.');
      return;
    }

    try {
      setIsUploading(true);
      setLoadingStatus('Scanning document and extracting content...');

      const formData = new FormData();
      formData.append('files', selectedFile);
      if (!import.meta.env.REACT_APP_DOCUMENT_PARSER_URL) {
        console.error('DOCUMENT_PARSER_URL is not set');
        return;
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
        throw new Error('Failed to extract text from file');
      }

      setSelectedFile(null);

      const responseData = await response.json();
      const fileContent = responseData.text;

      if (!fileContent || fileContent.trim().length < 10) {
        alert('No text found in the file. Please provide a valid file.');
        return;
      }

      setLoadingStatus('Calculating required tokens...');
      // Count tokens required for the file content
      const { tokens, sufficient } = await countTokens({
        content: fileContent,
      });

      if (!sufficient) {
        alert(`You don't have enough tokens to generate this exercise. It requires at least ${tokens} tokens.`);
        return;
      }

      setLoadingStatus('Generating exercise content...');
      // Proceed to create the exercise
      const jsonResponse = await createExercise({
        length: exerciseLength,
        level: exerciseLevel,
        content: fileContent,
        topicId: topicId ?? '',
        model: selectedModel,
        includeSummary: includeSummary,
        includeMCQuiz: includeMCQuiz,
        priorKnowledge: priorKnowledge,
      });

      if (includeSummary) {
        setLoadingStatus('Generating summary...');
      }

      if (includeMCQuiz) {
        setLoadingStatus('Generating multiple choice quiz...');
      }

      if (!jsonResponse.success) {
        alert(jsonResponse.message);
      }
    } catch (error) {
      console.error('Error during file upload or processing:', error);
      alert('There was an error while processing the file. Please try again.');
    } finally {
      setIsUploading(false);
      setLoadingStatus('');
      setSelectedFile(null);
      setShowAdvanced(false);
      setIncludeSummary(false);
      setIncludeMCQuiz(false);
      setPriorKnowledge('');
    }
  };

  // Handle files dropped into the dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
    setIsDragActive(false);
  }, []);

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
    <div className='w-full h-full scale-95 opacity-95 flex flex-col items-center bg-white dark:bg-gray-800 transition-all duration-300 ease-in-out'>
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
                    <span className='font-semibold hover:text-teal-600 dark:hover:text-teal-400 transition-colors'>Click to upload</span> or drag and drop
                  </p>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>PDF, PPTX, XLSX, TXT</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedFile && (
        <FileModal
          selectedFile={selectedFile}
          onGenerate={handleExerciseFileUpload}
          onDiscard={() => setSelectedFile(null)}
          loadingStatus={loadingStatus}
          isUploading={isUploading}
          exerciseLength={exerciseLength}
          setExerciseLength={setExerciseLength}
          exerciseLevel={exerciseLevel}
          setExerciseLevel={setExerciseLevel}
          priorKnowledge={priorKnowledge}
          setPriorKnowledge={setPriorKnowledge}
          showAdvanced={showAdvanced}
          setShowAdvanced={setShowAdvanced}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          includeSummary={includeSummary}
          setIncludeSummary={setIncludeSummary}
          includeMCQuiz={includeMCQuiz}
          setIncludeMCQuiz={setIncludeMCQuiz}
          topicId={topicId}
        />
      )}
    </div>
  );
};

export default ExerciseForm;
