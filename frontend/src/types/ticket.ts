import type { TicketComment } from './TicketComment';
import type { TicketHistory } from './ticketHistory';

export const TICKET_STATUS = {
  OPEN: 'Open',
  INPROGRESS: 'InProgress',
  CLOSED: 'Closed',
} as const;

export type TicketStatus = (typeof TICKET_STATUS)[keyof typeof TICKET_STATUS];

export const TICKET_PRIORITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
} as const;

export type TicketPriority =
  (typeof TICKET_PRIORITY)[keyof typeof TICKET_PRIORITY];

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  createdById: string;
  createdByName: string;
  assignedToId?: string;
  assignedToName?: string;
}

export interface PagedTickets {
  tickets: Ticket[];
  total: number;
  statusCounts: StatusCounts;
}

export type StatusCounts = Record<Uncapitalize<TicketStatus>, number>;

export interface TicketDetails {
  ticket: Ticket;
  ticketComments: TicketComment[];
  ticketHistories: TicketHistory[];
}
