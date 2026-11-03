using ChineseLearning.Application.Abstractions;
using ChineseLearning.Application.Common;
using ChineseLearning.Application.UseCases;
using ChineseLearning.Domain.Entities;

namespace ChineseLearning.Application.Tests;

public class UseCaseTests
{
    private class FakeWordRepository(params Word[] words) : IWordRepository
    {
        public Task<IReadOnlyList<Word>> GetByLevelAsync(int hskLevel, CancellationToken ct = default) =>
            Task.FromResult<IReadOnlyList<Word>>(words.Where(w => w.HskLevel == hskLevel).ToList());

        public Task<Word?> GetByIdAsync(string wordId, CancellationToken ct = default) =>
            Task.FromResult(words.FirstOrDefault(w => w.Id == wordId));

        public Task<IReadOnlyList<Word>> SearchAsync(string query, int? hskLevel, CancellationToken ct = default) =>
            Task.FromResult<IReadOnlyList<Word>>(words.Where(w => w.English.Contains(query)).ToList());

        public Task<IReadOnlyList<Word>> GetRandomAsync(int hskLevel, int count, CancellationToken ct = default) =>
            Task.FromResult<IReadOnlyList<Word>>(words.Where(w => w.HskLevel == hskLevel).Take(count).ToList());
    }

    private class FakeLessonRepository(params Lesson[] lessons) : ILessonRepository
    {
        public Task<IReadOnlyList<Lesson>> GetByLevelAsync(int hskLevel, CancellationToken ct = default) =>
            Task.FromResult<IReadOnlyList<Lesson>>(lessons.Where(l => l.HskLevel == hskLevel).ToList());

        public Task<Lesson?> GetWithWordsAsync(string lessonId, CancellationToken ct = default) =>
            Task.FromResult(lessons.FirstOrDefault(l => l.Id == lessonId));
    }

    private class FakeProgressRepository : IUserProgressRepository
    {
        public Dictionary<string, UserProgress> Store { get; } = new();

        public Task<UserProgress?> GetAsync(string userId, CancellationToken ct = default) =>
            Task.FromResult(Store.GetValueOrDefault(userId));

        public Task SaveAsync(UserProgress progress, CancellationToken ct = default)
        {
            Store[progress.UserId] = progress;
            return Task.CompletedTask;
        }
    }

    private static Word Word(string id, int level) =>
        new() { Id = id, Chinese = "字", Pinyin = "zì", English = "word " + id, HskLevel = level };

    [Theory]
    [InlineData(0)]
    [InlineData(10)]
    public async Task GetLessonsByLevel_RejectsOutOfRangeLevel(int level)
    {
        var uc = new GetLessonsByLevel(new FakeLessonRepository());
        await Assert.ThrowsAsync<ValidationException>(() => uc.ExecuteAsync(level));
    }

    [Theory]
    [InlineData(1)]
    [InlineData(9)]
    public async Task GetLessonsByLevel_AcceptsBoundaryLevels(int level)
    {
        var uc = new GetLessonsByLevel(new FakeLessonRepository());
        Assert.Empty(await uc.ExecuteAsync(level));
    }

    [Fact]
    public async Task GetLessonsByLevel_OrdersByOrder()
    {
        var uc = new GetLessonsByLevel(new FakeLessonRepository(
            new Lesson { Id = "b", HskLevel = 2, Order = 2 },
            new Lesson { Id = "a", HskLevel = 2, Order = 1 }));

        var result = await uc.ExecuteAsync(2);

        Assert.Equal(["a", "b"], result.Select(l => l.Id));
    }

    [Fact]
    public async Task GetLessonWithWords_ThrowsNotFound_WhenMissing()
    {
        var uc = new GetLessonWithWords(new FakeLessonRepository());
        await Assert.ThrowsAsync<NotFoundException>(() => uc.ExecuteAsync("nope"));
    }

    [Theory]
    [InlineData(0)]
    [InlineData(51)]
    public async Task GetRandomWordsForQuiz_RejectsBadCount(int count)
    {
        var uc = new GetRandomWordsForQuiz(new FakeWordRepository(Word("1", 1)));
        await Assert.ThrowsAsync<ValidationException>(() => uc.ExecuteAsync(1, count));
    }

    [Fact]
    public async Task GetRandomWordsForQuiz_ThrowsNotFound_WhenLevelHasNoWords()
    {
        var uc = new GetRandomWordsForQuiz(new FakeWordRepository(Word("1", 1)));
        await Assert.ThrowsAsync<NotFoundException>(() => uc.ExecuteAsync(5));
    }

    [Fact]
    public async Task UpdateUserProgress_CompleteLesson_PersistsAndAccumulatesScore()
    {
        var repo = new FakeProgressRepository();
        var uc = new UpdateUserProgress(repo);

        await uc.CompleteLessonAsync("u1", "L1", 80);
        var result = await uc.CompleteLessonAsync("u1", "L2", 90);

        Assert.Equal(170, result.TotalScore);
        Assert.Equal(2, repo.Store["u1"].CompletedLessons.Count);
    }

    [Theory]
    [InlineData(-1)]
    [InlineData(101)]
    public async Task UpdateUserProgress_CompleteLesson_RejectsBadScore(int score)
    {
        var uc = new UpdateUserProgress(new FakeProgressRepository());
        await Assert.ThrowsAsync<ValidationException>(() => uc.CompleteLessonAsync("u1", "L1", score));
    }

    [Fact]
    public async Task UpdateUserProgress_AddLearnedWord_IsIdempotent()
    {
        var repo = new FakeProgressRepository();
        var uc = new UpdateUserProgress(repo);

        await uc.AddLearnedWordAsync("u1", "1");
        var result = await uc.AddLearnedWordAsync("u1", "1");

        Assert.Single(result.LearnedWords);
    }
}
