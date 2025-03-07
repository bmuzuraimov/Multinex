import { footerNavigation } from '../../common/contentSections';
import { FaFacebook, FaXTwitter, FaInstagram, FaLinkedin, FaTiktok } from 'react-icons/fa6';

const FooterSection = () => {
  return (
    <div className='relative mt-32 w-full bg-white'>
      <footer className='relative w-full py-16'>
        <div className='relative max-w-7xl mx-auto px-6 lg:px-8'>
          {/* Main footer content */}
          <div className='grid grid-cols-1 lg:grid-cols-4 gap-12'>
            {/* Brand section */}
            <div className='lg:col-span-1'>
              <div className='space-y-6'>
                <div className='relative group'>
                  <svg
                    className='h-10 w-auto transition-transform duration-300 ease-in-out transform group-hover:scale-110'
                    viewBox='0 0 150 40'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M20 10 L40 10 L30 30 Z'
                      className='fill-primary-500 drop-shadow-[0_2px_8px_rgba(5,196,155,0.5)]'
                    />
                    <text
                      x='45'
                      y='28'
                      className='text-2xl font-bold fill-primary-900'
                      style={{ fontFamily: 'Manrope' }}
                    >
                      Multinex
                    </text>
                  </svg>
                </div>

                <p className='font-montserrat text-gray-600 leading-relaxed'>
                  Making studying more engaging and effective through active learning and multi-sensory techniques.
                </p>

                <div className='flex space-x-5'>
                  <a href="https://www.facebook.com/profile.php?id=61566443964554" target="_blank" rel="noopener noreferrer" className='text-gray-400 hover:text-primary-500 transition-colors duration-200'>
                    <FaFacebook className='h-5 w-5' />
                  </a>
                  <a href="https://x.com/multinex" target="_blank" rel="noopener noreferrer" className='text-gray-400 hover:text-primary-500 transition-colors duration-200'>
                    <FaXTwitter className='h-5 w-5' />
                  </a>
                  <a href="https://www.instagram.com/multinex/" target="_blank" rel="noopener noreferrer" className='text-gray-400 hover:text-primary-500 transition-colors duration-200'>
                    <FaInstagram className='h-5 w-5' />
                  </a>
                  <a href="https://www.linkedin.com/company/multinex/" target="_blank" rel="noopener noreferrer" className='text-gray-400 hover:text-primary-500 transition-colors duration-200'>
                    <FaLinkedin className='h-5 w-5' />
                  </a>
                  <a href="https://www.tiktok.com/@multinex" target="_blank" rel="noopener noreferrer" className='text-gray-400 hover:text-primary-500 transition-colors duration-200'>
                    <FaTiktok className='h-5 w-5' />
                  </a>
                </div>
              </div>
            </div>

            {/* Navigation sections */}
            <div className='lg:col-span-2 grid grid-cols-2 gap-8'>
              <div>
                <h3 className='font-manrope text-title-sm font-semibold text-primary-900 mb-4'>Quick Links</h3>
                <ul className='space-y-3'>
                  {footerNavigation.app.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className='font-montserrat text-gray-500 hover:text-primary-600 transition-colors duration-200'
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                  <li>
                    <a
                      href="https://multinex.getrewardful.com/signup"
                      target="_blank"
                      rel="noopener noreferrer" 
                      className='font-montserrat text-gray-500 hover:text-primary-600 transition-colors duration-200'
                    >
                      Affiliate Program
                    </a>
                  </li>
                  <li>
                    <a
                      href="/guide"
                      className='font-montserrat text-gray-500 hover:text-primary-600 transition-colors duration-200'
                    >
                      Guide
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className='font-manrope text-title-sm font-semibold text-primary-900 mb-4'>About Us</h3>
                <ul className='space-y-3'>
                  {footerNavigation.company.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className='font-montserrat text-gray-500 hover:text-primary-600 transition-colors duration-200'
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className='lg:col-span-1'>
              <h3 className='font-manrope text-title-sm font-semibold text-primary-900 mb-4'>Stay Updated</h3>
              <form className='mt-4'>
                <div className='flex flex-col space-y-3'>
                  <input
                    type='email'
                    placeholder='Your email address'
                    className='w-full px-4 py-2.5 rounded-lg bg-white border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-200 font-satoshi'
                  />
                  <button
                    type='submit'
                    className='w-full px-4 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200 font-satoshi font-medium'
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Bottom bar */}
          <div className='mt-16 pt-8 border-t border-gray-100'>
            <p className='text-center font-satoshi text-sm text-gray-400'>
              © {new Date().getFullYear()} Multinex Tech. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FooterSection;
