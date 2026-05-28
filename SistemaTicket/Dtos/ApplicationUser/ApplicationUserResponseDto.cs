using SistemaTicket.Dtos.Ticket;
using SistemaTicket.Enums;

namespace SistemaTicket.Dtos.ApplicationUser;

public class ApplicationUserResponseDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTimeOffset CreatedAt { get; set; }
    public UserRole Role { get; set; }
    public bool IsActive { get; set; }
    public List<TicketResponseDto>? CreatedTickets { get; set; }
    public List<TicketResponseDto>? AssignedTickets { get; set; }
}
