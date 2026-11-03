namespace ChineseLearning.Domain.Entities;

public class Word
{
    public string Id { get; set; } = string.Empty;
    public string Chinese { get; set; } = string.Empty;
    public string Pinyin { get; set; } = string.Empty;
    public string English { get; set; } = string.Empty;
    public int HskLevel { get; set; }
    public string PartOfSpeech { get; set; } = "noun";
    public string Example { get; set; } = string.Empty;

    public List<LessonWord> LessonWords { get; set; } = new();
}
