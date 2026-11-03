using ChineseLearning.Application.Common;

namespace ChineseLearning.Api.Middleware;

public class ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (ValidationException ex)
        {
            await Write(context, StatusCodes.Status400BadRequest, ex.Message);
        }
        catch (NotFoundException ex)
        {
            await Write(context, StatusCodes.Status404NotFound, ex.Message);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled exception");
            await Write(context, StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
        }
    }

    private static Task Write(HttpContext context, int status, string message)
    {
        context.Response.StatusCode = status;
        return context.Response.WriteAsJsonAsync(new { error = message });
    }
}
