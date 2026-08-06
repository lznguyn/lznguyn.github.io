export class GetLessonWithWords {
  constructor(lessonRepository) {
    this.lessonRepository = lessonRepository;
  }

  async execute(lessonId) {
    if (!lessonId || typeof lessonId !== 'string') {
      throw new Error('Invalid lesson ID.');
    }

    const lesson = await this.lessonRepository.getLessonWithWords(lessonId);
    if (!lesson) {
      throw new Error(`Lesson with ID ${lessonId} not found.`);
    }

    return lesson;
  }
}
