using SistemaTicket.Dtos.TicketComment;
using SistemaTicket.Entities;
using SistemaTicket.Exceptions;
using SistemaTicket.Repositories;

namespace SistemaTicket.Services;

public class TicketCommentService : ITicketCommentService
{
    private readonly ITicketCommentRepository _ticketCommentRepository;
    private readonly ITicketRepository _ticketRepository;

    public TicketCommentService(ITicketCommentRepository ticketCommentRepository, ITicketRepository ticketRepository)
    {
        _ticketCommentRepository = ticketCommentRepository;
        _ticketRepository = ticketRepository;
    }
    public async Task<TicketCommentResponseDto> CreateAsync(TicketCommentRequestDto ticketCommentRequestDto, string userId, int ticketId, bool isUser)
    {
        var ticket = await _ticketRepository.GetByIdAsync(ticketId) ?? throw new NotFoundException("Ticket not found");
        if (isUser && userId != ticket.CreatedById)
        {
            throw new ForbiddenException("You are not authorized to comment on this ticket");
        }
        TicketComment ticketComment = new()
        {
            Message = ticketCommentRequestDto.Message,
            CreatedAt = DateTime.UtcNow,
            UserId = userId,
            TicketId = ticketId
        };
        var response = await _ticketCommentRepository.CreateAsync(ticketComment);
        return new TicketCommentResponseDto
        {
            Id = response.Id,
            Message = response.Message,
            CreatedAt = response.CreatedAt,
            UserId = response.UserId,
            TicketId = response.TicketId
        };
    }
}
