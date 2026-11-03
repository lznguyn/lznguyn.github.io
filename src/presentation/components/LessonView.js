import { escapeHtml } from '../../utils/html.js';
import { colorizePinyin } from '../../utils/pinyin.js';
import { speakChinese, speechSupported } from '../../utils/speech.js';

export class LessonView {
  constructor(container) {
    this.container = container;
    this.currentWord = 0;
    this.words = [];
    this.title = '';
    this.onWordLearned = null;
    this.onLessonComplete = null;
    this.onExit = null;

    document.addEventListener('keydown', e => this.handleKey(e));
  }

  loadLesson(lesson) {
    this.words = lesson.words || [];
    this.title = lesson.title || '';
    this.currentWord = 0;
    this.render();
  }

  render() {
    this.container.innerHTML = '';
    if (this.words.length === 0) {
      this.container.innerHTML = `
        <div class="empty-state">
          <p>No words available for this lesson.</p>
          <button class="btn-secondary" id="btnLessonsBack">Back to lessons</button>
        </div>`;
      this.container.querySelector('#btnLessonsBack').addEventListener('click', () => this.onExit?.());
      return;
    }

    const word = this.words[this.currentWord];
    const isLast = this.currentWord === this.words.length - 1;
    const progress = Math.round(((this.currentWord + 1) / this.words.length) * 100);

    // Highlight the studied word inside its example sentence.
    const example = escapeHtml(word.example).replace(escapeHtml(word.chinese), match => `<mark>${match}</mark>`);

    const content = document.createElement('div');
    content.className = 'lesson-view';
    content.innerHTML = `
      <div class="view-toolbar">
        <button class="btn-back" id="btnLessonsBack" type="button">&larr; Lessons</button>
        <span class="view-title">${escapeHtml(this.title)}</span>
      </div>

      <div class="lesson-header">
        <div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress}">
          <div class="progress-fill" style="width: ${progress}%"></div>
        </div>
        <p class="progress-text">Word ${this.currentWord + 1} of ${this.words.length}</p>
      </div>

      <div class="word-card">
        ${word.partOfSpeech ? `<span class="pos-tag">${escapeHtml(word.partOfSpeech)}</span>` : ''}
        <div class="word-chinese" lang="zh-CN">${escapeHtml(word.chinese)}</div>
        <div class="word-pinyin">${colorizePinyin(word.pinyin)}</div>
        ${speechSupported ? `<button class="btn-audio" id="btnSpeak" type="button" aria-label="Play pronunciation">&#128266; Listen</button>` : ''}
        <div class="word-english">${escapeHtml(word.english)}</div>
        ${word.example ? `<div class="word-example" lang="zh-CN">${example}</div>` : ''}
      </div>

      <div class="lesson-actions">
        <button class="btn-secondary" id="btnPrevious" type="button" ${this.currentWord === 0 ? 'disabled' : ''}>
          &larr; Previous
        </button>
        <button class="btn-primary" id="btnNext" type="button">
          ${isLast ? 'Finish &amp; start quiz' : 'Next &rarr;'}
        </button>
      </div>
      <p class="hint">Tip: use the &larr; &rarr; arrow keys to move between words.</p>
    `;

    this.container.appendChild(content);
    this.attachEventListeners();
  }

  attachEventListeners() {
    this.container.querySelector('#btnNext')?.addEventListener('click', () => this.next());
    this.container.querySelector('#btnPrevious')?.addEventListener('click', () => this.previous());
    this.container.querySelector('#btnLessonsBack')?.addEventListener('click', () => this.onExit?.());
    this.container.querySelector('#btnSpeak')?.addEventListener('click', () => {
      speakChinese(this.words[this.currentWord].chinese);
    });
  }

  next() {
    if (this.onWordLearned) this.onWordLearned(this.words[this.currentWord]);

    if (this.currentWord === this.words.length - 1) {
      if (this.onLessonComplete) this.onLessonComplete();
    } else {
      this.currentWord++;
      this.render();
    }
  }

  previous() {
    if (this.currentWord > 0) {
      this.currentWord--;
      this.render();
    }
  }

  handleKey(event) {
    if (this.container.style.display === 'none' || this.words.length === 0) return;
    if (event.key === 'ArrowRight') this.next();
    if (event.key === 'ArrowLeft') this.previous();
  }

  show() {
    this.container.style.display = 'block';
  }

  hide() {
    this.container.style.display = 'none';
  }
}
