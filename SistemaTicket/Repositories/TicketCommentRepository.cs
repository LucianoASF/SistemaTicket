using Microsoft.EntityFrameworkCore;
using SistemaTicket.Data;
using SistemaTicket.Entities;

namespace SistemaTicket.Repositories;

public class TicketCommentRepository : ITicketCommentRepository
{
    private readonly AppDbContext _context;
    public TicketCommentRepository(AppDbContext context)
    {
        _context = context;
    }
    public async Task<TicketComment> CreateAsync(TicketComment ticketComment)
    {
        _context.TicketComments.Add(ticketComment);
        await _context.SaveChangesAsync();
        return ticketComment;
    }

    public async Task<List<TicketComment>> GetAllByTicketAsync(int ticketId, int page)
    {
        return await _context.TicketComments
           .AsNoTracking()
           .Where(tc => tc.TicketId == ticketId)
           .OrderByDescending(u => u.CreatedAt)
           .Skip((page - 1) * 5)
           .Take(5)
           .ToListAsync();
    }

    public async Task<TicketComment?> GetByIdAsync(int id, int ticketId)
    {
        return await _context.TicketComments
            .Where(tc => tc.TicketId == ticketId)
            .FirstOrDefaultAsync(tc => tc.Id == id);
    }
}
