import { features } from '../../common/contentSections';

const FeaturesSection: React.FC = () => {
  return (
    <div id='features' className='relative mx-auto min-h-screen py-24 px-6 lg:px-8 bg-white font-manrope'>
      <div className='relative mx-auto max-w-2xl text-center'>
        <h2 className='font-montserrat text-title-xl font-bold bg-gradient-to-r from-primary-900 via-primary-700 to-primary-900 bg-clip-text text-transparent'>
          Features
        </h2>
      </div>

      <div className='relative mx-auto mt-16 max-w-6xl sm:mt-20'>
        <dl className='grid max-w-xl grid-cols-1 gap-8 sm:gap-12 md:max-w-none md:grid-cols-2'>
          {features.map((feature) => (
            <div 
              key={feature.name} 
              className='group relative p-8 rounded-2xl bg-white hover:bg-primary-50 transition-all duration-300 shadow-md hover:shadow-lg border border-primary-100'
            >
              <dt className='flex items-center gap-x-6 text-title-md font-semibold leading-tight text-primary-900'>
                <div className='flex h-20 w-20 items-center justify-center rounded-xl bg-primary-100/50 group-hover:bg-primary-200/50 group-hover:scale-110 transition-all duration-300'>
                  <div className='text-4xl text-primary-600'>{feature.icon}</div>
                </div>
                <span className='font-satoshi bg-gradient-to-r from-primary-800 to-primary-600 bg-clip-text text-transparent'>
                  {feature.name}
                </span>
              </dt>
              <dd className='mt-6 text-lg leading-relaxed text-gray-600 pl-[6.5rem] font-montserrat'>
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
