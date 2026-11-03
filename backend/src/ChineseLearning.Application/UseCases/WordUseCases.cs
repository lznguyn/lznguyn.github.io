using ChineseLearning.Application.Abstractions;
using ChineseLearning.Application.Common;
using ChineseLearning.Application.Dtos;
using ChineseLearning.Domain.ValueObjects;

namespace ChineseLearning.Application.UseCases;

internal static class Guard
{
    public static void Level(int hskLevel)
    {
        if (!HskLevel.IsValid(hskLevel))
            throw new ValidationException($"Invalid HSK level. Must be between {HskLevel.Min} and {HskLevel.Max}.");
    }
}

public class GetWordsByLevel(IWordRepository words)
{
    public async Task<IReadOnlyList<WordDto>> ExecuteAsync(int hskLevel, CancellationToken ct = default)
    {
        Guard.Level(hskLevel);
        return (await words.GetByLevelAsync(hskLevel, ct)).Select(WordDto.From).ToList();
    }
}

public class GetWordById(IWordRepository words)
{
    public async Task<WordDto> ExecuteAsync(string wordId, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(wordId))
            throw new ValidationException("Invalid word ID.");

        var word = await words.GetByIdAsync(wordId, ct)
            ?? throw new NotFoundException($"Word with ID {wordId} not found.");
        return WordDto.From(word);
    }
}

public class SearchWords(IWordRepository words)
{
    public async Task<IReadOnlyList<WordDto>> ExecuteAsync(string query, int? hskLevel, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(query))
            throw new ValidationException("Search query must not be empty.");
        if (hskLevel is { } level)
            Guard.Level(level);

        return (await words.SearchAsync(query.Trim(), hskLevel, ct)).Select(WordDto.From).ToList();
    }
}

public class GetRandomWordsForQuiz(IWordRepository words)
{
    public async Task<IReadOnlyList<WordDto>> ExecuteAsync(int hskLevel, int count = 10, CancellationToken ct = default)
    {
        Guard.Level(hskLevel);
        if (count is < 1 or > 50)
            throw new ValidationException("Quiz count must be between 1 and 50.");

        var result = await words.GetRandomAsync(hskLevel, count, ct);
        if (result.Count == 0)
            throw new NotFoundException($"No words available for level {hskLevel}.");

        return result.Select(WordDto.From).ToList();
    }
}
