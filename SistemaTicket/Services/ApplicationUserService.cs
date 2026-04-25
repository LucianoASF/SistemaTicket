using Microsoft.AspNetCore.Identity;
using SistemaTicket.Dtos.ApplicationUser;
using SistemaTicket.Entities;
using SistemaTicket.Exceptions;
using SistemaTicket.Extentions;

namespace SistemaTicket.Services;

public class ApplicationUserService : IApplicationUserService
{
    private readonly UserManager<ApplicationUser> _userManager;

    public ApplicationUserService(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
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
            CreatedAt = applicationUser.CreatedAt
        };
    }
}