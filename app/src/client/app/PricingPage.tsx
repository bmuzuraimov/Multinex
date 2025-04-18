import { useAuth } from 'wasp/client/auth';
import { TIERS } from '../../shared/constants';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../shared/utils';
import { z } from 'zod';
import { toast } from 'sonner';
import { stripePayment } from 'wasp/client/operations';

// shadcn components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../shadcn/components/ui/card';
import { Button } from '../shadcn/components/ui/button';
import { Badge } from '../shadcn/components/ui/badge';
import { Separator } from '../shadcn/components/ui/separator';
import { ScrollArea } from '../shadcn/components/ui/scroll-area';

// Icons
import { AiFillCheckCircle } from 'react-icons/ai';
import { FiShield } from 'react-icons/fi';

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
    <ScrollArea className="min-h-screen bg-primary-50/30">
      <div className='mx-auto max-w-7xl px-8 py-24'>
        <div className='mx-auto max-w-4xl text-center mb-16 space-y-6'>
          <CardTitle className='text-4xl md:text-5xl font-manrope font-bold bg-gradient-to-r from-primary-600 via-primary-800 to-secondary-700 bg-clip-text text-transparent'>
            Choose Your Plan
          </CardTitle>
          <CardDescription className='text-lg font-satoshi text-primary-600/80'>
            <div className='flex items-center justify-center gap-2 mt-6'>
              <FiShield className="w-5 h-5 text-primary-500" />
              Secure payments powered by Stripe
            </div>
          </CardDescription>
          <Separator className="my-8" />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto'>
          {TIERS.map((tier) => (
            <Card
              key={tier.id}
              className={cn(
                'relative transition-all duration-300 border-2 flex flex-col',
                tier.bestDeal 
                  ? 'border-primary-300 shadow-xl bg-white/70 backdrop-blur-sm' 
                  : 'border-primary-100 shadow-lg hover:border-primary-200 bg-white/50'
              )}
            >
              {tier.bestDeal && (
                <Badge 
                  variant="default"
                  className="absolute -top-3 -right-3 bg-primary-500 text-white font-satoshi px-4 py-1.5 shadow-lg"
                >
                  Most Popular
                </Badge>
              )}

              <CardHeader className="space-y-2">
                <CardTitle className="text-title-sm font-manrope text-primary-900">
                  {tier.name}
                </CardTitle>
                <CardDescription className="text-primary-600 font-satoshi">
                  {tier.description}
                </CardDescription>
                <div className="text-title-lg font-manrope text-primary-900 pt-4">
                  {tier.price}
                </div>
              </CardHeader>

              <CardContent className="space-y-6 flex-grow">
                <Separator className="my-6" />
                <ul className='space-y-4'>
                  {tier.features.map((feature) => (
                    <li key={feature} className='flex items-center text-primary-700 font-satoshi'>
                      <AiFillCheckCircle className='h-5 w-5 text-primary-500 mr-3 flex-shrink-0' />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-6 mt-auto">
                <Button
                  onClick={() => handlePaymentClick(tier.id)}
                  disabled={is_stripe_payment_loading === tier.id}
                  className={cn(
                    'w-full py-6 rounded-xl font-satoshi text-base transition-all duration-200',
                    tier.bestDeal
                      ? 'bg-primary-500 text-white hover:bg-primary-600'
                      : 'bg-primary-50 text-primary-700 hover:bg-primary-100',
                    is_stripe_payment_loading === tier.id && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {!!user ? 'Get Started' : 'Sign in to Purchase'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

export default PricingPage;
