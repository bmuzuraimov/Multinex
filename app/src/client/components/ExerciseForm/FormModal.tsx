import { Tooltip } from 'react-tooltip';
import ReactDOM from 'react-dom';
import { BsFiletypeAi, BsChevronDown } from 'react-icons/bs';
import { HiOutlineInformationCircle } from 'react-icons/hi';
import { IoMdClose } from 'react-icons/io';
import { EXERCISE_LENGTHS, EXERCISE_LEVELS, AVAILABLE_MODELS } from '../../../shared/constants';
import { ExerciseFormContentSettings, ExerciseFormGenerationSettings, SensoryMode } from '../../../shared/types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const handleToggleMode = (mode: 'listen' | 'type' | 'write') => {
    const alreadySelected = exerciseSettings.sensoryModes.includes(mode);

    if (alreadySelected && exerciseSettings.sensoryModes.length === 1) {
      return;
    }

    const updatedModes = alreadySelected
      ? exerciseSettings.sensoryModes.filter((m) => m !== mode)
      : ([...exerciseSettings.sensoryModes, mode] as SensoryMode[]);

    exerciseSettings.setSensoryMods(updatedModes);
  };

  return ReactDOM.createPortal(
    <div className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm'>
      <div className='bg-white rounded-xl p-6 max-w-2xl w-full shadow-lg font-satoshi max-h-[90vh] overflow-y-auto'>
        <div className='relative flex flex-col items-center space-y-4'>
          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDiscard();
            }}
            className='absolute top-0 right-0 p-1.5 text-gray-400 hover:text-primary-600 transition-colors duration-200'
          >
            <IoMdClose className='w-5 h-5' />
          </button>

          {/* Modify Prompt Link */}
          <div className='absolute top-0 left-0'>
            <button
              onClick={() => navigate('/account')}
              className='text-sm text-primary-600 hover:text-primary-700'
            >
              Customize Prompt
            </button>
          </div>

          {/* Icon + Title */}
          <div className='relative p-3 bg-primary-50 rounded-full mt-6'>
            <BsFiletypeAi className='w-8 h-8 text-primary-600' />
          </div>
          <h2 className='text-title-sm font-manrope font-semibold text-gray-900'>{exerciseSettings.exerciseName}</h2>

          {/* Form Content */}
          <div className='w-full space-y-4'>
            {/* LENGTH + LEVEL */}
            <div className='relative grid grid-cols-1 md:grid-cols-2 gap-4'>
              <HiOutlineInformationCircle
                className='absolute -top-2 right-0 w-5 h-5 text-gray-400'
                data-multiline
                data-tooltip-id={`my-tooltip-${exerciseSettings.exerciseName || 'all'}`}
              />
              <Tooltip
                id={`my-tooltip-${exerciseSettings.exerciseName || 'all'}`}
                place='top'
                className='z-tooltip'
                content='Exercise length varies by level; higher levels require more words.'
              />

              {/* Exercise Length */}
              <div className='space-y-1.5'>
                <label className='block text-sm font-medium text-gray-700'>Length of the Exercise</label>
                <select
                  className='w-full p-2 text-sm border border-gray-200 rounded-lg shadow-sm focus:ring-1 focus:ring-primary-200 focus:border-primary-500 bg-white text-gray-900 hover:border-primary-400 transition-colors'
                  value={exerciseSettings.exerciseLength}
                  onChange={(e) => exerciseSettings.setExerciseLength(e.target.value)}
                >
                  {Object.entries(EXERCISE_LENGTHS).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </div>

              {/* Exercise Level */}
              <div className='space-y-1.5'>
                <label className='block text-sm font-medium text-gray-700'>Exercise Level</label>
                <select
                  className='w-full p-2 text-sm border border-gray-200 rounded-lg shadow-sm focus:ring-1 focus:ring-primary-200 focus:border-primary-500 bg-white text-gray-900 hover:border-primary-400 transition-colors'
                  value={exerciseSettings.exerciseLevel}
                  onChange={(e) => exerciseSettings.setExerciseLevel(e.target.value)}
                >
                  {Object.entries(EXERCISE_LEVELS).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className='w-full border-t border-gray-100'></div>

            {/* PRIOR KNOWLEDGE */}
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-700'>Prior Knowledge (Optional)</label>
              <div className='flex flex-wrap gap-2'>
                {exerciseSettings.topics.map((topic) => (
                  <div key={topic} className='inline-block'>
                    <input
                      type='checkbox'
                      id={`topic-${topic}`}
                      checked={exerciseSettings.priorKnowledge.includes(topic)}
                      onChange={(e) => {
                        const updatedKnowledge = e.target.checked
                          ? [...exerciseSettings.priorKnowledge, topic]
                          : exerciseSettings.priorKnowledge.filter((k) => k !== topic);
                        exerciseSettings.setPriorKnowledge(updatedKnowledge);
                      }}
                      className='sr-only'
                    />
                    <label
                      htmlFor={`topic-${topic}`}
                      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200
                        ${exerciseSettings.priorKnowledge.includes(topic)
                          ? 'bg-primary-500 text-white shadow-sm hover:bg-primary-600'
                          : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                        }`}
                    >
                      {topic}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className='w-full border-t border-gray-100'></div>

            {/* Sensory Modes Selection */}
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-700'>Learning Modes</label>
              <div className='flex justify-between items-center gap-3'>
                {/* Listening Mode */}
                <div className='flex-1'>
                  <input
                    type='checkbox'
                    id='mode-listen'
                    checked={exerciseSettings.sensoryModes.includes('listen')}
                    onChange={() => handleToggleMode('listen')}
                    className='sr-only'
                  />
                  <label
                    htmlFor='mode-listen'
                    className={`block text-center py-2 px-3 rounded-lg cursor-pointer transition-all duration-200
                      ${exerciseSettings.sensoryModes.includes('listen')
                        ? 'bg-primary-500 text-white shadow-sm'
                        : 'bg-white text-gray-700 border border-primary-200 hover:bg-primary-50'
                      }`}
                  >
                    <span className='text-sm font-medium'>👂 Listening</span>
                  </label>
                </div>

                {/* Typing Mode */}
                <div className='flex-1'>
                  <input
                    type='checkbox'
                    id='mode-type'
                    checked={exerciseSettings.sensoryModes.includes('type')}
                    onChange={() => handleToggleMode('type')}
                    className='sr-only'
                  />
                  <label
                    htmlFor='mode-type'
                    className={`block text-center py-2 px-3 rounded-lg cursor-pointer transition-all duration-200
                      ${exerciseSettings.sensoryModes.includes('type')
                        ? 'bg-secondary-500 text-white shadow-sm'
                        : 'bg-white text-gray-700 border border-secondary-200 hover:bg-secondary-50'
                      }`}
                  >
                    <span className='text-sm font-medium'>⌨️ Typing</span>
                  </label>
                </div>

                {/* Writing Mode */}
                <div className='flex-1'>
                  <input
                    type='checkbox'
                    id='mode-write'
                    checked={exerciseSettings.sensoryModes.includes('write')}
                    onChange={() => handleToggleMode('write')}
                    className='sr-only'
                  />
                  <label
                    htmlFor='mode-write'
                    className={`block text-center py-2 px-3 rounded-lg cursor-pointer transition-all duration-200
                      ${exerciseSettings.sensoryModes.includes('write')
                        ? 'bg-tertiary-500 text-white shadow-sm'
                        : 'bg-white text-gray-700 border border-tertiary-200 hover:bg-tertiary-50'
                      }`}
                  >
                    <span className='text-sm font-medium'>✍️ Writing</span>
                  </label>
                </div>
              </div>
            </div>

            <div className='w-full border-t border-gray-100'></div>

            {/* INCLUDE SUMMARY / MC QUIZ */}
            <div className='flex gap-3'>
              <button
                onClick={() => advancedSettings.setIncludeSummary(!advancedSettings.includeSummary)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200
                  ${advancedSettings.includeSummary
                    ? 'bg-primary-500 text-white shadow-sm hover:bg-primary-600'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                  }`}
              >
                Include Summary
              </button>

              <button
                onClick={() => advancedSettings.setIncludeMCQuiz(!advancedSettings.includeMCQuiz)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200
                  ${advancedSettings.includeMCQuiz
                    ? 'bg-primary-500 text-white shadow-sm hover:bg-primary-600'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                  }`}
              >
                Include MC Quiz
              </button>
            </div>

            {/* ADVANCED OPTIONS */}
            <div className='w-full'>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className='w-full flex items-center justify-center text-sm text-gray-500 hover:text-primary-600 py-1.5 transition-colors duration-200'
              >
                <span className='border-b border-gray-100 w-12 mx-2'></span>
                <span className='font-medium'>Advanced Options</span>
                <span className='border-b border-gray-100 w-12 mx-2'></span>
                <BsChevronDown className={`w-4 h-4 transform transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`} />
              </button>

              {showAdvanced && (
                <div className='mt-3 p-4 bg-gray-50 rounded-lg space-y-3'>
                  <div className='space-y-1.5'>
                    <label className='block text-sm font-medium text-gray-700'>Model Selection</label>
                    <select
                      className='w-full p-2 text-sm border border-gray-200 rounded-lg shadow-sm focus:ring-1 focus:ring-primary-200 focus:border-primary-500 bg-white text-gray-700'
                      value={advancedSettings.selectedModel}
                      onChange={(e) => advancedSettings.setSelectedModel(e.target.value)}
                    >
                      {AVAILABLE_MODELS.map((model) => (
                        <option key={model} value={model}>{model}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Generate Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onGenerate();
              }}
              disabled={isUploading}
              className='w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium text-base'
            >
              {isUploading ? loadingStatus : 'Generate Exercise'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    modalRoot
  );
};

export default FormModal;
