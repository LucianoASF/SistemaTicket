using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaTicket.Dtos.TicketComment;
using SistemaTicket.Services;

namespace SistemaTicket.Controllers;

[Route("api/tickets/{ticketId}/ticket-comments")]
[ApiController]
[Authorize]

public class TicketCommentController : AuthorizedApiControllerBase
{
    private readonly ITicketCommentService _ticketCommentService;

    public TicketCommentController(ITicketCommentService ticketCommentService)
    {
        _ticketCommentService = ticketCommentService;
    }

    [HttpPost]
    public async Task<ActionResult<TicketCommentResponseDto>> CreateAsync(TicketCommentRequestDto ticketCommentRequestDto, int ticketId)
    {
        var userId = CurrentUserId;
        var isUser = IsUser;
        var result = await _ticketCommentService.CreateAsync(ticketCommentRequestDto, userId, ticketId, isUser);
        return CreatedAtAction("GetById", new { id = result.Id, ticketId = ticketId }, result);
    }

    [HttpGet]
    public async Task<ActionResult<List<TicketCommentResponseDto>>> GetAllByTicketAsync(int ticketId, [FromQuery] int page)
    {
        var userId = CurrentUserId;
        var isUser = IsUser;
        var result = await _ticketCommentService.GetAllByTicketAsync(ticketId, userId, isUser, page);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TicketCommentResponseDto>> GetByIdAsync(int id, int ticketId)
    {
        var userId = CurrentUserId;
        var isUser = IsUser;
        var result = await _ticketCommentService.GetByIdAsync(id, ticketId, userId, isUser);
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TicketCommentResponseDto>> UpdateAsync(TicketCommentRequestDto dto, int id, int ticketId)
    {
        var userId = CurrentUserId;
        var isUser = IsUser;
        var result = await _ticketCommentService.UpdateAsync(dto, id, userId, ticketId, isUser);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteAsync(int id, int ticketId)
    {
        var userId = CurrentUserId;
        var isUser = IsUser;
        await _ticketCommentService.DeleteAsync(id, userId, ticketId, isUser);
        return NoContent();
    }
}