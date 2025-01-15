import { features } from '../../landing-page/contentSections';

const FeaturesSection: React.FC = () => {
  return (
    <div id='features' className='relative mx-auto mt-32 max-w-7xl px-6 lg:px-8'>
      <div className='relative mx-auto max-w-2xl text-center'>
        <span className='inline-block px-4 py-1 mb-4 text-sm font-medium text-teal-500 bg-teal-50 dark:bg-teal-900/30 rounded-full'>
          Powerful Features
        </span>
        <h2 className='mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-gray-100 bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-600'>
          Transform Your Learning Experience
        </h2>
        <p className='mt-6 text-xl leading-8 text-gray-600 dark:text-gray-300 font-light'>
          Don't work harder.
          <span className='block font-semibold text-2xl mt-1 bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent'>
            Work smarter.
          </span>
        </p>
      </div>

      <div className='relative mx-auto mt-16 max-w-5xl sm:mt-20 lg:mt-24'>
        <dl className='grid max-w-xl grid-cols-1 gap-x-12 gap-y-16 lg:max-w-none lg:grid-cols-2'>
          {features.map((feature) => (
            <div 
              key={feature.name} 
              className='group relative p-8 rounded-3xl bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-2xl border border-gray-100 dark:border-gray-700 backdrop-blur-sm'
            >
              <dt className='flex items-center gap-x-4 text-2xl font-semibold leading-7 text-gray-900 dark:text-gray-100'>
                <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 to-blue-500 text-white shadow-lg group-hover:scale-110 transition-transform duration-300'>
                  <div className='text-3xl'>{feature.icon}</div>
                </div>
                <span className='bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent'>
                  {feature.name}
                </span>
              </dt>
              <dd className='mt-6 text-lg leading-7 text-gray-600 dark:text-gray-300 pl-20'>
                {feature.description}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

export default FeaturesSection;
