export class LessonView {
  constructor(container) {
    this.container = container;
    this.currentWord = 0;
    this.words = [];
    this.onWordLearned = null;
    this.onLessonComplete = null;
  }

  loadLesson(lesson) {
    this.words = lesson.words || [];
    this.currentWord = 0;
    this.render();
  }

  render() {
    this.container.innerHTML = '';
    if (this.words.length === 0) {
      this.container.innerHTML = '<p>No words available for this lesson.</p>';
      return;
    }

    const word = this.words[this.currentWord];
    const progress = Math.round(((this.currentWord + 1) / this.words.length) * 100);

    const content = document.createElement('div');
    content.className = 'lesson-view';
    content.innerHTML = `
      <div class="lesson-header">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progress}%"></div>
        </div>
        <p class="progress-text">${this.currentWord + 1} / ${this.words.length}</p>
      </div>

      <div class="word-card">
        <div class="word-chinese">${word.chinese}</div>
        <div class="word-pinyin">${word.pinyin}</div>
        <div class="word-english">${word.english}</div>
        <div class="word-example">${word.example}</div>
      </div>

      <div class="lesson-actions">
        <button class="btn-secondary" id="btnPrevious" ${this.currentWord === 0 ? 'disabled' : ''}>
          Previous
        </button>
        <button class="btn-primary" id="btnNext">
          ${this.currentWord === this.words.length - 1 ? 'Complete' : 'Next'}
        </button>
      </div>
    `;

    this.container.appendChild(content);
    this.attachEventListeners();
  }

  attachEventListeners() {
    const btnNext = this.container.querySelector('#btnNext');
    const btnPrevious = this.container.querySelector('#btnPrevious');

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        if (this.onWordLearned) this.onWordLearned(this.words[this.currentWord]);

        if (this.currentWord === this.words.length - 1) {
          if (this.onLessonComplete) this.onLessonComplete();
        } else {
          this.currentWord++;
          this.render();
        }
      });
    }

    if (btnPrevious) {
      btnPrevious.addEventListener('click', () => {
        if (this.currentWord > 0) {
          this.currentWord--;
          this.render();
        }
      });
    }
  }

  show() {
    this.container.style.display = 'block';
  }

  hide() {
    this.container.style.display = 'none';
  }
}
