using SistemaTicket.Dtos.TicketComment;

namespace SistemaTicket.Services;

public interface ITicketCommentService
{
    Task<TicketCommentResponseDto> CreateAsync(TicketCommentRequestDto ticketCommentRequestDto, string userId, int ticketId, bool isUser);
    Task<List<TicketCommentResponseDto>> GetAllByTicketAsync(int ticketId, string userId, bool isUser, int page);
}
