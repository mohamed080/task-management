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

## Manual API Test Flow

Register a user:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

Login and copy the returned token:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

Create a task:

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d "{\"title\":\"Finish assessment\",\"description\":\"Complete backend and frontend\",\"status\":\"todo\",\"priority\":\"high\",\"dueDate\":\"2026-08-30\"}"
```

List tasks with search, filters, and pagination:

```bash
curl "http://localhost:5000/api/tasks?search=assessment&status=todo&priority=high&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Update a task:

```bash
curl -X PATCH http://localhost:5000/api/tasks/TASK_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d "{\"status\":\"done\"}"
```

Delete a task:

```bash
curl -X DELETE http://localhost:5000/api/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected error cases to test:

- Missing token returns `401`
- Invalid task ID returns `400`
- Missing required task fields return `400`
- Duplicate email registration returns `409`
- Requesting another user's task returns `404`
- Invalid `page` or `limit` query values return `400`

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
- Responsive frontend task workspace
- Client-side Zod validation
- Framer Motion transitions and accessible modal controls

## Bonus Features

- TypeScript
- Pagination

## Known Limitations

- Automated API tests are not included yet; the API can be tested manually with the curl flow above.
- No live deployment URL is available yet.
- Docker support is not included.

## Useful Commands

Backend:

```bash
pnpm --dir server typecheck
pnpm --dir server lint
pnpm --dir server build
```

Frontend:

```bash
pnpm --dir client typecheck
pnpm --dir client lint
pnpm --dir client build
```
