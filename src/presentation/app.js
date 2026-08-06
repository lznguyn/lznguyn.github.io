import { LevelSelector } from './components/LevelSelector.js';
import { LessonView } from './components/LessonView.js';
import { QuizView } from './components/QuizView.js';
import { ProgressTracker } from './components/ProgressTracker.js';

import { WordRepository } from '../data/repositories/WordRepository.js';
import { LessonRepository } from '../data/repositories/LessonRepository.js';
import { UserProgressRepository } from '../data/repositories/UserProgressRepository.js';

import { MockDataSource } from '../data/datasources/MockDataSource.js';

import { GetLessonsByLevel } from '../domain/usecases/GetLessonsByLevel.js';
import { GetLessonWithWords } from '../domain/usecases/GetLessonWithWords.js';
import { GetRandomWordsForQuiz } from '../domain/usecases/GetRandomWordsForQuiz.js';
import { UpdateUserProgress } from '../domain/usecases/UpdateUserProgress.js';

export class ChineseLearningApp {
  constructor() {
    this.initializeDependencies();
    this.setupUIComponents();
    this.currentState = 'LEVEL_SELECTION';
    this.currentLevel = 1;
    this.currentLessons = [];
    this.currentLesson = null;
    this.userProgress = null;
  }

  initializeDependencies() {
    const dataSource = new MockDataSource();
    this.wordRepository = new WordRepository(dataSource);
    this.lessonRepository = new LessonRepository(dataSource);
    this.userProgressRepository = new UserProgressRepository();

    this.getLessonsByLevel = new GetLessonsByLevel(this.lessonRepository);
    this.getLessonWithWords = new GetLessonWithWords(this.lessonRepository);
    this.getRandomWordsForQuiz = new GetRandomWordsForQuiz(this.wordRepository);
    this.updateUserProgress = new UpdateUserProgress(this.userProgressRepository);
  }

  setupUIComponents() {
    this.levelSelector = new LevelSelector(
      document.getElementById('level-container'),
      (level) => this.selectLevel(level)
    );

    this.lessonView = new LessonView(document.getElementById('lesson-container'));
    this.lessonView.onWordLearned = (word) => this.recordWordLearned(word);
    this.lessonView.onLessonComplete = () => this.onLessonCompleted();

    this.quizView = new QuizView(document.getElementById('quiz-container'));
    this.quizView.onQuizComplete = (score, total, retry) => this.onQuizCompleted(score, total, retry);

    this.progressTracker = new ProgressTracker(document.getElementById('progress-container'));
  }

  async initialize() {
    this.userProgress = this.userProgressRepository.getProgress('user1', 1);
    this.showLevelSelection();
  }

  async selectLevel(level) {
    this.currentLevel = level;
    this.currentLessons = await this.getLessonsByLevel.execute(level);
    this.showLessonSelection();
  }

  showLevelSelection() {
    this.currentState = 'LEVEL_SELECTION';
    this.levelSelector.render();
    this.levelSelector.show();
    this.lessonView.hide();
    this.quizView.hide();
  }

  showLessonSelection() {
    this.currentState = 'LESSON_SELECTION';
    this.levelSelector.hide();
    this.lessonView.hide();
    this.quizView.hide();
    this.renderLessonSelection();
  }

  renderLessonSelection() {
    const container = document.getElementById('lessons-container');
    container.innerHTML = '<h2>Select a Lesson</h2>';
    const grid = document.createElement('div');
    grid.className = 'lessons-grid';

    this.currentLessons.forEach((lesson, idx) => {
      const card = document.createElement('div');
      card.className = 'lesson-card';
      card.innerHTML = `
        <h3>${lesson.title}</h3>
        <p>${lesson.description}</p>
        <p class="word-count">${lesson.words.length} words</p>
        <button class="btn-primary">Start Lesson</button>
      `;

      card.querySelector('.btn-primary').addEventListener('click', () => {
        this.startLesson(lesson.id);
      });

      grid.appendChild(card);
    });

    container.appendChild(grid);
  }

  async startLesson(lessonId) {
    this.currentLesson = await this.getLessonWithWords.execute(lessonId);
    this.showLesson();
  }

  showLesson() {
    this.currentState = 'LESSON_LEARNING';
    this.levelSelector.hide();
    this.quizView.hide();
    document.getElementById('lessons-container').style.display = 'none';
    this.lessonView.show();
    this.lessonView.loadLesson(this.currentLesson);
  }

  recordWordLearned(word) {
    this.updateUserProgress.addLearnedWord(this.userProgress, word.id);
  }

  async onLessonCompleted() {
    const words = this.currentLesson.words;
    const quizWords = words.slice(0, Math.min(10, words.length));

    this.currentState = 'QUIZ';
    this.lessonView.hide();
    this.quizView.show();
    this.quizView.generateQuestions(quizWords);
  }

  async onQuizCompleted(score, total, retry) {
    const percentage = Math.round((score / total) * 100);

    if (!retry) {
      await this.updateUserProgress.completeLesson(this.userProgress, this.currentLesson.id, percentage);
      this.progressTracker.displayProgress(this.userProgress, this.currentLessons.length);
      this.progressTracker.show();
      this.quizView.hide();
      this.showLessonSelection();
    } else {
      this.quizView.generateQuestions(this.currentLesson.words);
    }
  }

  start() {
    this.initialize();
  }
}

// Initialize and start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.app = new ChineseLearningApp();
    window.app.start();
  });
} else {
  window.app = new ChineseLearningApp();
  window.app.start();
}
