using Microsoft.AspNetCore.Identity;
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
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
        {
            throw new UnauthorizedException("Invalid email or password.");
        }

        return await GenerateJwtTokenAsync(user);
    }
    private async Task<LoginResponseDto> GenerateJwtTokenAsync(ApplicationUser user)
    {
        var keyString = _config["Jwt:Key"];
        var ExpireMinutesString = _config["Jwt:ExpireMinutes"];
        if (string.IsNullOrWhiteSpace(keyString))
        {
            throw new InvalidOperationException("JWT key is not configured.");
        }
        else if (string.IsNullOrWhiteSpace(ExpireMinutesString) || !int.TryParse(ExpireMinutesString, out _))
        {
            throw new InvalidOperationException("JWT expiration time is not configured or invalid.");
        }
        var key = Encoding.UTF8.GetBytes(keyString);

        if (string.IsNullOrWhiteSpace(user.Email))
        {
            throw new InvalidOperationException("Email is invalid.");
        }

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Name)
        };

        var roles = await _userManager.GetRolesAsync(user);

        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }
        DateTime expires = DateTime.UtcNow.AddMinutes(int.Parse(ExpireMinutesString));
        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: expires,
            signingCredentials: new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256
            )
        );

        return new LoginResponseDto { Token = new JwtSecurityTokenHandler().WriteToken(token), Expires = expires };
    }
}
