using SistemaTicket.Entities;
using SistemaTicket.Enums;

namespace SistemaTicket.Repositories;

public interface ITicketRepository
{
    Task<Ticket> CreateAsync(Ticket ticket);
    Task<Ticket?> GetByIdAsync(int id);
    Task<(List<Ticket> Tickets, int Total)> GetAllAsync(int page, string? searchQuery, TicketStatus? status, TicketPriority? priority);
    Task SaveAsync();
    void Delete(Ticket ticket);
}
