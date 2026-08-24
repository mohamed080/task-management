# Task Management Client

The frontend for the Task Management application. It is a React 19 + TypeScript + Vite app with React Router, TanStack Query, Zustand, Zod, Framer Motion, Tailwind CSS, and Lucide icons.

## Setup

From the repository root:

```bash
pnpm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the development server:

```bash
pnpm --dir client dev
```

The client is normally available at `http://localhost:5173` or the next available Vite port.

## Features

- Login and registration with persisted JWT sessions
- Protected task workspace with logout
- Task creation and editing with client-side Zod validation
- Task deletion with confirmation
- Search, status and priority filters
- Server-backed pagination
- Loading, error, empty, and background-fetch states
- Responsive layout with Framer Motion transitions
- Keyboard-friendly modal controls and reduced-motion support

## Feature Structure

```text
src/
  api/                  HTTP and API modules
  components/ui/        Shared form and state components
  features/
    auth/               Auth pages, store, hook, schemas, and routes
    tasks/              Task types, queries, schemas, and page orchestration
      components/       Task form, card, filters, and pagination
  lib/                  Router and React Query client
  utils/                Shared formatting helpers
```

## Scripts

```bash
pnpm --dir client dev        # Start Vite development server
pnpm --dir client typecheck  # Run TypeScript checks
pnpm --dir client lint       # Run ESLint
pnpm --dir client build      # Create a production build
pnpm --dir client preview    # Preview the production build
```

The API server must be running separately for authentication and task requests. See the root README for backend setup and API details.
