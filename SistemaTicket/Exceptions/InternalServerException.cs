namespace SistemaTicket.Exceptions;

public class InternalServerException(string message) : AppException(message, 500)
{
}