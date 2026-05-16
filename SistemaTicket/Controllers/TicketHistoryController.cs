using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaTicket.Dtos.TicketHistory;
using SistemaTicket.Enums;
using SistemaTicket.Services;
using System.Security.Claims;

namespace SistemaTicket.Controllers;

[Route("api/tickets/{ticketId}/ticket-histories")]
[ApiController]
[Authorize]
public class TicketHistoryController : ControllerBase
{
    private readonly ITicketHistoryService _ticketHistoryService;

    public TicketHistoryController(ITicketHistoryService ticketHistoryService)
    {
        _ticketHistoryService = ticketHistoryService;
    }

    [HttpGet]
    public async Task<ActionResult<List<TicketHistoryResponseDto>>> GetAllByTicketIdAsync(int ticketId, [FromQuery] int page)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized();
        }
        var isUser = User.IsInRole(nameof(UserRole.User));
        var ticketHistories = await _ticketHistoryService.GetAllByTicketIdAsync(ticketId, userId, isUser, page);
        return Ok(ticketHistories);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TicketHistoryResponseDto>> GetByIdAsync(int ticketId, int id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized();
        }
        var isUser = User.IsInRole(nameof(UserRole.User));
        var ticketHistory = await _ticketHistoryService.GetByIdAsync(ticketId, id, userId, isUser);
        return Ok(ticketHistory);
    }
}