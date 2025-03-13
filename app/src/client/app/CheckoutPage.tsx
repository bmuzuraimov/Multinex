import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function CheckoutPage() {
  const [payment_status, setPaymentStatus] = useState('loading');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    function handleDelayedRedirect() {
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

  return (
    <div className='min-h-screen bg-white flex items-center justify-center font-montserrat px-4'>
      <div className='w-full max-w-xl'>
        <div className='bg-white rounded-2xl p-8 shadow-lg border border-primary-100'>
          <div className='text-center space-y-6'>
            {payment_status === 'paid' && (
              <>
                <div className='w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto'>
                  <span className='text-4xl'>🎉</span>
                </div>
                <h1 className='text-title-lg font-manrope font-bold text-primary-900'>
                  Payment Successful!
                </h1>
                <p className='text-primary-600 font-satoshi'>
                  Thank you for your purchase. Your payment has been processed successfully.
                </p>
              </>
            )}
            
            {payment_status === 'canceled' && (
              <>
                <div className='w-20 h-20 bg-danger/10 rounded-full flex items-center justify-center mx-auto'>
                  <span className='text-4xl'>😔</span>
                </div>
                <h1 className='text-title-lg font-manrope font-bold text-danger'>
                  Payment Canceled
                </h1>
                <p className='text-primary-600 font-satoshi'>
                  Your payment was canceled. Please try again if you'd like to complete your purchase.
                </p>
              </>
            )}

            {payment_status === 'error' && (
              <>
                <div className='w-20 h-20 bg-warning/10 rounded-full flex items-center justify-center mx-auto'>
                  <span className='text-4xl'>⚠️</span>
                </div>
                <h1 className='text-title-lg font-manrope font-bold text-warning'>
                  Payment Error
                </h1>
                <p className='text-primary-600 font-satoshi'>
                  There was an error processing your payment. Please try again.
                </p>
              </>
            )}

            {payment_status !== 'loading' && (
              <div className='mt-8 text-sm text-primary-500 font-satoshi'>
                Redirecting you to your account page...
                <div className='mt-4 h-1 bg-primary-100 rounded-full overflow-hidden'>
                  <div className='h-full bg-primary-500 animate-[loading_4s_ease-in-out]' style={{width: '100%'}} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
