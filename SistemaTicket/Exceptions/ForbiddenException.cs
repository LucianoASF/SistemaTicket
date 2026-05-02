namespace SistemaTicket.Exceptions;

public class ForbiddenException(string message) : AppException(message, 401)
{
}
