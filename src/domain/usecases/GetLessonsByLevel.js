import { MIN_HSK_LEVEL, MAX_HSK_LEVEL } from '../../config/constants.js';

export class GetLessonsByLevel {
  constructor(lessonRepository) {
    this.lessonRepository = lessonRepository;
  }

  async execute(hskLevel) {
    if (!Number.isInteger(hskLevel) || hskLevel < MIN_HSK_LEVEL || hskLevel > MAX_HSK_LEVEL) {
      throw new Error(`Invalid HSK level. Must be between ${MIN_HSK_LEVEL} and ${MAX_HSK_LEVEL}.`);
    }

    const lessons = await this.lessonRepository.getLessonsByLevel(hskLevel);
    return lessons.sort((a, b) => a.order - b.order);
  }
}
