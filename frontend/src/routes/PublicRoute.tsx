import { Navigate, Outlet, useLocation } from 'react-router';
import { LoaidingAuth } from '#components/LoadingAuth';
import { useAuth } from '../contexts/useAuth';

export function PublicRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  if (loading) {
    return <LoaidingAuth />;
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
}
