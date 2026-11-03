using ChineseLearning.Application.UseCases;

namespace ChineseLearning.Api.Endpoints;

public static class WordEndpoints
{
    public static void MapWordEndpoints(this RouteGroupBuilder api)
    {
        var g = api.MapGroup("/words").WithTags("Words");

        g.MapGet("/", async (int level, GetWordsByLevel uc, CancellationToken ct) =>
            Results.Ok(await uc.ExecuteAsync(level, ct)));

        // Declared before /{id} so "search" and "quiz" are not captured as ids.
        g.MapGet("/search", async (string q, int? level, SearchWords uc, CancellationToken ct) =>
            Results.Ok(await uc.ExecuteAsync(q, level, ct)));

        g.MapGet("/quiz", async (int level, int? count, GetRandomWordsForQuiz uc, CancellationToken ct) =>
            Results.Ok(await uc.ExecuteAsync(level, count ?? 10, ct)));

        g.MapGet("/{id}", async (string id, GetWordById uc, CancellationToken ct) =>
            Results.Ok(await uc.ExecuteAsync(id, ct)));
    }
}

public static class LessonEndpoints
{
    public static void MapLessonEndpoints(this RouteGroupBuilder api)
    {
        var g = api.MapGroup("/lessons").WithTags("Lessons");

        g.MapGet("/", async (int level, GetLessonsByLevel uc, CancellationToken ct) =>
            Results.Ok(await uc.ExecuteAsync(level, ct)));

        g.MapGet("/{id}", async (string id, GetLessonById uc, CancellationToken ct) =>
            Results.Ok(await uc.ExecuteAsync(id, ct)));

        g.MapGet("/{id}/words", async (string id, GetLessonWithWords uc, CancellationToken ct) =>
            Results.Ok(await uc.ExecuteAsync(id, ct)));
    }
}

public static class ProgressEndpoints
{
    public record LearnedWordRequest(string WordId);
    public record CompleteLessonRequest(string LessonId, int Score);
    public record CurrentLessonRequest(string LessonId);

    public static void MapProgressEndpoints(this RouteGroupBuilder api)
    {
        var g = api.MapGroup("/users/{userId}/progress").WithTags("Progress");

        g.MapGet("/", async (string userId, int? level, GetUserProgress uc, CancellationToken ct) =>
            Results.Ok(await uc.ExecuteAsync(userId, level ?? 1, ct)));

        g.MapPost("/learned-words", async (string userId, LearnedWordRequest body, UpdateUserProgress uc, CancellationToken ct) =>
            Results.Ok(await uc.AddLearnedWordAsync(userId, body.WordId, ct)));

        g.MapPost("/completed-lessons", async (string userId, CompleteLessonRequest body, UpdateUserProgress uc, CancellationToken ct) =>
            Results.Ok(await uc.CompleteLessonAsync(userId, body.LessonId, body.Score, ct)));

        g.MapPut("/current-lesson", async (string userId, CurrentLessonRequest body, UpdateUserProgress uc, CancellationToken ct) =>
            Results.Ok(await uc.SetCurrentLessonAsync(userId, body.LessonId, ct)));
    }
}
