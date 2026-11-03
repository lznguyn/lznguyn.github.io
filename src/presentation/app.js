import { LevelSelector } from './components/LevelSelector.js';
import { LessonView } from './components/LessonView.js';
import { QuizView } from './components/QuizView.js';
import { ProgressTracker } from './components/ProgressTracker.js';

import { WordRepository } from '../data/repositories/WordRepository.js';
import { LessonRepository } from '../data/repositories/LessonRepository.js';
import { UserProgressRepository } from '../data/repositories/UserProgressRepository.js';

import { ApiDataSource } from '../data/datasources/ApiDataSource.js';

import { GetLessonsByLevel } from '../domain/usecases/GetLessonsByLevel.js';
import { GetLessonWithWords } from '../domain/usecases/GetLessonWithWords.js';
import { GetRandomWordsForQuiz } from '../domain/usecases/GetRandomWordsForQuiz.js';
import { UpdateUserProgress } from '../domain/usecases/UpdateUserProgress.js';

import { HSK_LEVELS } from '../config/constants.js';
import { escapeHtml, shuffle } from '../utils/html.js';

const QUIZ_LENGTH = 10;

const VIEWS = {
  LEVEL_SELECTION: 'level-container',
  LESSON_SELECTION: 'lessons-container',
  LESSON_LEARNING: 'lesson-container',
  QUIZ: 'quiz-container',
  PROGRESS: 'progress-container',
};

export class ChineseLearningApp {
  constructor() {
    this.initializeDependencies();
    this.setupUIComponents();
    this.currentState = 'LEVEL_SELECTION';
    this.currentLevel = 1;
    this.currentLessons = [];
    this.currentLesson = null;
    this.quizPool = [];
    this.userProgress = null;
    this.messageTimer = null;
  }

  initializeDependencies() {
    // ASP.NET Core backend in /backend serves both this UI and /api (same origin).
    // Port 8080 = UI opened through `npm start`, so the API lives on a different origin.
    const apiUrl = location.port === '8080' ? 'http://localhost:5000/api' : '/api';
    const dataSource = new ApiDataSource(apiUrl);
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
    this.lessonView.onExit = () => this.showLessonSelection();

    this.quizView = new QuizView(document.getElementById('quiz-container'));
    this.quizView.onQuizComplete = (score, total, retry) => this.onQuizCompleted(score, total, retry);

    this.progressTracker = new ProgressTracker(document.getElementById('progress-container'));

    document.getElementById('btnHome').addEventListener('click', () => this.showLevelSelection());
    document.getElementById('btnLevels').addEventListener('click', () => this.showLevelSelection());
    document.getElementById('btnProgress').addEventListener('click', () => this.showProgress());
  }

  async initialize() {
    this.userProgress = this.userProgressRepository.getProgress('user1', 1);
    this.currentLevel = this.userProgress.currentLevel || 1;
    this.showLevelSelection();
  }

  // ---- View helpers -------------------------------------------------------

  showView(state) {
    this.currentState = state;
    Object.entries(VIEWS).forEach(([key, id]) => {
      document.getElementById(id).style.display = key === state ? 'block' : 'none';
    });

    document.getElementById('btnLevels').classList.toggle('is-active', state === 'LEVEL_SELECTION');
    document.getElementById('btnProgress').classList.toggle('is-active', state === 'PROGRESS');
    window.scrollTo(0, 0);
  }

  showMessage(text, type = 'info') {
    const el = document.getElementById('app-message');
    clearTimeout(this.messageTimer);
    el.className = `app-message app-message-${type}`;
    el.textContent = text;
    el.hidden = false;
    this.messageTimer = setTimeout(() => { el.hidden = true; }, 6000);
  }

  clearMessage() {
    clearTimeout(this.messageTimer);
    document.getElementById('app-message').hidden = true;
  }

  // ---- Navigation ---------------------------------------------------------

  async selectLevel(level) {
    try {
      this.currentLessons = await this.getLessonsByLevel.execute(level);
    } catch (error) {
      this.showMessage(error.message, 'error');
      return;
    }

    this.currentLevel = level;
    this.userProgress.currentLevel = level;
    this.userProgressRepository.saveProgress(this.userProgress);
    this.clearMessage();
    this.showLessonSelection();
  }

