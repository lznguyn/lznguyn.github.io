using ChineseLearning.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ChineseLearning.Infrastructure.Persistence;

// Seed data ported from src/data/datasources/MockDataSource.js
public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        await db.Database.EnsureCreatedAsync();
        if (await db.Words.AnyAsync())
            return;

        var words = new List<Word>
        {
            W("1", "你好", "nǐ hǎo", "Hello", 1, "greeting", "你好，我是小王。"),
            W("2", "谢谢", "xièxie", "Thank you", 1, "verb", "谢谢你的帮助。"),
            W("3", "请", "qǐng", "Please", 1, "verb", "请坐。"),
            W("4", "喜欢", "xǐhuān", "Like", 2, "verb", "我喜欢看书。"),
            W("5", "学习", "xuéxí", "Study", 2, "verb", "我每天学习中文。"),
            W("6", "工作", "gōngzuò", "Work", 3, "noun/verb", "我在这家公司工作。"),
            W("7", "家庭", "jiātíng", "Family", 3, "noun", "我有一个小家庭。"),
            W("8", "抽象概念", "chōuxiàng gàiniàn", "Abstract concept", 7, "noun", "哲学研究抽象概念。"),
            W("9", "深刻理解", "shēnkè lǐjiě", "Deep understanding", 7, "noun phrase", "我对这个主题有深刻理解。"),
            W("10", "精妙构思", "jīngmiào gòusī", "Exquisite conception", 8, "noun phrase", "这个设计的精妙构思令人印象深刻。"),
            W("11", "蕴含深意", "yùnhán shēnyì", "Contain deep meaning", 8, "verb phrase", "这部作品蕴含深意。"),
            W("12", "洞察力", "dòngchá lì", "Insight/Discernment", 9, "noun", "他拥有敏锐的洞察力。"),
            W("13", "涵养文明", "hányǎng wénmíng", "Cultivate civilization", 9, "verb phrase", "我们应该涵养优秀的文明。"),
        };

        var lessons = new List<Lesson>
        {
            L("L1", "Basic Greetings", 1, "Learn basic greetings", "1", "2", "3"),
            L("L2", "Likes and Preferences", 2, "Express preferences", "4", "5"),
            L("L3", "Work and Family", 3, "Discuss work and family topics", "6", "7"),
            L("L7", "Abstract Concepts", 7, "Advanced philosophical vocabulary", "8", "9"),
            L("L8", "Sophisticated Expression", 8, "Master nuanced language expression", "10", "11"),
            L("L9", "Mastery Elite", 9, "Professional and elite-level Chinese proficiency", "12", "13"),
        };

        db.Words.AddRange(words);
        db.Lessons.AddRange(lessons);
        await db.SaveChangesAsync();
    }

    private static Word W(string id, string chinese, string pinyin, string english, int level, string pos, string example) =>
        new() { Id = id, Chinese = chinese, Pinyin = pinyin, English = english, HskLevel = level, PartOfSpeech = pos, Example = example };

    private static Lesson L(string id, string title, int level, string description, params string[] wordIds) =>
        new()
        {
            Id = id, Title = title, HskLevel = level, Description = description, Order = 1,
            LessonWords = wordIds.Select((wid, i) => new LessonWord { LessonId = id, WordId = wid, Position = i }).ToList(),
        };
}
