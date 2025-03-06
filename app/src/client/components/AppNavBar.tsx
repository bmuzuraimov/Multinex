import { Link, routes } from 'wasp/client/router';
import { useAuth } from 'wasp/client/auth';
import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { BiLogIn } from 'react-icons/bi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { HiBars3 } from 'react-icons/hi2';
import logo from '../static/logo.png';
import DropdownUser from './DropdownUser';
import DarkModeSwitcher from '../components/DarkModeSwitcher';
import { UserMenuItems } from '../components/UserMenuItems';
import { MdOutlineToken } from 'react-icons/md';

const navigation = [
  { name: 'Portal', href: '/portal' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Feedback', href: '/feedback' },
] as const;

export default function AppNavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: user, isLoading: isUserLoading } = useAuth();

  return (
    <header className='bg-white sticky top-0 border-b border-gray-200 shadow-sm z-fixed'>
      <nav className='flex items-center justify-between p-4 lg:px-8 max-w-7xl mx-auto font-satoshi' aria-label='Global'>
        <div className='flex lg:flex-1'>
          <Link to='/' className='flex items-center -m-1.5 p-1.5'>
            <div className='relative group'>
              <svg
                className='h-8 w-auto transition-transform duration-300 ease-in-out transform group-hover:scale-110'
                viewBox='0 0 160 40'
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
                  textLength='100'
                >
                  Multinex
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
          </Link>
        </div>
        <div className='flex lg:hidden'>
          <button
            type='button'
            className='-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-600 hover:text-primary-600 transition-all duration-200'
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className='sr-only'>Open main menu</span>
            <HiBars3 className='h-6 w-6' aria-hidden='true' />
          </button>
        </div>
        <div className='hidden lg:flex lg:gap-x-8'>
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className='text-sm font-medium leading-6 text-gray-600 hover:text-primary-600 transition-all duration-200'
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className='hidden lg:flex lg:flex-1 gap-6 justify-end items-center'>
          <DarkModeSwitcher />
          {!isUserLoading && user && (
            <div className='group relative flex items-center gap-2 text-sm font-medium leading-6 text-primary-600 bg-primary-50 px-3 py-1.5 rounded-full transition-all duration-200'>
              <MdOutlineToken className='w-5 h-5 group-hover:rotate-180 transition-transform duration-300' />
              {user.credits}
              <div className='absolute -bottom-14 left-1/2 -translate-x-1/2 w-48 bg-gray-800 text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none'>
                Used to generate exercises, MC quizzes and summaries
              </div>
            </div>
          )}
          {isUserLoading ? null : !user ? (
            <Link
              to='/login'
              className='flex items-center gap-1 text-gray-600 hover:text-primary-600 transition-all duration-200 font-medium'
            >
              Log in <BiLogIn size='1.1rem' />
            </Link>
          ) : (
            <div className='ml-4'>
              <DropdownUser user={user} />
            </div>
          )}
        </div>
      </nav>
      <Dialog as='div' className='lg:hidden' open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className='fixed inset-0 z-50 bg-black/20 backdrop-blur-sm' />
        <Dialog.Panel className='fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 transform transition-transform duration-300'>
          <div className='flex items-center justify-between'>
            <Link to='/' className='-m-1.5 p-1.5'>
              <span className='sr-only'>Multinex</span>
            </Link>
            <button
              type='button'
              className='-m-2.5 rounded-md p-2.5 text-gray-600 hover:text-primary-600 transition-all duration-200'
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className='sr-only'>Close menu</span>
              <AiFillCloseCircle className='h-6 w-6' aria-hidden='true' />
            </button>
          </div>
          <div className='mt-6'>
            <div className='-my-6 divide-y divide-gray-100'>
              <div className='space-y-2 py-6'>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className='block rounded-lg px-3 py-2 text-base font-medium leading-7 text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200 hover:translate-x-2'
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className='py-6'>
                {isUserLoading ? null : !user ? (
                  <Link
                    to='/login'
                    className='flex items-center text-gray-600 hover:text-primary-600 transition-all duration-200 hover:translate-x-2'
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log in <BiLogIn size='1.1rem' className='ml-1' />
                  </Link>
                ) : (
                  <UserMenuItems user={user} setMobileMenuOpen={setMobileMenuOpen} />
                )}
              </div>
              <div className='py-6'>
                <DarkModeSwitcher />
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
