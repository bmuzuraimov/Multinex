import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateCurrentUser, createOnboarding } from 'wasp/client/operations';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedUserType, setSelectedUserType] = useState<string | null>(null);
  const [learningStyle, setLearningStyle] = useState<string>('');
  const [subjects, setSubjects] = useState({
    scienceMedicine: false,
    technologyEngineering: false,
    businessEconomics: false,
    humanitiesArts: false,
    languageLearning: false,
    testPrep: false,
  });
  const [motivations, setMotivations] = useState({
    motivationProgress: false,
    motivationGamification: false,
    motivationReminders: false,
    motivationCommunity: false,
    motivationToolOnly: false,
  });
  const [sources, setSources] = useState({
    sourceTwitter: false,
    sourceInstagram: false,
    sourceTikTok: false,
    sourceFacebook: false,
    sourceYoutube: false,
    sourceGoogle: false,
    sourceWordOfMouth: false,
  });

  const handleOnboardingSubmit = async () => {
    if (!selectedUserType) {
      alert('Please complete all required fields');
      return;
    }
    try {
      await createOnboarding({
        userType: selectedUserType,
        learningStyle,
        scienceMedicine: subjects.scienceMedicine,
        technologyEngineering: subjects.technologyEngineering,
        businessEconomics: subjects.businessEconomics,
        humanitiesArts: subjects.humanitiesArts,
        languageLearning: subjects.languageLearning,
        testPrep: subjects.testPrep,
        motivationProgress: motivations.motivationProgress,
        motivationGamification: motivations.motivationGamification,
        motivationReminders: motivations.motivationReminders,
        motivationCommunity: motivations.motivationCommunity,
        motivationToolOnly: motivations.motivationToolOnly,
        sourceTwitter: sources.sourceTwitter,
        sourceInstagram: sources.sourceInstagram,
        sourceTikTok: sources.sourceTikTok,
        sourceFacebook: sources.sourceFacebook,
        sourceYoutube: sources.sourceYoutube,
        sourceGoogle: sources.sourceGoogle,
        sourceWordOfMouth: sources.sourceWordOfMouth,
        featureRequest: "",
      });
      await updateCurrentUser({ onBoardingCompleted: true });
      navigate('/portal');
    } catch (error) {
      console.error('Error saving onboarding info:', error);
    }
  };

  const handleSkip = async () => {
    try {
      await updateCurrentUser({ onBoardingCompleted: true });
      navigate('/portal');
    } catch (error) {
      console.error('Error skipping onboarding:', error);
    }
  };

  const userTypes = [
    { name: 'I am a Student', icon: '👨‍🎓' },
    { name: 'I am a Teacher', icon: '👩‍🏫' },
    { name: 'I am a Parent', icon: '👨‍👩‍👧‍👦' },
    { name: 'I am a Professor', icon: '🎓' },
  ];

  const messages = [
    '',
    'Tell us about your role!',
    "What's your preferred learning style?",
    'What subjects interest you most?',
    'What motivates you to learn?',
    'How did you find us?',
    "Any features you'd like to see?",
  ];

  const progressWidths = ['w-1/6', 'w-2/6', 'w-3/6', 'w-4/6', 'w-5/6', 'w-full'];

  const learningStyles = ['👁️ Visual', '👂 Auditory', '🤸 Kinesthetic', '🔄 Mixed'];

  return (
    <div className='flex flex-col items-center min-h-screen bg-white font-montserrat'>
      {/* Progress Bar */}
      <div className='w-full max-w-8xl bg-primary-100 h-1.5 rounded-full relative mt-8'>
        <div className={`bg-primary-500 h-1.5 rounded-full transition-all duration-500 ${progressWidths[step - 1]}`}></div>
      </div>

      {/* Back and Skip Buttons */}
      <div className='w-full max-w-4xl mt-4 flex justify-between items-center px-8'>
        {step > 1 && (
          <button className='text-primary-600 font-semibold hover:text-primary-700 transition-colors' onClick={() => setStep(step - 1)}>
            &lt; Back
          </button>
        )}
        <button className='text-primary-600 font-semibold hover:text-primary-700 transition-colors' onClick={handleSkip}>
          Skip &gt;
        </button>
      </div>

      {/* Chat Bot Message */}
      <div className='flex items-center justify-center mt-12'>
        <div className='font-manrope text-title-lg text-primary-900 font-medium tracking-wide'>{messages[step]}</div>
      </div>

      {/* Steps */}
      {step === 1 && (
        <>
          <div className='grid grid-cols-1 gap-4 mt-10 max-w-md mx-auto w-full px-6'>
            {userTypes.map((type) => (
              <button
                key={type.name}
                className={`flex items-center px-8 py-4 rounded-xl text-lg transition-all duration-300 w-full shadow-sm ${
                  selectedUserType === type.name 
                    ? 'bg-primary-500 text-white shadow-md hover:bg-primary-600' 
                    : 'bg-white border border-primary-100 text-primary-900 hover:border-primary-300'
                }`}
                onClick={() => setSelectedUserType(type.name)}
              >
                <span className='mr-3 text-xl'>{type.icon}</span> 
                <span className='font-satoshi'>{type.name}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setStep(2)}
            disabled={!selectedUserType}
            className={`mt-8 px-12 py-4 rounded-xl font-satoshi text-lg transition-all duration-300 ${
              selectedUserType 
                ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md' 
                : 'bg-primary-100 text-primary-300 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </>
      )}

      {step === 2 && (
        <div className='mt-10 w-full max-w-md px-6'>
          <div className='grid grid-cols-2 gap-4'>
            {learningStyles.map((style) => (
              <button
                key={style}
                className={`p-6 rounded-xl transition-all duration-300 font-satoshi text-lg shadow-sm ${
                  learningStyle === style 
                    ? 'bg-primary-500 text-white shadow-md' 
                    : 'bg-white border border-primary-100 text-primary-900 hover:border-primary-300'
                }`}
                onClick={() => setLearningStyle(style)}
              >
                {style}
              </button>
            ))}
          </div>
          <button
            onClick={() => setStep(3)}
            disabled={!learningStyle}
            className={`mt-8 w-full py-4 rounded-xl font-satoshi text-lg transition-all duration-300 ${
              learningStyle 
                ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md'
                : 'bg-primary-100 text-primary-300 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>
      )}

      {step === 3 && (
        <div className='mt-10 w-full max-w-md px-6'>
          <div className='grid grid-cols-2 gap-4'>
            {Object.entries(subjects).map(([key, value]) => (
              <label key={key} className='flex items-center p-4 bg-white rounded-xl border border-primary-100 hover:border-primary-300 transition-all duration-300 cursor-pointer shadow-sm'>
                <input
                  type='checkbox'
                  checked={value}
                  onChange={(e) => setSubjects({ ...subjects, [key]: e.target.checked })}
                  className='hidden'
                />
                <div className={`flex items-center justify-center w-5 h-5 border-2 rounded-md mr-3 transition-colors ${value ? 'bg-primary-500 border-primary-500' : 'border-primary-300'}`}>
                  {value && <div className="w-2 h-2 bg-white rounded-sm"></div>}
                </div>
                <span className='text-primary-900 font-satoshi'>
                  {key.split(/(?=[A-Z])/).map((word, i) => i === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : `(${word})`).join(' ')}
                </span>
              </label>
            ))}
          </div>
          <button onClick={() => setStep(4)} className='mt-8 w-full py-4 bg-primary-600 text-white rounded-xl font-satoshi text-lg hover:bg-primary-700 transition-colors shadow-md'>
            Continue
          </button>
        </div>
      )}

      {step === 4 && (
        <div className='mt-10 w-full max-w-md px-6'>
          <div className='grid grid-cols-1 gap-4'>
            {Object.entries(motivations).map(([key, value]) => (
              <label key={key} className='flex items-center p-4 bg-white rounded-xl border border-primary-100 hover:border-primary-300 transition-all duration-300 cursor-pointer shadow-sm'>
                <input
                  type='checkbox'
                  checked={value}
                  onChange={(e) => setMotivations({ ...motivations, [key]: e.target.checked })}
                  className='hidden'
                />
                <div className={`flex items-center justify-center w-5 h-5 border-2 rounded-md mr-3 transition-colors ${value ? 'bg-primary-500 border-primary-500' : 'border-primary-300'}`}>
                  {value && <div className="w-2 h-2 bg-white rounded-sm"></div>}
                </div>
                <span className='text-primary-900 font-satoshi'>
                  {key.replace('motivation', '').charAt(0).toUpperCase() + key.replace('motivation', '').slice(1)}
                </span>
              </label>
            ))}
          </div>
          <button onClick={() => setStep(5)} className='mt-8 w-full py-4 bg-primary-600 text-white rounded-xl font-satoshi text-lg hover:bg-primary-700 transition-colors shadow-md'>
            Continue
          </button>
        </div>
      )}

      {step === 5 && (
        <div className='mt-10 w-full max-w-md px-6'>
          <div className='grid grid-cols-2 gap-4'>
            {Object.entries(sources).map(([key, value]) => (
              <label key={key} className='flex items-center p-4 bg-white rounded-xl border border-primary-100 hover:border-primary-300 transition-all duration-300 cursor-pointer shadow-sm'>
                <input
                  type='checkbox'
                  checked={value}
                  onChange={(e) => setSources({ ...sources, [key]: e.target.checked })}
                  className='hidden'
                />
                <div className={`flex items-center justify-center w-5 h-5 border-2 rounded-md mr-3 transition-colors ${value ? 'bg-primary-500 border-primary-500' : 'border-primary-300'}`}>
                  {value && <div className="w-2 h-2 bg-white rounded-sm"></div>}
                </div>
                <span className='text-primary-900 font-satoshi'>
                  {key.replace('source', '').charAt(0).toUpperCase() + key.replace('source', '').slice(1)}
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
