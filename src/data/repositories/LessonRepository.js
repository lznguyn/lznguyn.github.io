import { Lesson } from '../../domain/entities/Lesson.js';

export class LessonRepository {
  constructor(dataSource) {
    this.dataSource = dataSource;
    this.cache = new Map();
  }

  async getLessonsByLevel(hskLevel) {
    const cacheKey = `lessons_level_${hskLevel}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const data = await this.dataSource.fetchLessonsByLevel(hskLevel);
      const lessons = data.map(item => Lesson.create(item));
      this.cache.set(cacheKey, lessons);
      return lessons;
    } catch (error) {
      console.error(`Error fetching lessons for level ${hskLevel}:`, error);
      return [];
    }
  }

  async getLessonById(lessonId) {
    try {
      const data = await this.dataSource.fetchLessonById(lessonId);
      return Lesson.create(data);
    } catch (error) {
      console.error(`Error fetching lesson ${lessonId}:`, error);
      return null;
    }
  }

  async getLessonWithWords(lessonId) {
    try {
      const data = await this.dataSource.fetchLessonWithWords(lessonId);
      return Lesson.create(data);
    } catch (error) {
      console.error(`Error fetching lesson with words ${lessonId}:`, error);
      return null;
    }
  }

  clearCache() {
    this.cache.clear();
  }
}
