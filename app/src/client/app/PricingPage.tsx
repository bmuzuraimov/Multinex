import { useAuth } from 'wasp/client/auth';
import { stripePayment } from 'wasp/client/operations';
import { TierIds } from '../../shared/constants';
import { AiFillCheckCircle } from 'react-icons/ai';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../shared/utils';
import { z } from 'zod';

export const tiers = [
  {
    name: 'Pro Package',
    id: TierIds.PRO,
    price: '$7.99',
    description: 'Perfect for 5 courses per semester',
    features: ['350,000 tokens', '~75 PDF files'],
    bestDeal: false,
  },
  {
    name: 'Premium Package',
    id: TierIds.PREMIUM,
    price: '$9.99',
    description: 'Perfect for 7 courses per semester',
    features: ['700,000 LLM tokens', '~155 PDF files'],
    bestDeal: true,
  },
  {
    name: 'Enterprise',
    id: TierIds.BASIC,
    price: 'Contact Sales',
    description: 'Perfect for organizations and institutions',
    features: ['Custom token allocation', 'Dedicated support', 'Contact bmuzuraimov@typit.app'],
    bestDeal: false,
  },
];

const PricingPage = () => {
  const [isStripePaymentLoading, setIsStripePaymentLoading] = useState<boolean | string>(false);

  const { data: user, isLoading: isUserLoading } = useAuth();

  const navigate = useNavigate();

  async function handleBuyNowClick(tierId: string) {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      setIsStripePaymentLoading(tierId);
      let stripeResults = await stripePayment(tierId);

      if (stripeResults?.sessionUrl) {
        window.open(stripeResults.sessionUrl, '_self');
      }
    } catch (error: any) {
      console.error(error?.message ?? 'Something went wrong.');
    } finally {
      setIsStripePaymentLoading(false);
    }
  }

  const handleCustomerPortalClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const schema = z.string().url();
      const customerPortalUrl = schema.parse(import.meta.env.REACT_APP_STRIPE_CUSTOMER_PORTAL);
      window.open(customerPortalUrl, '_blank');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='py-10 lg:mt-10'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div id='pricing' className='mx-auto max-w-4xl text-center'>
          <h2 className='mt-2 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl dark:text-white'>
            Pick Your <span className='text-teal-500'>Package</span>
          </h2>
        </div>
        <p className='mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600 dark:text-white'>
          We do not store any credit card information in server, payments are processed by Stripe also our site is
          secured by SSL encryption.
        </p>
        <div className='isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 lg:gap-x-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3'>
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={cn(
                'relative flex flex-col grow justify-between rounded-3xl ring-gray-900/10 dark:ring-gray-100/10 overflow-hidden p-8 xl:p-10',
                {
                  'ring-2': tier.bestDeal,
                  'ring-1 lg:mt-8': !tier.bestDeal,
                }
              )}
            >
              {tier.bestDeal && (
                <div className='absolute top-0 right-0 -z-10 w-full h-full transform-gpu blur-3xl' aria-hidden='true'>
                  <div
                    className='absolute w-full h-full bg-gradient-to-br from-sky-400 to-rose-300 opacity-30 dark:opacity-50'
                    style={{
                      clipPath: 'circle(670% at 50% 50%)',
                    }}
                  />
                </div>
              )}
              <div className='mb-8'>
                <div className='flex items-center justify-between gap-x-4'>
                  <h3 id={tier.id} className='text-gray-900 text-lg font-semibold leading-8 dark:text-white'>
                    {tier.name}
                  </h3>
                </div>
                <p className='mt-4 text-sm leading-6 text-gray-600 dark:text-white'>{tier.description}</p>
                <p className='mt-6 flex items-baseline gap-x-1 dark:text-white'>
                  <span className='text-4xl font-bold tracking-tight text-gray-900 dark:text-white'>{tier.price}</span>
                </p>
                <ul role='list' className='mt-8 space-y-3 text-sm leading-6 text-gray-600 dark:text-white'>
                  {tier.features.map((feature) => (
                    <li key={feature} className='flex gap-x-3'>
                      <AiFillCheckCircle className='h-6 w-5 flex-none text-teal-500' aria-hidden='true' />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                data-rewardful='convert'
                onClick={() => handleBuyNowClick(tier.id)}
                aria-describedby={tier.id}
                className={cn(
                  {
                    'bg-teal-500 text-white hover:text-white shadow-sm hover:bg-teal-400': tier.bestDeal,
                    'text-gray-600  ring-1 ring-inset ring-teal-200 hover:ring-teal-400': !tier.bestDeal,
                  },
                  {
                    'opacity-50 cursor-wait cursor-not-allowed': isStripePaymentLoading === tier.id,
                  },
                  'mt-8 block rounded-md py-2 px-3 text-center text-sm dark:text-white font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-400'
                )}
              >
                {!!user ? 'Purchase Tokens' : 'Log in to buy tokens'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
