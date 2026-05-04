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
}
