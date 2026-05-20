import axios from 'axios';
import { toast } from 'sonner';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (
      error.response?.status === 401 &&
      window.location.pathname !== '/login'
    ) {
      const message = error.response?.data?.message || 'Erro inesperado';

      toast.error(message, { position: 'top-right' });

      return Promise.reject();
    }
  },
);
