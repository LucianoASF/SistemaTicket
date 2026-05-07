using SistemaTicket.Entities;

namespace SistemaTicket.Repositories;

public interface ITicketHistoryRepository
{
    Task CreateAsync(TicketHistory ticketHistory);
}
