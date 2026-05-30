using SistemaTicket.Enums;

namespace SistemaTicket.Entities;

public class TicketHistory
{
    public int Id { get; set; }
    public TicketStatus OldStatus { get; set; }
    public TicketStatus NewStatus { get; set; }
    public DateTimeOffset ChangedAt { get; set; }
    public string ChangedById { get; set; } = string.Empty;
    public int TicketId { get; set; }
    public ApplicationUser? ChangeBy { get; set; }
    public Ticket? Ticket { get; set; }

}
