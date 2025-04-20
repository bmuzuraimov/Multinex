import { HttpError } from 'wasp/server';
import Stripe from 'stripe';
import type { StripePaymentResult } from '../../shared/types';
import { getStripeCustomer, createStripeCheckoutSession } from '../payments/stripe-utils';
import { TIERS } from '../../shared/constants'
import { type StripePayment } from 'wasp/server/operations';

export const stripePayment: StripePayment<string, StripePaymentResult> = async (tier, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized');
  }

  const user_email = context.user.email;
  if (!user_email) {
    throw new HttpError(
      403,
      'User needs an email to make a payment. If using the usernameAndPassword Auth method, switch to an Auth method that provides an email'
    );
  }

  let price_id;
  if (tier === TIERS.find((t) => t.id === 'BASIC')?.id) {
    price_id = process.env.BASIC_PRICE_ID!;
  } else if (tier === TIERS.find((t) => t.id === 'PRO')?.id) {
    price_id = process.env.PRO_PRICE_ID!;
  } else if (tier === TIERS.find((t) => t.id === 'ENTERPRISE')?.id) {
    price_id = process.env.ENTERPRISE_PRICE_ID!;
  } else {
    throw new HttpError(404, 'Invalid tier');
  }

  let customer: Stripe.Customer | undefined;
  let session: Stripe.Checkout.Session | undefined;

  try {
    customer = await getStripeCustomer(user_email);
    if (!customer) {
      throw new HttpError(500, 'Error fetching customer');
    }

    session = await createStripeCheckoutSession({
      price_id,
      customer_id: customer.id,
      mode: 'payment',
    });
    if (!session) {
      throw new HttpError(500, 'Error creating session');
    }

    const updated_user = await context.entities.User.update({
      where: {
        id: context.user.id,
      },
      data: {
        checkout_session_id: session.id,
        stripe_id: customer.id,
      },
    });

    return {
      session_url: session.url,
      session_id: session.id,
    };

  } catch (error: any) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Payment processing failed', { error: error.message });
  }
};
