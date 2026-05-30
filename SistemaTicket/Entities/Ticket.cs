using SistemaTicket.Enums;
using System.ComponentModel.DataAnnotations;

namespace SistemaTicket.Entities;

public class Ticket
{
    public int Id { get; set; }
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public TicketStatus Status { get; set; }
    public TicketPriority Priority { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public string CreatedById { get; set; } = string.Empty;
    public ApplicationUser CreatedBy { get; set; } = null!;
    public string? AssignedToId { get; set; }
    public ApplicationUser? AssignedTo { get; set; }
    public List<TicketComment> TicketComments { get; set; } = [];
    public List<TicketHistory> TicketHistories { get; set; } = [];
}
