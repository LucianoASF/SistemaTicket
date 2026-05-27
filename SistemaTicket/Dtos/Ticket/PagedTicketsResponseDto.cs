namespace SistemaTicket.Dtos.Ticket;

public class PagedTicketsResponseDto
{
    public List<TicketResponseDto> Tickets { get; set; } = [];
    public int Total { get; set; }
    public StatusCountsDto? StatusCounts { get; set; }
}

public class StatusCountsDto
{
    public int Open { get; set; }
    public int InProgress { get; set; }
    public int Closed { get; set; }
}