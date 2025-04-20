import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../shadcn/components/ui/card';
import { Progress } from '../../../shadcn/components/ui/progress';
import { Button } from '../../../shadcn/components/ui/button';
import { Separator } from '../../../shadcn/components/ui/separator';
import { cn } from '../../../../shared/utils';
import DefaultLayout from '../../layouts/DefaultLayout';
import { FiCheck, FiX, FiAlertTriangle, FiArrowRight } from 'react-icons/fi';

const Checkout = () => {
  const [payment_status, setPaymentStatus] = useState('loading');
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    function handleDelayedRedirect() {
      // Animate progress bar
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 80);

      return setTimeout(() => {
        navigate('/account');
      }, 4000);
    }

    const query_params = new URLSearchParams(location.search);
    const is_success = query_params.get('success');
    const is_canceled = query_params.get('canceled');

    if (is_canceled) {
      setPaymentStatus('canceled');
    } else if (is_success) {
      setPaymentStatus('paid');
    } else {
      navigate('/account');
    }

    const timeout_id = handleDelayedRedirect();
    return () => {
      clearTimeout(timeout_id);
    };
  }, [location]);

  const statusConfig = {
    paid: {
      icon: <FiCheck className='w-8 h-8' />,
      title: 'Payment Successful!',
      description: 'Thank you for your purchase. Your payment has been processed successfully.',
      iconClass: 'bg-success/10 text-success',
      borderClass: 'border-success/20',
    },
    canceled: {
      icon: <FiX className='w-8 h-8' />,
      title: 'Payment Canceled',
      description: "Your payment was canceled. Please try again if you'd like to complete your purchase.",
      iconClass: 'bg-danger/10 text-danger',
      borderClass: 'border-danger/20',
    },
    error: {
      icon: <FiAlertTriangle className='w-8 h-8' />,
      title: 'Payment Error',
      description: 'There was an error processing your payment. Please try again.',
      iconClass: 'bg-warning/10 text-warning',
      borderClass: 'border-warning/20',
    },
  };

  const currentStatus = statusConfig[payment_status as keyof typeof statusConfig];

  return (
    <div className='min-h-screen bg-primary-50/30 grid place-items-center px-4 py-16 font-montserrat'>
      <Card
        className={cn(
          'w-full max-w-xl shadow-xl transition-all duration-500',
          'border-2',
          currentStatus?.borderClass || 'border-primary-100'
        )}
      >
        <CardHeader className='space-y-6 text-center'>
          <div
            className={cn(
              'w-16 h-16 rounded-full mx-auto flex items-center justify-center',
              currentStatus?.iconClass || 'bg-primary-100 text-primary-600'
            )}
          >
            {currentStatus?.icon}
          </div>
          <div className='space-y-2'>
            <CardTitle className='text-title-lg font-manrope font-bold text-primary-900'>
              {currentStatus?.title}
            </CardTitle>
            <CardDescription className='text-base font-satoshi text-primary-600'>
              {currentStatus?.description}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className='space-y-6'>
          <Separator className='my-6' />

          {payment_status !== 'loading' && (
            <div className='space-y-4'>
              <div className='flex items-center justify-between text-sm font-satoshi'>
                <span className='text-primary-600'>Redirecting to account page</span>
                <span className='text-primary-900 font-medium'>{progress}%</span>
              </div>
              <Progress value={progress} className='h-2 bg-primary-600' />

              <Button variant='outline' className='w-full mt-6 gap-2' onClick={() => navigate('/account')}>
                Go to Account
                <FiArrowRight className='w-4 h-4' />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DefaultLayout(Checkout);
