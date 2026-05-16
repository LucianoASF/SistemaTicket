using SistemaTicket.Enums;
using System.ComponentModel.DataAnnotations;

namespace SistemaTicket.Dtos.ApplicationUser;

public class ApplicationUserUpdateDto
{
    [Required]
    [StringLength(100, MinimumLength = 5)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(256)]
    public string Email { get; set; } = string.Empty;

    [StringLength(60, MinimumLength = 6)]
    public string? Password { get; set; }

    [EnumDataType(typeof(UserRole), ErrorMessage = "Invalid role.")]
    public UserRole? Role { get; set; }

}
