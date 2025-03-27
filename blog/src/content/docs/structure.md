---
title: Project Structure
description: Overview of the project structure
---

# Project Structure

```bash
app/
├── .wasp/              # Generated Wasp files
├── public/             # Static assets
├── src/
│   ├── client/         # Frontend React code
│   │   ├── app/        # Main application pages
│   │   ├── auth/       # Authentication components
│   │   ├── components/ # Reusable UI components
│   │   ├── contexts/   # React contexts
│   │   └── hooks/      # Custom React hooks
│   └── server/         # Backend Node.js code
│       ├── actions/    # Server actions (mutations)
│       ├── auth/       # Authentication logic
│       ├── queries/    # Data fetching logic
│       └── webhooks/   # External service webhooks
├── main.wasp           # Wasp configuration file
├── schema.prisma       # Database schema
└── tailwind.config.js  # Tailwind CSS configuration
```
