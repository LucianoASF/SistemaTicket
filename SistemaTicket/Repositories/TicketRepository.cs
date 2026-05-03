using Microsoft.EntityFrameworkCore;
using SistemaTicket.Data;
using SistemaTicket.Entities;
namespace SistemaTicket.Repositories;

public class TicketRepository : ITicketRepository
{

    private readonly AppDbContext _context;

    public TicketRepository(AppDbContext context)
    {
        _context = context;
    }
    public async Task<Ticket> Create(Ticket ticket)
    {
        _context.Tickets.Add(ticket);
        await _context.SaveChangesAsync();
        return ticket;
    }

    public async Task<List<Ticket>> GetAll(int page)
    {
        return await _context.Tickets
            .AsNoTracking()
            .OrderByDescending(u => u.CreatedAt)
            .Skip((page - 1) * 10)
            .Take(30)
            .ToListAsync();
    }

    public Task<Ticket> GetById(int id)
    {
        throw new NotImplementedException();
    }

    public Task Update(Ticket ticket)
    {
        throw new NotImplementedException();
    }
    public Task Delete(int id)
    {
        throw new NotImplementedException();
    }

}
