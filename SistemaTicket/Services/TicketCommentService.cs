// TODO: adiconar username na res´posta dos métodos
// TODO: consertar as rotas de history
// TODO: não deixar user que não é admin ver user/id
// TODO: criar rota para o user  ver os proprios tickets ? verificar se não posso fazer isso com rota existente
/* TODO: retornar os campos em tickethistory: OldPriority = th.OldPriority,
NewPriority = th.NewPriority,
            OldAssignedToId = th.OldAssignedToId,
            NewAssignedToId = th.NewAssignedToId,
            OldAssignedUserName = th.OldAssignedUser?.Name,
            NewAssignedUserName = th.NewAssignedUser?.Name,*/

using SistemaTicket.Dtos.TicketComment;
using SistemaTicket.Entities;
using SistemaTicket.Exceptions;
using SistemaTicket.Repositories;

namespace SistemaTicket.Services;

public class TicketCommentService : ITicketCommentService
{
    private readonly ITicketCommentRepository _ticketCommentRepository;
    private readonly ITicketRepository _ticketRepository;
    private readonly IApplicationUserService _applicationUserService;

    public TicketCommentService(ITicketCommentRepository ticketCommentRepository, ITicketRepository ticketRepository, IApplicationUserService applicationUserService)
    {
        _ticketCommentRepository = ticketCommentRepository;
        _ticketRepository = ticketRepository;
        _applicationUserService = applicationUserService;
    }
    public async Task<TicketCommentResponseDto> CreateAsync(TicketCommentRequestDto ticketCommentRequestDto, string userId, int ticketId, bool isUser)
    {
        await GetTicketAsync(ticketId, userId, isUser);
        TicketComment ticketComment = new()
        {
            Message = ticketCommentRequestDto.Message,
            CreatedAt = DateTimeOffset.UtcNow,
            UserId = userId,
            TicketId = ticketId
        };
        var response = await _ticketCommentRepository.CreateAsync(ticketComment);
        //var userName = await _applicationUserService.GetNameByUserAsync(userId);
        return new TicketCommentResponseDto
        {
            Id = response.Id,
            Message = response.Message,
            CreatedAt = response.CreatedAt,
            UserId = response.UserId,
            TicketId = response.TicketId,
            //UserName = userName
        };
    }

    public async Task<List<TicketCommentResponseDto>> GetAllByTicketAsync(int ticketId, string userId, bool isUser, int page)
    {
        var ticket = await GetTicketAsync(ticketId, userId, isUser);
        page = page < 1 ? 1 : page;
        var tiketComments = await _ticketCommentRepository.GetAllByTicketAsync(ticketId, page);
        List<TicketCommentResponseDto> response = new();
        foreach (var ticketComment in tiketComments)
        {
            response.Add(new TicketCommentResponseDto
            {
                Id = ticketComment.Id,
                Message = ticketComment.Message,
                CreatedAt = ticketComment.CreatedAt,
                UserId = ticketComment.UserId,
                TicketId = ticketComment.TicketId
            });
        }
        return response;
    }

    public async Task<TicketCommentResponseDto> GetByIdAsync(int id, int ticketId, string userId, bool isUser)
    {
        await GetTicketAsync(ticketId, userId, isUser);

        var ticketComment = await _ticketCommentRepository.GetByIdAsync(id, ticketId) ?? throw new NotFoundException("Ticket comment not found");
        return new TicketCommentResponseDto
        {
            Id = ticketComment.Id,
            Message = ticketComment.Message,
            CreatedAt = ticketComment.CreatedAt,
            UserId = ticketComment.UserId,
            TicketId = ticketComment.TicketId
        };
    }
    public async Task<TicketCommentResponseDto> UpdateAsync(TicketCommentRequestDto ticketCommentRequestDto, int id, string userId, int ticketId, bool isUser)
    {
        await GetTicketAsync(ticketId, userId, isUser);

        var ticketComment = await _ticketCommentRepository.GetByIdAsync(id, ticketId) ?? throw new NotFoundException("Ticket comment not found");
        ticketComment.Message = ticketCommentRequestDto.Message;
        await _ticketCommentRepository.SaveAsync();
        return new TicketCommentResponseDto
        {
            Id = ticketComment.Id,
            Message = ticketComment.Message,
            UserId = ticketComment.UserId,
            TicketId = ticketComment.TicketId,
            CreatedAt = ticketComment.CreatedAt
        };
    }
    public async Task DeleteAsync(int id, string userId, int ticketId, bool isUser)
    {
        await GetTicketAsync(ticketId, userId, isUser);
        var ticketComment = await _ticketCommentRepository.GetByIdAsync(id, ticketId) ?? throw new NotFoundException("Ticket comment not found");
        if (ticketComment.UserId != userId && isUser)
        {
            throw new ForbiddenException("You are not authorized to delete this comment");
        }
        _ticketCommentRepository.Delete(ticketComment);
        await _ticketCommentRepository.SaveAsync();
    }

    private async Task<Ticket> GetTicketAsync(int ticketId, string userId, bool isUser)
    {
        var ticket = await _ticketRepository.GetByIdAsync(ticketId) ?? throw new NotFoundException("Ticket not found");
        if (isUser && userId != ticket.CreatedById)
        {
            throw new ForbiddenException("You are not authorized to access comments on this ticket");
        }
        return ticket;
    }



}
