export class UpdateUserProgress {
  constructor(userProgressRepository) {
    this.userProgressRepository = userProgressRepository;
  }

  async addLearnedWord(userProgress, wordId) {
    if (!userProgress || !wordId) {
      throw new Error('Invalid user progress or word ID.');
    }

    userProgress.addLearnedWord(wordId);
    this.userProgressRepository.saveProgress(userProgress);
    return userProgress;
  }

  async completeLesson(userProgress, lessonId, score) {
    if (!userProgress || !lessonId) {
      throw new Error('Invalid user progress or lesson ID.');
    }

    if (score < 0 || score > 100) {
      throw new Error('Score must be between 0 and 100.');
    }

    userProgress.completeLesson(lessonId, score);
    this.userProgressRepository.saveProgress(userProgress);
    return userProgress;
  }

  async setCurrentLesson(userProgress, lessonId) {
    if (!userProgress || !lessonId) {
      throw new Error('Invalid user progress or lesson ID.');
    }

    userProgress.setCurrentLesson(lessonId);
    this.userProgressRepository.saveProgress(userProgress);
    return userProgress;
  }
}
