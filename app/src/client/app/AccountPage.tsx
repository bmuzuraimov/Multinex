import { Link } from 'wasp/client/router';
import { type User } from 'wasp/entities';
import { logout } from 'wasp/client/auth';
import { FiLogOut, FiLock, FiUser, FiMail, FiShoppingBag, FiBell } from 'react-icons/fi';
import { Switch } from '@headlessui/react';
import { useState } from 'react';

export default function AccountPage({ user }: { user: User }) {
  return (
    <div className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8'>
      <div className='space-y-8'>
        {/* Account Header */}
        <div className='flex items-center justify-between pb-8 border-b border-gray-200 dark:border-gray-700'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>Account Settings</h1>
            <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
              Manage your Typit account and security preferences
            </p>
          </div>
          <button
            onClick={logout}
            className='flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors'
          >
            <FiLogOut className='w-5 h-5' />
            Sign Out
          </button>
        </div>

        {/* Main Content Grid */}
        <div className='grid gap-8 lg:grid-cols-3'>
          {/* Account Details Card */}
          <div className='lg:col-span-2 space-y-6'>
            <section className='bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6 border border-gray-100 dark:border-gray-700'>
              <div className='flex items-center gap-3 mb-6'>
                <FiUser className='w-6 h-6 text-teal-600 dark:text-teal-400' />
                <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>Profile Information</h2>
              </div>
              
              <dl className='space-y-4 divide-y divide-gray-100 dark:divide-gray-700'>
                <InfoRow label='Email' value={user.email} icon={<FiMail />} />
                <InfoRow label='Username' value={user.username} icon={<FiUser />} />
                <TokenBalance tokens={user.tokens} />
              </dl>
            </section>

            {/* Security Card */}
            <section className='bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6 border border-gray-100 dark:border-gray-700'>
              <div className='flex items-center gap-3 mb-6'>
                <FiLock className='w-6 h-6 text-teal-600 dark:text-teal-400' />
                <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>Security</h2>
              </div>

              <div className='space-y-4'>
                <SecurityItem
                  title='Two-Factor Authentication'
                  description='Add an extra layer of security to your account'
                  action={<SwitchButton />}
                />
                <SecurityItem
                  title='Active Sessions'
                  description='3 devices currently signed in'
                  action={
                    <button className='text-sm font-medium text-teal-600 dark:text-teal-400 hover:underline'>
                      Manage Sessions
                    </button>
                  }
                />
              </div>
            </section>
          </div>

          {/* Preferences Sidebar */}
          <div className='lg:col-span-1'>
            <section className='bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6 border border-gray-100 dark:border-gray-700'>
              <div className='flex items-center gap-3 mb-6'>
                <FiBell className='w-6 h-6 text-teal-600 dark:text-teal-400' />
                <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>Preferences</h2>
              </div>

              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='text-sm font-medium text-gray-900 dark:text-white'>Email Notifications</h3>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>Product updates and newsletters</p>
                  </div>
                  <Switch
                    checked={user.sendEmail}
                    onChange={() => {}}
                    className={`${
                      user.sendEmail ? 'bg-teal-600' : 'bg-gray-200 dark:bg-gray-600'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                  >
                    <span
                      className={`${
                        user.sendEmail ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, icon }: { label: string; value?: string | null; icon: React.ReactNode }) {
  if (!value) return null;
  
  return (
    <div className='pt-4 first:pt-0'>
      <div className='flex items-center gap-3'>
        <span className='text-gray-400 dark:text-gray-500'>{icon}</span>
        <div className='flex-1'>
          <dt className='text-sm font-medium text-gray-500 dark:text-gray-300'>{label}</dt>
          <dd className='mt-1 text-sm text-gray-900 dark:text-white'>{value}</dd>
        </div>
      </div>
    </div>
  );
}

function TokenBalance({ tokens }: { tokens: number }) {
  return (
    <div className='pt-4'>
      <div className='flex items-center gap-3'>
        <FiShoppingBag className='w-5 h-5 text-gray-400 dark:text-gray-500' />
        <div className='flex-1'>
          <div className='flex items-center justify-between'>
            <div>
              <dt className='text-sm font-medium text-gray-500 dark:text-gray-300'>Token Balance</dt>
              <dd className='mt-1 text-sm text-gray-900 dark:text-white'>{tokens} tokens remaining</dd>
            </div>
            <CustomerPortalButton />
          </div>
          <div className='mt-3 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden'>
            <div 
              className='h-full bg-teal-600 dark:bg-teal-500' 
              style={{ width: `${Math.min((tokens / 1000) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function CustomerPortalButton() {
  return (
    <Link
      to='/pricing'
      className='inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-sm'
    >
      <FiShoppingBag className='w-4 h-4' />
      Add Tokens
    </Link>
  );
}

function SecurityItem({ title, description, action }: { 
  title: string;
  description: string;
  action: React.ReactNode;
}) {
  return (
    <div className='flex items-center justify-between pt-4 first:pt-0'>
      <div>
        <h3 className='text-sm font-medium text-gray-900 dark:text-white'>{title}</h3>
        <p className='text-sm text-gray-500 dark:text-gray-400'>{description}</p>
      </div>
      {action}
    </div>
  );
}

function SwitchButton() {
  const [enabled, setEnabled] = useState(false);

  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className={`${
        enabled ? 'bg-teal-600' : 'bg-gray-200 dark:bg-gray-600'
      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
    >
      <span
        className={`${
          enabled ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
      />
    </Switch>
  );
}