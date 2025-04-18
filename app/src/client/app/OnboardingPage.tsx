import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateCurrentUser, createOnboarding } from 'wasp/client/operations';
import { cn } from '../../shared/utils';
import { toast } from 'sonner';
import { USER_TYPES, STEP_MESSAGES, PROGRESS_WIDTHS, LEARNING_STYLES } from '../../shared/constants/onboarding';

// shadcn components
import { Card, CardContent, CardHeader, CardTitle } from '../shadcn/components/ui/card';
import { Button } from '../shadcn/components/ui/button';
import { RadioGroup, RadioGroupItem } from '../shadcn/components/ui/radio-group';
import { Label } from '../shadcn/components/ui/label';
import { Checkbox } from '../shadcn/components/ui/checkbox';
import { ScrollArea } from '../shadcn/components/ui/scroll-area';

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
    <div className='min-h-screen bg-primary-50/30 font-montserrat'>
      <div className='mx-auto max-w-4xl px-6 py-12'>
        <Card className='border-none shadow-xl bg-white/80 backdrop-blur-sm'>
          <CardHeader className='space-y-6'>
            {/* Progress Bar */}
            <div className='w-full max-w-8xl bg-primary-100 h-1.5 rounded-full relative mt-8'>
              <div className={cn(
                'bg-primary-500 h-1.5 rounded-full transition-all duration-500',
                PROGRESS_WIDTHS[current_step - 1]
                )}>
              </div>
            </div>

            {/* Back and Skip Buttons */}
            <div className='flex justify-between items-center'>
              {current_step > 1 ? (
                <Button
                  variant="ghost"
                  onClick={() => setCurrentStep(current_step - 1)}
                  className='text-primary-600 hover:text-primary-700'
                >
                  ← Back
                </Button>
              ) : <div />}
              <Button
                variant="ghost"
                onClick={handleSkip}
                className='text-primary-600 hover:text-primary-700'
              >
                Skip →
              </Button>
            </div>

            {/* Chat Bot Message */}
            <CardTitle className='text-center font-manrope text-2xl text-primary-900'>
              {STEP_MESSAGES[current_step]}
            </CardTitle>
          </CardHeader>

          <CardContent className='p-8'>
            <ScrollArea className='h-full'>
              {/* Step 1: User Type */}
              {current_step === 1 && (
                <div className='space-y-6'>
                  <RadioGroup
                    value={selected_user_type || ''}
                    onValueChange={setSelectedUserType}
                    className='grid grid-cols-1 gap-4'
                  >
                    {USER_TYPES.map((type) => (
                      <Label
                        key={type.name}
                        className={cn(
                          'flex items-center p-4 rounded-xl transition-all duration-300 cursor-pointer',
                          'border-2',
                          selected_user_type === type.name
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-primary-100 hover:border-primary-200'
                        )}
                      >
                        <RadioGroupItem value={type.name} className='sr-only' />
                        <span className='mr-3 text-xl'>{type.icon}</span>
                        <span className='font-satoshi text-lg text-primary-900'>{type.name}</span>
                      </Label>
                    ))}
                  </RadioGroup>

                  <Button
                    onClick={() => setCurrentStep(2)}
                    className='w-full text-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors'
                    size="lg"
                  >
                    Continue
                  </Button>
                </div>
              )}

              {/* Step 2: Learning Style */}
              {current_step === 2 && (
                <div className='space-y-6'>
                  <RadioGroup
                    value={learning_style || ''}
                    onValueChange={setLearningStyle}
                    className='grid grid-cols-1 gap-4'
                  >
                    {LEARNING_STYLES.map((style) => (
                      <Label
                        key={style}
                        className={cn(
                          'flex items-center p-4 rounded-xl transition-all duration-300 cursor-pointer',
                          'border-2',
                          learning_style === style
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-primary-100 hover:border-primary-200'
                        )}
                      >
                        <RadioGroupItem value={style} className='sr-only' />
                        <span className='font-satoshi text-lg text-primary-900'>{style}</span>
                      </Label>
                    ))}
                  </RadioGroup>

                  <Button
                    onClick={() => setCurrentStep(3)}
                    className='w-full text-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors'
                    size="lg"
                  >
                    Continue
                  </Button>
                </div>
              )}

              {/* Step 3: Subject Interests */}
              {current_step === 3 && (
                <div className='space-y-6'>
                  <div className='grid grid-cols-2 gap-4'>
                    {Object.entries(subject_interests).map(([key, value]) => (
                      <Label
                        key={key}
                        className={cn(
                          'flex items-center p-4 rounded-xl transition-all duration-300 cursor-pointer',
                          'border-2',
                          value
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-primary-100 hover:border-primary-200'
                        )}
                      >
                        <Checkbox
                          checked={value}
                          onCheckedChange={(checked) => setSubjectInterests({ ...subject_interests, [key]: checked })}
                          className='hidden'
                        />
                        <div className={cn(
                          'flex items-center justify-center w-5 h-5 border-2 rounded-md mr-3 transition-colors',
                          value ? 'bg-primary-500 border-primary-500' : 'border-primary-300'
                        )}>
                          {value && <div className="w-2 h-2 bg-white rounded-sm"></div>}
                        </div>
                        <span className='font-satoshi text-lg text-primary-900'>
                          {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </span>
                      </Label>
                    ))}
                  </div>

                  <Button
                    onClick={() => setCurrentStep(4)}
                    className='w-full text-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors'
                    size="lg"
                  >
                    Continue
                  </Button>
                </div>
              )}

              {/* Step 4: Motivation Factors */}
              {current_step === 4 && (
                <div className='space-y-6'>
                  <div className='grid grid-cols-1 gap-4'>
                    {Object.entries(motivation_factors).map(([key, value]) => (
                      <Label
                        key={key}
                        className={cn(
                          'flex items-center p-4 rounded-xl transition-all duration-300 cursor-pointer',
                          'border-2',
                          value
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-primary-100 hover:border-primary-200'
                        )}
                      >
                        <Checkbox
                          checked={value}
                          onCheckedChange={(checked) => setMotivationFactors({ ...motivation_factors, [key]: checked })}
                          className='hidden'
                        />
                        <div className={cn(
                          'flex items-center justify-center w-5 h-5 border-2 rounded-md mr-3 transition-colors',
                          value ? 'bg-primary-500 border-primary-500' : 'border-primary-300'
                        )}>
                          {value && <div className="w-2 h-2 bg-white rounded-sm"></div>}
                        </div>
                        <span className='font-satoshi text-lg text-primary-900'>
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </span>
                      </Label>
                    ))}
                  </div>

                  <Button
                    onClick={() => setCurrentStep(5)}
                    className='w-full text-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors'
                    size="lg"
                  >
                    Continue
                  </Button>
                </div>
              )}

              {/* Step 5: Source Channels */}
              {current_step === 5 && (
                <div className='space-y-6'>
                  <div className='grid grid-cols-2 gap-4'>
                    {Object.entries(source_channels).map(([key, value]) => (
                      <Label
                        key={key}
                        className={cn(
                          'flex items-center p-4 rounded-xl transition-all duration-300 cursor-pointer',
                          'border-2',
                          value
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-primary-100 hover:border-primary-200'
                        )}
                      >
                        <Checkbox
                          checked={value}
                          onCheckedChange={(checked) => setSourceChannels({ ...source_channels, [key]: checked })}
                          className='hidden'
                        />
                        <div className={cn(
                          'flex items-center justify-center w-5 h-5 border-2 rounded-md mr-3 transition-colors',
                          value ? 'bg-primary-500 border-primary-500' : 'border-primary-300'
                        )}>
                          {value && <div className="w-2 h-2 bg-white rounded-sm"></div>}
                        </div>
                        <span className='font-satoshi text-lg text-primary-900'>
                          {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </span>
                      </Label>
                    ))}
                  </div>

                  <Button
                    onClick={handleOnboardingSubmit}
                    className='w-full text-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors'
                    size="lg"
                  >
                    Complete
                  </Button>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingPage;
