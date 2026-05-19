import { Navigate, Outlet } from 'react-router';
import { LoaidingAuth } from '#components/LoadingAuth';
import { useAuth } from '../contexts/useAuth';

export function PublicRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoaidingAuth />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
