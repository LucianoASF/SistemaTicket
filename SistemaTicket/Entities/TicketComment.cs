using System.ComponentModel.DataAnnotations;

namespace SistemaTicket.Entities;

public class TicketComment
{
    public int Id { get; set; }

    [Required]
    public string Message { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public int TicketId { get; set; }
    public int UserId { get; set; }
    public Ticket Ticket { get; set; } = null!;
    public User User { get; set; } = null!;


}
