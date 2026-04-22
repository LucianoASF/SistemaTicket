using SistemaTicket.Enums;
using System.ComponentModel.DataAnnotations;

namespace SistemaTicket.Entities;

public class Ticket
{
    public int Id { get; set; }

    [Required]
    [StringLength(200, MinimumLength = 5)]
    public string Title { get; set; } = null!;

    [Required]
    public string Description { get; set; } = null!;
    public TicketStatus Status { get; set; }
    public TicketPriority Priority { get; set; }
    public DateTime CreatedAt { get; set; }
    public int CreatedById { get; set; }
    public User CreatedBy { get; set; } = new();
    public List<TicketComment> TicketComments { get; set; } = new();
    public List<TicketHistory> TicketHistory { get; set; } = new();
}
