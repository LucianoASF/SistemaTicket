namespace SistemaTicket.Dtos.Ticket;

public class PagedTicketsResponseDto
{
    public List<TicketResponseDto> Tickets { get; set; } = [];
    public int Total { get; set; }
    public int? Open { get; set; }
    public int? InProgress { get; set; }
    public int? Closed { get; set; }
}
