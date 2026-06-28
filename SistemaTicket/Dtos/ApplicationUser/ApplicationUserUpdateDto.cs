using SistemaTicket.Enums;
using System.ComponentModel.DataAnnotations;

namespace SistemaTicket.Dtos.ApplicationUser;

public class ApplicationUserUpdateDto
{
    [Required(ErrorMessage = "O nome é obrigatório.")]
    [StringLength(100, MinimumLength = 5, ErrorMessage = "O nome deve ter entre 5 e 100 caracteres.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "O email é obrigatório.")]
    [EmailAddress(ErrorMessage = "O email informado é inválido.")]
    [StringLength(256, ErrorMessage = "O email deve ter no máximo 256 caracteres.")]
    public string Email { get; set; } = string.Empty;

    [StringLength(60, MinimumLength = 6, ErrorMessage = "A senha deve ter entre 6 e 60 caracteres.")]
    public string? Password { get; set; }

    [EnumDataType(typeof(UserRole), ErrorMessage = "O cargo informado é inválido.")]
    public UserRole Role { get; set; }
}