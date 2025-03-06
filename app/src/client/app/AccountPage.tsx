import { Link } from 'wasp/client/router'
import { type User } from 'wasp/entities'
import { logout } from 'wasp/client/auth'
import { FiLogOut, FiLock, FiUser, FiMail, FiShoppingBag, FiBell, FiEdit } from 'react-icons/fi'
import { Switch } from '@headlessui/react'
import { useState, useEffect } from 'react'
import { useQuery, updatePrompt, getPrompt } from 'wasp/client/operations'
import { useRevalidator } from 'react-router-dom'

// ------------------------------------------------------------------
// MAIN ACCOUNT PAGE
// ------------------------------------------------------------------
export default function AccountPage({ user }: { user: User }) {
  return (
    <div className='mx-auto max-w-7xl px-6 py-12 font-montserrat'>
      <div className='space-y-10'>
        {/* Account Header */}
        <div className='flex items-center justify-between pb-8 border-b border-primary-100'>
          <div>
            <h1 className='text-title-xl font-manrope font-bold text-primary-900'>
              Account Settings
            </h1>
            <p className='mt-2 text-base text-primary-600 font-satoshi'>
              Manage your Multinex account and security preferences
            </p>
          </div>
          <button
            onClick={logout}
            className='flex items-center gap-2 px-6 py-3 text-sm font-medium text-danger bg-white hover:bg-danger/5 rounded-xl transition-all duration-200 shadow-sm border border-danger/20'
          >
            <FiLogOut className='w-5 h-5' />
            Sign Out
          </button>
        </div>

        {/* MAIN WRAPPER: 2-column grid for top sections */}
        <div className='grid gap-8 lg:grid-cols-3'>
          {/* LEFT: Profile Information */}
          <div className='lg:col-span-2 space-y-8'>
            <section className='bg-white rounded-2xl p-8 shadow-lg border border-primary-100'>
              <div className='flex items-center gap-4 mb-8'>
                <div className='p-3 bg-primary-50 rounded-xl'>
                  <FiUser className='w-6 h-6 text-primary-600' />
                </div>
                <h2 className='text-title-md font-manrope font-semibold text-primary-900'>
                  Profile Information
                </h2>
              </div>
              <dl className='space-y-6 divide-y divide-primary-100'>
                <InfoRow label='Email' value={user.email} icon={<FiMail />} />
                <InfoRow label='Username' value={user.username} icon={<FiUser />} />
                <TokenBalance credits={user.credits} />
              </dl>
            </section>
          </div>

          {/* RIGHT: Preferences & Security */}
          <div className='space-y-8'>
            {/* Preferences */}
            <section className='bg-white rounded-2xl p-8 shadow-lg border border-primary-100'>
              <div className='flex items-center gap-4 mb-8'>
                <div className='p-3 bg-primary-50 rounded-xl'>
                  <FiBell className='w-6 h-6 text-primary-600' />
                </div>
                <h2 className='text-title-md font-manrope font-semibold text-primary-900'>
                  Preferences
                </h2>
              </div>
              <div className='space-y-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='text-sm font-medium text-primary-900'>
                      Email Notifications
                    </h3>
                    <p className='mt-1 text-sm text-primary-600'>
                      Product updates and newsletters
                    </p>
                  </div>
                  <Switch
                    checked={user.sendEmail}
                    onChange={() => {}}
                    className={`${
                      user.sendEmail ? 'bg-primary-500' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out`}
                  >
                    <span
                      className={`${
                        user.sendEmail ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out`}
                    />
                  </Switch>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* BOTTOM FULL-WIDTH ROW: Prompt Customization */}
        <div className='space-y-8'>
          <PromptCustomizationCard user={user} />
        </div>
      </div>
    </div>
  )
}

