import { type User } from 'wasp/entities';
import { useEffect, useRef, useState } from 'react';
import { UserMenuItems } from './UserMenuItems';
import { cn } from '../../../shared/utils';

const DropdownUser = ({ user }: { user: Partial<User> }) => {
  const [is_dropdown_open, setIsDropdownOpen] = useState(false);

  const trigger_ref = useRef<any>(null);
  const dropdown_ref = useRef<any>(null);

  const toggleDropdownMenu = () => setIsDropdownOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = ({ target }: MouseEvent) => {
      if (!dropdown_ref.current) return;
      if (!is_dropdown_open || dropdown_ref.current.contains(target) || trigger_ref.current.contains(target)) {
        return;
      }
      setIsDropdownOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  });

  useEffect(() => {
    const handleEscapeKey = ({ keyCode }: KeyboardEvent) => {
      if (!is_dropdown_open || keyCode !== 27) return;
      setIsDropdownOpen(false);
    };
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  });

  return (
    <div className='relative font-satoshi' style={{ zIndex: 'dropdown' }}>
      <button
        ref={trigger_ref}
        onClick={toggleDropdownMenu}
        className='flex items-center gap-4 px-4 py-2'
      >
        <span className='hidden text-right lg:block'>
          <span className='block font-medium text-primary-900'>{user.username}</span>
        </span>

        <svg
          className={cn('hidden fill-current text-primary-600 sm:block transition-transform duration-300', {
            'rotate-180': is_dropdown_open,
          })}
          width='12'
          height='8'
          viewBox='0 0 12 8'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z'
          />
        </svg>
      </button>

      {/* Dropdown */}
      <div
        ref={dropdown_ref}
        className={cn(
          'absolute right-0 mt-2 w-64 flex flex-col rounded-lg border border-gray-200 bg-white shadow-lg',
          'transform transition-all duration-300 ease-in-out',
          {
            'opacity-0 invisible translate-y-2': !is_dropdown_open,
            'opacity-100 visible translate-y-0': is_dropdown_open,
          }
        )}
        style={{ zIndex: 'popover' }}
      >
        <UserMenuItems user={user} setMobileMenuOpen={toggleDropdownMenu} />
      </div>
    </div>
  );
};

export default DropdownUser;
