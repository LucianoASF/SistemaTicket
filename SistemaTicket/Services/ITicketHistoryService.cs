using SistemaTicket.Dtos.TicketHistory;

namespace SistemaTicket.Services;

public interface ITicketHistoryService
{
    Task<List<TicketHistoryResponseDto>> GetAllByTicketIdAsync(int ticketId, string userId, bool isUser, int page);
    Task<TicketHistoryResponseDto> GetByIdAsync(int ticketId, int id, string userId, bool isUser);
}
