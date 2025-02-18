import { faqs } from '../../landing-page/contentSections';

const FAQSection = () => {
  return (
    <div className='relative mx-auto h-screen max-w-7xl px-6 pb-24 sm:pb-32 lg:px-8'>
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        <div className='absolute left-[50%] top-0 h-[48rem] w-[84rem] -translate-x-1/2 bg-gradient-to-r from-teal-50 to-cyan-50 opacity-30 dark:from-teal-900/30 dark:to-cyan-900/30 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)]' />
      </div>

      <div className='mx-auto max-w-4xl text-center'>
      <h2 className='mt-6 text-5xl font-bold bg-gradient-to-r from-gray-900 via-teal-800 to-gray-900 dark:from-white dark:via-teal-200 dark:to-white bg-clip-text text-transparent'>
          Frequently Asked Questions
        </h2>
      </div>

      <dl className='mx-auto mt-16 max-w-4xl space-y-4'>
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className='group rounded-2xl bg-white/60 dark:bg-gray-800/60 p-6 shadow-lg ring-1 ring-gray-900/5 dark:ring-white/5 backdrop-blur transition-all duration-300 hover:bg-white hover:shadow-xl dark:hover:bg-gray-800'
          >
            <dt className='flex items-center justify-between gap-x-3 text-lg font-semibold leading-7 text-gray-900 dark:text-gray-100'>
              <span className='flex items-center gap-x-3'>
                <svg
                  className='h-6 w-6 text-teal-500'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='1.5'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z'
                  />
                </svg>
                {faq.question}
              </span>
            </dt>
            <dd className='mt-4 text-base leading-7 text-gray-600 dark:text-gray-300'>
              <p className='group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-200'>
                {faq.answer}
              </p>
              {faq.href && (
                <a
                  href={faq.href}
                  className='mt-4 inline-flex items-center text-teal-600 dark:text-teal-400 hover:text-teal-500 dark:hover:text-teal-300 transition-colors duration-200'
                >
                  Learn more
                  <svg className='ml-2 h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
                    <path
                      fillRule='evenodd'
                      d='M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z'
                      clipRule='evenodd'
                    />
                  </svg>
                </a>
              )}
            </dd>
          </div>
        ))}
      </dl>

      <div className='mt-16 flex justify-center'>
        <a
          href='#contact'
          className='rounded-full bg-teal-600 px-4 py-2 text-lg font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600'
        >
          Still have questions? Contact us
        </a>
      </div>
    </div>
  );
};

export default FAQSection;
