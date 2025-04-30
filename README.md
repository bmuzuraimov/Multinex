# Multinex

## Educational Application

Multinex is designed to enhance learning for university students through multi-modal channels, enabling efficient and intuitive mastery of educational content. It leverages neuroscience principles like Cognitive Load Theory, Dual Coding, and the Generation Effect to optimize knowledge acquisition.

The interface supports interactive engagement with material across various topics, particularly in exercise-related subjects, as part of structured courses.

## Features

### Multi-Modal Learning

Combines text, visuals, writing, and audio to reinforce concepts through active encoding, visual-spatial scaffolding, retrieval practice, and auditory priming.

### Content Types

- **Type**: Students type core concepts to engage working memory and attention, using clear, concise text to minimize cognitive load.
- **Mermaid**: Visual flowcharts or diagrams (e.g., hierarchies, processes) provide dual coding via the visuospatial sketchpad, limited to 5–8 items for clarity.
- **Write**: Retrieval-based exercises, such as fill-in-the-blank prompts, strengthen retention through synaptic plasticity, with scaffolds to support beginners.
- **Listen**: Audio summaries with active prompts (e.g., questions) leverage the phonological loop and prosody to enhance engagement and prevent passive consumption.

### Interactive Workflow

Students type text, view Mermaid charts, listen to audio summaries, and write answers, ensuring varied and active interaction with material.

### Neuroscience-Driven Design

Built to reduce cognitive overload, combine verbal and visual inputs, and promote active recall for 10x faster learning compared to traditional methods.

## Purpose

The application targets university students, helping them grasp complex topics efficiently. It is particularly suited for exercise-related topics within structured courses, fostering deep understanding through scientifically grounded learning strategies.

## Usage

Students navigate topics within a course, engaging with each sub-topic through:

1. Typing key concepts to encode information.
2. Viewing Mermaid charts to visualize relationships or processes.
3. Listening to audio summaries with active prompts to reinforce learning.
4. Writing answers to retrieval prompts to solidify retention.

## Prerequisites

- **Operating System**: Unix-based system (Linux, macOS) - Windows is not currently supported
- **Node.js**: v18 or higher
- **PostgreSQL**: v12 or higher
- **Python**: v3.9 or higher
- **React**: v18.2.0 (both react and react-dom packages)

## Installation

### 1. Install Wasp

```bash
curl -sSL https://get.wasp-lang.dev/installer.sh | sh -s -- --version 0.15.2
```

### 2. Clone the Repository

```bash
git clone https://github.com/bmuzuraimov/Multinex
cd Multinex
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
cd doc_flow
python3.9 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
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

For support, please [create an issue](https://github.com/bmuzuraimov/Multinex/issues) or contact [bmuzuraimov@gmail.com](mailto:bmuzuraimov@gmail.com).
