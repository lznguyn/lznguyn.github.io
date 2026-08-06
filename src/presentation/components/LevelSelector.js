import { HSK_LEVELS } from '../../config/constants.js';

export class LevelSelector {
  constructor(container, onLevelSelect) {
    this.container = container;
    this.onLevelSelect = onLevelSelect;
  }

  render() {
    this.container.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'level-grid';

    Object.values(HSK_LEVELS).forEach(level => {
      const card = document.createElement('div');
      card.className = 'level-card';
      card.innerHTML = `
        <div class="level-number">${level.name}</div>
        <div class="level-description">${level.description}</div>
        <div class="level-words">${level.words} words</div>
        <button class="btn-select">Start Learning</button>
      `;

      card.querySelector('.btn-select').addEventListener('click', () => {
        this.onLevelSelect(level.level);
      });

      grid.appendChild(card);
    });

    this.container.appendChild(grid);
  }

  show() {
    this.container.style.display = 'block';
  }

  hide() {
    this.container.style.display = 'none';
  }
}
