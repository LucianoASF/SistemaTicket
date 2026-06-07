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
        var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;
        Enum.TryParse<UserRole>(roleClaim, out var role);
        if (string.IsNullOrEmpty(roleClaim))
        {
            Unauthorized("User role is not specified.");
        }
        var result = await _ticketService.CreateAsync(dto, userId, role);
        return CreatedAtAction("GetDetailsById", new { id = result.Id }, result);
    }

    [Authorize(Roles = nameof(UserRole.Admin))]
    [HttpGet]
    public async Task<ActionResult<PagedTicketsResponseDto>> GetAllAsync(int page,
        string? searchQuery, TicketStatus? status, TicketPriority? priority, bool? withStatusCounts)
    {
        return Ok(await _ticketService.GetAllAsync(page, searchQuery, status, priority, withStatusCounts));
    }

    [Authorize]
    [HttpGet("{id}")]
    public async Task<ActionResult<TicketDetailsResponseDto>> GetDetailsByIdAsync(int id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized();
        }
        var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;
        Enum.TryParse<UserRole>(roleClaim, out var role);
        if (string.IsNullOrEmpty(roleClaim))
        {
            Unauthorized("User role is not specified.");
        }
        return Ok(await _ticketService.GetDetailsByIdAsync(id, userId, role));
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
        var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;
        Enum.TryParse<UserRole>(roleClaim, out var role);
        if (string.IsNullOrEmpty(roleClaim))
        {
            Unauthorized("User role is not specified.");
        }
        return Ok(await _ticketService.UpdateAsync(id, userId, role, dto));
    }
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteAsync(int id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized();
        }
        var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;
        Enum.TryParse<UserRole>(roleClaim, out var role);
        if (string.IsNullOrEmpty(roleClaim))
        {
            Unauthorized("User role is not specified.");
        }

        await _ticketService.DeleteAsync(id, userId, role);
        return NoContent();
    }
}
