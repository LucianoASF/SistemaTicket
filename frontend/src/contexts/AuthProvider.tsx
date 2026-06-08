import { useEffect, useState } from 'react';
import type { UserLogin } from '../types/auth';
import { api } from '../axios/axios';
import { AuthContext } from './AuthContext';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserLogin | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadUser() {
    try {
      const response = await api.get('/auth/me');

      setUser(response.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    try {
      await api.post('/auth/login', { email, password });
      await loadUser();
    } catch {
      return;
    }
  }

  async function logout() {
    try {
      await api.post('/auth/logout');
      setUser(null);
    } catch {
      return;
    }
  }

  useEffect(() => {
    const fetch = async () => {
      await loadUser();
    };
    fetch();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
