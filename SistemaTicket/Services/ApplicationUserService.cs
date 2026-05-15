using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SistemaTicket.Data;
using SistemaTicket.Dtos.ApplicationUser;
using SistemaTicket.Entities;
using SistemaTicket.Exceptions;
using SistemaTicket.Extentions;
using System.Data;

namespace SistemaTicket.Services;

public class ApplicationUserService : IApplicationUserService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly AppDbContext _context;
    public ApplicationUserService(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, AppDbContext context)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _context = context;
    }
    public async Task<ApplicationUserResponseDto> CreateAsync(ApplicationUserCreateDto applicationUserCreateDto)
    {
        var applicationUser = new ApplicationUser
        {
            Name = applicationUserCreateDto.Name,
            Email = applicationUserCreateDto.Email,
            UserName = applicationUserCreateDto.Email,
            CreatedAt = DateTime.UtcNow
        };
        await using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {


            if (!await _roleManager.RoleExistsAsync(applicationUserCreateDto.Role))
            {
                throw new BadRequestException(new Dictionary<string, string[]> { { "role", new[] { $"The role '{applicationUserCreateDto.Role}' does not exist." } } });
            }

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
            var roleResult = await _userManager.AddToRoleAsync(applicationUser, applicationUserCreateDto.Role);
            if (!roleResult.Succeeded)
            {
                var errors = roleResult.Errors
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
                Id = applicationUser.Id,
                Name = applicationUser.Name,
                Email = applicationUser.Email,
                CreatedAt = applicationUser.CreatedAt,
                Role = applicationUserCreateDto.Role
            };
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<List<ApplicationUserResponseDto>> GetAllAsync(int page)
    {
        page = page < 1 ? 1 : page;

        var users = await _userManager
            .Users
            .AsNoTracking()
            .OrderByDescending(u => u.CreatedAt)
            .Skip((page - 1) * 10)
            .Take(10)
            .ToListAsync();

        var userDtos = new List<ApplicationUserResponseDto>();

        foreach (var user in users)
        {
            if (string.IsNullOrWhiteSpace(user.Email))
                throw new InvalidOperationException("Email is null or empty.");

            var roles = await _userManager.GetRolesAsync(user);
            userDtos.Add(new ApplicationUserResponseDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                CreatedAt = user.CreatedAt,
                Role = roles.FirstOrDefault() ?? string.Empty
            });
        }

        return userDtos;
    }

    public async Task<ApplicationUserResponseDto> GetByIdAsync(string id)
    {
        var user = await _userManager.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == id);
        if (user == null)
        {
            throw new NotFoundException("User not found.");
        }
        if (string.IsNullOrWhiteSpace(user.Email))
            throw new InvalidOperationException("Email is null or empty.");

        var roles = await _userManager.GetRolesAsync(user);
        return new ApplicationUserResponseDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            CreatedAt = user.CreatedAt,
            Role = roles.FirstOrDefault() ?? string.Empty
        };
    }
    public async Task<ApplicationUserResponseDto> UpdateAsync(string id, ApplicationUserUpdateDto applicationUserUpdateDto, bool isAdmin)
    {
        if (!isAdmin && applicationUserUpdateDto.Role != null)
            throw new ForbiddenException("You cannot change roles.");

        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
        {
            throw new NotFoundException("User not found.");
        }
        var currentRoles = await _userManager.GetRolesAsync(user);

        user.Name = applicationUserUpdateDto.Name;
        user.Email = applicationUserUpdateDto.Email;
        user.UserName = applicationUserUpdateDto.Email;

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

            if (applicationUserUpdateDto.Role == null)
            {
                applicationUserUpdateDto.Role = currentRoles.FirstOrDefault() ?? string.Empty;
            }
            applicationUserUpdateDto.Role = applicationUserUpdateDto.Role.ToLower();


            if (!await _roleManager.RoleExistsAsync(applicationUserUpdateDto.Role))
            {
                throw new BadRequestException(new Dictionary<string, string[]> { { "roles", new[] { $"The role '{applicationUserUpdateDto.Role}' does not exist." } } });
            }

            if (applicationUserUpdateDto.Role != currentRoles.FirstOrDefault())
            {
                var removeResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
                if (!removeResult.Succeeded)
                {
                    var errors = removeResult.Errors
                        .GroupBy(e => e.ToFieldName())
                        .ToDictionary(
                            g => g.Key,
                            g => g.Select(e => e.Description).ToArray()
                        );
                    throw new BadRequestException(errors);
                }
                var addResult = await _userManager.AddToRoleAsync(user, applicationUserUpdateDto.Role);
                if (!addResult.Succeeded)
                {
                    var errors = addResult.Errors
                        .GroupBy(e => e.ToFieldName())
                        .ToDictionary(
                            g => g.Key,
                            g => g.Select(e => e.Description).ToArray()
                        );
                    throw new BadRequestException(errors);
                }
            }

            await transaction.CommitAsync();

            return new ApplicationUserResponseDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                CreatedAt = user.CreatedAt,
                Role = applicationUserUpdateDto.Role
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
        await using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                throw new NotFoundException("User not found.");
            }

            await _context.TicketComments
                .Where(tc => tc.UserId == id)
                .ExecuteDeleteAsync();

            await _context.TicketHistories
                .Where(th => th.ChangeById == id)
                .ExecuteDeleteAsync();

            await _context.Tickets
                .Where(t => t.CreatedById == id)
                .ExecuteDeleteAsync();

            var result = await _userManager.DeleteAsync(user);
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
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }

    }
}