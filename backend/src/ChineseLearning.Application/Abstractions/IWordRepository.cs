using ChineseLearning.Domain.Entities;

namespace ChineseLearning.Application.Abstractions;

public interface IWordRepository
{
    Task<IReadOnlyList<Word>> GetByLevelAsync(int hskLevel, CancellationToken ct = default);
    Task<Word?> GetByIdAsync(string wordId, CancellationToken ct = default);
    Task<IReadOnlyList<Word>> SearchAsync(string query, int? hskLevel, CancellationToken ct = default);
    Task<IReadOnlyList<Word>> GetRandomAsync(int hskLevel, int count, CancellationToken ct = default);
}
