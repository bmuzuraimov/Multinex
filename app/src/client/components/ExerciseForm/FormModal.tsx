import { Tooltip } from 'react-tooltip';
import ReactDOM from 'react-dom';
import { BsFiletypeAi, BsChevronDown } from 'react-icons/bs';
import { HiOutlineInformationCircle } from 'react-icons/hi';
import { EXERCISE_LENGTHS, EXERCISE_LEVELS, AVAILABLE_MODELS } from '../../../shared/constants';
import { ExerciseFormContentSettings, ExerciseFormGenerationSettings } from '../../../shared/types';
import { useState } from 'react';
import voices from './voices';

type FormModalProps = {
  onGenerate: () => void;
  onDiscard: () => void;
  loadingStatus: string;
  isUploading: boolean;
  exerciseSettings: ExerciseFormContentSettings;
  advancedSettings: ExerciseFormGenerationSettings;
};

const FormModal: React.FC<FormModalProps> = ({
  onGenerate,
  onDiscard,
  loadingStatus,
  isUploading,
  exerciseSettings,
  advancedSettings,
}) => {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  const [showAdvanced, setShowAdvanced] = useState(false);

  return ReactDOM.createPortal(
    <div className='fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full'>
        <div className='flex flex-col items-center space-y-6'>
          <div className='relative p-4 bg-teal-50 dark:bg-teal-900/20 rounded-full'>
            <BsFiletypeAi className='w-12 h-12 text-teal-500' />
          </div>
          <p className='text-lg font-medium text-gray-700 dark:text-gray-300'>{exerciseSettings.exerciseName}</p>
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
                data-tooltip-id={`my-tooltip-${exerciseSettings.exerciseName || 'all'}`}
              />
              <Tooltip
                id={`my-tooltip-${exerciseSettings.exerciseName || 'all'}`}
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
                    value={exerciseSettings.exerciseLength}
                    onChange={(e) => exerciseSettings.setExerciseLength(e.target.value)}
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
                    value={exerciseSettings.exerciseLevel}
                    onChange={(e) => exerciseSettings.setExerciseLevel(e.target.value)}
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
              <div className="flex flex-wrap gap-3">
                {exerciseSettings.topics.map((topic) => (
                  <div 
                    key={topic}
                    className="flex items-center"
                  >
                    <input
                      type="checkbox"
                      id={`topic-${topic}`}
                      checked={exerciseSettings.priorKnowledge.includes(topic)}
                      onChange={(e) => {
                        const updatedKnowledge = e.target.checked
                          ? [...exerciseSettings.priorKnowledge, topic]
                          : exerciseSettings.priorKnowledge.filter(k => k !== topic);
                        exerciseSettings.setPriorKnowledge(updatedKnowledge);
                      }}
                      className="sr-only"
                    />
                    <label
                      htmlFor={`topic-${topic}`}
                      className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer
                        transition-all duration-200 ease-in-out select-none
                        ${exerciseSettings.priorKnowledge.includes(topic)
                          ? 'bg-teal-500 text-white hover:bg-teal-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                    >
                      {topic}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className='flex flex-col md:flex-row md:items-center md:justify-around space-y-4 md:space-y-0'>
              <button
                onClick={() => advancedSettings.setIncludeSummary(!advancedSettings.includeSummary)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  advancedSettings.includeSummary
                    ? 'bg-teal-500 text-white hover:bg-teal-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Include Summary
              </button>

              <button
                onClick={() => advancedSettings.setIncludeMCQuiz(!advancedSettings.includeMCQuiz)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  advancedSettings.includeMCQuiz
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
                  className={`w-4 h-4 transform transition-transform duration-150 ${
                    showAdvanced ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {showAdvanced && (
                <div className='mt-4 p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                        Model Selection
                      </label>
                      <div className='h-[40px]'>
                        <select
                          className='w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                          value={advancedSettings.selectedModel}
                          onChange={(e) => advancedSettings.setSelectedModel(e.target.value)}
                        >
                          {AVAILABLE_MODELS.map((model) => (
                            <option key={model} value={model}>
                              {model}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
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

export default FormModal;
