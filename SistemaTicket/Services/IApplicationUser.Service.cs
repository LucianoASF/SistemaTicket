using SistemaTicket.Dtos.ApplicationUser;

namespace SistemaTicket.Services;

public interface IApplicationUserService
{
    Task<ApplicationUserResponseDto> CreateAsync(ApplicationUserCreateDto applicationUserCreateDto);
    Task<List<ApplicationUserResponseDto>> GetAllAsync(int page);
    Task<ApplicationUserResponseDto> GetByIdAsync(string id);
    Task<ApplicationUserResponseDto> UpdateAsync(string id, ApplicationUserUpdateDto applicationUserUpdateDto, bool isAdmin);
    Task DeleteAsync(string id);
}
