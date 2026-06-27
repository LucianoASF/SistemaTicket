using SistemaTicket.Dtos.ApplicationUser;
using SistemaTicket.Enums;

namespace SistemaTicket.Services;

public interface IApplicationUserService
{
    Task<ApplicationUserResponseDto> CreateAsync(ApplicationUserCreateDto applicationUserCreateDto);
    Task<PagedApplicationUsersResponseDto> GetAllAsync(int page, string? searchquery, UserRole? role, bool? inactives);
    Task<ApplicationUserResponseDto> GetByIdAsync(string userId, UserRole role, string userSearchId);
    Task<ApplicationUserWithTicketsResponseDto> GetUserWithTicketsByIdAsync(string id);
    Task<string> GetNameByAssignedUserAsync(string id);
    Task<ApplicationUserResponseDto> UpdateAsync(string id, ApplicationUserUpdateDto applicationUserUpdateDto, bool isAdmin);
    Task DeleteAsync(string id);
    Task<List<ApplicationUserResponseDto>> GetOptionsAsync(string? searchQuery);
    Task<List<ApplicationUserResponseDto>> GetTicketRelatedUsersCreatorsAsync
         (string userId, UserRole role, string? searchQueryUsers, string? searchQueryTickets,
         TicketStatus? status, TicketPriority? priority, string? assignedToId);
    Task<List<ApplicationUserResponseDto>> GetTicketRelatedUsersAssignedsAsync
       (string userId, UserRole role, string? searchQueryUsers, string? searchQueryTickets,
       TicketStatus? status, TicketPriority? priority, string? createdById);
}
