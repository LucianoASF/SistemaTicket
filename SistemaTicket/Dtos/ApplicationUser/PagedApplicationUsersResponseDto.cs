namespace SistemaTicket.Dtos.ApplicationUser;

public class PagedApplicationUsersResponseDto
{

    public List<ApplicationUserResponseDto> Users { get; set; } = [];
    public int Total { get; set; }
    public Dictionary<string, int> RoleCounts { get; set; } = [];

}
