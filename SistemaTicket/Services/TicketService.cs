using SistemaTicket.Dtos.Ticket;
using SistemaTicket.Entities;
using SistemaTicket.Enums;
using SistemaTicket.Exceptions;
using SistemaTicket.Repositories;

namespace SistemaTicket.Services;

public class TicketService : ITicketService
{
    private readonly ITicketRepository _ticketRepository;

    public TicketService(ITicketRepository ticketRepository)
    {
        _ticketRepository = ticketRepository;
    }

    public async Task<TicketResponseDto> CreateAsync(TicketCreateDto ticketCreateDto, string userId, bool isUser)
    {
        if (!Enum.IsDefined(ticketCreateDto.Priority))
        {
            throw new BadRequestException(new Dictionary<string, string[]>() { { "priority", ["that priority does not exist"] } });
        }

        if (isUser)
        {
            ticketCreateDto.Priority = TicketPriority.Low;
        }

        Ticket newTicket = new Ticket
        {
            Title = ticketCreateDto.Title,
            Description = ticketCreateDto.Description,
            Status = TicketStatus.Open,
            Priority = ticketCreateDto.Priority,
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
        var ticket = await _ticketRepository.GetByIdAsync(id);
        if (ticket == null)
        {
            throw new NotFoundException("ticket not found");
        }
        if (ticket.CreatedById != userId && isUser)
        {
            throw new ForbiddenException("you are not authorized to view this ticket");
        }
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
}
