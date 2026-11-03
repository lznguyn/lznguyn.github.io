using ChineseLearning.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace ChineseLearning.Infrastructure.Persistence;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Word> Words => Set<Word>();
    public DbSet<Lesson> Lessons => Set<Lesson>();
    public DbSet<UserProgress> UserProgress => Set<UserProgress>();

    // SQLite drops DateTimeKind; re-tag stored values as UTC so JSON keeps the trailing "Z".
    protected override void ConfigureConventions(ModelConfigurationBuilder configuration) =>
        configuration.Properties<DateTime>().HaveConversion<UtcDateTimeConverter>();

    private class UtcDateTimeConverter() : ValueConverter<DateTime, DateTime>(
        v => v.ToUniversalTime(),
        v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<Word>(e =>
        {
            e.HasKey(w => w.Id);
            e.HasIndex(w => w.HskLevel);
        });

        b.Entity<Lesson>(e =>
        {
            e.HasKey(l => l.Id);
            e.HasIndex(l => l.HskLevel);
            e.Ignore(l => l.Words);
            e.Ignore(l => l.WordCount);
        });

        b.Entity<LessonWord>(e =>
        {
            e.HasKey(lw => new { lw.LessonId, lw.WordId });
            e.HasOne(lw => lw.Lesson).WithMany(l => l.LessonWords).HasForeignKey(lw => lw.LessonId);
            e.HasOne(lw => lw.Word).WithMany(w => w.LessonWords).HasForeignKey(lw => lw.WordId);
        });

        b.Entity<UserProgress>(e =>
        {
            e.HasKey(p => p.UserId);
            e.OwnsMany(p => p.CompletedLessons, c =>
            {
                c.WithOwner().HasForeignKey("UserId");
                c.Property<int>("Id");
                c.HasKey("Id");
            });
        });
    }
}
