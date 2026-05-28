using SistemaTicket.Dtos.Ticket;

namespace SistemaTicket.Dtos.ApplicationUser;

public class ApplicationUserWithTicketsResponseDto
{
    public ApplicationUserResponseDto User { get; set; } = new ApplicationUserResponseDto();
    public List<TicketResponseDto> CreatedTickets { get; set; } = [];
    public List<TicketResponseDto> AssignedTickets { get; set; } = [];
    public StatusCountsDto CreatedTicketsStatusCounts { get; set; } = new StatusCountsDto();
    public StatusCountsDto AssignedTicketsStatusCounts { get; set; } = new StatusCountsDto();
    public int CreatedTicketsCount { get; set; }
    public int AssignedTicketsCount { get; set; }
}
