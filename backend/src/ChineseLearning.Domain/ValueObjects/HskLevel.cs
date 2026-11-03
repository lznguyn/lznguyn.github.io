namespace ChineseLearning.Domain.ValueObjects;

public readonly record struct HskLevel
{
    public const int Min = 1;
    public const int Max = 9;

    public int Value { get; }

    public HskLevel(int value)
    {
        if (!IsValid(value))
            throw new ArgumentOutOfRangeException(nameof(value), $"HSK level must be between {Min} and {Max}.");
        Value = value;
    }

    public static bool IsValid(int value) => value is >= Min and <= Max;

    public static implicit operator int(HskLevel level) => level.Value;
}
