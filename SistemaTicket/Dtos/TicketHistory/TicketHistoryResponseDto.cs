using SistemaTicket.Enums;

namespace SistemaTicket.Dtos.TicketHistory;

public class TicketHistoryResponseDto
{
    public int Id { get; set; }
    public TicketStatus? OldStatus { get; set; }
    public TicketStatus? NewStatus { get; set; }
    public TicketPriority? OldPriority { get; set; }
    public TicketPriority? NewPriority { get; set; }
    public string? OldAssignedToId { get; set; }
    public string? NewAssignedToId { get; set; }
    public string? OldAssignedUserName { get; set; }
    public string? NewAssignedUserName { get; set; }
    public DateTimeOffset ChangedAt { get; set; }
    public string ChangedById { get; set; } = string.Empty;
    public string ChangedByName { get; set; } = string.Empty;
    public int TicketId { get; set; }
}
