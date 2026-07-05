import { useEffect } from 'react';
import { useAuth } from '../contexts/useAuth';
import { api } from './axios';
import { toast } from 'sonner';

interface AxiosInterceptorProps {
  children: React.ReactNode;
}

export function AxiosInterceptor({ children }: AxiosInterceptorProps) {
  console.log('aaaaaaaaaaaaaaaaaaaaaaaa');
  const { setUser } = useAuth();

  useEffect(() => {
    const interceptorId = api.interceptors.response.use(
      (res) => res,
      (error) => {
        if (error.config.url === '/auth/me' && error.response?.status === 401) {
          setUser(null);
        } else if (error.response?.status === 401) {
          setUser(null);
          toast.error(error.response?.data?.message || 'Erro inesperado', {
            position: 'top-right',
          });
        } else if (
          !(
            (error.response?.status === 403 ||
              error.response?.status === 404) &&
            error.config.skip403And404Toast
          )
        ) {
          toast.error(error.response?.data?.message || 'Erro inesperado', {
            position: 'top-right',
          });
        }

        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.response.eject(interceptorId);
    };
  }, [setUser]);

  return children;
}
