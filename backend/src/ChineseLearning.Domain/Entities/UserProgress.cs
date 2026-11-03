namespace ChineseLearning.Domain.Entities;

public class UserProgress
{
    public string UserId { get; private set; } = string.Empty;
    public int CurrentLevel { get; private set; }
    public string? CurrentLesson { get; private set; }
    public List<string> LearnedWordIds { get; private set; } = new();
    public List<CompletedLesson> CompletedLessons { get; private set; } = new();
    public int TotalScore { get; private set; }
    public DateTime LastActivityDate { get; private set; }
    public int StreakDays { get; private set; }

    private UserProgress() { }

    public UserProgress(string userId, int currentLevel)
    {
        UserId = userId;
        CurrentLevel = currentLevel;
        LastActivityDate = DateTime.UtcNow;
    }

    public void AddLearnedWord(string wordId)
    {
        if (!LearnedWordIds.Contains(wordId))
            LearnedWordIds.Add(wordId);
        Touch();
    }

    public void CompleteLesson(string lessonId, int score)
    {
        CompletedLessons.Add(new CompletedLesson(lessonId, score, DateTime.UtcNow));
        TotalScore += score;
        Touch();
    }

    public void SetCurrentLesson(string lessonId)
    {
        CurrentLesson = lessonId;
        Touch();
    }

    public int GetProgress(int totalLessons) =>
        totalLessons == 0 ? 0 : (int)Math.Round(CompletedLessons.Count * 100.0 / totalLessons);

    private void Touch() => LastActivityDate = DateTime.UtcNow;
}

public record CompletedLesson(string LessonId, int Score, DateTime CompletedDate);
