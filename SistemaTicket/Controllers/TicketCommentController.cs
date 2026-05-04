using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaTicket.Dtos.TicketComment;
using SistemaTicket.Services;
using System.Security.Claims;

namespace SistemaTicket.Controllers;

[Route("api/tickets/{ticketId}/ticket-comments")]
[ApiController]
public class TicketCommentController : ControllerBase
{
    private readonly ITicketCommentService _ticketCommentService;

    public TicketCommentController(ITicketCommentService ticketCommentService)
    {
        _ticketCommentService = ticketCommentService;
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<TicketCommentResponseDto>> CreateAsync(TicketCommentRequestDto ticketCommentRequestDto, int ticketId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized();
        }
        var isUser = User.IsInRole("User");
        var result = await _ticketCommentService.CreateAsync(ticketCommentRequestDto, userId, ticketId, isUser);
        return StatusCode(201, result);
    }


}
