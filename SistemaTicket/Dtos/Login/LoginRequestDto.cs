using System.ComponentModel.DataAnnotations;

namespace SistemaTicket.Dtos.Login;

public class LoginRequestDto
{
    [Required(ErrorMessage = "O email é obrigatório.")]
    [EmailAddress(ErrorMessage = "O email informado é inválido.")]
    [StringLength(256, ErrorMessage = "O email deve ter no máximo 256 caracteres.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "A senha é obrigatória.")]
    [StringLength(60, MinimumLength = 6, ErrorMessage = "A senha deve ter entre 6 e 60 caracteres.")]
    public string Password { get; set; } = string.Empty;
}