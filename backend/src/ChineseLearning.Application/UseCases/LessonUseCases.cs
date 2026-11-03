using ChineseLearning.Application.Abstractions;
using ChineseLearning.Application.Common;
using ChineseLearning.Application.Dtos;

namespace ChineseLearning.Application.UseCases;

public class GetLessonsByLevel(ILessonRepository lessons)
{
    public async Task<IReadOnlyList<LessonDto>> ExecuteAsync(int hskLevel, CancellationToken ct = default)
    {
        Guard.Level(hskLevel);
        return (await lessons.GetByLevelAsync(hskLevel, ct))
            .OrderBy(l => l.Order)
            .Select(LessonDto.From)
            .ToList();
    }
}

public class GetLessonById(ILessonRepository lessons)
{
    public async Task<LessonDto> ExecuteAsync(string lessonId, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(lessonId))
            throw new ValidationException("Invalid lesson ID.");

        var lesson = await lessons.GetWithWordsAsync(lessonId, ct)
            ?? throw new NotFoundException($"Lesson with ID {lessonId} not found.");
        return LessonDto.From(lesson);
    }
}

public class GetLessonWithWords(ILessonRepository lessons)
{
    public async Task<LessonWithWordsDto> ExecuteAsync(string lessonId, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(lessonId))
            throw new ValidationException("Invalid lesson ID.");

        var lesson = await lessons.GetWithWordsAsync(lessonId, ct)
            ?? throw new NotFoundException($"Lesson with ID {lessonId} not found.");
        return LessonWithWordsDto.From(lesson);
    }
}
