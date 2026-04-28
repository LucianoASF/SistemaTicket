using SistemaTicket.Exceptions;

namespace SistemaTicket.Middlewares;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;

    public ExceptionMiddleware(RequestDelegate next)
    {
        _next = next;
    }
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ErrorsAppException ex)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = StatusCodes.Status400BadRequest;

            var response = new Dictionary<string, object>
            {
                ["message"] = ex.Message,
                ["traceId"] = context.TraceIdentifier,
                ["errors"] = ex.Errors
            };
            await context.Response.WriteAsJsonAsync(response);
        }
        catch (Exception ex)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = ex switch
            {
                BadRequestException => StatusCodes.Status400BadRequest,
                UnauthorizedException => StatusCodes.Status401Unauthorized,
                NotFoundException => StatusCodes.Status404NotFound,
                ForbiddenException => StatusCodes.Status403Forbidden,
                _ => StatusCodes.Status500InternalServerError
            };
            var response = new Dictionary<string, object>
            {
                ["message"] = context.Response.StatusCode == 500 ? "Internal Server Error" : ex.Message,
                ["traceId"] = context.TraceIdentifier,
            };

            await context.Response.WriteAsJsonAsync(response);
        }
    }
}
