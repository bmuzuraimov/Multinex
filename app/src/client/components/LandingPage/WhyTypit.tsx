import { Link } from 'wasp/client/router';
import whyTypit from '../../static/whytypit.png';

const WhyTypit: React.FC = () => {
  return (
    <section className='relative bg-gradient-to-br from-gray-50 to-teal-50 dark:from-gray-900 dark:to-teal-900'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>
          <div className='space-y-8 animate-fade-in'>
            <div className='space-y-4'>
              <h2 className='text-5xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent'>
                Why Choose Typit?
              </h2>
              <div className='w-24 h-1 bg-teal-500'></div>
            </div>
            
            <div className='space-y-6'>
              <div className='p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300'>
                <p className='text-xl font-serif text-gray-700 dark:text-gray-300 leading-relaxed'>
                  Renowned neuroscientist{' '}
                  <strong className='font-bold text-gray-900 dark:text-gray-100'>Andrew Huberman</strong> emphasizes that
                  active engagement is crucial for effective learning and memory consolidation.
                </p>
              </div>
              
              <div className='p-6 bg-teal-50 dark:bg-teal-900/30 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300'>
                <p className='text-xl font-serif text-gray-700 dark:text-gray-300 leading-relaxed'>
                  Typit turns passive reading into an{' '}
                  <strong className='font-bold text-teal-600 dark:text-teal-400'>active learning</strong> experience,
                  helping you absorb information faster and retain it longer.
                </p>
              </div>
            </div>
            
            <div className='flex space-x-4'>
              <Link
                to='/demo'
                className='group relative inline-flex items-center px-8 py-3 overflow-hidden text-lg font-medium text-teal-600 border-2 border-teal-600 rounded-full hover:text-white transition duration-300'
              >
                <span className='absolute left-0 w-full h-0 transition-all bg-teal-600 opacity-100 group-hover:h-full group-hover:top-0 duration-300 ease-out'></span>
                <span className='relative'>Try Demo</span>
              </Link>
              <Link
                to='/'
                className='inline-flex items-center px-8 py-3 text-lg font-medium text-gray-600 hover:text-teal-600 transition duration-300'
              >
                Learn More →
              </Link>
            </div>
          </div>
          
          <div className='relative group'>
            <div className='absolute -inset-1 bg-gradient-to-r from-teal-600 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200'></div>
            <div className='relative'>
              <img 
                src={whyTypit} 
                alt='Andrew Huberman' 
                className='rounded-lg shadow-2xl transform transition duration-500 hover:scale-105'
              />
              <div className='absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg'>
                <p className='text-sm font-medium text-teal-600'>Backed by Science</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyTypit;