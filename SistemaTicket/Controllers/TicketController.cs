using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaTicket.Dtos.Ticket;
using SistemaTicket.Enums;
using SistemaTicket.Services;
using System.Security.Claims;

namespace SistemaTicket.Controllers;

[Route("api/tickets")]
[ApiController]
public class TicketController : ControllerBase
{
    private readonly ITicketService _ticketService;

    public TicketController(ITicketService ticketService)
    {
        _ticketService = ticketService;
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<TicketResponseDto>> CreateAsync(TicketCreateDto dto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized();
        }
        var isUser = User.IsInRole(nameof(UserRole.User));
        var result = await _ticketService.CreateAsync(dto, userId, isUser);
        return CreatedAtAction("GetById", new { id = result.Id }, result);
    }

    [Authorize(Roles = $"{nameof(UserRole.Admin)},{nameof(UserRole.Support)}")]
    [HttpGet]
    public async Task<ActionResult<List<TicketResponseDto>>> GetAllAsync([FromQuery] int page)
    {
        return Ok(await _ticketService.GetAllAsync(page));
    }

    [Authorize]
    [HttpGet("{id}")]
    public async Task<ActionResult<TicketResponseDto>> GetByIdAsync(int id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized();
        }
        var isUser = User.IsInRole(nameof(UserRole.User));
        return Ok(await _ticketService.GetByIdAsync(id, userId, isUser));
    }

    [Authorize]
    [HttpPatch("{id}")]
    public async Task<ActionResult<TicketResponseDto>> UpdateAsync(int id, TicketUpdateDto dto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized();
        }
        var isUser = User.IsInRole(nameof(UserRole.User));
        return Ok(await _ticketService.UpdateAsync(id, userId, isUser, dto));
    }
    [Authorize(Roles = nameof(UserRole.Admin))]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteAsync(int id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized();
        }
        await _ticketService.DeleteAsync(id, userId, false);
        return NoContent();
    }

}

