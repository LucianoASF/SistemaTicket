using Microsoft.AspNetCore.Identity;
using SistemaTicket.Enums;
using System.ComponentModel.DataAnnotations;

namespace SistemaTicket.Entities;

public class ApplicationUser : IdentityUser
{

    [Required]
    [StringLength(100, MinimumLength = 5)]
    public string Name { get; set; } = string.Empty;
    public DateTimeOffset CreatedAt { get; set; }
    public UserRole Role { get; set; }
    public bool IsActive { get; set; } = true;
    public List<Ticket> CreatedTickets { get; set; } = [];
    public List<Ticket> AssignedTickets { get; set; } = [];


    //public List<TicketComment> TicketComments { get; set; } = new(); Já tem na Fluent API
    //public List<TicketHistory> TicketHistories { get; set; } = new(); Já tem na Fluent API

}

