import type { UserRole } from './role';
import type { StatusCounts, Ticket } from './ticket';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export interface UserWithTickets {
  user: User;
  createdTickets: Ticket[];
  assignedTickets: Ticket[];
  createdTicketsStatusCounts: StatusCounts;
  assignedTicketsStatusCounts: StatusCounts;
  createdTicketsCount: number;
  assignedTicketsCount: number;
}

export interface PagedUsers {
  users: User[];
  total: number;
  roleCounts: Record<Uncapitalize<UserRole>, number>;
}
