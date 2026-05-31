import type { TicketPriority, TicketStatus } from './ticket';

export interface TicketHistory {
  id: number;
  oldStatus?: TicketStatus;
  newStatus?: TicketStatus;
  oldAssignedUserId?: string;
  newAssignedUserId?: string;
  oldAssignedUserName?: string;
  newAssignedUserName?: string;
  oldPriority?: TicketPriority;
  newPriority?: TicketPriority;
  changedAt: string;
  changedById: string;
  ticketId: number;
  changedByName: string;
}
