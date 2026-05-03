
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaTicket.Dtos.ApplicationUser;
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
    [Authorize(Roles = ("Admin"))]
    [HttpPost]
    public async Task<ActionResult<ApplicationUserResponseDto>> CreateAsync(ApplicationUserCreateDto dto)
    {
        var result = await _applicationUserService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetByIdAsync), new { id = result.Id }, result);
    }

    [Authorize(Roles = ("Admin"))]
    [HttpGet]
    public async Task<ActionResult<List<ApplicationUserResponseDto>>> GetAllAsync([FromQuery] int page)
    {
        return Ok(await _applicationUserService.GetAllAsync(page));
    }

    [Authorize]
    [HttpGet("{id}")]
    public async Task<ActionResult<ApplicationUserResponseDto>> GetByIdAsync(string id)
    {
        return Ok(await _applicationUserService.GetByIdAsync(id));
    }

    [Authorize]
    [HttpPatch("{id}")]
    public async Task<ActionResult<ApplicationUserResponseDto>> UpdateAsync(string id, ApplicationUserUpdateDto dto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var isAdmin = User.IsInRole("Admin");

        if (!isAdmin && userId != id)
        {
            return Forbid();
        }
        return Ok(await _applicationUserService.UpdateAsync(id, dto, isAdmin));
    }

    [Authorize(Roles = ("Admin"))]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteAsync(string id)
    {
        await _applicationUserService.DeleteAsync(id);
        return NoContent();
    }
}