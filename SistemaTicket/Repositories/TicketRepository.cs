using Microsoft.EntityFrameworkCore;
using SistemaTicket.Data;
using SistemaTicket.Dtos.Ticket;
using SistemaTicket.Dtos.TicketComment;
using SistemaTicket.Dtos.TicketHistory;
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

    public async Task<(List<TicketResponseDto> Tickets, int Total, StatusCountsDto? StatusCounts)> GetAllAsync
        (int page, string? searchQuery, TicketStatus? status, TicketPriority? priority, bool? withStatusCounts)
    {
        var query = _context.Tickets.AsNoTracking()
            .Where(t => (string.IsNullOrEmpty(searchQuery) || (t.Title.Contains(searchQuery) || t.Id.ToString().Contains(searchQuery)))
            && (!status.HasValue || t.Status == status.Value)
            && (!priority.HasValue || t.Priority == priority.Value));

        IQueryable<TicketResponseDto> dtoQuery;

        dtoQuery = query.Select(t => new TicketResponseDto
        {
            Id = t.Id,
            Title = t.Title,
            Description = t.Description,
            Status = t.Status,
            Priority = t.Priority,
            CreatedAt = t.CreatedAt,
            CreatedById = t.CreatedById,
            CreatedByName = t.CreatedBy.Name
        });

        var tickets = await dtoQuery
            .OrderByDescending(t => t.CreatedAt)
            .Skip((page - 1) * 5)
            .Take(5)
            .ToListAsync();

        int total = await dtoQuery.CountAsync();

        if (withStatusCounts == true)
        {
            var groupedStatus = await query
                .GroupBy(t => t.Status)
                .ToDictionaryAsync(
                    g => g.Key.ToString().ToLower(),
                    g => g.Count()
        );

            var statusCounts = new StatusCountsDto
            {
                Open = groupedStatus.GetValueOrDefault("open"),
                InProgress = groupedStatus.GetValueOrDefault("inprogress"),
                Closed = groupedStatus.GetValueOrDefault("closed")
            };



            return (tickets, total, statusCounts);
        }
        return (tickets, total, null);
    }

    public async Task<Ticket?> GetByIdAsync(int id)
    {
        return await _context.Tickets
            .Include(t => t.CreatedBy)
            .Include(t => t.AssignedTo)
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task SaveAsync()
    {
        await _context.SaveChangesAsync();
    }
    public void Delete(Ticket ticket)
    {
        _context.Tickets.Remove(ticket);
    }

    public async Task<TicketDetailsResponseDto?> GetDetailsByIdAsync(int id)
    {
        var ticketDetails = await _context.Tickets.AsNoTracking()
            .Where(t => t.Id == id)
            .Select(t => new TicketDetailsResponseDto
            {
                Ticket = new TicketResponseDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    Status = t.Status,
                    Priority = t.Priority,
                    CreatedAt = t.CreatedAt,
                    CreatedById = t.CreatedById,
                    CreatedByName = t.CreatedBy.Name,
                    AssignedToId = t.AssignedToId,
                    AssignedToName = t.AssignedTo != null ? t.AssignedTo.Name : null
                },
                TicketComments = t.TicketComments.Select(tc => new TicketCommentResponseDto
                {
                    Id = tc.Id,
                    Message = tc.Message,
                    CreatedAt = tc.CreatedAt,
                    TicketId = tc.TicketId,
                    UserId = tc.UserId,
                    UserName = tc.User.Name
                })
                .OrderByDescending(tc => tc.CreatedAt)
                .ToList(),
                TicketHistories = t.TicketHistories.Select(th => new TicketHistoryResponseDto
                {
                    Id = th.Id,
                    OldStatus = th.OldStatus,
                    NewStatus = th.NewStatus,
                    OldPriority = th.OldPriority,
                    NewPriority = th.NewPriority,
                    OldAssignedUserId = th.OldAssignedUserId,
                    NewAssignedUserId = th.NewAssignedUserId,
                    OldAssignedUserName = th.OldAssignedUser != null ? th.OldAssignedUser.Name : null,
                    NewAssignedUserName = th.NewAssignedUser != null ? th.NewAssignedUser.Name : null,
                    ChangedAt = th.ChangedAt,
                    ChangedById = th.ChangedById,
                    ChangedByName = th.ChangedBy.Name,
                    TicketId = th.TicketId
                })
                .OrderByDescending(th => th.ChangedAt)
                .ToList(),
            })
            .AsSplitQuery()
            .FirstOrDefaultAsync();

        return ticketDetails;
    }
}
