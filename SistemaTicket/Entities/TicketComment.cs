namespace SistemaTicket.Entities;

public class TicketComment
{
    public int Id { get; set; }
    public string Message { get; set; } = string.Empty;
    public DateTimeOffset CreatedAt { get; set; }
    public int TicketId { get; set; }
    public string UserId { get; set; } = string.Empty;
    public Ticket Ticket { get; set; } = null!;
    public ApplicationUser User { get; set; } = null!;


}
