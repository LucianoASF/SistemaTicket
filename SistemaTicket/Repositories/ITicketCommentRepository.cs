using SistemaTicket.Entities;

namespace SistemaTicket.Repositories;

public interface ITicketCommentRepository
{
    Task<TicketComment> CreateAsync(TicketComment ticketComment);

}
