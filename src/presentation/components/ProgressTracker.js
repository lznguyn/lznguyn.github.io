import { formatDate, formatPercentage } from '../../utils/formatters.js';

export class ProgressTracker {
  constructor(container) {
    this.container = container;
  }

  displayProgress(userProgress, totalLessons) {
    this.container.innerHTML = '';
    const progressPercentage = userProgress.getProgress(totalLessons);

    const tracker = document.createElement('div');
    tracker.className = 'progress-tracker';
    tracker.innerHTML = `
      <div class="tracker-header">
        <h3>Your Progress</h3>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Level</div>
          <div class="stat-value">HSK ${userProgress.currentLevel}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Completed Lessons</div>
          <div class="stat-value">${userProgress.completedLessons.length}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Words Learned</div>
          <div class="stat-value">${userProgress.learnedWords.size}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Total Score</div>
          <div class="stat-value">${userProgress.totalScore}</div>
        </div>
      </div>

      <div class="progress-section">
        <div class="progress-label">Overall Progress</div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progressPercentage}%"></div>
        </div>
        <div class="progress-text">${progressPercentage}% Complete</div>
      </div>

      <div class="last-activity">
        <p>Last activity: ${formatDate(userProgress.lastActivityDate)}</p>
      </div>
    `;

    this.container.appendChild(tracker);
  }

  show() {
    this.container.style.display = 'block';
  }

  hide() {
    this.container.style.display = 'none';
  }
}
