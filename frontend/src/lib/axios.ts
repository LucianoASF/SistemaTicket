import axios from 'axios';
import { toast } from 'sonner';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.config.url === '/auth/me' && error.response?.status === 401)
      return Promise.reject(error);
    else if (error.response?.status === 401) {
      sessionStorage.setItem(
        'redirectAfterLogin',
        window.location.pathname + window.location.search,
      );
      sessionStorage.setItem('sessionExpired', 'true');
      window.location.replace('/login');
      const redirectTo = sessionStorage.getItem('redirectAfterLogin');
      sessionStorage.removeItem('redirectAfterLogin');

      window.location.replace(redirectTo || '/dashboard');
    } else {
      const message = error.response?.data?.message || 'Erro inesperado';
      toast.error(message, { position: 'top-right' });

      return Promise.reject(error);
    }
  },
);
