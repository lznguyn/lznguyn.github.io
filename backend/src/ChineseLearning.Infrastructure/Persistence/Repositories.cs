using ChineseLearning.Application.Abstractions;
using ChineseLearning.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ChineseLearning.Infrastructure.Persistence;

public class WordRepository(AppDbContext db) : IWordRepository
{
    public async Task<IReadOnlyList<Word>> GetByLevelAsync(int hskLevel, CancellationToken ct = default) =>
        await db.Words.AsNoTracking().Where(w => w.HskLevel == hskLevel).OrderBy(w => w.Id).ToListAsync(ct);

    public Task<Word?> GetByIdAsync(string wordId, CancellationToken ct = default) =>
        db.Words.AsNoTracking().FirstOrDefaultAsync(w => w.Id == wordId, ct);

    public async Task<IReadOnlyList<Word>> SearchAsync(string query, int? hskLevel, CancellationToken ct = default)
    {
        var words = db.Words.AsNoTracking().AsQueryable();
        if (hskLevel is { } level)
            words = words.Where(w => w.HskLevel == level);

        // SQLite LIKE is case-insensitive for ASCII; Chinese characters match exactly.
        var pattern = $"%{query}%";
        return await words
            .Where(w => EF.Functions.Like(w.Chinese, pattern) || EF.Functions.Like(w.English, pattern))
            .ToListAsync(ct);
    }

    public async Task<IReadOnlyList<Word>> GetRandomAsync(int hskLevel, int count, CancellationToken ct = default)
    {
        var words = await GetByLevelAsync(hskLevel, ct);
        return words.OrderBy(_ => Random.Shared.Next()).Take(count).ToList();
    }
}

public class LessonRepository(AppDbContext db) : ILessonRepository
{
    public async Task<IReadOnlyList<Lesson>> GetByLevelAsync(int hskLevel, CancellationToken ct = default) =>
        await db.Lessons.AsNoTracking()
            .Include(l => l.LessonWords)
            .Where(l => l.HskLevel == hskLevel)
            .OrderBy(l => l.Order)
            .ToListAsync(ct);

    public Task<Lesson?> GetWithWordsAsync(string lessonId, CancellationToken ct = default) =>
        db.Lessons.AsNoTracking()
            .Include(l => l.LessonWords).ThenInclude(lw => lw.Word)
            .FirstOrDefaultAsync(l => l.Id == lessonId, ct);
}

public class UserProgressRepository(AppDbContext db) : IUserProgressRepository
{
    public Task<UserProgress?> GetAsync(string userId, CancellationToken ct = default) =>
        db.UserProgress.Include(p => p.CompletedLessons).FirstOrDefaultAsync(p => p.UserId == userId, ct);

    public async Task SaveAsync(UserProgress progress, CancellationToken ct = default)
    {
        if (db.Entry(progress).State == EntityState.Detached)
            db.UserProgress.Add(progress);
        await db.SaveChangesAsync(ct);
    }
}
