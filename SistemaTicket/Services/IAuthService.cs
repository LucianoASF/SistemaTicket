using SistemaTicket.Dtos.Login;
using System.Security.Claims;

namespace SistemaTicket.Services;

public interface IAuthService
{
    Task<LoginResponseDto> LoginAsync(LoginRequestDto dto);
    Task<CurrentUserResponseDto> MeAsync(ClaimsPrincipal userClaims);
}
