using SistemaTicket.Enums;

namespace SistemaTicket.Dtos.ApplicationUser;

public class ApplicationUserResponseDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public UserRole Role { get; set; }
}
