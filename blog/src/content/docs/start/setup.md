---
title: Environment Setup
description: Configure environment variables for Multinex
---

# Environment Setup

Make sure to set up the following environment variables:

## .env.server: Server-side environment variables

- **DATABASE_URL**: PostgreSQL connection URL (only in production, for local development comment this line)
- **STRIPE_KEY**: Stripe secret key for payments
- **BASIC_PRICE_ID, PRO_PRICE_ID, PREMIUM_PRICE_ID**: Stripe price IDs for subscription tiers
- **STRIPE_WEBHOOK_SECRET**: Secret for Stripe webhook verification
- **ADMIN_EMAILS**: Comma-separated list of admin user emails
- **GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET**: Google OAuth credentials
- **MAILGUN_API_KEY, MAILGUN_DOMAIN**: Mailgun credentials for email sending
- **JWT_SECRET**: Secret key for JWT tokens (required in production)
- **SKIP_EMAIL_VERIFICATION_IN_DEV**: Toggle email verification in development
- **OPENAI_API_KEY**: OpenAI API key for AI features
- **DEMO_EXERCISE_ID**: ID of exercise shown on hero page

## .env.client: Client-side environment variables

- **REACT_APP_STRIPE_CUSTOMER_PORTAL**: Stripe customer portal URL
- **REACT_APP_DOCUMENT_PARSER_URL**: Document parser service URL (default: http://localhost:8000)

## Overview

This documentation describes the required environment variables for your Multinex application setup, organized by functionality. These variables control various aspects of the application, from database connections to third-party service integrations.

## Setup Instructions

1. Create a `.env` file in your project root
2. Add all required variables with their appropriate values
3. For development, you can use dummy values for testing
4. For production, ensure all secrets are properly secured
5. Never commit the `.env` file to version control

## Stripe CLI Setup

To get the STRIPE_WEBHOOK_SECRET:

1. Install Stripe CLI from [https://stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli)
2. Run: `stripe listen --forward-to localhost:3001/stripe-webhook`
3. The CLI will output your webhook signing secret

## Important Notes

- All API keys and secrets should be kept confidential
- In production, ensure environment variables are properly secured
- The `.env.example` file should contain all variable names without values for reference
- For local development, you can create a `.env.local` file that won't be tracked by git

## Example .env File

```bash
# Server-side environment variables
DATABASE_URL=postgresql://username:password@localhost:5432/multinex
STRIPE_KEY=your_stripe_secret_key
BASIC_PRICE_ID=price_1234567890
PRO_PRICE_ID=price_1234567891
PREMIUM_PRICE_ID=price_1234567892
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
ADMIN_EMAILS=admin@example.com,admin2@example.com
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your_mailgun_domain
JWT_SECRET=your_jwt_secret
SKIP_EMAIL_VERIFICATION_IN_DEV=true
OPENAI_API_KEY=your_openai_api_key
DEMO_EXERCISE_ID=your_demo_exercise_id

# Client-side environment variables
REACT_APP_STRIPE_CUSTOMER_PORTAL=your_stripe_customer_portal_url
REACT_APP_DOCUMENT_PARSER_URL=http://localhost:8000
```