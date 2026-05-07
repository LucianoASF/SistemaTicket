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
        if (isUser)
        {
            ticketCreateDto.Priority = TicketPriority.Low;
        }

        Ticket newTicket = new Ticket
        {
            Title = ticketCreateDto.Title,
            Description = ticketCreateDto.Description,
            Status = TicketStatus.Open,
            Priority = VerifyPriority(ticketCreateDto.Priority),
            CreatedAt = DateTime.UtcNow,
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
            CreatedById = response.CreatedById
        };
    }

    public async Task<List<TicketResponseDto>> GetAllAsync(int page)
    {
        page = page < 1 ? 1 : page;
        var tickets = await _ticketRepository.GetAllAsync(page);
        List<TicketResponseDto> response = new();

        foreach (var ticket in tickets)
        {
            response.Add(new TicketResponseDto
            {
                Id = ticket.Id,
                Title = ticket.Title,
                Description = ticket.Description,
                Status = ticket.Status,
                Priority = ticket.Priority,
                CreatedAt = ticket.CreatedAt,
                CreatedById = ticket.CreatedById
            });
        }

        return response;
    }

    public async Task<TicketResponseDto> GetByIdAsync(int id, string userId, bool isUser)
    {
        var ticket = await GetTicketOrThrowAsync(id, userId, isUser);

        return new TicketResponseDto
        {
            Id = ticket.Id,
            Title = ticket.Title,
            Description = ticket.Description,
            Status = ticket.Status,
            Priority = ticket.Priority,
            CreatedAt = ticket.CreatedAt,
            CreatedById = ticket.CreatedById
        };
    }

    public async Task<TicketResponseDto> UpdateAsync(int id, string userId, bool isUser, TicketUpdateDto ticketUpdateDto)
    {
        var ticket = await GetTicketOrThrowAsync(id, userId, isUser);

        if (ticketUpdateDto.Status.HasValue && ticketUpdateDto.Status != ticket.Status)
        {
            await _ticketHistoryRepository.CreateAsync(new TicketHistory
            {
                TicketId = ticket.Id,
                OldStatus = ticket.Status,
                NewStatus = ticketUpdateDto.Status.Value,
                ChangeAt = DateTime.UtcNow,
                ChangeById = userId
            });
        }

        ticket.Title = ticketUpdateDto.Title;
        ticket.Description = ticketUpdateDto.Description;
        if (!isUser)
        {
            ticket.Priority = VerifyPriority(ticketUpdateDto.Priority);
            ticket.Status = VerifyStatus(ticketUpdateDto.Status);
        }

        await _ticketRepository.SaveAsync();

        return new TicketResponseDto
        {
            Id = ticket.Id,
            Title = ticket.Title,
            Description = ticket.Description,
            Status = ticket.Status,
            Priority = ticket.Priority,
            CreatedAt = ticket.CreatedAt,
            CreatedById = ticket.CreatedById
        };
    }
    public async Task DeleteAsync(int id, string userId, bool isUser)
    {
        var ticket = await GetTicketOrThrowAsync(id, userId, isUser);
        _ticketRepository.Delete(ticket);
        await _ticketRepository.SaveAsync();
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

    private TicketPriority VerifyPriority(TicketPriority? priority)
    {
        if (!priority.HasValue || !Enum.IsDefined(priority.Value))
        {
            throw new BadRequestException(new Dictionary<string, string[]>() { { "priority", ["that priority does not exist"] } });
        }
        return priority.Value;
    }
    private TicketStatus VerifyStatus(TicketStatus? status)
    {
        if (!status.HasValue || !Enum.IsDefined(status.Value))
        {
            throw new BadRequestException(new Dictionary<string, string[]>() { { "status", ["that status does not exist"] } });
        }
        return status.Value;
    }
}
