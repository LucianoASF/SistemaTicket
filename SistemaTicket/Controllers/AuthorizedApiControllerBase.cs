using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaTicket.Enums;
using SistemaTicket.Exceptions;
using System.Security.Claims;

namespace SistemaTicket.Controllers;

[ApiController]
[Authorize]
public abstract class AuthorizedApiControllerBase : ControllerBase
{
    protected string CurrentUserId
    {
        get
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
            return userId;
        }

    }

    protected UserRole CurrentUserRole
    {
        get
        {
            var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;
            if (string.IsNullOrEmpty(roleClaim) || !Enum.TryParse<UserRole>(roleClaim, out var role))
            {
                throw new UnauthorizedException("User role is not specified.");
            }
            return role;
        }
    }

    private bool IsInRole(UserRole role)
    {
        return User.IsInRole(role.ToString());
    }

    protected bool IsAdmin => IsInRole(UserRole.Admin);
    protected bool IsSupport => IsInRole(UserRole.Support);
    protected bool IsUser => IsInRole(UserRole.User);


}
