namespace SistemaTicket.Dtos.Ticket;

public class PagedTicketsResponseDto
{
    public List<TicketResponseDto> Tickets { get; set; } = [];
    public int Total { get; set; }
}
