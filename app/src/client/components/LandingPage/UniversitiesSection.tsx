import { universities } from '../../landing-page/contentSections';

const UniversitiesSection: React.FC = () => {
  return (
    <section className='relative overflow-hidden px-6 py-32'>
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute left-1/4 top-1/3 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute right-1/4 bottom-1/3 w-80 h-80 bg-teal-300/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className='relative max-w-7xl mx-auto'>
        <div className='text-center mb-16'>
          <span className='px-4 py-1 text-sm font-medium text-teal-600 bg-teal-50 dark:bg-teal-900/30 rounded-full'>
            Global Recognition
          </span>
          <h2 className='mt-6 text-5xl font-bold bg-gradient-to-r from-gray-900 via-teal-800 to-gray-900 dark:from-white dark:via-teal-200 dark:to-white bg-clip-text text-transparent'>
            Empowering Students Worldwide
          </h2>
          <p className='mt-4 text-xl text-gray-600 dark:text-gray-300'>
            Join thousands of students from prestigious institutions who trust Typit
          </p>
        </div>

        <div className='relative'>
          <div className='absolute inset-0 bg-gradient-to-r from-white via-transparent to-white dark:from-gray-900 dark:to-gray-900 z-10'></div>
          <div className='relative w-full overflow-hidden'>
            <div className='flex animate-slide gap-16 items-center'>
              {[...universities, ...universities].map((university, index) => (
                <div 
                  key={`${university.name}-${index}`}
                  className='group relative flex-shrink-0 transition-transform duration-300 hover:scale-110'
                >
                  <div className='relative p-8 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300'>
                    <img 
                      src={university.logoSrc} 
                      alt={university.name} 
                      className='h-16 w-auto filter dark:brightness-0 dark:invert transition-all duration-300 group-hover:brightness-110'
                    />
                    <div className='absolute inset-0 bg-gradient-to-br from-teal-500/0 to-blue-500/0 group-hover:from-teal-500/5 group-hover:to-blue-500/5 rounded-xl transition-all duration-300'></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='mt-16 text-center'>
          <p className='text-lg text-gray-600 dark:text-gray-300 font-light'>
            Join over <span className='font-semibold text-teal-600'>50,000+</span> students who've transformed their learning journey
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-slide {
          animation: slide 30s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default UniversitiesSection;
