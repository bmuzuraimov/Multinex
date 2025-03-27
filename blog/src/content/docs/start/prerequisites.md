---
title: Prerequisites
description: Complete guide to setting up and using our project
---

# Prerequisites

Before setting up Multinex, ensure your development environment meets the following requirements. This will ensure a smooth installation and development experience.

## System Requirements

- **Operating System**: 
  - Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+, Debian 10+, etc.)
  - WSL2 recommended for Windows users

- **Hardware**:
  - Minimum: 4GB RAM, dual-core processor
  - Recommended: 8GB+ RAM, quad-core processor

## Software Requirements

### Required Software

1. **Node.js** (v16 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

2. **npm** (v7 or higher, comes with Node.js)
   - Verify installation: `npm --version`

3. **PostgreSQL** (v13 or higher)
   - Download from [postgresql.org](https://www.postgresql.org/download/)
   - Verify installation: `psql --version`

4. **Git**
   - Download from [git-scm.com](https://git-scm.com/downloads)
   - Verify installation: `git --version`

5. **Wasp CLI** (v0.15.2 or higher)
   - Install with: `curl -sSL https://get.wasp-lang.dev/installer.sh | sh`
   - Verify installation: `wasp --version`

### Need to install

1. **Docker** and **Docker Compose**
   - Useful for containerized development
   - Download from [docker.com](https://www.docker.com/products/docker-desktop)

2. **Visual Studio Code**
   - Recommended IDE with helpful extensions
   - Download from [code.visualstudio.com](https://code.visualstudio.com/)

3. **Postman** or **Insomnia**
   - For API testing
   - Download from [postman.com](https://www.postman.com/downloads/) or [insomnia.rest](https://insomnia.rest/download)

## Account Requirements

You'll need accounts with the following services:

1. **GitHub** - For source code management
   - Sign up at [github.com](https://github.com/)

2. **Stripe** (for payment processing)
   - Sign up at [stripe.com](https://stripe.com/)

3. **AWS** (for S3 file storage)
   - Sign up at [aws.amazon.com](https://aws.amazon.com/)

4. **Google Cloud Platform** (for OAuth authentication)
   - Sign up at [cloud.google.com](https://cloud.google.com/)

## Knowledge Prerequisites

While not strictly required, familiarity with the following technologies will be helpful:

- **JavaScript/TypeScript** - Core programming languages
- **React** - Frontend framework
- **Node.js** - Backend runtime
- **Prisma** - ORM for database access
- **PostgreSQL** - SQL database
- **Wasp** - Full-stack framework

## Verifying Prerequisites

Run the following command to verify that your system meets all requirements:
```bash
npx @multinex/check-prereqs
```

This will check for all required software versions and provide guidance if anything is missing.

## Troubleshooting

### Node.js Version Issues

If you need to manage multiple Node.js versions, consider using:
- [nvm](https://github.com/nvm-sh/nvm) (for macOS/Linux)
- [nvm-windows](https://github.com/coreybutler/nvm-windows) (for Windows)

### PostgreSQL Connection Issues

- Ensure PostgreSQL service is running:
  - Windows: Check Services app
  - macOS: `brew services list`
  - Linux: `sudo systemctl status postgresql`

- Default port is 5432; ensure it's not blocked by firewall

### Wasp CLI Installation Issues

If the curl installer doesn't work, try:
- Manual installation from [GitHub releases](https://github.com/wasp-lang/wasp/releases)
- Building from source following the [contribution guide](https://github.com/wasp-lang/wasp/blob/main/CONTRIBUTING.md)

## Next Steps

Once you've confirmed all prerequisites are met, proceed to the [Installation](./installation.md) guide.
