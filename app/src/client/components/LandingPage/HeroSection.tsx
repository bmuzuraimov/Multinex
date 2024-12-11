import { Link } from 'wasp/client/router';

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
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-600'>
                Ultimate Final Exam Prep Tool
                <span className='animate-pulse'>|</span>
              </span>
            </h1>
            <h3 className='mt-6 text-xl leading-8 text-teal-700 dark:text-teal-300 italic font-serif'>
              Transform your lecture notes into an interactive learning experience
            </h3>
            <p className='mt-6 mx-auto max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300'>
              Drop your PDF notes and choose your study mode: Quick review with playback, active recall through typing exercises, or test your knowledge with final exam-style quizzes. Your path to exam success starts here.
            </p>
            {/* <div className='mt-10'>
              <div className='flex items-center justify-center w-full'>
                <div className='flex flex-col items-center p-2 justify-center w-full h-64 border-2 border-dashed rounded-lg bg-gray-50'>
                  <p className='text-xl text-gray-500 text-center'>Demonstration video coming soon! 🎬</p>
                  <p className='text-sm text-gray-500 mt-2'>Check back later to see our product in action</p>
                </div>
              </div>
            </div> */}

            <div className='mt-10 flex items-center justify-center gap-x-6'>
              <Link
                to='/demo'
                className='rounded-md px-5 py-3 border border-black animate-pulse text-sm font-medium hover:bg-gray-50 transition-colors duration-100 pointer-events-auto'
              >
                Not sure yet? Try our demo!
              </Link>
              <Link
                to='/login'
                className='rounded-md bg-teal-500 px-5 py-3 text-sm font-medium text-white hover:bg-teal-600 transition-colors duration-200 pointer-events-auto'
              >
                Let's get started! <span aria-hidden='true'>→</span>
              </Link>
            </div>
          </div>
          <span className='text-gray-600 dark:text-gray-300 text-sm mt-8 block text-center italic'>
            Powered by gpt-4o-mini llm ✨
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
