using SistemaTicket.Enums;
using System.ComponentModel.DataAnnotations;

namespace SistemaTicket.Dtos.Ticket;

public class TicketUpdateDto
{
    [Required]
    [StringLength(200, MinimumLength = 5)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MinLength(10)]
    public string Description { get; set; } = string.Empty;

    public TicketPriority? Priority { get; set; }

    public TicketStatus? Status { get; set; }
}
