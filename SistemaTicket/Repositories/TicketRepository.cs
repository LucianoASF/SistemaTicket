using Microsoft.EntityFrameworkCore;
using SistemaTicket.Data;
using SistemaTicket.Dtos.Ticket;
using SistemaTicket.Entities;
using SistemaTicket.Enums;
namespace SistemaTicket.Repositories;

public class TicketRepository : ITicketRepository
{

    private readonly AppDbContext _context;

    public TicketRepository(AppDbContext context)
    {
        _context = context;
    }
    public async Task<Ticket> CreateAsync(Ticket ticket)
    {
        _context.Tickets.Add(ticket);
        await _context.SaveChangesAsync();
        return ticket;
    }

    public async Task<(List<TicketResponseDto> Tickets, int Total)> GetAllAsync(int page, string? searchQuery,
        TicketStatus? status, TicketPriority? priority, bool? withAuthor)
    {
        var query = _context.Tickets.AsNoTracking()
            .Where(t => (string.IsNullOrEmpty(searchQuery) || (t.Title.Contains(searchQuery) || t.Id.ToString().Contains(searchQuery)))
            && (!status.HasValue || t.Status == status.Value)
            && (!priority.HasValue || t.Priority == priority.Value));

        IQueryable<TicketResponseDto> dtoQuery;

        if (withAuthor == true)
        {
            dtoQuery = query.Select(t => new TicketResponseDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                Status = t.Status,
                Priority = t.Priority,
                CreatedAt = t.CreatedAt,
                CreatedById = t.CreatedById,
                CreatedByName = t.CreatedBy == null ? null : t.CreatedBy.Name
            });
        }
        else
        {
            dtoQuery = query.Select(t => new TicketResponseDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                Status = t.Status,
                Priority = t.Priority,
                CreatedAt = t.CreatedAt
            });
        }


        var total = await query.CountAsync();

        var tickets = await dtoQuery
            .OrderByDescending(t => t.CreatedAt)
            .Skip((page - 1) * 5)
            .Take(5)
            .ToListAsync();

        return (tickets, total);
    }

    public async Task<Ticket?> GetByIdAsync(int id)
    {
        return await _context.Tickets.FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task SaveAsync()
    {
        await _context.SaveChangesAsync();
    }
    public void Delete(Ticket ticket)
    {
        _context.Tickets.Remove(ticket);
    }

}
