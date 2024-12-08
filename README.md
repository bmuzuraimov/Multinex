# TypeIt

A platform to fill gaps in the education by revising materials efficiently and typing through important parts of the documents.

## Prerequisites

- **Operating System**: Unix-based system (Linux, macOS) - Windows is not currently supported
- **Node.js**: v18 or higher
- **PostgreSQL**: v12 or higher
- **Python**: v3.9 or higher

## Installation

### 1. Install Wasp

```bash
curl -sSL https://get.wasp-lang.dev/installer.sh | sh -s -- --version 0.13.2
```

### 2. Clone the Repository

```bash
git clone https://github.com/bmuzuraimov/Typeit
cd Typeit
```

### 3. Set Up the Database

Ensure Docker is running on your system, then start PostgreSQL and run migrations:

```bash
cd app
wasp db start
wasp db migrate-dev
```

### 4. Start Document Parser Service

In a new terminal, run:

```bash
cd document_parser
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```


## Development

### Running the App Locally

Start the development server:

```bash
wasp start
```

The app will be available at `http://localhost:3000`

## Environment Variables

Make sure to set up the following environment variables:

- `.env.server`: Server-side environment variables
  - `DATABASE_URL`: PostgreSQL connection URL (only in production, for local development comment this line)
  - `STRIPE_KEY`: Stripe secret key for payments
  - `BASIC_PRICE_ID`, `PRO_PRICE_ID`, `PREMIUM_PRICE_ID`: Stripe price IDs for subscription tiers
  - `STRIPE_WEBHOOK_SECRET`: Secret for Stripe webhook verification
  - `ADMIN_EMAILS`: Comma-separated list of admin user emails
  - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`: Google OAuth credentials
  - `MAILGUN_API_KEY`, `MAILGUN_DOMAIN`: Mailgun credentials for email sending
  - `JWT_SECRET`: Secret key for JWT tokens (required in production)
  - `SKIP_EMAIL_VERIFICATION_IN_DEV`: Toggle email verification in development
  - `OPENAI_API_KEY`: OpenAI API key for AI features
  - `DEMO_EXERCISE_ID`: ID of exercise shown on hero page

- `.env.client`: Client-side environment variables
  - `REACT_APP_STRIPE_CUSTOMER_PORTAL`: Stripe customer portal URL
  - `REACT_APP_DOCUMENT_PARSER_URL`: Document parser service URL (default: http://localhost:8000)

## Contributing
Contributions are welcome! Please check out our [CONTRIBUTING.md](CONTRIBUTING.md) guide for details on how to contribute to this project.

## License

[AGPL-3.0](LICENSE)

## Support

For support, please [create an issue](https://github.com/bmuzuraimov/Typeit/issues) or contact [bmuzuraimov@gmail.com](mailto:bmuzuraimov@gmail.com).
