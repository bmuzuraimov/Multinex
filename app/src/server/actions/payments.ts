import { HttpError } from 'wasp/server';
import Stripe from 'stripe';
import type { StripePaymentResult } from '../../shared/types';
import { fetchStripeCustomer, createStripeCheckoutSession } from '../payments/stripeUtils.js';
import { TIERS } from '../../shared/constants.js';
import { type StripePayment } from 'wasp/server/operations';

export const stripePayment: StripePayment<string, StripePaymentResult> = async (tier, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  const userEmail = context.user.email;
  if (!userEmail) {
    throw new HttpError(
      403,
      'User needs an email to make a payment. If using the usernameAndPassword Auth method, switch to an Auth method that provides an email.'
    );
  }

  let priceId;
  if (tier === TIERS.find(t => t.id === 'BASIC')?.id) {
    priceId = process.env.BASIC_PRICE_ID!;
  } else if (tier === TIERS.find(t => t.id === 'PRO')?.id) {
    priceId = process.env.PRO_PRICE_ID!;
  } else if (tier === TIERS.find(t => t.id === 'ENTERPRISE')?.id) {
    priceId = process.env.ENTERPRISE_PRICE_ID!;
  } else {
    throw new HttpError(404, 'Invalid tier');
  }
  let customer: Stripe.Customer | undefined;
  let session: Stripe.Checkout.Session | undefined;
  try {
    customer = await fetchStripeCustomer(userEmail);
    if (!customer) {
      throw new HttpError(500, 'Error fetching customer');
    }
    session = await createStripeCheckoutSession({
      priceId,
      customerId: customer.id,
      mode: 'payment',
    });
    if (!session) {
      throw new HttpError(500, 'Error creating session');
    }
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || 'Internal server error';
    throw new HttpError(statusCode, errorMessage);
  }

  const updatedUser = await context.entities.User.update({
    where: {
      id: context.user.id,
    },
    data: {
      checkoutSessionId: session.id,
      stripeId: customer.id,
    },
  });

  return {
    sessionUrl: session.url,
    sessionId: session.id,
  };
};
