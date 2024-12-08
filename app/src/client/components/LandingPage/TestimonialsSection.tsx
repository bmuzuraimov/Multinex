import { testimonials } from '../../landing-page/contentSections';

const TestimonialsSection = () => {
  return (
    <div className='mx-auto mt-32 max-w-7xl sm:mt-56 sm:px-6 lg:px-8 min-h-screen'>
      <div className='text-center mb-16'>
        <h2 className='text-4xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-teal-400 to-purple-600 bg-clip-text text-transparent'>
          Voices of Success
        </h2>
        <p className='mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300'>
          Join thousands of satisfied users who have transformed their typing experience
        </p>
      </div>

      <div className='relative'>
        {/* Decorative elements */}
        <div className='absolute inset-0 -z-10'>
          <div
            className='absolute right-1/2 bottom-0 -ml-24 transform-gpu blur-3xl lg:ml-24 xl:ml-48'
            aria-hidden='true'
          >
            <div
              className='aspect-[801/1036] w-[50.0625rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30'
              style={{
                clipPath:
                  'polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)',
              }}
            />
          </div>
        </div>

        <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className='group relative rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl dark:shadow-teal-500/10'
            >
              <div className='flex items-center gap-x-4 mb-6'>
                <img
                  src={testimonial.avatarSrc}
                  className='h-14 w-14 rounded-full ring-2 ring-teal-500'
                  alt={testimonial.name}
                />
                <div>
                  <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                    <a href={testimonial.socialUrl} className='hover:text-teal-500 transition-colors'>
                      {testimonial.name}
                    </a>
                  </h3>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>{testimonial.role}</p>
                </div>
              </div>

              <blockquote>
                <div className='relative'>
                  <svg
                    className='absolute -top-2 -left-2 h-8 w-8 text-teal-500 opacity-25'
                    fill='currentColor'
                    viewBox='0 0 32 32'
                    aria-hidden='true'
                  >
                    <path d='M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z' />
                  </svg>
                  <p className='relative text-base text-gray-700 dark:text-gray-300'>{testimonial.quote}</p>
                </div>
              </blockquote>

              <div className='mt-6 flex items-center gap-x-4 border-t border-gray-200 dark:border-gray-700 pt-4'>
                <div className='flex gap-x-1 text-teal-500'>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                    </svg>
                  ))}
                </div>
                <p className='text-sm text-gray-500 dark:text-gray-400'>Verified Customer</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
