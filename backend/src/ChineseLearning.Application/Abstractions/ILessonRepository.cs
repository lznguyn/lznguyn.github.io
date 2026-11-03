using ChineseLearning.Domain.Entities;

namespace ChineseLearning.Application.Abstractions;

public interface ILessonRepository
{
    Task<IReadOnlyList<Lesson>> GetByLevelAsync(int hskLevel, CancellationToken ct = default);
    Task<Lesson?> GetWithWordsAsync(string lessonId, CancellationToken ct = default);
}
