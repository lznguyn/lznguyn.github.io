using ChineseLearning.Api.Endpoints;
using ChineseLearning.Api.Middleware;
using ChineseLearning.Application;
using ChineseLearning.Infrastructure;
using ChineseLearning.Infrastructure.Persistence;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Composition root (replaces initializeDependencies in app.js)
builder.Services.AddApplication();
builder.Services.AddInfrastructure(
    builder.Configuration.GetConnectionString("Default") ?? "Data Source=chinese-learning.db");

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod()));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
    await DbSeeder.SeedAsync(scope.ServiceProvider.GetRequiredService<AppDbContext>());

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseCors();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Serve the JS frontend (index.html + src/) so one `dotnet run` is enough. Only these two are exposed,
// not the whole repo root (which holds backend sources and .git).
var frontendRoot = Path.GetFullPath(Path.Combine(
    app.Environment.ContentRootPath, builder.Configuration["Frontend:RootPath"] ?? "../../.."));
if (File.Exists(Path.Combine(frontendRoot, "index.html")))
{
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(Path.Combine(frontendRoot, "src")),
        RequestPath = "/src",
    });
    app.MapGet("/", () => Results.File(Path.Combine(frontendRoot, "index.html"), "text/html")).ExcludeFromDescription();
}

var api = app.MapGroup("/api");
api.MapWordEndpoints();
api.MapLessonEndpoints();
api.MapProgressEndpoints();

app.Run();

public partial class Program;
