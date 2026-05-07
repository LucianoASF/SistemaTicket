using SistemaTicket.Entities;

namespace SistemaTicket.Repositories;

public interface ITicketCommentRepository
{
    Task<TicketComment> CreateAsync(TicketComment ticketComment);
    Task<List<TicketComment>> GetAllByTicketAsync(int ticketId, int page);
    Task<TicketComment?> GetByIdAsync(int id, int ticketId);
    Task SaveAsync();
    void Delete(TicketComment ticketComment);
}
