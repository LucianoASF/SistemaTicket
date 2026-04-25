namespace SistemaTicket.Exceptions;

public class BadRequestException(Dictionary<string, string[]> errors) : ErrorsAppException("Validation error", 400, errors)
{
}