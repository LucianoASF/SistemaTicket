using SistemaTicket.Dtos.ApplicationUser;

namespace SistemaTicket.Services;

public interface IApplicationUserService
{
    Task<ApplicationUserResponseDto> Create(ApplicationUserCreateDto applicationUserCreateDto);
}
