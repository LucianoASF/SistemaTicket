using Microsoft.AspNetCore.Mvc;
using SistemaTicket.Dtos.ApplicationUser;
using SistemaTicket.Exceptions;
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
        try
        {
            var result = await _applicationUserService.Create(dto);
            return Ok(result);
        }
        catch (BadRequestException e)
        {
            return BadRequest(new { message = e.Message, errors = e.Errors });
        }
    }

}
