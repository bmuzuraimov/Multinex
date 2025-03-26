import { Tooltip } from 'react-tooltip';
import ReactDOM from 'react-dom';
import { BsFiletypeAi, BsChevronDown } from 'react-icons/bs';
import { HiOutlineInformationCircle } from 'react-icons/hi';
import { IoMdClose } from 'react-icons/io';
import { EXERCISE_LENGTHS, EXERCISE_LEVELS, AVAILABLE_MODELS } from '../../../shared/constants';
import { ExerciseFormContentSettings, ExerciseFormGenerationSettings, SensoryMode } from '../../../shared/types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../shared/utils';

type FormModalProps = {
  on_generate: () => void;
  on_discard: () => void;
  loading_status: string;
  is_uploading: boolean;
  exercise_settings: ExerciseFormContentSettings;
  advanced_settings: ExerciseFormGenerationSettings;
};

const FormModal: React.FC<FormModalProps> = ({
  on_generate,
  on_discard,
  loading_status,
  is_uploading,
  exercise_settings,
  advanced_settings,
}) => {
  const modal_root = document.getElementById('modal-root');
  if (!modal_root) return null;

  const [show_advanced, setShowAdvanced] = useState(false);
  const navigate = useNavigate();

  const handleToggleMode = (mode: SensoryMode) => {
    const already_selected = exercise_settings.sensory_modes.includes(mode);

    if (already_selected && exercise_settings.sensory_modes.length === 1) {
      return;
    }

    const updated_modes = already_selected
      ? exercise_settings.sensory_modes.filter((m: SensoryMode) => m !== mode)
      : ([...exercise_settings.sensory_modes, mode] as SensoryMode[]);

    exercise_settings.set_sensory_modes(updated_modes);
  };

  const modalTitle = exercise_settings.content_type === 'text' 
    ? 'Generate from Text' 
    : exercise_settings.exercise_name;

  return ReactDOM.createPortal(
    <div className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm'>
      <div className='bg-white rounded-xl p-6 max-w-2xl w-full shadow-lg font-satoshi max-h-[90vh] overflow-y-auto'>
        <div className='relative flex flex-col items-center space-y-4'>
          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              on_discard();
            }}
            className='absolute top-0 right-0 p-1.5 text-gray-400 hover:text-primary-600 transition-colors duration-200'
          >
            <IoMdClose className='w-5 h-5' />
          </button>

          {/* Modify Prompt Link */}
          <div className='absolute top-0 left-0'>
            <button onClick={() => navigate('/account')} className='text-sm text-primary-600 hover:text-primary-700'>
              Customize Prompt
            </button>
          </div>

          {/* Icon + Title */}
          <div className='relative p-3 bg-primary-50 rounded-full mt-6'>
            <BsFiletypeAi className='w-8 h-8 text-primary-600' />
          </div>
          <h2 className='text-title-sm font-manrope font-semibold text-gray-900'>{modalTitle}</h2>

          {/* Form Content */}
          <div className='w-full space-y-4'>
            {/* LENGTH + LEVEL */}
            <div className='relative grid grid-cols-1 md:grid-cols-2 gap-4'>
              <HiOutlineInformationCircle
                className='absolute -top-2 right-0 w-5 h-5 text-gray-400'
                data-multiline
                data-tooltip-id={`my-tooltip-${exercise_settings.exercise_name || 'all'}`}
              />
              <Tooltip
                id={`my-tooltip-${exercise_settings.exercise_name || 'all'}`}
                place='top'
                className='z-tooltip'
                content='Exercise length varies by level; higher levels require more words.'
              />

              {/* Exercise Length */}
              <div className='space-y-1.5'>
                <label className='block text-sm font-medium text-gray-700'>Length of the Exercise</label>
                <select
                  className='w-full p-2 text-sm border border-gray-200 rounded-lg shadow-sm focus:ring-1 focus:ring-primary-200 focus:border-primary-500 bg-white text-gray-900 hover:border-primary-400 transition-colors'
                  value={exercise_settings.exercise_length}
                  onChange={(e) => exercise_settings.set_exercise_length(e.target.value)}
                >
                  {Object.entries(EXERCISE_LENGTHS).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              {/* Exercise Level */}
              <div className='space-y-1.5'>
                <label className='block text-sm font-medium text-gray-700'>Exercise Level</label>
                <select
                  className='w-full p-2 text-sm border border-gray-200 rounded-lg shadow-sm focus:ring-1 focus:ring-primary-200 focus:border-primary-500 bg-white text-gray-900 hover:border-primary-400 transition-colors'
                  value={exercise_settings.exercise_level}
                  onChange={(e) => exercise_settings.set_exercise_level(e.target.value)}
                >
                  {Object.entries(EXERCISE_LEVELS).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className='w-full border-t border-gray-100'></div>

            {/* PRIOR KNOWLEDGE */}
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-700'>Prior Knowledge (Optional)</label>
              <div className='flex flex-wrap gap-2'>
                {exercise_settings.topics.map((topic) => (
                  <div key={topic} className='inline-block'>
                    <input
                      type='checkbox'
                      id={`topic-${topic}`}
                      checked={exercise_settings.prior_knowledge.includes(topic)}
                      onChange={(e) => {
                        const updated_knowledge = e.target.checked
                          ? [...exercise_settings.prior_knowledge, topic]
                          : exercise_settings.prior_knowledge.filter((k: string) => k !== topic);
                        exercise_settings.set_prior_knowledge(updated_knowledge);
                      }}
                      className='sr-only'
                    />
                    <label
                      htmlFor={`topic-${topic}`}
                      className={cn(
                        'inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200',
                        exercise_settings.prior_knowledge.includes(topic)
                          ? 'bg-primary-500 text-white shadow-sm hover:bg-primary-600'
                          : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                      )}
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
                {/* Mermaid Mode */}
                <div className='flex-1'>
                  <input
                    type='checkbox'
                    id='mode-mermaid'
                    checked={exercise_settings.sensory_modes.includes('mermaid')}
                    onChange={() => handleToggleMode('mermaid')}
                    className='sr-only'
                  />
                  <label
                    htmlFor='mode-mermaid'
                    className={cn(
                      'block text-center py-2 px-3 rounded-lg cursor-pointer transition-all duration-200',
                      exercise_settings.sensory_modes.includes('mermaid')
                        ? 'bg-primary-500 text-white shadow-sm'
                        : 'bg-white text-gray-700 border border-primary-200 hover:bg-primary-50'
                    )}
                  >
                    <span className='text-sm font-medium'>Mermaid</span>
                  </label>
                </div>
                {/* Listening Mode */}
                <div className='flex-1'>
                  <input
                    type='checkbox'
                    id='mode-listen'
                    checked={exercise_settings.sensory_modes.includes('listen')}
                    onChange={() => handleToggleMode('listen')}
                    className='sr-only'
                  />
                  <label
                    htmlFor='mode-listen'
                    className={cn(
                      'block text-center py-2 px-3 rounded-lg cursor-pointer transition-all duration-200',
                      exercise_settings.sensory_modes.includes('listen')
                        ? 'bg-primary-500 text-white shadow-sm'
                        : 'bg-white text-gray-700 border border-primary-200 hover:bg-primary-50'
                    )}
                  >
                    <span className='text-sm font-medium'>👂 Listening</span>
                  </label>
                </div>

                {/* Typing Mode */}
                <div className='flex-1'>
                  <input
                    type='checkbox'
                    id='mode-type'
                    checked={exercise_settings.sensory_modes.includes('type')}
                    onChange={() => handleToggleMode('type')}
                    className='sr-only'
                  />
                  <label
                    htmlFor='mode-type'
                    className={cn(
                      'block text-center py-2 px-3 rounded-lg cursor-pointer transition-all duration-200',
                      exercise_settings.sensory_modes.includes('type')
                        ? 'bg-secondary-500 text-white shadow-sm'
                        : 'bg-white text-gray-700 border border-secondary-200 hover:bg-secondary-50'
                    )}
                  >
                    <span className='text-sm font-medium'>⌨️ Typing</span>
                  </label>
                </div>

                {/* Writing Mode */}
                <div className='flex-1'>
                  <input
                    type='checkbox'
                    id='mode-write'
                    checked={exercise_settings.sensory_modes.includes('write')}
                    onChange={() => handleToggleMode('write')}
                    className='sr-only'
                  />
                  <label
                    htmlFor='mode-write'
                    className={cn(
                      'block text-center py-2 px-3 rounded-lg cursor-pointer transition-all duration-200',
                      exercise_settings.sensory_modes.includes('write')
                        ? 'bg-tertiary-500 text-white shadow-sm'
                        : 'bg-white text-gray-700 border border-tertiary-200 hover:bg-tertiary-50'
                    )}
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
                onClick={() => advanced_settings.set_include_summary(!advanced_settings.include_summary)}
                className={cn(
                  'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200',
                  advanced_settings.include_summary
                    ? 'bg-primary-500 text-white shadow-sm hover:bg-primary-600'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                )}
              >
                Include Summary
              </button>

              <button
                onClick={() => advanced_settings.set_include_mc_quiz(!advanced_settings.include_mc_quiz)}
                className={cn(
                  'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200',
                  advanced_settings.include_mc_quiz
                    ? 'bg-primary-500 text-white shadow-sm hover:bg-primary-600'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                )}
              >
                Include MC Quiz
              </button>
            </div>

            {/* ADVANCED OPTIONS */}
            <div className='w-full'>
              <button
                onClick={() => setShowAdvanced(!show_advanced)}
                className='w-full flex items-center justify-center text-sm text-gray-500 hover:text-primary-600 py-1.5 transition-colors duration-200'
              >
                <span className='border-b border-gray-100 w-12 mx-2'></span>
                <span className='font-medium'>Advanced Options</span>
                <span className='border-b border-gray-100 w-12 mx-2'></span>
                <BsChevronDown
                  className={cn(
                    'w-4 h-4 transform transition-transform duration-200',
                    show_advanced ? 'rotate-180' : ''
                  )}
                />
              </button>

              {show_advanced && (
                <div className='mt-3 p-4 bg-gray-50 rounded-lg space-y-3'>
                  <div className='space-y-1.5'>
                    <label className='block text-sm font-medium text-gray-700'>Model Selection</label>
                    <select
                      className='w-full p-2 text-sm border border-gray-200 rounded-lg shadow-sm focus:ring-1 focus:ring-primary-200 focus:border-primary-500 bg-white text-gray-700'
                      value={advanced_settings.selected_model}
                      onChange={(e) => advanced_settings.set_selected_model(e.target.value)}
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

            {/* Generate Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                on_generate();
              }}
              disabled={is_uploading}
              className='w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium text-base'
            >
              {is_uploading ? loading_status : 'Generate Exercise'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    modal_root
  );
};

export default FormModal;
