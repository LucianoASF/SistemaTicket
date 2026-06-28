using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SistemaTicket.Dtos.Login;
using SistemaTicket.Entities;
using SistemaTicket.Exceptions;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
namespace SistemaTicket.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IConfiguration _config;


    public AuthService(UserManager<ApplicationUser> userManager, IConfiguration config)
    {
        _userManager = userManager;
        _config = config;
    }

    public async Task<LoginResponseDto> LoginAsync(LoginRequestDto dto)
    {
        var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Email == dto.Email && u.IsActive);
        if (user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
        {
            throw new UnauthorizedException("Email e/ou senha inválidos.");
        }

        return await GenerateJwtTokenAsync(user);
    }
    private async Task<LoginResponseDto> GenerateJwtTokenAsync(ApplicationUser user)
    {
        var keyString = _config["Jwt:Key"];
        var ExpireMinutesString = _config["Jwt:ExpireMinutes"];
        if (string.IsNullOrWhiteSpace(keyString))
        {
            throw new InvalidOperationException("A chave JWT não está configurada.");
        }
        else if (string.IsNullOrWhiteSpace(ExpireMinutesString) || !int.TryParse(ExpireMinutesString, out _))
        {
            throw new InvalidOperationException("O tempo de expiração do JWT não está configurado ou é inválido.");
        }
        var key = Encoding.UTF8.GetBytes(keyString);

        if (string.IsNullOrWhiteSpace(user.Email))
        {
            throw new InvalidOperationException("O email do usuário é inválido.");
        }

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.Role, user.Role.ToString())
        };

        DateTimeOffset expires = DateTimeOffset.UtcNow.AddMinutes(int.Parse(ExpireMinutesString));
        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: expires.UtcDateTime,
            signingCredentials: new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256
            )
        );

        return new LoginResponseDto { Token = new JwtSecurityTokenHandler().WriteToken(token), Expires = expires };
    }
    public async Task<CurrentUserResponseDto> MeAsync(ClaimsPrincipal userClaims)
    {
        var user = await _userManager.GetUserAsync(userClaims);
        return new CurrentUserResponseDto
        {
            Id = user!.Id,
            Name = user.Name,
            Email = user.Email ?? string.Empty,
            Role = user.Role
        };
    }
}
