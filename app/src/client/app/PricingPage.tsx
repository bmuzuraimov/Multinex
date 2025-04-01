import { useAuth } from 'wasp/client/auth';
import { TIERS } from '../../shared/constants';
import { AiFillCheckCircle } from 'react-icons/ai';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../shared/utils';
import { z } from 'zod';
import { toast } from 'sonner';
import { stripePayment } from 'wasp/client/operations';
const PricingPage = () => {
  const [is_stripe_payment_loading, setIsStripePaymentLoading] = useState<boolean | string>(false);
  const { data: user, isLoading: is_user_loading } = useAuth();
  const navigate = useNavigate();

  async function handlePaymentClick(tier_id: string) {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      setIsStripePaymentLoading(tier_id);
      const stripe_results = await stripePayment(tier_id);
      if (stripe_results?.session_url) {
        window.open(stripe_results.session_url, '_self');
      }
    } catch (error: any) {
      toast.error(error?.message ?? 'Something went wrong.');
    } finally {
      setIsStripePaymentLoading(false);
    }
  }

  function handleCustomerPortalClick() {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const url_schema = z.string().url();
      const customer_portal_url = url_schema.parse(import.meta.env.REACT_APP_STRIPE_CUSTOMER_PORTAL);
      window.open(customer_portal_url, '_blank');
    } catch (err) {
      toast.error(err as string);
    }
  }

  return (
    <div className='min-h-screen bg-white'>
      <div className='mx-auto max-w-7xl px-8 py-24'>
        <div className='mx-auto max-w-4xl text-center mb-16'>
          <h2 className='text-title-xl font-manrope text-primary-900'>
            Choose Your <span className='text-primary-500'>Plan</span>
          </h2>
          <p className='mt-6 text-lg font-satoshi text-primary-600'>
            Secure payments powered by Stripe. Your data is protected with enterprise-grade encryption.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto'>
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              className={cn(
                'relative bg-white rounded-2xl transition-all duration-300',
                'border-2 hover:border-primary-200',
                tier.bestDeal ? 'border-primary-300 shadow-xl' : 'border-gray-100 shadow-lg',
                'p-8 flex flex-col'
              )}
            >
              {tier.bestDeal && (
                <div className='absolute top-0 right-0 -mt-4 -mr-4'>
                  <span className='bg-primary-500 text-white text-sm font-satoshi px-4 py-1 rounded-full shadow-md'>
                    Most Popular
                  </span>
                </div>
              )}

              <div className='mb-8'>
                <h3 className='text-title-sm font-manrope text-primary-900 mb-3'>{tier.name}</h3>
                <p className='text-primary-600 font-satoshi mb-6'>{tier.description}</p>
                <div className='text-title-lg font-manrope text-primary-900 mb-8'>{tier.price}</div>

                <ul className='space-y-4'>
                  {tier.features.map((feature) => (
                    <li key={feature} className='flex items-center text-primary-700 font-satoshi'>
                      <AiFillCheckCircle className='h-5 w-5 text-primary-500 mr-3 flex-shrink-0' />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handlePaymentClick(tier.id)}
                disabled={is_stripe_payment_loading === tier.id}
                className={cn(
                  'mt-auto w-full py-4 rounded-xl font-satoshi text-base transition-all duration-200',
                  tier.bestDeal
                    ? 'bg-primary-500 text-white hover:bg-primary-600'
                    : 'bg-primary-50 text-primary-700 hover:bg-primary-100',
                  is_stripe_payment_loading === tier.id && 'opacity-50 cursor-not-allowed'
                )}
              >
                {!!user ? 'Get Started' : 'Sign in to Purchase'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
