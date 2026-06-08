import { createContext } from 'react';
import type { UserLogin } from '../types/auth';

interface AuthContextProps {
  user: UserLogin | null;
  setUser: (user: UserLogin | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextProps | null>(null);
