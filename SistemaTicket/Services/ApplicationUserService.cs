using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SistemaTicket.Data;
using SistemaTicket.Dtos.ApplicationUser;
using SistemaTicket.Dtos.Ticket;
using SistemaTicket.Entities;
using SistemaTicket.Enums;
using SistemaTicket.Exceptions;
using SistemaTicket.Extentions;
using System.Data;

namespace SistemaTicket.Services;

public class ApplicationUserService : IApplicationUserService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly AppDbContext _context;
    public ApplicationUserService(UserManager<ApplicationUser> userManager, AppDbContext context)
    {
        _userManager = userManager;
        _context = context;
    }
    public async Task<ApplicationUserResponseDto> CreateAsync(ApplicationUserCreateDto applicationUserCreateDto)
    {
        var existingUser = await _userManager.Users.FirstOrDefaultAsync(u => u.Email == applicationUserCreateDto.Email && u.IsActive == false);
        if (existingUser != null)
        {
            throw new BadRequestException(new Dictionary<string, string[]>
            { { "Email", new[] { "to an inactivated user with this email. To activate this user, contact the system administrator." } } });
        }

        var applicationUser = new ApplicationUser
        {
            Name = applicationUserCreateDto.Name,
            Email = applicationUserCreateDto.Email,
            UserName = applicationUserCreateDto.Email,
            Role = applicationUserCreateDto.Role,
            CreatedAt = DateTimeOffset.UtcNow,
            IsActive = true
        };

        var result = await _userManager.CreateAsync(applicationUser, applicationUserCreateDto.Password);

        if (!result.Succeeded)
        {
            var errors = result.Errors
                .GroupBy(e => e.ToFieldName())
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(e => e.Description).ToArray()
                );

            throw new BadRequestException(errors);
        }

        return new ApplicationUserResponseDto
        {
            Id = applicationUser.Id,
            Name = applicationUser.Name,
            Email = applicationUser.Email,
            CreatedAt = applicationUser.CreatedAt,
            Role = applicationUser.Role
        };
    }

    public async Task<PagedApplicationUsersResponseDto> GetAllAsync(int page, string? searchquery, UserRole? role, bool? inactives)
    {
        page = page < 1 ? 1 : page;

        var query = _userManager.Users.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(searchquery))
        {
            query = query.Where(u => u.Name.Contains(searchquery) || u.Email!.Contains(searchquery) || u.Id.Contains(searchquery));
        }

        if (role.HasValue)
        {
            query = query.Where(u => u.Role == role.Value);
        }

        if (inactives.HasValue && inactives.Value == true)
        {
            query = query.Where(u => u.IsActive == false);
        }
        else if (inactives.HasValue && inactives.Value == false)
        {
            query = query.Where(u => u.IsActive == true);
        }

        var users = await query
            .OrderByDescending(u => u.CreatedAt)
            .Skip((page - 1) * 5)
            .Take(5)
            .ToListAsync();

        var groupedStatus = await query
                .GroupBy(u => u.Role)
                .ToDictionaryAsync(
                    g => g.Key.ToString().ToLower(),
                    g => g.Count()
                );

        var userDtos = new List<ApplicationUserResponseDto>();

        foreach (var user in users)
        {
            if (string.IsNullOrWhiteSpace(user.Email))
                throw new InvalidOperationException("Email is null or empty.");

            userDtos.Add(new ApplicationUserResponseDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                CreatedAt = user.CreatedAt,
                Role = user.Role,
                IsActive = user.IsActive,
            });
        }

        return new PagedApplicationUsersResponseDto
        {
            Users = userDtos,
            RoleCounts = new RoleCountsDto
            {
                Admin = groupedStatus.GetValueOrDefault("admin", 0),
                Support = groupedStatus.GetValueOrDefault("support", 0),
                User = groupedStatus.GetValueOrDefault("user", 0)
            },
            Total = await query.CountAsync()
        };
    }

    public async Task<ApplicationUserWithTicketsResponseDto> GetByIdAsync(string id)
    {
        var response = await _userManager.Users
            .AsNoTracking()
            .Where(u => u.Id == id)
            .Select(u => new ApplicationUserWithTicketsResponseDto
            {
                User = new ApplicationUserResponseDto
                {
                    Id = u.Id,
                    Name = u.Name,
                    Email = u.Email ?? string.Empty,
                    CreatedAt = u.CreatedAt,
                    Role = u.Role,
                    IsActive = u.IsActive
                },
                CreatedTicketsCount = u.CreatedTickets.Count(),

                CreatedTicketsStatusCounts = new StatusCountsDto
                {
                    Open = u.CreatedTickets.Count(t => t.Status == TicketStatus.Open),
                    InProgress = u.CreatedTickets.Count(t => t.Status == TicketStatus.InProgress),
                    Closed = u.CreatedTickets.Count(t => t.Status == TicketStatus.Closed)
                },

                AssignedTicketsCount = u.AssignedTickets.Count(),

                AssignedTicketsStatusCounts = new StatusCountsDto
                {
                    Open = u.AssignedTickets.Count(t => t.Status == TicketStatus.Open),
                    InProgress = u.AssignedTickets.Count(t => t.Status == TicketStatus.InProgress),
                    Closed = u.AssignedTickets.Count(t => t.Status == TicketStatus.Closed)
                },

                CreatedTickets = u.CreatedTickets
                    .OrderByDescending(t => t.CreatedAt)
                    .Take(5)
                    .Select(t => new TicketResponseDto
                    {
                        Id = t.Id,
                        Title = t.Title,
                        Description = t.Description,
                        Status = t.Status,
                        Priority = t.Priority,
                        CreatedAt = t.CreatedAt,
                        CreatedById = t.CreatedById,
                        AssignedToId = t.AssignedToId,
                        CreatedByName = t.CreatedBy.Name,
                        AssignedToName = t.AssignedTo != null
                            ? t.AssignedTo.Name
                            : null
                    }).ToList(),

                AssignedTickets = u.AssignedTickets
                    .OrderByDescending(t => t.CreatedAt)
                    .Take(5)
                    .Select(t => new TicketResponseDto
                    {
                        Id = t.Id,
                        Title = t.Title,
                        Description = t.Description,
                        Status = t.Status,
                        Priority = t.Priority,
                        CreatedAt = t.CreatedAt,
                        CreatedById = t.CreatedById,
                        AssignedToId = t.AssignedToId,
                        CreatedByName = t.CreatedBy.Name,
                        AssignedToName = t.AssignedTo != null
                            ? t.AssignedTo.Name
                            : null
                    }).ToList()
            })
            .FirstOrDefaultAsync();

        if (response == null)
        {
            throw new NotFoundException("User not found.");
        }
        if (string.IsNullOrWhiteSpace(response.User.Email))
            throw new InvalidOperationException("Email is null or empty.");

        return response;
    }
    public async Task<ApplicationUserResponseDto> UpdateAsync(string id, ApplicationUserUpdateDto applicationUserUpdateDto, bool isAdmin)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
        {
            throw new NotFoundException("User not found.");
        }

        if (!isAdmin && user.Role != applicationUserUpdateDto.Role)
        {
            throw new BadRequestException(new Dictionary<string, string[]> { { "role", new[] { "you are not allowed to change the role." } } });
        }

        user.Name = applicationUserUpdateDto.Name;
        user.Email = applicationUserUpdateDto.Email;
        user.UserName = applicationUserUpdateDto.Email;
        user.Role = applicationUserUpdateDto.Role;

        await using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            if (!string.IsNullOrWhiteSpace(applicationUserUpdateDto.Password))
            {
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                await _userManager.ResetPasswordAsync(user, token, applicationUserUpdateDto.Password);
            }

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                var errors = result.Errors
                    .GroupBy(e => e.ToFieldName())
                    .ToDictionary(
                        g => g.Key,
                        g => g.Select(e => e.Description).ToArray()
                    );
                throw new BadRequestException(errors);
            }

            await transaction.CommitAsync();

            return new ApplicationUserResponseDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                CreatedAt = user.CreatedAt,
                Role = applicationUserUpdateDto.Role,
                IsActive = user.IsActive
            };
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
    public async Task DeleteAsync(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
        {
            throw new NotFoundException("User not found.");
        }

        user.IsActive = false;

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            var errors = result.Errors
                .GroupBy(e => e.ToFieldName())
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(e => e.Description).ToArray()
                );
            throw new BadRequestException(errors);
        }
    }
}