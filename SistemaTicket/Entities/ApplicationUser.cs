using Microsoft.AspNetCore.Identity;
using SistemaTicket.Enums;
using System.ComponentModel.DataAnnotations;

namespace SistemaTicket.Entities;

public class ApplicationUser : IdentityUser
{
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    public DateTimeOffset CreatedAt { get; set; }
    public UserRole Role { get; set; }
    public bool IsActive { get; set; } = true;
    public List<Ticket> CreatedTickets { get; set; } = [];
    public List<Ticket> AssignedTickets { get; set; } = [];

}

