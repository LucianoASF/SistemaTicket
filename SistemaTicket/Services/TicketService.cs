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

    public async Task<TicketResponseDto> Create(TicketCreateDto ticketCreateDto, string userId, bool isUser)
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

        var response = await _ticketRepository.Create(newTicket);
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
}
