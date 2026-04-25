using SistemaTicket.Dtos.Login;

namespace SistemaTicket.Services;

public interface IAuthService
{
    Task<LoginResponseDto> Login(LoginRequestDto dto);
}
