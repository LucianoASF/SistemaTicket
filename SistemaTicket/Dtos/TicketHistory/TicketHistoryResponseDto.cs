using SistemaTicket.Enums;

namespace SistemaTicket.Dtos.TicketHistory;

public class TicketHistoryResponseDto
{
    public int Id { get; set; }
    public TicketStatus OldStatus { get; set; }
    public TicketStatus NewStatus { get; set; }
    public DateTimeOffset ChangedAt { get; set; }
    public string ChangedById { get; set; } = string.Empty;
    public int TicketId { get; set; }
}
