namespace SistemaTicket.Dtos.ApplicationUser;

public class PagedApplicationUsersResponseDto
{

    public List<ApplicationUserResponseDto> Users { get; set; } = [];
    public int Total { get; set; }
    public RoleCountsDto RoleCounts { get; set; } = new();
}

public class RoleCountsDto
{
    public int Admin { get; set; }
    public int Support { get; set; }
    public int User { get; set; }
}
