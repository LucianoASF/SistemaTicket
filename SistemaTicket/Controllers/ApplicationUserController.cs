
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaTicket.Dtos.ApplicationUser;
using SistemaTicket.Enums;
using SistemaTicket.Services;
using System.Security.Claims;

namespace SistemaTicket.Controllers;

[Route("api/users")]
[ApiController]
public class ApplicationUserController : ControllerBase
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
        return CreatedAtAction("GetUserWithTicketsById", new { id = result.Id }, result);
    }

    [Authorize(Roles = nameof(UserRole.Admin))]
    [HttpGet]
    public async Task<ActionResult<PagedApplicationUsersResponseDto>> GetAllAsync(int page, string? searchquery, UserRole? role, bool? inactives)
    {
        return Ok(await _applicationUserService.GetAllAsync(page, searchquery, role, inactives));
    }

    [Authorize]
    [HttpGet("{id}")]
    public async Task<ActionResult<ApplicationUserWithTicketsResponseDto>> GetUserWithTicketsByIdAsync(string id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var isUser = User.IsInRole(nameof(UserRole.User));
        if (isUser && userId != id)
        {
            return Forbid();
        }
        return Ok(await _applicationUserService.GetUserWithTicketsByIdAsync(id));
    }

    [Authorize]
    [HttpPatch("{id}")]
    public async Task<ActionResult<ApplicationUserResponseDto>> UpdateAsync(string id, ApplicationUserUpdateDto dto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var isAdmin = User.IsInRole(nameof(UserRole.Admin));

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
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var isAdmin = User.IsInRole(nameof(UserRole.Admin));

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
}