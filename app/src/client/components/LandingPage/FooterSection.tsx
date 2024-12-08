import { footerNavigation } from '../../landing-page/contentSections';
import { FaFacebook, FaXTwitter, FaInstagram, FaLinkedin, FaTiktok } from 'react-icons/fa6';

const FooterSection = () => {
  return (
    <div className='relative mt-32 w-full'>
      <div className='absolute inset-0 dark:via-teal-900/30 dark:to-teal-900/50'></div>

      <footer className='relative w-full pt-24 pb-12'>
        <div className='relative max-w-7xl mx-auto px-6 lg:px-8'>
          {/* Main footer content */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-16'>
            {/* Brand section */}
            <div className='lg:col-span-1'>
              <div className='space-y-8'>
                <div className='relative group'>
                  <svg
                    className='h-8 w-auto transition-transform duration-300 ease-in-out transform group-hover:scale-110'
                    viewBox='0 0 120 40'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M20 10 L40 10 L30 30 Z'
                      className='fill-teal-500 dark:fill-teal-400 drop-shadow-[0_2px_8px_rgba(45,212,191,0.5)]'
                    />
                    <text
                      x='45'
                      y='28'
                      className='text-2xl font-bold fill-gray-800 dark:fill-white filter drop-shadow-md'
                      style={{ fontFamily: 'system-ui' }}
                    >
                      Typit
                    </text>
                    <circle
                      cx='30'
                      cy='20'
                      r='15'
                      className='stroke-teal-500 dark:stroke-teal-400 stroke-[0.5] fill-none opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                    />
                  </svg>
                  <div className='absolute -inset-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-300'></div>
                </div>

                <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
                  Hey! We're here to make studying way more fun and effective. Trust me, your brain will thank you
                  later! 😊
                </p>

                <div className='flex space-x-4'>
                  <a href="https://www.facebook.com/profile.php?id=61566443964554" target="_blank" rel="noopener noreferrer" className='text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors'>
                    <FaFacebook className='h-6 w-6' />
                  </a>
                  <a href="https://x.com/typitapp" target="_blank" rel="noopener noreferrer" className='text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors'>
                    <FaXTwitter className='h-6 w-6' />
                  </a>
                  <a href="https://www.instagram.com/typitapp/" target="_blank" rel="noopener noreferrer" className='text-gray-600 hover:text-pink-600 dark:text-gray-300 dark:hover:text-pink-400 transition-colors'>
                    <FaInstagram className='h-6 w-6' />
                  </a>
                  <a href="https://www.linkedin.com/company/typitapp/" target="_blank" rel="noopener noreferrer" className='text-gray-600 hover:text-blue-700 dark:text-gray-300 dark:hover:text-blue-500 transition-colors'>
                    <FaLinkedin className='h-6 w-6' />
                  </a>
                  <a href="https://www.tiktok.com/@typitapp" target="_blank" rel="noopener noreferrer" className='text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors'>
                    <FaTiktok className='h-6 w-6' />
                  </a>
                </div>
              </div>
            </div>

            {/* Navigation sections */}
            <div className='lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8'>
              <div>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6'>Quick Links</h3>
                <ul className='space-y-4'>
                  {footerNavigation.app.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className='group flex items-center text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200'
                      >
                        <span className='mr-2 h-1 w-1 rounded-full bg-current opacity-0 group-hover:opacity-100 transition-opacity'></span>
                        {item.name}
                      </a>
                    </li>
                  ))}
                  <li>
                    <a
                      href="https://typit.getrewardful.com/signup"
                      target="_blank"
                      rel="noopener noreferrer" 
                      className='group flex items-center text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200'
                    >
                      <span className='mr-2 h-1 w-1 rounded-full bg-current opacity-0 group-hover:opacity-100 transition-opacity'></span>
                      Affiliate Program
                    </a>
                  </li>
                  <li>
                    <a
                      href="/guide"
                      className='group flex items-center text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200'
                    >
                      <span className='mr-2 h-1 w-1 rounded-full bg-current opacity-0 group-hover:opacity-100 transition-opacity'></span>
                      Guide
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6'>About Us</h3>
                <ul className='space-y-4'>
                  {footerNavigation.company.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className='group flex items-center text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200'
                      >
                        <span className='mr-2 h-1 w-1 rounded-full bg-current opacity-0 group-hover:opacity-100 transition-opacity'></span>
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className='sm:col-span-1'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6'>Stay in the Loop!</h3>
                <form className='mt-6'>
                  <div className='relative group'>
                    <input
                      type='email'
                      placeholder='Drop your email here'
                      className='w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-all duration-200'
                    />
                    <button
                      type='submit'
                      className='absolute right-2 top-2 rounded-lg bg-teal-500 p-1 text-white hover:bg-teal-600 transition-colors duration-200'
                    >
                      <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M14 5l7 7m0 0l-7 7m7-7H3'
                        />
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className='mt-16 pt-8 border-t border-gray-200 dark:border-gray-700'>
            <p className='text-center text-sm text-gray-500 dark:text-gray-400'>
              Made with ❤️ by students, for students - Typit {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FooterSection;
