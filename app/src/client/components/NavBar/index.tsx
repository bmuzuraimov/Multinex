import { Link } from 'wasp/client/router';
import { useAuth } from 'wasp/client/auth';
import { routes } from 'wasp/client/router';
import { useState, useCallback, memo } from 'react';
import { Dialog } from '@headlessui/react';
import { BiLogIn } from 'react-icons/bi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { HiBars3 } from 'react-icons/hi2';
import { MdOutlineToken } from 'react-icons/md';
import DropdownUser from './DropdownUser';
import DarkModeSwitcher from './DarkModeSwitcher';
import { UserMenuItems } from './UserMenuItems';
import { AUTH_NAVBAR, PUBLIC_NAVBAR } from '../../../shared/constants';
import { cn } from '../../../shared/utils';

const NavigationLink = memo(
  ({
    item,
    onClick,
    is_mobile = false,
    is_auth = false
  }: {
    item: { name: string; href: string };
    onClick?: () => void;
    is_mobile?: boolean;
    is_auth?: boolean;
  }) => {
    const base_classes = 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors';
    const desktop_classes = is_auth 
      ? 'text-sm font-medium leading-6 text-gray-600 hover:text-primary-600 transition-all duration-200'
      : 'text-sm pb-2 font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-teal-500 hover:after:w-full after:transition-all';
    const mobile_classes = is_auth
      ? 'block rounded-lg px-3 py-2 text-base font-medium leading-7 text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200 hover:translate-x-2'
      : 'block px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 font-medium';

    return (
      <Link to={item.href as any} onClick={onClick} className={cn(base_classes, is_mobile ? mobile_classes : desktop_classes)}>
        {item.name}
      </Link>
    );
  }
);

