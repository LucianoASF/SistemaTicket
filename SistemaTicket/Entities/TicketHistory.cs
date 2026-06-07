using SistemaTicket.Enums;

namespace SistemaTicket.Entities;

public class TicketHistory
{
    public int Id { get; set; }
    public TicketStatus? OldStatus { get; set; }
    public TicketStatus? NewStatus { get; set; }
    public TicketPriority? OldPriority { get; set; }
    public TicketPriority? NewPriority { get; set; }
    public string? OldAssignedToId { get; set; }
    public string? NewAssignedToId { get; set; }
    public DateTimeOffset ChangedAt { get; set; }
    public string ChangedById { get; set; } = string.Empty;
    public int TicketId { get; set; }
    public ApplicationUser? OldAssignedUser { get; set; }
    public ApplicationUser? NewAssignedUser { get; set; }
    public ApplicationUser ChangedBy { get; set; } = null!;
    public Ticket Ticket { get; set; } = null!;

}
