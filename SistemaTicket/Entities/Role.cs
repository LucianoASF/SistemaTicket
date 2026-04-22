using System.ComponentModel.DataAnnotations;

namespace SistemaTicket.Entities;

public class Role
{
    public int Id { get; set; }

    [Required]
    [StringLength(50, MinimumLength = 3)]
    public string Name { get; set; } = null!;
    public List<User> Users { get; set; } = new();
}