const NavBar = () => {
  const { data: user, isLoading: is_user_loading } = useAuth();
  const [mobile_menu_open, setMobileMenuOpen] = useState(false);
  const public_paths = [
    routes.LandingPageRoute.build(),
    routes.LoginRoute.build(),
    routes.SignupRoute.build(), 
    routes.AboutPageRoute.build(),
    routes.PublicCoursesRoute.build(),
    routes.GuidePageRoute.build(),
    routes.PrivacyPageRoute.build(),
    routes.TermsPageRoute.build(),
    routes.DemoPageRoute.build(),
    routes.EmailVerificationRoute.build(),
    routes.RequestPasswordResetRoute.build(),
    routes.PasswordResetRoute.build(),
    routes.PricingPageRoute.build()
  ];
  const is_auth = !public_paths.includes(window.location.pathname);

  const handleMobileMenuClose = useCallback(() => setMobileMenuOpen(false), []);
  const handleMobileMenuOpen = useCallback(() => setMobileMenuOpen(true), []);

  return (
    <header className={cn(
      'bg-white sticky top-0 z-fixed',
      is_auth ? 'border-b border-gray-200 shadow-sm' : 'bg-white/80 dark:bg-gray-900/90 backdrop-blur-lg'
    )}>
      <nav className={cn(
        'flex items-center justify-between max-w-7xl mx-auto',
        is_auth ? 'p-4 lg:px-8 font-satoshi' : 'p-6 lg:px-8'
      )} aria-label='Global'>
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
            className={cn(
              '-m-2.5 inline-flex items-center justify-center rounded-md p-2.5',
              is_auth 
                ? 'text-gray-600 hover:text-primary-600 transition-all duration-200'
                : 'text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200'
            )}
            onClick={handleMobileMenuOpen}
          >
            <span className='sr-only'>Open main menu</span>
            <HiBars3 className='h-6 w-6' aria-hidden='true' />
          </button>
        </div>

        <div className='hidden lg:flex lg:gap-x-8'>
          {(is_auth ? AUTH_NAVBAR : PUBLIC_NAVBAR).map((item) => (
            <NavigationLink key={item.name} item={item} is_auth={is_auth} />
          ))}
        </div>

        <div className='hidden lg:flex lg:flex-1 lg:justify-end lg:items-center'>
          {is_auth && <DarkModeSwitcher />}
          {!is_user_loading && user && is_auth && (
            <div className='group relative flex items-center gap-2 text-sm font-medium leading-6 text-primary-600 bg-primary-50 px-3 py-1.5 rounded-full transition-all duration-200'>
              <MdOutlineToken className='w-5 h-5 group-hover:rotate-180 transition-transform duration-300' />
              {user.credits}
              <div className='absolute -bottom-14 left-1/2 -translate-x-1/2 w-48 bg-gray-800 text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none'>
                Used to generate exercises, MC quizzes and summaries
              </div>
            </div>
          )}
          {is_user_loading ? null : !user ? (
            <Link
              to='/login'
              className={cn(
                'flex items-center gap-1 font-medium',
                is_auth 
                  ? 'text-gray-600 hover:text-primary-600 transition-all duration-200'
                  : 'text-gray-900 dark:text-gray-100 hover:text-teal-500 dark:hover:text-teal-400'
              )}
            >
              Log in <BiLogIn size='1.1rem' />
            </Link>
          ) : is_auth ? (
            <div className='ml-4'>
              <DropdownUser user={user} />
            </div>
          ) : (
            <Link to='/portal' className='rounded-full text-base bg-black text-white px-4 py-1'>
              Portal
            </Link>
          )}
        </div>
      </nav>

      <Dialog as='div' className='lg:hidden' open={mobile_menu_open} onClose={handleMobileMenuClose}>
        <div className={cn(
          'fixed inset-0 z-50',
          is_auth ? 'bg-black/20 backdrop-blur-sm' : 'bg-black/30 backdrop-blur-sm dark:bg-black/50'
        )} />
        <Dialog.Panel className={cn(
          'fixed inset-y-0 right-0 z-50 w-full overflow-y-auto px-6 py-6 sm:max-w-sm transform transition-transform duration-300',
          is_auth 
            ? 'bg-white sm:ring-1 sm:ring-gray-900/10'
            : 'bg-white dark:bg-gray-900 sm:ring-1 sm:ring-gray-900/10 dark:sm:ring-gray-100/10'
        )}>
          <div className='flex items-center justify-between'>
            <Link to='/' className='-m-1.5 p-1.5'>
              <span className='sr-only'>Multinex</span>
            </Link>
            <button
              type='button'
              className={cn(
                '-m-2.5 rounded-md p-2.5',
                is_auth
                  ? 'text-gray-600 hover:text-primary-600 transition-all duration-200'
                  : 'text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200'
              )}
              onClick={handleMobileMenuClose}
            >
              <span className='sr-only'>Close menu</span>
              <AiFillCloseCircle className='h-6 w-6' aria-hidden='true' />
            </button>
          </div>
          <div className='mt-6'>
            <div className={cn(
              '-my-6',
              is_auth ? 'divide-y divide-gray-100' : 'divide-y divide-gray-200 dark:divide-gray-700'
            )}>
              <div className='space-y-2 py-6'>
                {(is_auth ? AUTH_NAVBAR : PUBLIC_NAVBAR).map((item) => (
                  <NavigationLink 
                    key={item.name} 
                    item={item} 
                    onClick={handleMobileMenuClose}
                    is_mobile
                    is_auth={is_auth}
                  />
                ))}
              </div>
              <div className='py-6'>
                {is_user_loading ? null : !user ? (
                  <Link
                    to='/login'
                    className={cn(
                      'flex items-center',
                      is_auth
                        ? 'text-gray-600 hover:text-primary-600 transition-all duration-200 hover:translate-x-2'
                        : 'text-gray-900 dark:text-gray-100 hover:text-teal-500 dark:hover:text-teal-400'
                    )}
                    onClick={handleMobileMenuClose}
                  >
                    Log in <BiLogIn size='1.1rem' className='ml-1' />
                  </Link>
                ) : is_auth ? (
                  <UserMenuItems user={user} setMobileMenuOpen={handleMobileMenuClose} />
                ) : (
                  <Link
                    to='/portal'
                    className='block px-3 py-2 text-base font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200'
                    onClick={handleMobileMenuClose}
                  >
                    Portal
                  </Link>
                )}
              </div>
              {is_auth && (
                <div className='py-6'>
                  <DarkModeSwitcher />
                </div>
              )}
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
};

export default memo(NavBar);