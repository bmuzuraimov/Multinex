---
title: Installation
description: Complete guide to installing Multinex
---

# Installation

This guide will walk you through the process of installing and setting up Multinex on your local machine.

## 1. Install Wasp

Install the Wasp CLI with the specific version required for Multinex:

```bash
curl -sSL https://get.wasp-lang.dev/installer.sh | sh -s -- --version 0.15.2
```

Verify the installation by running:

```bash
wasp --version
```

## 2. Clone the Repository

Clone the Multinex repository from GitHub:

```bash
git clone https://github.com/bmuzuraimov/Multinex
cd Multinex
```

## 3. Set Up the Database

Ensure Docker is running on your system, then start PostgreSQL and run migrations:

```bash
cd app
wasp db start
wasp db migrate-dev
```

This will:
- Start a PostgreSQL container using Docker
- Apply all database migrations to set up the schema

## 4. Start Document Parser Service

In a new terminal, run:

```bash
cd doc_flow
python3.9 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

This starts the document parser service which handles:
- PDF processing
- Text extraction
- Exercise generation

## 5. Start the Application

In a new terminal, navigate back to the app directory and start the Wasp development server:

```bash
cd app
wasp start
```

The application will be available at `http://localhost:3000`.

## Verifying Installation

To verify that everything is working correctly:

1. Open your browser and navigate to `http://localhost:3000`
2. You should see the Multinex login page
3. Create an account or log in with the default credentials
4. Try uploading a document to ensure the parser service is working

## Troubleshooting Common Installation Issues

### Wasp Installation Issues

If you encounter issues installing Wasp:
- Check that you have the required prerequisites (Node.js, npm)
- Try installing manually from the [GitHub releases](https://github.com/wasp-lang/wasp/releases)

### Database Connection Errors

If you encounter database connection issues:
- Ensure Docker is running
- Check if the PostgreSQL container is running with `docker ps`
- Verify the database connection string in your `.env` file

### Document Parser Service Issues

If the document parser service fails to start:
- Ensure you have Python 3.9 installed
- Check that all dependencies are installed correctly
- Verify port 8000 is not in use by another application

### Port Conflicts

If you encounter port conflicts:
- For the main application, modify the port in `main.wasp`
- For the document parser, change the port in the uvicorn command

## Next Steps

Now that you have Multinex installed and running, you can:
- Set up your [environment variables](./envSetup.md)
- Create your first course
- Upload documents to generate exercises

For any issues not covered here, please refer to the troubleshooting section or open an issue on GitHub.
