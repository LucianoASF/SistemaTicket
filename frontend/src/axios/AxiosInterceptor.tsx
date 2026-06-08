import { useAuth } from '../contexts/useAuth';
import { api } from './axios';
import { toast } from 'sonner';

interface AxiosInterceptorProps {
  children: React.ReactNode;
}

export function AxiosInterceptor({ children }: AxiosInterceptorProps) {
  const { setUser } = useAuth();

  api.interceptors.response.use(
    (res) => res,
    (error) => {
      if (error.config.url === '/auth/me' && error.response?.status === 401) {
        setUser(null);
      } else if (error.response?.status === 401) {
        setUser(null);
        toast.error(error.response?.data?.message || 'Erro inesperado', {
          position: 'top-right',
        });
      } else {
        const message = error.response?.data?.message || 'Erro inesperado';
        toast.error(message, { position: 'top-right' });
      }
      return Promise.reject(error);
    },
  );

  return children;
}
