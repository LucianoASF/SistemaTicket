
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
    public async Task<ActionResult<ApplicationUserResponseDto>> Create(ApplicationUserCreateDto dto)
    {
        var result = await _applicationUserService.Create(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [Authorize(Roles = ("Admin"))]
    [HttpGet]
    public async Task<ActionResult<List<ApplicationUserResponseDto>>> GetAll([FromQuery] int page)
    {
        return Ok(await _applicationUserService.GetAll(page));
    }

    [Authorize]
    [HttpGet("{id}")]
    public async Task<ActionResult<ApplicationUserResponseDto>> GetById(string id)
    {
        return Ok(await _applicationUserService.GetById(id));
    }

    [Authorize]
    [HttpPatch("{id}")]
    public async Task<ActionResult<ApplicationUserResponseDto>> Update(string id, ApplicationUserUpdateDto dto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var isAdmin = User.IsInRole("Admin");

        if (!isAdmin && userId != id)
        {
            return Forbid();
        }
        return Ok(await _applicationUserService.Update(id, dto, isAdmin));
    }
}