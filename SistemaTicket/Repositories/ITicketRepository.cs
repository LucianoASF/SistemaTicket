using SistemaTicket.Entities;

namespace SistemaTicket.Repositories;

public interface ITicketRepository
{
    Task<Ticket> Create(Ticket ticket);
    Task<Ticket> GetById(int id);
    Task<List<Ticket>> GetAll(int page);
    Task Update(Ticket ticket);
    Task Delete(int id);
}
