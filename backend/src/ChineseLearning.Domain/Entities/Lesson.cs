namespace ChineseLearning.Domain.Entities;

public class Lesson
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public int HskLevel { get; set; }
    public string Description { get; set; } = string.Empty;
    public int Order { get; set; }

    public List<LessonWord> LessonWords { get; set; } = new();

    public int WordCount => LessonWords.Count;

    public IEnumerable<Word> Words => LessonWords.OrderBy(lw => lw.Position).Select(lw => lw.Word);
}

public class LessonWord
{
    public string LessonId { get; set; } = string.Empty;
    public Lesson Lesson { get; set; } = null!;
    public string WordId { get; set; } = string.Empty;
    public Word Word { get; set; } = null!;
    public int Position { get; set; }
}
