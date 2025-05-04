<p align="center">
  <img src="https://multinex.app/public-banner.png" alt="Multinex Logo">
</p>

<p align="center">
Multinex is a multi-channel learning platform. It allows you to create engaging exercises with &lt;type&gt;&lt;/type&gt;, &lt;listen&gt;&lt;/listen&gt;, &lt;mermaid&gt;&lt;/mermaid&gt;, &lt;write&gt;&lt;/write&gt; tags.
</p>

<p align="center">
  <a href="https://github.com/bmuzuraimov/Multinex/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-AGPL%20v3-blue.svg" alt="License: AGPL v3"></a>
  <a href="https://github.com/bmuzuraimov/Multinex/stargazers"><img src="https://img.shields.io/github/stars/bmuzuraimov/Multinex" alt="GitHub stars"></a>
  <a href="https://github.com/bmuzuraimov/Multinex/issues"><img src="https://img.shields.io/github/issues/bmuzuraimov/Multinex" alt="GitHub issues"></a>
  <a href="https://wasp-lang.dev/"><img src="https://img.shields.io/badge/Built%20With-Wasp%20v0.15.2-orange" alt="Built with Wasp"></a>
  <a href="https://github.com/bmuzuraimov/Multinex/pulse"><img src="https://img.shields.io/github/commit-activity/m/bmuzuraimov/Multinex" alt="Commit Activity"></a>
  <a href="https://multinex.app"><img src="https://img.shields.io/badge/Demo-Live-brightgreen" alt="Live Demo"></a>
</p>

## 🎓 Educational Application

Multinex is designed to enhance learning for university students through multi-modal channels, enabling efficient and intuitive mastery of educational content. It leverages neuroscience principles like Cognitive Load Theory, Dual Coding, and the Generation Effect to optimize knowledge acquisition.

The interface supports interactive engagement with material across various topics, particularly in exercise-related subjects, as part of structured courses.

## ✨ Features

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

## 🎯 Purpose

The application targets university students, helping them grasp complex topics efficiently. It is particularly suited for exercise-related topics within structured courses, fostering deep understanding through scientifically grounded learning strategies.

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Node.js, Express, Wasp framework
- **Database**: PostgreSQL
- **Document Processing**: FastAPI, Apache Tika, PyMuPDF
- **AI Services**: OpenAI, Google Generative AI
- **Storage**: AWS S3
- **Authentication**: Email, Google OAuth
- **Payments**: Stripe

## 🚀 System Architecture

Multinex consists of two main components:

1. **Main Application (Wasp/React)**: Handles user interface, authentication, and core functionality
2. **Document Processing Service (FastAPI)**: Processes uploaded documents, extracts text, and generates exercises

## 🧰 Prerequisites

- **Operating System**: Unix-based system (Linux, macOS) - Windows is not currently supported
- **Node.js**: v18 or higher
- **PostgreSQL**: v12 or higher
- **Python**: v3.9 or higher
- **Docker**: For running Apache Tika and development databases

## 📦 Installation

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

### 4. Setup Apache Tika

```bash
docker pull apache/tika:latest
docker run -d -p 127.0.0.1:9998:9998 apache/tika:latest
```

### 5. Start Document Processing Service

The document processing service is a separate FastAPI application that handles document parsing. It is not included in the Wasp app and needs to be started separately.

```bash
cd doc_flow
python3.9 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 6. Configure Environment Variables

Create two environment files:

- `.env.server`: Server-side environment variables
  ```
  # Database (comment for local development with the Wasp dev database)
  # DATABASE_URL=postgres://user:password@localhost:5432/multinex

  # Auth
  GOOGLE_CLIENT_ID=your_google_client_id
  GOOGLE_CLIENT_SECRET=your_google_client_secret
  JWT_SECRET=your_jwt_secret
  SKIP_EMAIL_VERIFICATION_IN_DEV=true

  # Email
  MAILGUN_API_KEY=your_mailgun_api_key
  MAILGUN_DOMAIN=your_mailgun_domain

  # Payments
  STRIPE_KEY=your_stripe_secret_key
  BASIC_PRICE_ID=stripe_price_id_for_basic
  PRO_PRICE_ID=stripe_price_id_for_pro
  PREMIUM_PRICE_ID=stripe_price_id_for_premium
  STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

  # Admin
  ADMIN_EMAILS=admin1@example.com,admin2@example.com

  # AI
  OPENAI_API_KEY=your_openai_api_key

  # Demo
  DEMO_EXERCISE_ID=example_exercise_id
  ```

- `.env.client`: Client-side environment variables
  ```
  REACT_APP_STRIPE_CUSTOMER_PORTAL=https://your-stripe-customer-portal-url
  REACT_APP_DOCUMENT_PARSER_URL=http://localhost:8000
  ```

### 7. Start the Application

```bash
wasp start
```

The app will be available at `http://localhost:3000`

## 🧩 Project Structure

```
Multinex/
├── app/                    # Main Wasp application
│   ├── main.wasp          # Wasp configuration file
│   ├── schema.prisma      # Database schema
│   ├── src/               # Source code
│   │   ├── client/        # Frontend React code
│   │   │   ├── App.tsx    # Root component
│   │   │   ├── auth/      # Authentication components
│   │   │   ├── common/    # Shared components
│   │   │   └── user/      # User-related components
│   │   └── server/        # Backend Node.js code
│   │       ├── actions/   # Server actions
│   │       ├── auth/      # Auth configuration
│   │       └── queries/   # Server queries
│   └── public/            # Static assets
│
└── doc_flow/              # Document processing service
    ├── api/               # API endpoints
    ├── core/              # Core functionality
    ├── services/          # Business logic
    ├── main.py           # Entry point
    └── requirements.txt  # Python dependencies
```

## 🤝 Contributing

Contributions are welcome! Please check out our [CONTRIBUTING.md](CONTRIBUTING.md) guide for details on how to contribute to this project and our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for community guidelines.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Run tests
5. Submit a pull request

## 📄 License

This project is licensed under the GNU Affero General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Website](https://www.multinex.app)
- [Documentation](https://docs.multinex.app)
- [Issue Tracker](https://github.com/bmuzuraimov/Multinex/issues)

## 📬 Support

For support, please [create an issue](https://github.com/bmuzuraimov/Multinex/issues) or contact [bmuzuraimov@gmail.com](mailto:bmuzuraimov@gmail.com).
