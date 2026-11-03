using ChineseLearning.Application.Abstractions;
using ChineseLearning.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace ChineseLearning.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, string connectionString)
    {
        services.AddDbContext<AppDbContext>(o => o.UseSqlite(connectionString));
        services.AddScoped<IWordRepository, WordRepository>();
        services.AddScoped<ILessonRepository, LessonRepository>();
        services.AddScoped<IUserProgressRepository, UserProgressRepository>();
        return services;
    }
}
