
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaTicket.Dtos.ApplicationUser;
using SistemaTicket.Enums;
using SistemaTicket.Services;

namespace SistemaTicket.Controllers;

[Route("api/users")]
[ApiController]
public class ApplicationUserController : AuthorizedApiControllerBase
{
    private readonly IApplicationUserService _applicationUserService;

    public ApplicationUserController(IApplicationUserService applicationUserService)
    {
        _applicationUserService = applicationUserService;
    }
    [Authorize(Roles = nameof(UserRole.Admin))]
    [HttpPost]
    public async Task<ActionResult<ApplicationUserResponseDto>> CreateAsync(ApplicationUserCreateDto dto)
    {
        var result = await _applicationUserService.CreateAsync(dto);
        return CreatedAtAction("GetById", new { id = result.Id }, result);
    }

    [Authorize(Roles = nameof(UserRole.Admin))]
    [HttpGet]
    public async Task<ActionResult<PagedApplicationUsersResponseDto>> GetAllAsync(int page, string? searchquery, UserRole? role, bool? inactives)
    {
        return Ok(await _applicationUserService.GetAllAsync(page, searchquery, role, inactives));
    }

    [Authorize]
    [HttpGet("{userSearchId}")]
    public async Task<ActionResult<ApplicationUserResponseDto>> GetByIdAsync(string userSearchId)
    {
        var role = CurrentUserRole;
        var userId = CurrentUserId;
        return Ok(await _applicationUserService.GetByIdAsync(userId, role, userSearchId));
    }

    [Authorize]
    [HttpGet("{id}/tickets")]
    public async Task<ActionResult<ApplicationUserWithTicketsResponseDto>> GetUserWithTicketsByIdAsync(string id)
    {
        var userId = CurrentUserId;
        var isAdmin = IsAdmin;
        if (!isAdmin && userId != id)
        {
            return Forbid();
        }
        return Ok(await _applicationUserService.GetUserWithTicketsByIdAsync(id));
    }

    [Authorize]
    [HttpPatch("{id}")]
    public async Task<ActionResult<ApplicationUserResponseDto>> UpdateAsync(string id, ApplicationUserUpdateDto dto)
    {
        var userId = CurrentUserId;
        var isAdmin = IsAdmin;

        if (!isAdmin && userId != id)
        {
            return Forbid();
        }
        return Ok(await _applicationUserService.UpdateAsync(id, dto, isAdmin));
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteAsync(string id)
    {
        var userId = CurrentUserId;
        var isAdmin = IsAdmin;

        if (!isAdmin && userId != id)
        {
            return Forbid();
        }
        await _applicationUserService.DeleteAsync(id);
        return NoContent();
    }

    [Authorize(Roles = nameof(UserRole.Admin))]
    [HttpGet("options")]
    public async Task<ActionResult<List<ApplicationUserResponseDto>>> GetOptionsAsync(string? searchQuery)
    {
        return Ok(await _applicationUserService.GetOptionsAsync(searchQuery));
    }

    [Authorize(Roles = $"{nameof(UserRole.Admin)},{nameof(UserRole.Support)}")]
    [HttpGet("ticket-related-users-creators")]
    public async Task<ActionResult<List<ApplicationUserResponseDto>>> GetTicketRelatedUsersCreatorsAsync(
        string? searchQueryUsers, string? searchQueryTickets, TicketStatus? status, TicketPriority? priority, string? assignedToId)
    {
        var userId = CurrentUserId;
        var role = CurrentUserRole;
        var result = await _applicationUserService.GetTicketRelatedUsersCreatorsAsync(userId, role, searchQueryUsers, searchQueryTickets, status, priority, assignedToId);
        return Ok(result);
    }

    [Authorize]
    [HttpGet("ticket-related-users-assigneds")]
    public async Task<ActionResult<List<ApplicationUserResponseDto>>> GetTicketRelatedUsersAssignedsAsync(
        string? searchQueryUsers, string? searchQueryTickets, TicketStatus? status, TicketPriority? priority, string? createdById)
    {
        var userId = CurrentUserId;
        var role = CurrentUserRole;
        var result = await _applicationUserService.GetTicketRelatedUsersAssignedsAsync(userId, role, searchQueryUsers, searchQueryTickets, status, priority, createdById);
        return Ok(result);
    }
}