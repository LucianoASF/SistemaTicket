using Microsoft.EntityFrameworkCore;
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

    public async Task<List<TicketHistory>> GetAllByTicketIdAsync(int ticketId, int page)
    {
        return await _context.TicketHistories
            .AsNoTracking()
            .Where(th => th.TicketId == ticketId)
            .OrderByDescending(th => th.ChangeAt)
            .Skip((page - 1) * 5)
            .Take(5)
            .ToListAsync();
    }
}
