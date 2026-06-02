using SistemaTicket.Dtos.Ticket;
using SistemaTicket.Entities;
using SistemaTicket.Enums;
using SistemaTicket.Exceptions;
using SistemaTicket.Repositories;

namespace SistemaTicket.Services;

public class TicketService : ITicketService
{
    private readonly ITicketRepository _ticketRepository;
    private readonly ITicketHistoryRepository _ticketHistoryRepository;

    public TicketService(ITicketRepository ticketRepository, ITicketHistoryRepository ticketHistoryRepository)
    {
        _ticketRepository = ticketRepository;
        _ticketHistoryRepository = ticketHistoryRepository;
    }

    public async Task<TicketResponseDto> CreateAsync(TicketCreateDto ticketCreateDto, string userId, bool isUser)
    {
        if (isUser || !ticketCreateDto.Priority.HasValue)
        {
            ticketCreateDto.Priority = TicketPriority.Low;
        }

        Ticket newTicket = new Ticket
        {
            Title = ticketCreateDto.Title,
            Description = ticketCreateDto.Description,
            Status = TicketStatus.Open,
            Priority = ticketCreateDto.Priority.Value,
            CreatedAt = DateTimeOffset.UtcNow,
            CreatedById = userId
        };
        var response = await _ticketRepository.CreateAsync(newTicket);
        return new TicketResponseDto
        {
            Id = response.Id,
            Title = response.Title,
            Description = response.Description,
            Status = response.Status,
            Priority = response.Priority,
            CreatedAt = response.CreatedAt,
            CreatedById = response.CreatedById,
            CreatedByName = response.CreatedBy.Name
        };
    }

    public async Task<PagedTicketsResponseDto> GetAllAsync(int page, string? searchQuery,
        TicketStatus? status, TicketPriority? priority, bool? withStatusCounts)
    {
        page = page < 1 ? 1 : page;
        var response = await _ticketRepository.GetAllAsync(page, searchQuery, status, priority, withStatusCounts);
        List<TicketResponseDto> tickets = new();

        foreach (var ticket in response.Tickets)
        {
            tickets.Add(new TicketResponseDto
            {
                Id = ticket.Id,
                Title = ticket.Title,
                Description = ticket.Description,
                Status = ticket.Status,
                Priority = ticket.Priority,
                CreatedAt = ticket.CreatedAt,
                CreatedById = ticket.CreatedById,
                CreatedByName = ticket.CreatedByName
            });
        }

        return new PagedTicketsResponseDto
        {
            Tickets = tickets,
            Total = response.Total,
            StatusCounts = withStatusCounts == true && response.StatusCounts != null ? new StatusCountsDto
            {
                Open = response.StatusCounts.Open,
                InProgress = response.StatusCounts.InProgress,
                Closed = response.StatusCounts.Closed
            } : null
        };
    }

    public async Task<TicketResponseDto> UpdateAsync(int id, string userId, bool isUser, TicketUpdateDto ticketUpdateDto)
    {
        var ticket = await GetTicketOrThrowAsync(id, userId, isUser);

        if (isUser)
        {
            if (ticket.Status != ticketUpdateDto.Status && ticketUpdateDto.Status.HasValue)
            {
                throw new BadRequestException(new Dictionary<string, string[]>() { { "status", ["you do not have authorization to change the status"] } });
            }
            if (ticket.Priority != ticketUpdateDto.Priority && ticketUpdateDto.Priority.HasValue)
            {
                throw new BadRequestException(new Dictionary<string, string[]>() { { "priority", ["you do not have authorization to change the priority"] } });
            }
        }

        TicketHistory ticketHistory = new()
        {
            TicketId = ticket.Id,
            ChangedAt = DateTimeOffset.UtcNow,
            ChangedById = userId
        };
        bool hasChanges = false;

        if (ticketUpdateDto.Status.HasValue && ticketUpdateDto.Status != ticket.Status)
        {
            ticketHistory.OldStatus = ticket.Status;
            ticketHistory.NewStatus = ticketUpdateDto.Status.Value;
            hasChanges = true;
        }
        if (ticketUpdateDto.Priority.HasValue && ticketUpdateDto.Priority != ticket.Priority)
        {
            ticketHistory.OldPriority = ticket.Priority;
            ticketHistory.NewPriority = ticketUpdateDto.Priority.Value;
            hasChanges = true;
        }
        if (ticketUpdateDto.AssignedUserId != null && ticketUpdateDto.AssignedUserId != ticket.AssignedToId && ticket.AssignedToId != null)
        {
            ticketHistory.OldAssignedUserId = ticket.AssignedToId;
            ticketHistory.NewAssignedUserId = ticketUpdateDto.AssignedUserId;
            hasChanges = true;
        }
        if (hasChanges)
        {
            await _ticketHistoryRepository.CreateAsync(ticketHistory);
        }

        ticket.Title = ticketUpdateDto.Title;
        ticket.Description = ticketUpdateDto.Description;
        ticket.Priority = ticketUpdateDto.Priority ?? ticket.Priority;
        ticket.Status = ticketUpdateDto.Status ?? ticket.Status;
        ticket.AssignedToId = ticketUpdateDto.AssignedUserId ?? ticket.AssignedToId;

        await _ticketRepository.SaveAsync();

        return new TicketResponseDto
        {
            Id = ticket.Id,
            Title = ticket.Title,
            Description = ticket.Description,
            Status = ticket.Status,
            Priority = ticket.Priority,
            CreatedAt = ticket.CreatedAt,
            CreatedById = ticket.CreatedById,
            CreatedByName = ticket.CreatedBy.Name,
            AssignedToId = ticket.AssignedToId,
            AssignedToName = ticket.AssignedTo?.Name
        };
    }
    public async Task DeleteAsync(int id, string userId, bool isUser)
    {
        var ticket = await GetTicketOrThrowAsync(id, userId, isUser);
        _ticketRepository.Delete(ticket);
        await _ticketRepository.SaveAsync();
    }

    public async Task<TicketDetailsResponseDto> GetDetailsByIdAsync(int id, string userId, bool isUser)
    {

        var ticketDetails = await _ticketRepository.GetDetailsByIdAsync(id);

        if (ticketDetails == null)
        {
            throw new NotFoundException("ticket not found");
        }
        if (ticketDetails.Ticket.CreatedById != userId && isUser)
        {
            throw new ForbiddenException("you are not authorized to access this ticket");
        }

        return ticketDetails;
    }

    private async Task<Ticket> GetTicketOrThrowAsync(int id, string userId, bool isUser)
    {
        var ticket = await _ticketRepository.GetByIdAsync(id);
        if (ticket == null)
        {
            throw new NotFoundException("ticket not found");
        }
        if (ticket.CreatedById != userId && isUser)
        {
            throw new ForbiddenException("you are not authorized to access this ticket");
        }
        return ticket;
    }
}
