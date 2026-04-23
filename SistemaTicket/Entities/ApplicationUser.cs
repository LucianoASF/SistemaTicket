using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace SistemaTicket.Entities;

public class ApplicationUser : IdentityUser
{

    [Required]
    [StringLength(100, MinimumLength = 5)]
    public string Name { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public List<Ticket> Tickets { get; set; } = new();

    //public List<TicketComment> TicketComments { get; set; } = new(); Já tem na Fluent API
    //public List<TicketHistory> TicketHistories { get; set; } = new(); Já tem na Fluent API

}

