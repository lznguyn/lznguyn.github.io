using ChineseLearning.Domain.Entities;

namespace ChineseLearning.Application.Dtos;

public record WordDto(string Id, string Chinese, string Pinyin, string English, int HskLevel, string PartOfSpeech, string Example)
{
    public static WordDto From(Word w) =>
        new(w.Id, w.Chinese, w.Pinyin, w.English, w.HskLevel, w.PartOfSpeech, w.Example);
}

// Words holds word ids here, matching the shape the JS client expects for lesson lists.
public record LessonDto(string Id, string Title, int HskLevel, IReadOnlyList<string> Words, string Description, int Order)
{
    public static LessonDto From(Lesson l) =>
        new(l.Id, l.Title, l.HskLevel,
            l.LessonWords.OrderBy(lw => lw.Position).Select(lw => lw.WordId).ToList(),
            l.Description, l.Order);
}

public record LessonWithWordsDto(string Id, string Title, int HskLevel, IReadOnlyList<WordDto> Words, string Description, int Order)
{
    public static LessonWithWordsDto From(Lesson l) =>
        new(l.Id, l.Title, l.HskLevel, l.Words.Select(WordDto.From).ToList(), l.Description, l.Order);
}

public record CompletedLessonDto(string LessonId, int Score, DateTime CompletedDate);

public record UserProgressDto(
    string UserId, int CurrentLevel, string? CurrentLesson,
    IReadOnlyList<string> LearnedWords, IReadOnlyList<CompletedLessonDto> CompletedLessons,
    int TotalScore, DateTime LastActivityDate, int StreakDays)
{
    public static UserProgressDto From(UserProgress p) =>
        new(p.UserId, p.CurrentLevel, p.CurrentLesson, p.LearnedWordIds.ToList(),
            p.CompletedLessons.Select(c => new CompletedLessonDto(c.LessonId, c.Score, c.CompletedDate)).ToList(),
            p.TotalScore, p.LastActivityDate, p.StreakDays);
}
