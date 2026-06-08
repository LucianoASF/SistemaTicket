import type { TicketPriority, TicketStatus } from './ticket';

export interface TicketHistory {
  id: number;
  oldStatus?: TicketStatus;
  newStatus?: TicketStatus;
  oldAssignedToId?: string;
  newAssignedToId?: string;
  oldAssignedUserName?: string;
  newAssignedUserName?: string;
  oldPriority?: TicketPriority;
  newPriority?: TicketPriority;
  changedAt: string;
  changedById: string;
  ticketId: number;
  changedByName: string;
}
