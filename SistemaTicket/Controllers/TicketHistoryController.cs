using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaTicket.Dtos.TicketHistory;
using SistemaTicket.Services;

namespace SistemaTicket.Controllers;

[Route("api/tickets/{ticketId}/ticket-histories")]
[ApiController]
[Authorize]
public class TicketHistoryController : AuthorizedApiControllerBase
{
    private readonly ITicketHistoryService _ticketHistoryService;

    public TicketHistoryController(ITicketHistoryService ticketHistoryService)
    {
        _ticketHistoryService = ticketHistoryService;
    }

    [HttpGet]
    public async Task<ActionResult<List<TicketHistoryResponseDto>>> GetAllByTicketIdAsync(int ticketId, [FromQuery] int page)
    {
        var userId = CurrentUserId;
        var isUser = IsUser;
        var ticketHistories = await _ticketHistoryService.GetAllByTicketIdAsync(ticketId, userId, isUser, page);
        return Ok(ticketHistories);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TicketHistoryResponseDto>> GetByIdAsync(int ticketId, int id)
    {
        var userId = CurrentUserId;
        var isUser = IsUser;
        var ticketHistory = await _ticketHistoryService.GetByIdAsync(ticketId, id, userId, isUser);
        return Ok(ticketHistory);
    }
}