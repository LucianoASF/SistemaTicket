using SistemaTicket.Dtos.Ticket;
using SistemaTicket.Enums;

namespace SistemaTicket.Services;

public interface ITicketService
{
    Task<TicketResponseDto> CreateAsync(TicketCreateDto ticketCreateDto, string userId, UserRole role);
    Task<PagedTicketsResponseDto> GetAllAsync(int page, string? searchQuery,
            TicketStatus? status, TicketPriority? priority, bool? withStatusCounts);
    Task<TicketResponseDto> UpdateAsync(int id, string userId, UserRole role, TicketUpdateDto ticketUpdateDto);
    Task DeleteAsync(int id, string userId, UserRole role);
    Task<TicketDetailsResponseDto> GetDetailsByIdAsync(int id, string userId, UserRole role);
}
