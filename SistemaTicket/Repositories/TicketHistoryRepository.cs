using SistemaTicket.Data;
using SistemaTicket.Entities;

namespace SistemaTicket.Repositories;

public class TicketHistoryRepository : ITicketHistoryRepository

{
    private readonly AppDbContext _context;

    public TicketHistoryRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task CreateAsync(TicketHistory ticketHistory)
    {
        _context.TicketHistories.Add(ticketHistory);
    }
}
