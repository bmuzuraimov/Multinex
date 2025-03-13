import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateCurrentUser, createOnboarding } from 'wasp/client/operations';
import { cn } from '../../shared/utils';
import { toast } from 'sonner';
import { USER_TYPES, STEP_MESSAGES, PROGRESS_WIDTHS, LEARNING_STYLES } from '../../shared/constants/onboarding';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [current_step, setCurrentStep] = useState(1);
  const [selected_user_type, setSelectedUserType] = useState<string | null>(null);
  const [learning_style, setLearningStyle] = useState<string>('');
  const [subject_interests, setSubjectInterests] = useState({
    science_medicine: false,
    technology_engineering: false, 
    business_economics: false,
    humanities_arts: false,
    language_learning: false,
    test_prep: false
  });
  const [motivation_factors, setMotivationFactors] = useState({
    progress: false,
    gamification: false,
    reminders: false,
    community: false,
    tool_only: false
  });
  const [source_channels, setSourceChannels] = useState({
    twitter: false,
    instagram: false,
    tiktok: false,
    facebook: false,
    youtube: false,
    google: false,
    word_of_mouth: false
  });

  const handleOnboardingSubmit = async () => {
    if (!selected_user_type) {
      toast.error('Please complete all required fields');
      return;
    }

    try {
      await createOnboarding({
        user_type: selected_user_type,
        learning_style: learning_style,
        science_medicine: subject_interests.science_medicine,
        technology_engineering: subject_interests.technology_engineering,
        business_economics: subject_interests.business_economics,
        humanities_arts: subject_interests.humanities_arts,
        language_learning: subject_interests.language_learning,
        test_prep: subject_interests.test_prep,
        motivation_progress: motivation_factors.progress,
        motivation_gamification: motivation_factors.gamification,
        motivation_reminders: motivation_factors.reminders,
        motivation_community: motivation_factors.community,
        motivation_tool_only: motivation_factors.tool_only,
        source_twitter: source_channels.twitter,
        source_instagram: source_channels.instagram,
        source_tiktok: source_channels.tiktok,
        source_facebook: source_channels.facebook,
        source_youtube: source_channels.youtube,
        source_google: source_channels.google,
        source_word_of_mouth: source_channels.word_of_mouth,
        feature_request: ""
      });
      await updateCurrentUser({ onboarding_complete: true });
      navigate('/portal');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save onboarding info');
    }
  };

  const handleSkip = async () => {
    try {
      await updateCurrentUser({ onboarding_complete: true });
      navigate('/portal');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to skip onboarding');
    }
  };



  return (
    <div className='flex flex-col items-center min-h-screen bg-white font-montserrat'>
      {/* Progress Bar */}
      <div className='w-full max-w-8xl bg-primary-100 h-1.5 rounded-full relative mt-8'>
        <div className={cn(
          'bg-primary-500 h-1.5 rounded-full transition-all duration-500',
          PROGRESS_WIDTHS[current_step - 1]
        )}></div>
      </div>

      {/* Back and Skip Buttons */}
      <div className='w-full max-w-4xl mt-4 flex justify-between items-center px-8'>
        {current_step > 1 && (
          <button className='text-primary-600 font-semibold hover:text-primary-700 transition-colors' onClick={() => setCurrentStep(current_step - 1)}>
            &lt; Back
          </button>
        )}
        <button className='text-primary-600 font-semibold hover:text-primary-700 transition-colors' onClick={handleSkip}>
          Skip &gt;
        </button>
      </div>

      {/* Chat Bot Message */}
      <div className='flex items-center justify-center mt-12'>
        <div className='font-manrope text-title-lg text-primary-900 font-medium tracking-wide'>{STEP_MESSAGES[current_step]}</div>
      </div>

      {/* Steps */}
      {current_step === 1 && (
        <>
          <div className='grid grid-cols-1 gap-4 mt-10 max-w-md mx-auto w-full px-6'>
            {USER_TYPES.map((type) => (
              <button
                key={type.name}
                className={cn(
                  'flex items-center px-8 py-4 rounded-xl text-lg transition-all duration-300 w-full shadow-sm',
                  selected_user_type === type.name 
                    ? 'bg-primary-500 text-white shadow-md hover:bg-primary-600' 
                    : 'bg-white border border-primary-100 text-primary-900 hover:border-primary-300'
                )}
                onClick={() => setSelectedUserType(type.name)}
              >
                <span className='mr-3 text-xl'>{type.icon}</span> 
                <span className='font-satoshi'>{type.name}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentStep(2)}
            disabled={!selected_user_type}
            className={cn(
              'mt-8 px-12 py-4 rounded-xl font-satoshi text-lg transition-all duration-300',
              selected_user_type 
                ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md' 
                : 'bg-primary-100 text-primary-300 cursor-not-allowed'
            )}
          >
            Continue
          </button>
        </>
      )}

      {current_step === 2 && (
        <div className='mt-10 w-full max-w-md px-6'>
          <div className='grid grid-cols-2 gap-4'>
            {LEARNING_STYLES.map((style) => (
              <button
                key={style}
                className={cn(
                  'p-6 rounded-xl transition-all duration-300 font-satoshi text-lg shadow-sm',
                  learning_style === style 
                    ? 'bg-primary-500 text-white shadow-md' 
                    : 'bg-white border border-primary-100 text-primary-900 hover:border-primary-300'
                )}
                onClick={() => setLearningStyle(style)}
              >
                {style}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentStep(3)}
            disabled={!learning_style}
            className={cn(
              'mt-8 w-full py-4 rounded-xl font-satoshi text-lg transition-all duration-300',
              learning_style 
                ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md'
                : 'bg-primary-100 text-primary-300 cursor-not-allowed'
            )}
          >
            Continue
          </button>
        </div>
      )}

      {current_step === 3 && (
        <div className='mt-10 w-full max-w-md px-6'>
          <div className='grid grid-cols-2 gap-4'>
            {Object.entries(subject_interests).map(([key, value]) => (
              <label key={key} className='flex items-center p-4 bg-white rounded-xl border border-primary-100 hover:border-primary-300 transition-all duration-300 cursor-pointer shadow-sm'>
                <input
                  type='checkbox'
                  checked={value}
                  onChange={(e) => setSubjectInterests({ ...subject_interests, [key]: e.target.checked })}
                  className='hidden'
                />
                <div className={cn(
                  'flex items-center justify-center w-5 h-5 border-2 rounded-md mr-3 transition-colors',
                  value ? 'bg-primary-500 border-primary-500' : 'border-primary-300'
                )}>
                  {value && <div className="w-2 h-2 bg-white rounded-sm"></div>}
                </div>
                <span className='text-primary-900 font-satoshi'>
                  {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </span>
              </label>
            ))}
          </div>
          <button onClick={() => setCurrentStep(4)} className='mt-8 w-full py-4 bg-primary-600 text-white rounded-xl font-satoshi text-lg hover:bg-primary-700 transition-colors shadow-md'>
            Continue
          </button>
        </div>
      )}

      {current_step === 4 && (
        <div className='mt-10 w-full max-w-md px-6'>
          <div className='grid grid-cols-1 gap-4'>
            {Object.entries(motivation_factors).map(([key, value]) => (
              <label key={key} className='flex items-center p-4 bg-white rounded-xl border border-primary-100 hover:border-primary-300 transition-all duration-300 cursor-pointer shadow-sm'>
                <input
                  type='checkbox'
                  checked={value}
                  onChange={(e) => setMotivationFactors({ ...motivation_factors, [key]: e.target.checked })}
                  className='hidden'
                />
                <div className={cn(
                  'flex items-center justify-center w-5 h-5 border-2 rounded-md mr-3 transition-colors',
                  value ? 'bg-primary-500 border-primary-500' : 'border-primary-300'
                )}>
                  {value && <div className="w-2 h-2 bg-white rounded-sm"></div>}
                </div>
                <span className='text-primary-900 font-satoshi'>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </span>
              </label>
            ))}
          </div>
          <button onClick={() => setCurrentStep(5)} className='mt-8 w-full py-4 bg-primary-600 text-white rounded-xl font-satoshi text-lg hover:bg-primary-700 transition-colors shadow-md'>
            Continue
          </button>
        </div>
      )}

      {current_step === 5 && (
        <div className='mt-10 w-full max-w-md px-6'>
          <div className='grid grid-cols-2 gap-4'>
            {Object.entries(source_channels).map(([key, value]) => (
              <label key={key} className='flex items-center p-4 bg-white rounded-xl border border-primary-100 hover:border-primary-300 transition-all duration-300 cursor-pointer shadow-sm'>
                <input
                  type='checkbox'
                  checked={value}
                  onChange={(e) => setSourceChannels({ ...source_channels, [key]: e.target.checked })}
                  className='hidden'
                />
                <div className={cn(
                  'flex items-center justify-center w-5 h-5 border-2 rounded-md mr-3 transition-colors',
                  value ? 'bg-primary-500 border-primary-500' : 'border-primary-300'
                )}>
                  {value && <div className="w-2 h-2 bg-white rounded-sm"></div>}
                </div>
                <span className='text-primary-900 font-satoshi'>
                  {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </span>
              </label>
            ))}
          </div>
          <button onClick={handleOnboardingSubmit} className='mt-8 w-full py-4 bg-primary-600 text-white rounded-xl font-satoshi text-lg hover:bg-primary-700 transition-colors shadow-md'>
            Complete
          </button>
        </div>
      )}
    </div>
  );
};

export default OnboardingPage;
