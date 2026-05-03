using SistemaTicket.Dtos.Ticket;

namespace SistemaTicket.Services;

public interface ITicketService
{
    Task<TicketResponseDto> Create(TicketCreateDto ticketCreateDto, string userId, bool isUser);
    Task<List<TicketResponseDto>> GetAll(int page);
}
