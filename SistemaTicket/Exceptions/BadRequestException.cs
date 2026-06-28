namespace SistemaTicket.Exceptions;

public class BadRequestException(string message) : AppException(message, 400)
{
}