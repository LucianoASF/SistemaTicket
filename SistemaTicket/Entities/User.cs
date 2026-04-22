using System.ComponentModel.DataAnnotations;

namespace SistemaTicket.Entities;

public class User
{
    public int Id { get; set; }

    [Required]
    [StringLength(100, MinimumLength = 5)]
    public string Name { get; set; } = null!;

    [Required]
    [StringLength(150, MinimumLength = 5)]
    public string Email { get; set; } = null!;

    [Required]
    [StringLength(255, MinimumLength = 5)]
    public string Password { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public List<Ticket> Tickets { get; set; } = new();
    public List<Role> Roles { get; set; } = new();

    //public List<TicketComment> TicketComments { get; set; } = new(); Já tem na Fluent API
    //public List<TicketHistory> TicketHistories { get; set; } = new(); Já tem na Fluent API

}

