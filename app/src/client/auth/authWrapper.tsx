import { ReactNode } from 'react';
import NavBar from '../components/NavBar';
export function AuthWrapper({children} : {children: ReactNode }) {
  return (
    <div className='flex min-h-full flex-col justify-center px-4 pt-6 sm:pt-10 sm:px-6 lg:px-8'>
      <NavBar />
      <div className='mx-auto w-full max-w-[90%] mt-16 sm:mt-24 sm:max-w-md'>
        <div className='bg-white dark:bg-gray-800 py-6 sm:py-8 px-4 sm:px-10 shadow-xl ring-1 ring-gray-900/10 dark:ring-gray-100/10 rounded-lg sm:rounded-lg dark:text-gray-100 transition-colors duration-200'>
          <div className='-mt-6 sm:-mt-8'>
            { children }
          </div>
        </div>
      </div>
    </div>
  );
}
