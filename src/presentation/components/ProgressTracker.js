import { HSK_LEVELS } from '../../config/constants.js';
import { formatDate } from '../../utils/formatters.js';
import { escapeHtml } from '../../utils/html.js';

export class ProgressTracker {
  constructor(container) {
    this.container = container;
  }

  // lessons: the lessons of the learner's current level (used for "x of y" and the progress bar).
  displayProgress(userProgress, lessons = []) {
    const level = Object.values(HSK_LEVELS).find(l => l.level === userProgress.currentLevel);
    const lessonIds = new Set(lessons.map(l => l.id));
    const completed = userProgress.completedLessons.filter(c => lessonIds.has(c.lessonId));
    const percentage = lessons.length ? Math.round((completed.length / lessons.length) * 100) : 0;
    const average = completed.length
      ? Math.round(completed.reduce((sum, c) => sum + c.score, 0) / completed.length)
      : null;

    this.container.innerHTML = `
      <div class="progress-tracker">
        <div class="section-header">
          <h2>My progress</h2>
          <p>${escapeHtml(level?.name ?? `HSK ${userProgress.currentLevel}`)} &middot; ${escapeHtml(level?.description ?? '')}</p>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">Lessons completed</div>
            <div class="stat-value">${completed.length}<span class="stat-of"> / ${lessons.length}</span></div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Words learned</div>
            <div class="stat-value">${userProgress.learnedWords.size}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Average quiz score</div>
            <div class="stat-value">${average === null ? '&ndash;' : `${average}%`}</div>
          </div>
        </div>

        <div class="progress-section">
          <div class="progress-label">${escapeHtml(level?.name ?? 'Level')} completion</div>
          <div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percentage}">
            <div class="progress-fill" style="width: ${percentage}%"></div>
          </div>
          <div class="progress-text">${percentage}% complete</div>
        </div>

        <div class="last-activity">
          <p>Last activity: ${formatDate(userProgress.lastActivityDate)}</p>
        </div>
      </div>
    `;
  }

  show() {
    this.container.style.display = 'block';
  }

  hide() {
    this.container.style.display = 'none';
  }
}
