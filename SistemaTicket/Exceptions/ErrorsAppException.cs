namespace SistemaTicket.Exceptions;

public abstract class ErrorsAppException : AppException
{
    public Dictionary<string, string[]> Errors { get; }
    protected ErrorsAppException(string message, int statusCode, Dictionary<string, string[]> errors)
    : base(message, statusCode)
    {
        Errors = errors;
    }
}
