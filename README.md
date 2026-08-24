# Task Management App

A MERN stack task management application with a TypeScript Express API, MongoDB persistence, JWT authentication, and per-user task access.

## Tech Stack

- MongoDB
- Express.js
- React.js
- Node.js
- TypeScript
- Mongoose
- Zod
- JWT
- bcrypt
- TanStack Query
- Zustand
- Framer Motion
- Tailwind CSS
- Lucide React

## Test Account

A test account is not required. The reviewer can create an account
using the registration flow.

## Project Structure

```text
task-management/
  client/   React frontend
  server/   Express API, MongoDB models, routes, services, validators
```

Backend structure:

```text
server/src/
  config/       Database connection
  controllers/  Request handlers
  errors/       Application error classes and codes
  middleware/   Auth, rate limiting, and error handling
  models/       Mongoose models
  routes/       API route definitions
  services/     Business logic and database queries
  types/        Shared TypeScript request types
  utils/        JWT and pagination helpers
  validators/   Zod request schemas
```

Frontend structure:

```text
client/src/
  api/                  HTTP and API modules
  components/ui/        Shared form and state components
  features/auth/        Auth pages, store, hook, schemas, and routes
  features/tasks/       Task page, queries, schemas, and components
  lib/                  Router and React Query client
  utils/                Shared formatting helpers
```

## Prerequisites

- Node.js
- pnpm
- MongoDB database, local or hosted

## Environment Variables

Copy the backend example file:

```bash
cp server/.env.example server/.env
```

Fill in:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-management
JWT_SECRET=replace-with-a-secure-secret
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Do not commit `server/.env`. It is ignored by git.

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

`CLIENT_URL` must match the browser origin used by Vite. The default is
`http://localhost:5173`; if Vite starts on `http://localhost:5174`, update
`CLIENT_URL` to that value and restart the server.

## Setup

Install dependencies from the repository root:

```bash
pnpm install
```

Run the backend:

```bash
pnpm --dir server dev
```

Run the frontend:

```bash
pnpm --dir client dev
```

Backend health check:

```bash
curl http://localhost:5000/api/health
```

## Main API Endpoints

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

Tasks:

- `POST /api/tasks`
- `GET /api/tasks`
- `GET /api/tasks/:id`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`

Task status values:

- `todo`
- `in_progress`
- `done`

Task priority values:

- `low`
- `medium`
- `high`

The frontend can display these as `To Do`, `In Progress`, `Done`, `Low`, `Medium`, and `High`.

## Implemented Features

- User registration and login
- Password hashing with bcrypt
- JWT creation and verification
- Protected API endpoints
- Per-user task isolation
- Task create, read, update, and delete
- Task validation with Zod
- Search tasks by title
- Filter tasks by status and priority
- Pagination
- Central error handling
- Rate limiting
- `.env.example` without secrets
- Automated API integration tests with an isolated in-memory MongoDB
- Responsive frontend task workspace
- Client-side Zod validation
- Framer Motion transitions and accessible modal controls

## Bonus Features

- TypeScript
- Pagination
- Automated API integration tests
- Live deployment (frontend)

## Deployment

- Frontend: https://task-management-client-rosy.vercel.app
- Backend: https://server-eta-two-14.vercel.app
- Backend Health Check: https://server-eta-two-14.vercel.app/api/health

## Known Limitations

- Production backend is currently experiencing a MongoDB connection issue.
- Docker support is not included.

## Useful Commands

Backend:

```bash
pnpm --dir server typecheck
pnpm --dir server lint
pnpm --dir server build
pnpm --dir server test
```

The API tests use `supertest`, Vitest, and `mongodb-memory-server`. The first test run downloads a MongoDB binary; no running API server or local MongoDB instance is required.

Frontend:

```bash
pnpm --dir client typecheck
pnpm --dir client lint
pnpm --dir client build
```
