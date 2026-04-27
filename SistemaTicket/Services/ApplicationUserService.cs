using Microsoft.AspNetCore.Identity;
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
}