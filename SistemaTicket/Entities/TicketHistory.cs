using SistemaTicket.Enums;

namespace SistemaTicket.Entities;

public class TicketHistory
{
    public int Id { get; set; }
    public TicketStatus OldStatus { get; set; }
    public TicketStatus NewStatus { get; set; }
    public DateTime ChangeAt { get; set; }
    public int ChangeById { get; set; }
    public int TicketId { get; set; }
    public User ChangeBy { get; set; } = new();
    public Ticket Ticket { get; set; } = null!;

}
