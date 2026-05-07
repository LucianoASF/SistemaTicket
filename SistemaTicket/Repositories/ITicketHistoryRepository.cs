using SistemaTicket.Entities;

namespace SistemaTicket.Repositories;

public interface ITicketHistoryRepository
{
    Task CreateAsync(TicketHistory ticketHistory);
    Task<List<TicketHistory>> GetAllByTicketIdAsync(int ticketId, int page);
}
