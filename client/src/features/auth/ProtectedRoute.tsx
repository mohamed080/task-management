import { Navigate, useLocation } from "react-router-dom";

import { useAuthStore } from "./auth.store";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate state={{ from: location }} to="/login" replace />;
  }

  return children;
}

export function GuestRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/tasks" replace />;
  }

  return children;
}
