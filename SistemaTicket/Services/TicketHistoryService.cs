using SistemaTicket.Dtos.TicketHistory;
using SistemaTicket.Entities;
using SistemaTicket.Exceptions;
using SistemaTicket.Repositories;

namespace SistemaTicket.Services;

public class TicketHistoryService : ITicketHistoryService
{
    private readonly ITicketHistoryRepository _ticketHistoryRepository;
    private readonly ITicketRepository _ticketRepository;

    public TicketHistoryService(ITicketHistoryRepository ticketHistoryRepository, ITicketRepository ticketRepository)
    {
        _ticketHistoryRepository = ticketHistoryRepository;
        _ticketRepository = ticketRepository;
    }

    public async Task<List<TicketHistoryResponseDto>> GetAllByTicketIdAsync(int ticketId, string userId, bool isUser, int page)
    {
        await GetTicketAsync(ticketId, userId, isUser);
        page = page < 1 ? 1 : page;
        var response = await _ticketHistoryRepository.GetAllByTicketIdAsync(ticketId, page);
        return response.Select(th => new TicketHistoryResponseDto
        {
            Id = th.Id,
            OldStatus = th.OldStatus,
            NewStatus = th.NewStatus,
            ChangeAt = th.ChangeAt,
            ChangeById = th.ChangeById,
            TicketId = th.TicketId
        }).ToList();
    }

    private async Task<Ticket> GetTicketAsync(int ticketId, string userId, bool isUser)
    {
        var ticket = await _ticketRepository.GetByIdAsync(ticketId) ?? throw new NotFoundException("Ticket not found");
        if (isUser && userId != ticket.CreatedById)
        {
            throw new ForbiddenException("You are not authorized to access comments on this ticket");
        }
        return ticket;
    }
}