// ------------------------------------------------------------------
// PROMPT CUSTOMIZATION CARD
// ------------------------------------------------------------------
function PromptCustomizationCard({ user }: { user: User }) {
  const { data: promptData, isLoading, error } = useQuery(getPrompt)
  const [prePrompt, setPrePrompt] = useState('')
  const [postPrompt, setPostPrompt] = useState('')

  useEffect(() => {
    if (promptData) {
      setPrePrompt(promptData.pre_prompt || '')
      setPostPrompt(promptData.post_prompt || '')
    }
  }, [promptData])

  const handleSave = async () => {
    try {
      await updatePrompt({
        id: Number(user.id),
        data: {
          userId: String(user.id),
          pre_prompt: prePrompt,
          post_prompt: postPrompt,
        },
      })
      alert('Prompt settings saved!')
    } catch (err) {
      alert('Failed to save prompt settings. See console for more info.')
      console.error(err)
    }
  }

  if (isLoading) return <div className='text-primary-600'>Loading prompt data...</div>
  if (error) return <div className='text-danger'>Error loading prompt data!</div>

  return (
    <section className='bg-white rounded-2xl p-8 shadow-lg border border-primary-100'>
      <div className='flex items-center gap-4 mb-8'>
        <div className='p-3 bg-primary-50 rounded-xl'>
          <FiEdit className='w-6 h-6 text-primary-600' />
        </div>
        <h2 className='text-title-md font-manrope font-semibold text-primary-900'>
          Prompt Customization
        </h2>
      </div>
      <div className='space-y-8'>
        {/* Pre‐Prompt */}
        <div>
          <label
            htmlFor='prePrompt'
            className='block text-sm font-medium text-primary-900 mb-2'
          >
            Pre‐Prompt
          </label>
          <textarea
            id='prePrompt'
            className='w-full p-4 text-sm border border-primary-200 rounded-xl bg-white text-primary-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200'
            rows={5}
            value={prePrompt}
            onChange={(e) => setPrePrompt(e.target.value)}
          />
          <p className='mt-2 text-xs text-primary-600'>
            Content prepended to the final prompt (prefix).
          </p>
        </div>

        {/* Post‐Prompt */}
        <div>
          <label
            htmlFor='postPrompt'
            className='block text-sm font-medium text-primary-900 mb-2'
          >
            Post‐Prompt
          </label>
          <textarea
            id='postPrompt'
            className='w-full p-4 text-sm border border-primary-200 rounded-xl bg-white text-primary-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200'
            rows={5}
            value={postPrompt}
            onChange={(e) => setPostPrompt(e.target.value)}
          />
          <p className='mt-2 text-xs text-primary-600'>
            Content appended after the main body (suffix).
          </p>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className='inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-xl transition-colors duration-200 shadow-md'
        >
          Save Prompt
        </button>
      </div>
    </section>
  )
}

// ------------------------------------------------------------------
// HELPER COMPONENTS
// ------------------------------------------------------------------
function InfoRow({
  label,
  value,
  icon
}: {
  label: string
  value?: string | null
  icon: React.ReactNode
}) {
  if (!value) return null
  return (
    <div className='pt-6 first:pt-0'>
      <div className='flex items-center gap-4'>
        <span className='p-2 bg-primary-50 rounded-lg text-primary-600'>{icon}</span>
        <div className='flex-1'>
          <dt className='text-sm font-medium text-primary-600'>
            {label}
          </dt>
          <dd className='mt-1 text-sm text-primary-900'>{value}</dd>
        </div>
      </div>
    </div>
  )
}

function TokenBalance({ credits }: { credits: number }) {
  return (
    <div className='pt-6'>
      <div className='flex items-center gap-4'>
        <span className='p-2 bg-primary-50 rounded-lg'>
          <FiShoppingBag className='w-5 h-5 text-primary-600' />
        </span>
        <div className='flex-1'>
          <div className='flex items-center justify-between'>
            <div>
              <dt className='text-sm font-medium text-primary-600'>Token Balance</dt>
              <dd className='mt-1 text-sm text-primary-900'>{credits} credits remaining</dd>
            </div>
            <CustomerPortalButton />
          </div>
          <div className='mt-4 h-2 bg-primary-100 rounded-full overflow-hidden'>
            <div 
              className='h-full bg-primary-500 transition-all duration-300' 
              style={{ width: `${Math.min((credits / 100) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function CustomerPortalButton() {
  return (
    <Link
      to='/pricing'
      className='inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-xl transition-colors duration-200 shadow-sm'
    >
      <FiShoppingBag className='w-4 h-4' />
      Add credits
    </Link>
  )
}

function SecurityItem({
  title,
  description,
  action
}: {
  title: string
  description: string
  action: React.ReactNode
}) {
  return (
    <div className='flex items-center justify-between pt-6 first:pt-0'>
      <div>
        <h3 className='text-sm font-medium text-primary-900'>
          {title}
        </h3>
        <p className='text-sm text-primary-600'>{description}</p>
      </div>
      {action}
    </div>
  )
}

function SwitchButton() {
  const [enabled, setEnabled] = useState(false)
  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className={`${
        enabled ? 'bg-primary-500' : 'bg-gray-200'
      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out`}
    >
      <span
        className={`${
          enabled ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out`}
      />
    </Switch>
  )
}
