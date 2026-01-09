# 📂 HackMate Project Structure

HackMate is built as a **TypeScript Monorepo** using [Turborepo](https://turbo.build/).

## 🌳 High-Level Overview

```
hackmate/
├── apps/               # Deployable applications
│   ├── api/            # Fastify Backend (REST + WebSocket)
│   └── cli/            # Node.js CLI Client (Ink/React)
│
├── packages/           # Shared libraries
│   ├── db/             # Mongoose Models & Database Logic
│   ├── shared/         # Shared Types, Zod Schemas, Utils
│   └── tsconfig/       # Shared TypeScript Configurations
│
├── scripts/            # Automation & Verification Scripts
└── docs/               # Project Documentation
```

## 📦 Packages Details

### `apps/api`
The backend core.
- **`src/app.ts`**: Main entry point.
- **`src/modules/`**: Feature modules (`auth`, `profile`, `match`, `chat`).
- **`src/plugins/`**: Fastify plugins (`jwt`, `redis`, `socket`, `mongodb`).

### `apps/cli`
The terminal user interface.
- **`src/cli.tsx`**: Entry point, command registration (Commander).
- **`src/commands/`**: React/Ink components for each screen (`Login`, `Chat`, `Discover`).
- **`src/flags.ts`**: Command-line argument parsing.

### `packages/db`
Database abstraction layer.
- **`src/models/`**: Mongoose schemas (`User`, `Profile`, `Message`).
- **`src/index.ts`**: Exports connection logic and models.

### `packages/shared`
Single source of truth for types.
- Used by both API and CLI to ensure type safety across the network.

## 🛠️ Key Technologies

- **Monorepo**: Turborepo + pnpm workspaces
- **Language**: TypeScript (Strict)
- **Backend**: Fastify, Socket.io, MongoDB, Redis (Upstash)
- **CLI**: Ink (React for Terminal), Commander.js
