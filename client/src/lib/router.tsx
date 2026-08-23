import { createBrowserRouter, Navigate } from 'react-router-dom'

import { LoginPage } from '../features/auth/LoginPage'
import { GuestRoute, ProtectedRoute } from '../features/auth/ProtectedRoute'
import { RegisterPage } from '../features/auth/RegisterPage'
import { TasksPage } from '../features/tasks/TasksPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/tasks" replace />,
  },
  {
    path: '/login',
    element: (
      <GuestRoute>
        <LoginPage />
      </GuestRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <GuestRoute>
        <RegisterPage />
      </GuestRoute>
    ),
  },
  {
    path: '/tasks',
    element: (
      <ProtectedRoute>
        <TasksPage />
      </ProtectedRoute>
    ),
  },
])
