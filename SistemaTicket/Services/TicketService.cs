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
    private readonly IApplicationUserService _applicationUserService;

    public TicketService(ITicketRepository ticketRepository, ITicketHistoryRepository ticketHistoryRepository, IApplicationUserService applicationUserService)
    {
        _ticketRepository = ticketRepository;
        _ticketHistoryRepository = ticketHistoryRepository;
        _applicationUserService = applicationUserService;
    }

    public async Task<TicketResponseDto> CreateAsync(TicketCreateDto ticketCreateDto, string userId, UserRole role)
    {
        if (role == UserRole.User && ticketCreateDto.Priority.HasValue)
        {
            throw new BadRequestException("Você não está autorizado a definir a prioridade.");
        }

        if (role != UserRole.Admin && ticketCreateDto.AssignedToId != null)
        {
            throw new BadRequestException("Você não está autorizado a definir o usuário atribuído.");
        }
        if (!ticketCreateDto.Priority.HasValue)
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
            CreatedById = userId,
            AssignedToId = ticketCreateDto.AssignedToId,
        };
        string? assignedToName = null;
        if (ticketCreateDto.AssignedToId != null)
        {
            assignedToName = await _applicationUserService.GetNameByAssignedUserAsync(ticketCreateDto.AssignedToId);

        }
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
            CreatedByName = response.CreatedBy.Name,
            AssignedToId = response.AssignedToId,
            AssignedToName = assignedToName
        };
    }

    public async Task<PagedTicketsResponseDto> GetFilteredTicketsAsync(string userId, UserRole role, int page, string? searchQuery,
        TicketStatus? status, TicketPriority? priority, bool? withStatusCounts, string? createdById, string? assignedToId)
    {
        if (role == UserRole.User && withStatusCounts.HasValue && withStatusCounts.Value)
        {
            throw new ForbiddenException("Você não está autorizado a visualizar esse recurso.");
        }
        if (!string.IsNullOrWhiteSpace(createdById) && !string.IsNullOrWhiteSpace(assignedToId) && role == UserRole.Support && userId != assignedToId && userId != createdById || role == UserRole.User && userId != createdById)
        {
            throw new BadRequestException("Você não está autorizado a visualizar os tickets de outros usuários.");
        }
        bool createdOrAssigned = string.IsNullOrWhiteSpace(createdById) && string.IsNullOrWhiteSpace(assignedToId) && role == UserRole.Support;
        if (createdOrAssigned)
        {
            createdById = userId;
            assignedToId = userId;
        }

        page = page < 1 ? 1 : page;

        var filteredTickets = await _ticketRepository.GetFilteredTicketsAsync(page, searchQuery, status, priority, withStatusCounts, createdById, assignedToId, userId, createdOrAssigned, role == UserRole.Support);

        return new PagedTicketsResponseDto
        {
            Tickets = filteredTickets.Tickets,
            Total = filteredTickets.Total,
            StatusCounts = withStatusCounts == true && filteredTickets.StatusCounts != null ? new StatusCountsDto
            {
                Open = filteredTickets.StatusCounts.Open,
                InProgress = filteredTickets.StatusCounts.InProgress,
                Closed = filteredTickets.StatusCounts.Closed
            } : null,
        };
    }

    public async Task<TicketDetailsResponseDto> UpdateAsync(int id, string userId, UserRole role, TicketUpdateDto ticketUpdateDto)
    {
        var ticket = await GetTicketOrThrowAsync(id, userId, role);

        if (role == UserRole.User)
        {
            if (ticket.Status != ticketUpdateDto.Status && ticketUpdateDto.Status.HasValue)
            {
                throw new BadRequestException("Você não está autorizado a alterar o status.");
            }
            if (ticket.Priority != ticketUpdateDto.Priority && ticketUpdateDto.Priority.HasValue)
            {
                throw new BadRequestException("Você não está autorizado a alterar a prioridade.");
            }
        }
        if (role != UserRole.Admin)
        {

            if (!string.IsNullOrWhiteSpace(ticketUpdateDto.AssignedToId))
            {
                throw new BadRequestException("Você não está autorizado a alterar o usuário atribuído.");
            }
            else
            {
                ticketUpdateDto.AssignedToId = ticket.AssignedToId;
            }
        }

        TicketHistory ticketHistory = new()
        {
            TicketId = ticket.Id,
            ChangedAt = DateTimeOffset.UtcNow,
            ChangedById = userId
        };
        bool hasChanges = false;
        string? assignedToName = ticket.AssignedTo?.Name;

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
        if (ticketUpdateDto.AssignedToId != ticket.AssignedToId)
        {
            if (ticketUpdateDto.AssignedToId != null)
            {
                assignedToName = await _applicationUserService.GetNameByAssignedUserAsync(ticketUpdateDto.AssignedToId);
            }
            else
            {
                assignedToName = null;
            }

            ticketHistory.OldAssignedToId = ticket.AssignedToId;
            ticketHistory.NewAssignedToId = ticketUpdateDto.AssignedToId;
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
        ticket.AssignedToId = ticketUpdateDto.AssignedToId;

        await _ticketRepository.SaveAsync();


        var ticketDetails = await _ticketRepository.GetDetailsByIdAsync(id);

        if (ticketDetails == null)
        {
            throw new NotFoundException("Ticket não encontrado.");
        }
        return ticketDetails;
    }
    public async Task DeleteAsync(int id, string userId, UserRole role)
    {
        var ticket = await GetTicketOrThrowAsync(id, userId, role);
        _ticketRepository.Delete(ticket);
        await _ticketRepository.SaveAsync();
    }

    public async Task<TicketDetailsResponseDto> GetDetailsByIdAsync(int id, string userId, UserRole role)
    {

        var ticketDetails = await _ticketRepository.GetDetailsByIdAsync(id);

        if (ticketDetails == null)
        {
            throw new NotFoundException("Ticket não encontrado.");
        }
        if (ticketDetails.Ticket.CreatedById != userId && (role == UserRole.User || (role == UserRole.Support && ticketDetails.Ticket.AssignedToId != userId)))
        {
            throw new ForbiddenException("Você não está autorizado a acessar este ticket.");
        }

        return ticketDetails;
    }

    private async Task<Ticket> GetTicketOrThrowAsync(int id, string userId, UserRole role)
    {
        var ticket = await _ticketRepository.GetByIdAsync(id);
        if (ticket == null)
        {
            throw new NotFoundException("Ticket não encontrado.");
        }
        if (ticket.CreatedById != userId && (role == UserRole.User || (role == UserRole.Support && ticket.AssignedToId != userId)))
        {
            throw new ForbiddenException("Você não está autorizado a acessar este ticket.");
        }
        return ticket;
    }
}
