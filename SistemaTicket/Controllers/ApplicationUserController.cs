
using Microsoft.AspNetCore.Mvc;
using SistemaTicket.Dtos.ApplicationUser;
using SistemaTicket.Services;

namespace SistemaTicket.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ApplicationUserController : ControllerBase
{
    private readonly IApplicationUserService _applicationUserService;

    public ApplicationUserController(IApplicationUserService applicationUserService)
    {
        _applicationUserService = applicationUserService;
    }

    [HttpPost]
    public async Task<ActionResult<ApplicationUserResponseDto>> Create(ApplicationUserCreateDto dto)
    {
        var result = await _applicationUserService.Create(dto);
        //         return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        return StatusCode(201, new { status = 201, result });
    }

}
