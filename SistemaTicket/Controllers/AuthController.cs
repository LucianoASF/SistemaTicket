using Microsoft.AspNetCore.Mvc;
using SistemaTicket.Dtos.Login;
using SistemaTicket.Services;

namespace SistemaTicket.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("Login")]
    public async Task<ActionResult> Login(LoginRequestDto dto)
    {
        var response = await _authService.Login(dto);
        Response.Cookies.Append("auth_token", response.Token, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = response.Expires
        });

        return NoContent();
    }
    [HttpPost("logout")]
    public ActionResult Logout()
    {
        Response.Cookies.Delete("auth_token");

        return NoContent();
    }
}
