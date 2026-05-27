import type { UserRole } from './role';
import type { Ticket } from './ticket';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: Date;
  createdTickets?: Ticket[];
  assignedTickets?: Ticket[];
}

export interface PagedUsers {
  users: User[];
  total: number;
  roleCounts: Record<Uncapitalize<UserRole>, number>;
}
