import { Dialog } from '@headlessui/react';
import DropdownUser from '../components/DropdownUser';
import { UserMenuItems } from './UserMenuItems';
import DarkModeSwitcher from './DarkModeSwitcher';
import { useState, useCallback, memo } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';
import { HiBars3 } from 'react-icons/hi2';
import { BiLogIn } from 'react-icons/bi';
import { useAuth } from 'wasp/client/auth';
import { Link } from 'wasp/client/router';
import logo from '../static/logo.png';
import { navigation } from '../landing-page/contentSections';

const NavLogo = memo(() => <img className='h-8' src={logo} alt='Typit' />);

const NavigationLink = memo(({ item, onClick, isMobile = false }: { 
  item: { name: string; href: string; }; 
  onClick?: () => void;
  isMobile?: boolean;
}) => {
// Update NavigationLink component
const baseClasses = "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors";
const desktopClasses = "text-sm pb-2 font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-teal-500 hover:after:w-full after:transition-all";

// Mobile menu item update
const mobileClasses = "block px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 font-medium";

  return (
    <a
      href={item.href}
      onClick={onClick}
      className={`${baseClasses} ${isMobile ? mobileClasses : desktopClasses}`}
    >
      {item.name}
    </a>
  );
});

const LoginButton = memo(({ isMobile = false }: { isMobile?: boolean }) => (
  <Link to='/login'>
    <div className={`flex items-center text-gray-900 dark:text-gray-100 hover:text-teal-500 dark:hover:text-teal-400 transition-all duration-200 ${isMobile ? 'hover:translate-x-2' : 'hover:scale-105'}`}>
      Log in <BiLogIn size='1.1rem' className='ml-1' />
    </div>
  </Link>
));

const NavBar: React.FC = () => {
  const { data: user, isLoading: isUserLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileMenuClose = useCallback(() => setMobileMenuOpen(false), []);
  const handleMobileMenuOpen = useCallback(() => setMobileMenuOpen(true), []);

  return (
    <header className='bg-white/80 dark:bg-gray-900/90 backdrop-blur-lg'>
      <nav className='flex items-center justify-between p-6 lg:px-8 max-w-7xl mx-auto' aria-label='Global'>
        <div className='flex items-center lg:flex-1'>
          <Link to='/' className='flex items-center -m-1.5 p-1.5'>
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
          </Link>
        </div>
        <div className='flex lg:hidden'>
          <button
            type='button'
            className='-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200'
            onClick={handleMobileMenuOpen}
          >
            <span className='sr-only'>Open main menu</span>
            <HiBars3 className='h-6 w-6' aria-hidden='true' />
          </button>
        </div>
        <div className='hidden lg:flex lg:gap-x-12'>
          {navigation.map((item) => (
            <NavigationLink key={item.name} item={item} />
          ))}
        </div>
        <div className='hidden lg:flex lg:flex-1 lg:justify-end lg:align-end'>
          <div className='flex items-center gap-4'>
            <DarkModeSwitcher />
            {isUserLoading ? null : !user ? (
              <LoginButton />
            ) : (
              <DropdownUser user={user} />
            )}
          </div>
        </div>
      </nav>
      <Dialog as='div' className='lg:hidden' open={mobileMenuOpen} onClose={handleMobileMenuClose}>
        <div className='fixed inset-0 z-50 bg-black/30 backdrop-blur-sm dark:bg-black/50' />
        <Dialog.Panel className='fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white dark:bg-gray-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 dark:sm:ring-gray-100/10 transform transition-transform duration-300'>
          <div className='flex items-center justify-between'>
            <Link to='/' className='-m-1.5 p-1.5'>
              <span className='sr-only'>Typit</span>
              <NavLogo />
            </Link>
            <button
              type='button'
              className='-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200'
              onClick={handleMobileMenuClose}
            >
              <span className='sr-only'>Close menu</span>
              <AiFillCloseCircle className='h-6 w-6' aria-hidden='true' />
            </button>
          </div>
          <div className='mt-6'>
            <div className='-my-6 divide-y divide-gray-200 dark:divide-gray-700'>
              <div className='space-y-2 py-6'>
                {navigation.map((item) => (
                  <NavigationLink 
                    key={item.name} 
                    item={item} 
                    onClick={handleMobileMenuClose}
                    isMobile
                  />
                ))}
              </div>
              <div className='py-6'>
                {isUserLoading ? null : !user ? (
                  <LoginButton isMobile />
                ) : (
                  <UserMenuItems user={user} />
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
};

export default memo(NavBar);
