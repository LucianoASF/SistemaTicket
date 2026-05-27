using SistemaTicket.Dtos.ApplicationUser;
using SistemaTicket.Enums;

namespace SistemaTicket.Services;

public interface IApplicationUserService
{
    Task<ApplicationUserResponseDto> CreateAsync(ApplicationUserCreateDto applicationUserCreateDto);
    Task<PagedApplicationUsersResponseDto> GetAllAsync(int page, string? querySearch, UserRole? role);
    Task<ApplicationUserResponseDto> GetByIdAsync(string id);
    Task<ApplicationUserResponseDto> UpdateAsync(string id, ApplicationUserUpdateDto applicationUserUpdateDto, bool isAdmin);
    Task DeleteAsync(string id);
}
