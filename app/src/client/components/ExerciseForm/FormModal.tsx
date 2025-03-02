import { Tooltip } from 'react-tooltip';
import ReactDOM from 'react-dom';
import { BsFiletypeAi, BsChevronDown } from 'react-icons/bs';
import { HiOutlineInformationCircle } from 'react-icons/hi';
import { IoMdClose } from 'react-icons/io';
import {
  EXERCISE_LENGTHS,
  EXERCISE_LEVELS,
  AVAILABLE_MODELS,
} from '../../../shared/constants';
import {
  ExerciseFormContentSettings,
  ExerciseFormGenerationSettings,
  SensoryMode,
} from '../../../shared/types';
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

  // Ensure user cannot unselect the last remaining mode
  const handleToggleMode = (mode: 'listen' | 'type' | 'write') => {
    const alreadySelected = exerciseSettings.sensoryModes.includes(mode);

    // If user is trying to uncheck the only remaining mode, do nothing
    if (alreadySelected && exerciseSettings.sensoryModes.length === 1) {
      return;
    }

    const updatedModes = alreadySelected
      ? exerciseSettings.sensoryModes.filter((m) => m !== mode)
      : [...exerciseSettings.sensoryModes, mode] as SensoryMode[];

    exerciseSettings.setSensoryMods(updatedModes);
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
        <div className="relative flex flex-col items-center space-y-6">
          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDiscard();
            }}
            className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
          >
            <IoMdClose className="w-6 h-6" />
          </button>

          {/* Modify Prompt Link */}
          <div className="absolute top-4 left-4">
            <button
              onClick={() => navigate('/account')}
              className="text-xs text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-500 underline"
            >
              Modify the Prompt
            </button>
          </div>
          {/* Icon + Title */}
          <div className="relative p-4 bg-teal-50 dark:bg-teal-900/20 rounded-full">
            <BsFiletypeAi className="w-12 h-12 text-teal-500" />
          </div>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            {exerciseSettings.exerciseName}
          </p>

          {/* Form Content */}
          <div className="w-full max-w-3xl mx-auto space-y-8 overflow-y-auto max-h-[calc(100vh-200px)]">

            {/* LENGTH + LEVEL */}
            <div className="relative">
              <HiOutlineInformationCircle
                className="absolute -top-1 right-0 w-6 h-6 text-gray-600 dark:text-gray-400"
                data-multiline
                data-tooltip-id={`my-tooltip-${exerciseSettings.exerciseName || 'all'}`}
              />
              <Tooltip
                id={`my-tooltip-${exerciseSettings.exerciseName || 'all'}`}
                place="top"
                className="z-99"
                content="Exercise length varies by level; higher levels require more words."
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Exercise Length */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Length of the Exercise
                  </label>
                  <select
                    className='w-full p-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm ease-in-out focus:outline-none focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:border-teal-400 dark:hover:border-teal-500'
                    value={exerciseSettings.exerciseLength}
                    onChange={(e) => exerciseSettings.setExerciseLength(e.target.value)}
                  >
                    {Object.entries(EXERCISE_LENGTHS).map(([key, value]) => (
                      <option key={key} value={key} className="py-2">
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Exercise Level */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Exercise Level
                  </label>
                  <select
                    className='w-full p-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm ease-in-out focus:outline-none focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:border-teal-400 dark:hover:border-teal-500'
                    value={exerciseSettings.exerciseLevel}
                    onChange={(e) => exerciseSettings.setExerciseLevel(e.target.value)}
                  >
                    {Object.entries(EXERCISE_LEVELS).map(([key, value]) => (
                      <option key={key} value={key} className="py-2">
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* PRIOR KNOWLEDGE */}
            <div className="w-full space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Prior Knowledge (Optional)
              </label>
              <div className="flex flex-wrap gap-3">
                {exerciseSettings.topics.map((topic) => (
                  <div 
                    key={topic}
                    className="inline-block"
                  >
                    <input
                      type="checkbox"
                      id={`topic-${topic}`}
                      checked={exerciseSettings.priorKnowledge.includes(topic)}
                      onChange={(e) => {
                        const updatedKnowledge = e.target.checked
                          ? [...exerciseSettings.priorKnowledge, topic]
                          : exerciseSettings.priorKnowledge.filter((k) => k !== topic);
                        exerciseSettings.setPriorKnowledge(updatedKnowledge);
                      }}
                      className="sr-only"
                    />
                    <label
                      htmlFor={`topic-${topic}`}
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer
                        ease-in-out select-none shadow-sm hover:shadow
                        ${exerciseSettings.priorKnowledge.includes(topic)
                          ? 'bg-teal-500 text-white hover:bg-teal-600 ring-2 ring-teal-300'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:border-gray-600'
                        }`}
                    >
                      {topic}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Sensory Modes Selection */}
            <div className="w-full space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Learning Modes
              </label>
              <div className="flex justify-between items-center w-full">
                {/* Listening Mode */}
                <div className="relative flex-1 mx-2">
                  <input
                    type="checkbox"
                    id="mode-listen"
                    checked={exerciseSettings.sensoryModes.includes('listen')}
                    onChange={() => handleToggleMode('listen')}
                    className="sr-only"
                  />
                  <label
                    htmlFor="mode-listen"
                    className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg cursor-pointer
                      ${exerciseSettings.sensoryModes.includes('listen')
                        ? 'bg-teal-500 text-white ring-2 ring-teal-300'
                        : 'bg-white text-gray-700 border border-teal-500 hover:bg-teal-50'
                      }`}
                  >
                    <span className="text-sm font-medium">👂 Listening</span>
                  </label>
                </div>

                {/* Typing Mode */}
                <div className="relative flex-1 mx-2">
                  <input
                    type="checkbox"
                    id="mode-type" 
                    checked={exerciseSettings.sensoryModes.includes('type')}
                    onChange={() => handleToggleMode('type')}
                    className="sr-only"
                  />
                  <label
                    htmlFor="mode-type"
                    className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg cursor-pointer
                      ${exerciseSettings.sensoryModes.includes('type')
                        ? 'bg-green-600 text-white ring-2 ring-green-300'
                        : 'bg-white text-gray-700 border border-green-600 hover:bg-green-50'
                      }`}
                  >
                    <span className="text-sm font-medium">⌨️ Typing</span>
                  </label>
                </div>

                {/* Writing Mode */}
                <div className="relative flex-1 mx-2">
                  <input
                    type="checkbox"
                    id="mode-write"
                    checked={exerciseSettings.sensoryModes.includes('write')}
                    onChange={() => handleToggleMode('write')}
                    className="sr-only"
                  />
                  <label
                    htmlFor="mode-write"
                    className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg cursor-pointer
                      ${exerciseSettings.sensoryModes.includes('write')
                        ? 'bg-red-600 text-white ring-2 ring-red-300'
                        : 'bg-white text-gray-700 border border-red-600 hover:bg-red-50'
                      }`}
                  >
                    <span className="text-sm font-medium">✍️ Writing</span>
                  </label>
                </div>
              </div>
            </div>

            {/* INCLUDE SUMMARY / MC QUIZ / ETC. */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-around space-y-4 md:space-y-0">
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

              {/* KEY: Link to Account (Modify the Prompt) */}
              <button
                onClick={() => navigate('/account')}
                className="px-4 py-2 rounded-lg text-sm font-medium
                  bg-gray-100 text-gray-700 hover:bg-gray-200
                  dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Modify the Prompt
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

            {/* ADVANCED OPTIONS */}
            <div className="w-full">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full flex items-center justify-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 py-2"
              >
                <span className="border-b border-gray-200 dark:border-gray-700 w-16 mx-3"></span>
                <span className="font-medium">Advanced Options</span>
                <span className="border-b border-gray-200 dark:border-gray-700 w-16 mx-3"></span>
                <BsChevronDown
                  className={`w-4 h-4 transform transition-transform duration-150 ${
                    showAdvanced ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {showAdvanced && (
                <div className="mt-4 p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Model Selection
                      </label>
                      <div className="h-[40px]">
                        <select
                          className='w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-teal-400 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300'
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

            {/* Generate Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onGenerate();
                }}
                className="w-full py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium text-lg"
                disabled={isUploading}
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
