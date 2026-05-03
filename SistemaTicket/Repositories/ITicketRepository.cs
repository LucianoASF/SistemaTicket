using SistemaTicket.Entities;

namespace SistemaTicket.Repositories;

public interface ITicketRepository
{
    Task<Ticket> CreateAsync(Ticket ticket);
    Task<Ticket?> GetByIdAsync(int id);
    Task<List<Ticket>> GetAllAsync(int page);
    Task SaveAsync();
    Task DeleteAsync(int id);
}
