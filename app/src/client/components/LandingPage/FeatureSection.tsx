import { features } from '../../common/contentSections';

const FeaturesSection: React.FC = () => {
  return (
    <div id='features' className='relative mx-auto h-screen max-w-7xl px-6 lg:px-8'>
      <div className='relative mx-auto max-w-2xl text-center'>
        <h2 className='mt-6 text-5xl font-bold bg-gradient-to-r from-gray-900 via-teal-800 to-gray-900 dark:from-white dark:via-teal-200 dark:to-white bg-clip-text text-transparent'>
          Features
        </h2>
      </div>

      <div className='relative mx-auto mt-16 max-w-5xl sm:mt-20 lg:mt-24'>
        <dl className='grid max-w-xl grid-cols-1 gap-x-8 gap-y-12 sm:gap-x-12 sm:gap-y-16 md:max-w-none md:grid-cols-2 lg:gap-x-16'>
          {features.map((feature) => (
            <div 
              key={feature.name} 
              className='group relative p-4 rounded-xl bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 shadow-sm hover:shadow-md border border-teal-100 dark:border-gray-700 backdrop-blur-sm'
            >
              <dt className='flex items-center gap-x-4 text-2xl font-semibold leading-7 text-gray-900 dark:text-gray-100'>
                <div className='flex h-16 w-16 items-center justify-center group-hover:scale-110 transition-transform'>
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