  showLevelSelection() {
    this.levelSelector.render(this.userProgress?.currentLevel);
    this.showView('LEVEL_SELECTION');
  }

  showLessonSelection() {
    this.showView('LESSON_SELECTION');
    this.renderLessonSelection();
  }

  renderLessonSelection() {
    const level = Object.values(HSK_LEVELS).find(l => l.level === this.currentLevel);
    const completed = new Map(this.userProgress.completedLessons.map(c => [c.lessonId, c.score]));

    const container = document.getElementById('lessons-container');
    container.innerHTML = `
      <div class="view-toolbar">
        <button class="btn-back" id="btnBackToLevels" type="button">&larr; All levels</button>
      </div>
      <div class="section-header">
        <h2>${escapeHtml(level?.name ?? `HSK ${this.currentLevel}`)} <span class="header-zh" lang="zh-CN">${escapeHtml(level?.zh ?? '')}</span></h2>
        <p>${this.currentLessons.length ? 'Select a lesson to study its new words, then take the quiz.' : ''}</p>
      </div>
    `;
    container.querySelector('#btnBackToLevels').addEventListener('click', () => this.showLevelSelection());

    if (this.currentLessons.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.innerHTML = `<p>No lessons are available for ${escapeHtml(level?.name ?? 'this level')} yet.</p>`;
      container.appendChild(empty);
      return;
    }

    const grid = document.createElement('div');
    grid.className = 'lessons-grid';

    this.currentLessons.forEach((lesson) => {
      const done = completed.has(lesson.id);
      const card = document.createElement('div');
      card.className = `lesson-card${done ? ' is-complete' : ''}`;
      card.innerHTML = `
        ${done ? `<span class="badge-complete">&#10003; Best ${completed.get(lesson.id)}%</span>` : ''}
        <h3>${escapeHtml(lesson.title)}</h3>
        <p>${escapeHtml(lesson.description)}</p>
        <p class="word-count">${lesson.words.length} words</p>
        <button class="btn-primary" type="button">${done ? 'Review lesson' : 'Start lesson'}</button>
      `;

      card.querySelector('button').addEventListener('click', () => this.startLesson(lesson.id));
      grid.appendChild(card);
    });

    container.appendChild(grid);
  }

  async startLesson(lessonId) {
    try {
      this.currentLesson = await this.getLessonWithWords.execute(lessonId);
    } catch (error) {
      this.showMessage(error.message, 'error');
      return;
    }

    this.clearMessage();
    this.showLesson();
  }

  showLesson() {
    this.showView('LESSON_LEARNING');
    this.lessonView.loadLesson(this.currentLesson);
  }

  async showProgress() {
    const level = this.userProgress.currentLevel || this.currentLevel;
    let lessons = this.currentLessons;
    if (!lessons.length || this.currentLessons[0]?.hskLevel !== level) {
      try {
        lessons = await this.getLessonsByLevel.execute(level);
      } catch {
        lessons = [];
      }
    }

    this.progressTracker.displayProgress(this.userProgress, lessons);
    this.showView('PROGRESS');
  }

  // ---- Learning flow ------------------------------------------------------

  recordWordLearned(word) {
    this.updateUserProgress.addLearnedWord(this.userProgress, word.id);
  }

  async onLessonCompleted() {
    const lessonWords = this.currentLesson.words;

    // Wrong answers come from the whole level so short lessons still get 3-4 options.
    const levelWords = await this.wordRepository.getWordsByLevel(this.currentLevel);
    this.quizPool = [...lessonWords, ...levelWords.filter(w => !lessonWords.some(l => l.id === w.id))];

    this.showView('QUIZ');
    this.quizView.generateQuestions(shuffle(lessonWords).slice(0, QUIZ_LENGTH), this.quizPool);
  }

  async onQuizCompleted(score, total, retry) {
    if (retry) {
      this.quizView.generateQuestions(shuffle(this.currentLesson.words).slice(0, QUIZ_LENGTH), this.quizPool);
      return;
    }

    const percentage = Math.round((score / total) * 100);
    await this.updateUserProgress.completeLesson(this.userProgress, this.currentLesson.id, percentage);
    this.showLessonSelection();
    this.showMessage(`Lesson complete — you scored ${percentage}%.`, 'success');
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
