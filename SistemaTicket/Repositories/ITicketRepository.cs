using SistemaTicket.Dtos.Ticket;
using SistemaTicket.Entities;
using SistemaTicket.Enums;

namespace SistemaTicket.Repositories;

public interface ITicketRepository
{
    Task<Ticket> CreateAsync(Ticket ticket);
    Task<Ticket?> GetByIdAsync(int id);
    Task<(List<TicketResponseDto> Tickets, int Total, StatusCountsDto? StatusCounts)> GetFilteredTicketsAsync
         (int page, string? searchQuery, TicketStatus? status,
         TicketPriority? priority, bool? withStatusCounts, string? createdById, string? assignedToId, string? supportId, bool createdOrAssigned = false, bool isSupport = false);
    Task SaveAsync();
    void Delete(Ticket ticket);
    Task<TicketDetailsResponseDto?> GetDetailsByIdAsync(int id);
}
