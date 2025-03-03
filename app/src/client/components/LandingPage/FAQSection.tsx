import { faqs } from '../../common/contentSections';

const FAQSection = () => {
  return (
    <div className='relative mx-auto min-h-screen max-w-7xl px-6 py-24 font-montserrat'>
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        <div className='absolute left-[50%] top-0 h-[48rem] w-[84rem] -translate-x-1/2 bg-gradient-to-r from-primary-50 to-secondary-50 opacity-20' />
      </div>

      <div className='mx-auto max-w-4xl text-center'>
        <h2 className='font-manrope text-title-xl font-bold bg-gradient-to-r from-primary-900 via-primary-700 to-primary-900 bg-clip-text text-transparent'>
          Frequently Asked Questions
        </h2>
      </div>

      <dl className='mx-auto mt-16 max-w-4xl space-y-6'>
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className='group rounded-2xl bg-white p-8 shadow-lg ring-1 ring-primary-100 transition-all duration-300 hover:shadow-xl hover:ring-primary-200'
          >
            <dt className='flex items-center justify-between gap-x-4 text-title-sm font-semibold text-primary-900'>
              <span className='flex items-center gap-x-4'>
                <svg
                  className='h-6 w-6 text-primary-500'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='2'
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
            <dd className='mt-6 text-base leading-relaxed text-gray-600'>
              <p className='group-hover:text-primary-900 transition-colors duration-200'>
                {faq.answer}
              </p>
              {faq.href && (
                <a
                  href={faq.href}
                  className='mt-4 inline-flex items-center font-satoshi text-primary-600 hover:text-primary-500 transition-colors duration-200'
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

      <div className='mt-20 flex justify-center'>
        <a
          href='#contact'
          className='rounded-full bg-primary-600 px-8 py-4 font-satoshi text-lg font-semibold text-white shadow-md transition-all duration-200 hover:bg-primary-500 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
        >
          Still have questions? Contact us
        </a>
      </div>
    </div>
  );
};

export default FAQSection;
