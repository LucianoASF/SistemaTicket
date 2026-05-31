using SistemaTicket.Dtos.TicketComment;
using SistemaTicket.Dtos.TicketHistory;

namespace SistemaTicket.Dtos.Ticket;

public class TicketDetailsResponseDto
{
    public TicketResponseDto Ticket { get; set; } = new();
    public List<TicketHistoryResponseDto> TicketHistories { get; set; } = [];
    public List<TicketCommentResponseDto> TicketComments { get; set; } = [];
}
