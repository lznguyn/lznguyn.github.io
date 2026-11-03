using ChineseLearning.Application.Abstractions;
using ChineseLearning.Application.Common;
using ChineseLearning.Application.Dtos;
using ChineseLearning.Domain.Entities;
using ChineseLearning.Domain.ValueObjects;

namespace ChineseLearning.Application.UseCases;

public class GetUserProgress(IUserProgressRepository progress)
{
    public async Task<UserProgressDto> ExecuteAsync(string userId, int defaultLevel = 1, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(userId))
            throw new ValidationException("Invalid user ID.");
        Guard.Level(defaultLevel);

        var existing = await progress.GetAsync(userId, ct) ?? new UserProgress(userId, defaultLevel);
        return UserProgressDto.From(existing);
    }
}

public class UpdateUserProgress(IUserProgressRepository progress)
{
    public Task<UserProgressDto> AddLearnedWordAsync(string userId, string wordId, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(wordId))
            throw new ValidationException("Invalid word ID.");
        return UpdateAsync(userId, p => p.AddLearnedWord(wordId), ct);
    }

    public Task<UserProgressDto> CompleteLessonAsync(string userId, string lessonId, int score, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(lessonId))
            throw new ValidationException("Invalid lesson ID.");
        if (score is < 0 or > 100)
            throw new ValidationException("Score must be between 0 and 100.");
        return UpdateAsync(userId, p => p.CompleteLesson(lessonId, score), ct);
    }

    public Task<UserProgressDto> SetCurrentLessonAsync(string userId, string lessonId, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(lessonId))
            throw new ValidationException("Invalid lesson ID.");
        return UpdateAsync(userId, p => p.SetCurrentLesson(lessonId), ct);
    }

    private async Task<UserProgressDto> UpdateAsync(string userId, Action<UserProgress> mutate, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(userId))
            throw new ValidationException("Invalid user ID.");

        var current = await progress.GetAsync(userId, ct) ?? new UserProgress(userId, HskLevel.Min);
        mutate(current);
        await progress.SaveAsync(current, ct);
        return UserProgressDto.From(current);
    }
}
