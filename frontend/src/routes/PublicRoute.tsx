import { Navigate, Outlet, useLocation } from 'react-router';
import { LoadingAuth } from '#components/loadings/LoadingAuth';
import { useAuth } from '../contexts/useAuth';

export function PublicRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  if (loading) {
    return <LoadingAuth />;
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
}
