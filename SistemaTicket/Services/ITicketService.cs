using SistemaTicket.Dtos.Ticket;
using SistemaTicket.Enums;

namespace SistemaTicket.Services;

public interface ITicketService
{
    Task<TicketResponseDto> CreateAsync(TicketCreateDto ticketCreateDto, string userId, UserRole role);
    Task<PagedTicketsResponseDto> GetFilteredTicketsAsync(string userId, UserRole role, int page, string? searchQueryTickets,
        string? searchQueryUsers, TicketStatus? status, TicketPriority? priority, bool? withStatusCounts, string? createdById, string? assignedToId);
    Task<TicketDetailsResponseDto> UpdateAsync(int id, string userId, UserRole role, TicketUpdateDto ticketUpdateDto);
    Task DeleteAsync(int id, string userId, UserRole role);
    Task<TicketDetailsResponseDto> GetDetailsByIdAsync(int id, string userId, UserRole role);
}
