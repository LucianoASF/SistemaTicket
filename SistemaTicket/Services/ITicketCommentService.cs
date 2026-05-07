using SistemaTicket.Dtos.TicketComment;

namespace SistemaTicket.Services;

public interface ITicketCommentService
{
    Task<TicketCommentResponseDto> CreateAsync(TicketCommentRequestDto ticketCommentRequestDto, string userId, int ticketId, bool isUser);
    Task<List<TicketCommentResponseDto>> GetAllByTicketAsync(int ticketId, string userId, bool isUser, int page);
    Task<TicketCommentResponseDto> GetByIdAsync(int id, int ticketId, string userId, bool isUser);
    Task<TicketCommentResponseDto> UpdateAsync(TicketCommentRequestDto ticketCommentRequestDto, int id, string userId, int ticketId, bool isUser);
    Task DeleteAsync(int id, string userId, int ticketId, bool isUser);
}
