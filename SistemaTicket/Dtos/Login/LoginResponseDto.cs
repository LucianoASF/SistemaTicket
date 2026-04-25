namespace SistemaTicket.Dtos.Login;

public class LoginResponseDto
{
    public string Token { get; set; } = string.Empty;
    public DateTime Expires { get; set; }
}
