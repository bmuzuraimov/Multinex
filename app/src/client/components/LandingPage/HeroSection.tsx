import { Link } from 'wasp/client/router';
import ExerciseForm from '../ExerciseForm';
import { useAuth } from 'wasp/client/auth';
import { useState, useEffect } from 'react';
const HeroSection: React.FC = () => {
  const { data: user, isLoading } = useAuth();
  const [demoMode, setDemoMode] = useState(true);

  useEffect(() => {
    if (user && !isLoading) {
      setDemoMode(false);
    } else {
      setDemoMode(true);
    }
  }, [user, isLoading]);

  return (
    <div className='relative pt-14 w-full min-h-[85vh] flex items-center pointer-events-none'>
      {/* Cool background stuff */}
      <div
        className='absolute top-0 right-0 -z-10 transform-gpu blur-3xl overflow-hidden w-full h-full'
        aria-hidden='true'
      >
        <div
          className='hidden absolute top-0 right-0 w-full h-full bg-gradient-to-tr from-teal-400 to-purple-600 opacity-30 dark:opacity-20 dark:block'
          style={{
            clipPath: 'polygon(80% 20%, 90% 55%, 50% 100%, 70% 30%, 20% 50%, 50% 0)',
          }}
        />
      </div>
      <div className='py-24 sm:py-32 w-full'>
        <div className='mx-auto max-w-8xl px-6 lg:px-8'>
          <div className='mx-auto max-w-3xl text-center'>
            <h1 className='text-3xl font-semibold tracking-tight text-gray-900 sm:text-6xl dark:text-gray-100'>
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-gray-900'>
                Triathlon But For Brain
              </span>
            </h1>
            <p className='my-6 mx-auto max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300'>
              <span className='font-semibold text-teal-600 dark:text-teal-400'>Type key concepts</span> →{' '}
              <span className='font-semibold text-red-600 dark:text-red-400'>Handwrite connections</span> →{' '}
              <span className='font-semibold text-blue-600 dark:text-blue-400'>Listen explanations</span>.
            </p>
            <ExerciseForm topic_id={null} demo={demoMode} />
            {!user && !isLoading && (
              <div className='mt-10 flex items-center justify-center gap-x-6'>
                <Link
                  to='/signup'
                  className='rounded-full bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-200 pointer-events-auto hover:shadow-teal-500/25'
                >
                  Sign up for more free credits
                </Link>
                <Link
                  to='/demo'
                  className='rounded-full bg-gradient-to-r from-tertiary-500 to-tertiary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:from-tertiary-600 hover:to-tertiary-700 transition-all duration-200 pointer-events-auto hover:shadow-tertiary-500/25'
                >
                  Try demo <span aria-hidden='true' className='transition-transform group-hover:translate-x-1'>→</span>
                </Link>
              </div>
            )}
          </div>
          <div className='flex justify-center'>
            <span className='px-4 py-1 font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-full text-sm mt-8 inline-block text-center italic'>
              Beyond AI Summaries ✨
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
