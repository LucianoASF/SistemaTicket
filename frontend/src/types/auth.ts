import type { UserRole } from './role';

export interface UserLogin {
  id: string;
  role: UserRole;
  name: string;
  email: string;
}
