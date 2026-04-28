
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaTicket.Dtos.ApplicationUser;
using SistemaTicket.Services;

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
        //         return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        return StatusCode(201, new { status = 201, result });
    }

    [Authorize(Roles = ("Admin"))]
    [HttpGet]
    public async Task<ActionResult<List<ApplicationUserResponseDto>>> GetAll([FromQuery] int page)
    {
        return Ok(await _applicationUserService.GetAll(page));
    }


}