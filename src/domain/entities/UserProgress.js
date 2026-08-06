import { PROGRESS_STATUS } from '../../config/constants.js';

export class UserProgress {
  constructor(userId, hskLevel) {
    this.userId = userId;
    this.currentLevel = hskLevel;
    this.completedLessons = [];
    this.currentLesson = null;
    this.learnedWords = new Set();
    this.totalScore = 0;
    this.lastActivityDate = new Date();
    this.streakDays = 0;
  }

  addLearnedWord(wordId) {
    this.learnedWords.add(wordId);
  }

  completeLesson(lessonId, score) {
    this.completedLessons.push({
      lessonId,
      score,
      completedDate: new Date(),
    });
    this.totalScore += score;
    this.updateLastActivityDate();
  }

  setCurrentLesson(lessonId) {
    this.currentLesson = lessonId;
    this.updateLastActivityDate();
  }

  updateLastActivityDate() {
    this.lastActivityDate = new Date();
  }

  getProgress(totalLessons) {
    return Math.round((this.completedLessons.length / totalLessons) * 100);
  }

  toJSON() {
    return {
      userId: this.userId,
      currentLevel: this.currentLevel,
      completedLessons: this.completedLessons,
      currentLesson: this.currentLesson,
      learnedWords: Array.from(this.learnedWords),
      totalScore: this.totalScore,
      lastActivityDate: this.lastActivityDate,
      streakDays: this.streakDays,
    };
  }

  static fromJSON(data) {
    const progress = new UserProgress(data.userId, data.currentLevel);
    progress.completedLessons = data.completedLessons || [];
    progress.currentLesson = data.currentLesson;
    progress.learnedWords = new Set(data.learnedWords || []);
    progress.totalScore = data.totalScore || 0;
    progress.lastActivityDate = new Date(data.lastActivityDate);
    progress.streakDays = data.streakDays || 0;
    return progress;
  }
}
