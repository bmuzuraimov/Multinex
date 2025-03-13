import Stripe from 'stripe';
import { HttpError } from 'wasp/server';

const STRIPE_CLIENT = new Stripe(process.env.STRIPE_KEY!, {
  apiVersion: '2022-11-15',
});

// WASP_WEB_CLIENT_URL will be set up by Wasp when deploying to production: https://wasp-lang.dev/docs/deploying
const BASE_DOMAIN = process.env.WASP_WEB_CLIENT_URL || 'http://localhost:3000';

export async function getStripeCustomer(customer_email: string) {
  let stripe_customer: Stripe.Customer;
  try {
    const stripe_customers = await STRIPE_CLIENT.customers.list({
      email: customer_email,
    });
    if (!stripe_customers.data.length) {
      console.log('creating customer');
      stripe_customer = await STRIPE_CLIENT.customers.create({
        email: customer_email,
      });
    } else {
      console.log('using existing customer');
      stripe_customer = stripe_customers.data[0];
    }
    return stripe_customer;
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
}

export async function createStripeCheckoutSession({
  price_id,
  customer_id,
  mode,
}: {
  price_id: string;
  customer_id: string;
  mode: 'subscription' | 'payment';
}) {
  try {
    return await STRIPE_CLIENT.checkout.sessions.create({
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],
      mode: mode,
      success_url: `${BASE_DOMAIN}/checkout?success=true`,
      cancel_url: `${BASE_DOMAIN}/checkout?canceled=true`, 
      automatic_tax: { enabled: true },
      customer_update: {
        address: 'auto',
      },
      customer: customer_id,
    });
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
}
