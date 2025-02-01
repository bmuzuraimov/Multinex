import { Link } from 'wasp/client/router';
import ExerciseForm from '../ExerciseForm';

const HeroSection: React.FC = () => {
  return (
    <div className='relative pt-14 w-full min-h-screen flex items-center pointer-events-none'>
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
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-gray-900'>
                Outsmart AI Laziness – Learn Faster by Doing, Not Just Reading
                <span className='animate-pulse'>|</span>
              </span>
            </h1>
            <h3 className='mt-6 text-xl leading-8 text-teal-700 dark:text-teal-300 italic font-serif'>
              Your brain wasn’t built for ChatGPT copy-paste.
            </h3>
            <p className='mt-6 mx-auto max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300'>
              <span className="font-semibold text-teal-600 dark:text-teal-400">Type key concepts</span> → <span className="font-semibold text-red-600 dark:text-red-400">Handwrite connections</span> → <span className="font-semibold text-blue-600 dark:text-blue-400">Hear explanations</span> → <span className="font-semibold text-purple-600 dark:text-purple-400">Retain 3x longer</span>.
            </p>
            <ExerciseForm topicId={null} demo={true} />

            <div className='mt-10 flex items-center justify-center gap-x-6'>
              <Link
                to='/login'
                className='rounded-md bg-teal-500 px-5 py-3 text-sm font-medium text-white hover:bg-teal-600 transition-colors duration-200 pointer-events-auto'
              >
                Sign up for more free credits <span aria-hidden='true'>→</span>
              </Link>
            </div>
          </div>
          <span className='text-gray-600 dark:text-gray-300 text-sm mt-8 block text-center italic'>
            Powered by OpenAI models ✨
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
