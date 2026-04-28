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
    public async Task<ApplicationUserResponseDto> Create(ApplicationUserCreateDto applicationUserCreateDto)
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
            List<string> invalidRoles = new();
            foreach (var role in applicationUserCreateDto.Roles)
            {
                if (!await _roleManager.RoleExistsAsync(role))
                {
                    invalidRoles.Add(role);
                }

            }
            if (invalidRoles.Count > 0)
            {
                throw new BadRequestException(new Dictionary<string, string[]> { { "roles", invalidRoles.Select(r => $"The role '{r}' does not exist.").ToArray() } });
            }
            var rolesDistict = applicationUserCreateDto.Roles.Select(r => r.ToLower()).Distinct().ToList();
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
            var roleResult = await _userManager.AddToRolesAsync(applicationUser, rolesDistict);
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
                Roles = rolesDistict
            };
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<List<ApplicationUserResponseDto>> GetAll(int page)
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
                Roles = roles.ToList()
            });
        }

        return userDtos;
    }

    public async Task<ApplicationUserResponseDto> GetById(string id)
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
            Roles = roles.ToList()
        };
    }
}