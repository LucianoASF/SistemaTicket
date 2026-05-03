using SistemaTicket.Dtos.Ticket;

namespace SistemaTicket.Services;

public interface ITicketService
{
    Task<TicketResponseDto> CreateAsync(TicketCreateDto ticketCreateDto, string userId, bool isUser);
    Task<List<TicketResponseDto>> GetAllAsync(int page);
    Task<TicketResponseDto> GetByIdAsync(int id, string userId, bool isUser);
    Task<TicketResponseDto> UpdateAsync(int id, string userId, bool isUser, TicketUpdateDto ticketUpdateDto);
}
