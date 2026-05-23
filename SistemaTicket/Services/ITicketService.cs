using SistemaTicket.Dtos.Ticket;
using SistemaTicket.Enums;

namespace SistemaTicket.Services;

public interface ITicketService
{
    Task<TicketResponseDto> CreateAsync(TicketCreateDto ticketCreateDto, string userId, bool isUser);
    Task<PagedTicketsResponseDto> GetAllAsync(int page, string? searchQuery,
            TicketStatus? status, TicketPriority? priority, bool? withAuthor);
    Task<TicketResponseDto> GetByIdAsync(int id, string userId, bool isUser);
    Task<TicketResponseDto> UpdateAsync(int id, string userId, bool isUser, TicketUpdateDto ticketUpdateDto);
    Task DeleteAsync(int id, string userId, bool isUser);
}
