using SistemaTicket.Dtos.ApplicationUser;
using SistemaTicket.Enums;

namespace SistemaTicket.Services;

public interface IApplicationUserService
{
    Task<ApplicationUserResponseDto> CreateAsync(ApplicationUserCreateDto applicationUserCreateDto);
    Task<PagedApplicationUsersResponseDto> GetAllAsync(int page, string? searchquery, UserRole? role, bool? inactives);
    Task<ApplicationUserWithTicketsResponseDto> GetUserWithTicketsByIdAsync(string id);
    Task<string> GetNameByAssignedUserAsync(string id);
    Task<ApplicationUserResponseDto> UpdateAsync(string id, ApplicationUserUpdateDto applicationUserUpdateDto, bool isAdmin);
    Task DeleteAsync(string id);
    Task<List<ApplicationUserResponseDto>> GetOptionsAsync(string? searchQuery);
}
