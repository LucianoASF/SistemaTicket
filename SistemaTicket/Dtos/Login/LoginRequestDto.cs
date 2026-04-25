using System.ComponentModel.DataAnnotations;

namespace SistemaTicket.Dtos.Login;

public class LoginRequestDto
{
    [Required]
    [EmailAddress]
    [StringLength(256)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(60, MinimumLength = 6)]
    public string Password { get; set; } = string.Empty;
}
