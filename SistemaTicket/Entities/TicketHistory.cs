using SistemaTicket.Enums;

namespace SistemaTicket.Entities;

public class TicketHistory
{
    public int Id { get; set; }
    public TicketStatus OldStatus { get; set; }
    public TicketStatus NewStatus { get; set; }
    public DateTime ChangeAt { get; set; }
    public string ChangeById { get; set; } = null!;
    public int TicketId { get; set; }
    public ApplicationUser ChangeBy { get; set; } = new();
    public Ticket Ticket { get; set; } = null!;

}
