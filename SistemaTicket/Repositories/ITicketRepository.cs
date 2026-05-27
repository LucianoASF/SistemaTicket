using SistemaTicket.Dtos.Ticket;
using SistemaTicket.Entities;
using SistemaTicket.Enums;

namespace SistemaTicket.Repositories;

public interface ITicketRepository
{
    Task<Ticket> CreateAsync(Ticket ticket);
    Task<Ticket?> GetByIdAsync(int id);
    Task<(List<TicketResponseDto> Tickets, int Total, int? Open, int? InProgress, int? Closed)> GetAllAsync
        (int page, string? searchQuery, TicketStatus? status, TicketPriority? priority);
    Task SaveAsync();
    void Delete(Ticket ticket);
}
