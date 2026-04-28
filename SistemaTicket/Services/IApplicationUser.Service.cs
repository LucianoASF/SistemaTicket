using SistemaTicket.Dtos.ApplicationUser;

namespace SistemaTicket.Services;

public interface IApplicationUserService
{
    Task<ApplicationUserResponseDto> Create(ApplicationUserCreateDto applicationUserCreateDto);
    Task<List<ApplicationUserResponseDto>> GetAll(int page);
    Task<ApplicationUserResponseDto> GetById(string id);
    Task<ApplicationUserResponseDto> Update(string id, ApplicationUserUpdateDto applicationUserUpdateDto, bool isAdmin);
}
