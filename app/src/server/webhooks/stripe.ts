import { type MiddlewareConfigFn } from 'wasp/server';
import { type StripeWebhook } from 'wasp/server/api';
import express from 'express';
import { TIERS } from '../../shared/constants'

import Stripe from 'stripe';

// make sure the api version matches the version in the Stripe dashboard
const stripe = new Stripe(process.env.STRIPE_KEY!, {
  apiVersion: '2022-11-15', // TODO find out where this is in the Stripe dashboard and document
});

export const stripeWebhook: StripeWebhook = async (request, response, context) => {
  const sig = request.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    console.table({sig: 'stripe webhook signature verified', type: event.type})
  } catch (err: any) {
    console.log(err.message);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      console.log('Checkout session completed');
      const session = event.data.object as Stripe.Checkout.Session;
      const userStripeId = session.customer as string;
      if (!userStripeId) {
        console.log('No userStripeId in session');
        return response.status(400).send(`Webhook Error: No userStripeId in session`);
      }

      const { line_items } = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items'],
      });

      /**
       * here are your products, both subscriptions and one-time payments.
       * make sure to configure them in the Stripe dashboard first!
       */
      console.log(line_items?.data[0]?.price?.id);
      if (line_items?.data[0]?.price?.id === process.env.BASIC_PRICE_ID) {
        console.log('Basic package purchased');
        await context.entities.User.updateMany({
          where: {
            stripe_id: userStripeId,
          },
          data: {
            credits: {
              increment: TIERS.find(tier => tier.id === 'BASIC')?.credits
            },
            date_paid: new Date(),
          },
        });
      } else if (line_items?.data[0]?.price?.id === process.env.PRO_PRICE_ID) {
        console.log('Pro package purchased');
        await context.entities.User.updateMany({
          where: {
            stripe_id: userStripeId,
          },
          data: {
            credits: {
              increment: TIERS.find(tier => tier.id === 'PRO')?.credits
            },
            date_paid: new Date(),
          },
        });
      } else if (line_items?.data[0]?.price?.id === process.env.ENTERPRISE_PRICE_ID) {
        console.log('Enterprise package purchased');
        await context.entities.User.updateMany({
          where: {
            stripe_id: userStripeId,
          },
          data: {
            credits: {
              increment: TIERS.find(tier => tier.id === 'ENTERPRISE')?.credits
            },
            date_paid: new Date(),
          },
        });
      } else {
        response.status(404).send('Invalid product');
      }
    } else {
      console.log(`Unhandled event type ${event.type}`);
    }
    response.json({ received: true });
  } catch (err: any) {
    response.status(400).send(`Webhook Error: ${err?.message}`);
  }
};

// This allows us to override Wasp's defaults and parse the raw body of the request from Stripe to verify the signature
export const stripeMiddlewareFn: MiddlewareConfigFn = (middlewareConfig) => {
  middlewareConfig.delete('express.json');
  middlewareConfig.set('express.raw', express.raw({ type: 'application/json' }));
  return middlewareConfig;
};
