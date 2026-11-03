using ChineseLearning.Application.UseCases;
using Microsoft.Extensions.DependencyInjection;

namespace ChineseLearning.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<GetWordsByLevel>();
        services.AddScoped<GetWordById>();
        services.AddScoped<SearchWords>();
        services.AddScoped<GetRandomWordsForQuiz>();
        services.AddScoped<GetLessonsByLevel>();
        services.AddScoped<GetLessonById>();
        services.AddScoped<GetLessonWithWords>();
        services.AddScoped<GetUserProgress>();
        services.AddScoped<UpdateUserProgress>();
        return services;
    }
}
