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
  createdAt: Date;
  createdById: string;
  createdByName?: string;
}

export interface PagedTickets {
  tickets: Ticket[];
  total: number;
  statusCounts?: Record<Uncapitalize<TicketStatus>, number>;
}
