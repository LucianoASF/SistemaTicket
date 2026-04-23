namespace SistemaTicket.Exceptions;

public class BadRequestException : AppException
{
    public List<string> Errors { get; }

    public BadRequestException(List<string> errors)
        : base("Validation error", 400)
    {
        Errors = errors;
    }


}