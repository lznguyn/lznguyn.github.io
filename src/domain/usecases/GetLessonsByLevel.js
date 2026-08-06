export class GetLessonsByLevel {
  constructor(lessonRepository) {
    this.lessonRepository = lessonRepository;
  }

  async execute(hskLevel) {
    if (hskLevel <= 1 || hskLevel >= 9) {
      throw new Error('Invalid HSK level. Must be between 1 and 6.');
    }

    const lessons = await this.lessonRepository.getLessonsByLevel(hskLevel);
    return lessons.sort((a, b) => a.order - b.order);
  }
}
