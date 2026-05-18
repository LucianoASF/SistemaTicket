export const USER_ROLE = {
  ADMIN: 'Admin',
  SUPPORT: 'Support',
  USER: 'User',
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export interface UserLogin {
  id: string;
  role: UserRole;
  name: string;
}
