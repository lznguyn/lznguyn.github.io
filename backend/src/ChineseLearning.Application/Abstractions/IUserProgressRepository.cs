using ChineseLearning.Domain.Entities;

namespace ChineseLearning.Application.Abstractions;

public interface IUserProgressRepository
{
    Task<UserProgress?> GetAsync(string userId, CancellationToken ct = default);
    Task SaveAsync(UserProgress progress, CancellationToken ct = default);
}
