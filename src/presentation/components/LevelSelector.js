import { HSK_LEVELS } from '../../config/constants.js';
import { escapeHtml } from '../../utils/html.js';

export class LevelSelector {
  constructor(container, onLevelSelect) {
    this.container = container;
    this.onLevelSelect = onLevelSelect;
  }

  render(currentLevel = null) {
    this.container.innerHTML = `
      <div class="section-header">
        <h2>Choose your HSK level</h2>
        <p>Pick the level that matches your Chinese. Each lesson teaches new words, then tests you with a short quiz.</p>
      </div>
      <div class="level-grid"></div>
    `;

    const grid = this.container.querySelector('.level-grid');

    Object.values(HSK_LEVELS).forEach(level => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'level-card';
      if (level.level === currentLevel) card.classList.add('is-current');
      card.innerHTML = `
        <span class="level-zh" lang="zh-CN">${escapeHtml(level.zh)}</span>
        <span class="level-number">${escapeHtml(level.name)}</span>
        <span class="level-description">${escapeHtml(level.description)}</span>
        <span class="level-words">${level.words.toLocaleString('en-US')} words</span>
        <span class="level-cta">${level.level === currentLevel ? 'Continue' : 'Start learning'} &rarr;</span>
      `;
      card.addEventListener('click', () => this.onLevelSelect(level.level));
      grid.appendChild(card);
    });
  }

  show() {
    this.container.style.display = 'block';
  }

  hide() {
    this.container.style.display = 'none';
  }
}
