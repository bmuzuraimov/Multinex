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
    <div className='flex flex-col items-center min-h-screen bg-gray-100 p-6'>
      {/* Progress Bar */}
      <div className='w-full max-w-8xl bg-gray-300 h-2 rounded-lg relative mt-4'>
        <div className={`bg-teal-500 h-2 rounded-lg transition-all duration-500 ${progressWidths[step - 1]}`}></div>
      </div>

      {/* Back and Skip Buttons */}
      <div className='w-full max-w-4xl mt-3 flex justify-between items-center'>
        {step > 1 && (
          <button className='text-gray-500 font-semibold' onClick={() => setStep(step - 1)}>
            &lt; Back
          </button>
        )}
        <button className='text-gray-500 font-semibold' onClick={handleSkip}>
          Skip&gt;
        </button>
      </div>

      {/* Chat Bot */}
      <div className='flex items-center justify-center mt-10'>
          <div className='text-2xl font-medium tracking-wide'>{messages[step]}</div>
      </div>

      {/* Steps */}
      {step === 1 && (
        <>
          <div className='grid grid-cols-1 gap-4 mt-10 max-w-md mx-auto'>
            {userTypes.map((type) => (
              <button
                key={type.name}
                className={`flex items-center px-6 py-3 border rounded-2xl text-lg hover:opacity-80 transition-all w-full ${
                  selectedUserType === type.name ? 'bg-teal-500 text-white border-teal-500' : 'bg-white border-gray-400'
                }`}
                onClick={() => setSelectedUserType(type.name)}
              >
                <span className='mr-2'>{type.icon}</span> {type.name}
              </button>
            ))}
          </div>
          <button
            onClick={() => setStep(2)}
            disabled={!selectedUserType}
            className={`mt-6 px-8 py-3 rounded-md ${
              selectedUserType ? 'bg-teal-700 text-white' : 'bg-gray-400 text-gray-200'
            }`}
          >
            Continue
          </button>
        </>
      )}

      {step === 2 && (
        <div className='mt-10 w-full max-w-md'>
          <div className='grid grid-cols-2 gap-4'>
            {learningStyles.map((style) => (
              <button
                key={style}
                className={`p-4 border rounded-2xl ${learningStyle === style ? 'bg-teal-500 text-white' : 'bg-white'}`}
                onClick={() => setLearningStyle(style)}
              >
                {style}
              </button>
            ))}
          </div>
          <button
            onClick={() => setStep(3)}
            disabled={!learningStyle}
            className='mt-6 w-full py-3 bg-teal-700 text-white rounded-md'
          >
            Continue
          </button>
        </div>
      )}

      {step === 3 && (
        <div className='mt-10 w-full max-w-md'>
          <div className='grid grid-cols-2 gap-4'>
            {Object.entries(subjects).map(([key, value]) => (
              <label key={key} className='flex items-center p-3 bg-white rounded-2xl shadow-sm hover:bg-gray-50 transition-colors cursor-pointer'>
                <input
                  type='checkbox'
                  checked={value}
                  onChange={(e) => setSubjects({ ...subjects, [key]: e.target.checked })}
                  className='hidden'
                />
                <div className={`flex items-center justify-center w-5 h-5 border-2 rounded mr-3 transition-colors ${value ? 'bg-teal-500 border-teal-500' : 'border-gray-300'}`}>
                  {value && <div className="w-2 h-2 bg-white rounded-sm"></div>}
                </div>
                <span className='text-gray-700 font-medium'>
                  {key.split(/(?=[A-Z])/).map((word, i) => i === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : `(${word})`).join(' ')}
                </span>
              </label>
            ))}
          </div>
          <button onClick={() => setStep(4)} className='mt-6 w-full py-3 bg-teal-700 text-white rounded-md'>
            Continue
          </button>
        </div>
      )}

      {step === 4 && (
        <div className='mt-10 w-full max-w-md'>
          <div className='grid grid-cols-1 gap-4'>
            {Object.entries(motivations).map(([key, value]) => (
              <label key={key} className='flex items-center p-3 bg-white rounded-2xl shadow-sm hover:bg-gray-50 transition-colors cursor-pointer'>
                <input
                  type='checkbox'
                  checked={value}
                  onChange={(e) => setMotivations({ ...motivations, [key]: e.target.checked })}
                  className='hidden'
                />
                <div className={`flex items-center justify-center w-5 h-5 border-2 rounded mr-3 transition-colors ${value ? 'bg-teal-500 border-teal-500' : 'border-gray-300'}`}>
                  {value && <div className="w-2 h-2 bg-white rounded-sm"></div>}
                </div>
                <span className='text-gray-700 font-medium'>
                  {key.replace('motivation', '').charAt(0).toUpperCase() + key.replace('motivation', '').slice(1)}
                </span>
              </label>
            ))}
          </div>
          <button onClick={() => setStep(5)} className='mt-6 w-full py-3 bg-teal-700 text-white rounded-md'>
            Continue
          </button>
        </div>
      )}

      {step === 5 && (
        <div className='mt-10 w-full max-w-md'>
          <div className='grid grid-cols-2 gap-4'>
            {Object.entries(sources).map(([key, value]) => (
              <label key={key} className='flex items-center p-3 bg-white rounded-2xl shadow-sm hover:bg-gray-50 transition-colors cursor-pointer'>
                <input
                  type='checkbox'
                  checked={value}
                  onChange={(e) => setSources({ ...sources, [key]: e.target.checked })}
                  className='hidden'
                />
                <div className={`flex items-center justify-center w-5 h-5 border-2 rounded mr-3 transition-colors ${value ? 'bg-teal-500 border-teal-500' : 'border-gray-300'}`}>
                  {value && <div className="w-2 h-2 bg-white rounded-sm"></div>}
                </div>
                <span className='text-gray-700 font-medium'>
                  {key.replace('source', '').charAt(0).toUpperCase() + key.replace('source', '').slice(1)}
                </span>
              </label>
            ))}
          </div>
          <button onClick={handleOnboardingSubmit} className='mt-6 w-full py-3 bg-teal-700 text-white rounded-md'>
            Complete
          </button>
        </div>
      )}
    </div>
  );
};

export default OnboardingPage;
