import { escapeHtml, shuffle } from '../../utils/html.js';
import { colorizePinyin } from '../../utils/pinyin.js';
import { speakChinese, speechSupported } from '../../utils/speech.js';

const MAX_OPTIONS = 4;

export class QuizView {
  constructor(container) {
    this.container = container;
    this.currentQuestionIndex = 0;
    this.questions = [];
    this.score = 0;
    this.answers = [];
    this.onQuizComplete = null;
  }

  // words: what is being tested. pool: wider set of words used to pick wrong answers.
  generateQuestions(words, pool = words) {
    this.questions = words.map((word, index) =>
      this.buildQuestion(word, index % 2 === 0 ? 'zh-to-en' : 'en-to-zh', pool)
    );

    this.currentQuestionIndex = 0;
    this.score = 0;
    this.answers = [];
    this.render();
  }

  buildQuestion(word, type, pool) {
    const key = type === 'zh-to-en' ? 'english' : 'chinese';
    const toOption = w => ({ value: w[key], pinyin: w.pinyin });

    // Distinct wrong answers only; with a small pool there may be fewer than 3, which is fine.
    const seen = new Set([word[key]]);
    const wrong = shuffle(pool).filter(w => !seen.has(w[key]) && seen.add(w[key])).slice(0, MAX_OPTIONS - 1);

    return {
      id: word.id,
      type,
      word,
      correct: word[key],
      options: shuffle([toOption(word), ...wrong.map(toOption)]),
    };
  }

  render() {
    this.container.innerHTML = '';
    const question = this.questions[this.currentQuestionIndex];
    const total = this.questions.length;
    const progress = Math.round((this.currentQuestionIndex / total) * 100);
    const { word } = question;
    const showPinyinInOptions = question.type === 'en-to-zh';

    const prompt = question.type === 'zh-to-en'
      ? `
        <p class="question-label">What does this word mean?</p>
        <div class="word-chinese" lang="zh-CN">${escapeHtml(word.chinese)}</div>
        <div class="word-pinyin">${colorizePinyin(word.pinyin)}</div>
        ${speechSupported ? `<button class="btn-audio" id="btnSpeak" type="button" aria-label="Play pronunciation">&#128266; Listen</button>` : ''}`
      : `
        <p class="question-label">Which word means&hellip;</p>
        <div class="question-meaning">&ldquo;${escapeHtml(word.english)}&rdquo;</div>`;

    const content = document.createElement('div');
    content.className = 'quiz-view';
    content.innerHTML = `
      <div class="quiz-header">
        <div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress}">
          <div class="progress-fill" style="width: ${progress}%"></div>
        </div>
        <p class="progress-text">Question ${this.currentQuestionIndex + 1} of ${total} &middot; Score ${this.score}</p>
      </div>

      <div class="question-card">
        ${prompt}
        <div class="options ${showPinyinInOptions ? 'options-zh' : ''}">
          ${question.options.map((option, idx) => `
            <button class="option-btn" type="button" data-index="${idx}">
              <span class="option-text" ${showPinyinInOptions ? 'lang="zh-CN"' : ''}>${escapeHtml(option.value)}</span>
              ${showPinyinInOptions ? `<span class="option-pinyin">${colorizePinyin(option.pinyin)}</span>` : ''}
            </button>
          `).join('')}
        </div>
        <div class="feedback" id="feedback" role="status" aria-live="polite"></div>
        <div class="quiz-next" id="quizNext"></div>
      </div>
    `;

    this.container.appendChild(content);
    this.attachEventListeners(question);
  }

  attachEventListeners(question) {
    this.container.querySelector('#btnSpeak')?.addEventListener('click', () => speakChinese(question.word.chinese));

    const buttons = [...this.container.querySelectorAll('.option-btn')];
    buttons.forEach((btn, idx) => {
      btn.addEventListener('click', () => this.answer(question, buttons, idx));
    });
  }

  answer(question, buttons, idx) {
    const selected = question.options[idx].value;
    const isCorrect = selected === question.correct;

    this.answers.push({ questionId: question.id, word: question.word, selected, correct: question.correct, isCorrect });
    if (isCorrect) this.score++;

    buttons.forEach((btn, i) => {
      btn.disabled = true;
      if (question.options[i].value === question.correct) btn.classList.add('is-correct');
      else if (i === idx) btn.classList.add('is-wrong');
    });

    const { word } = question;
    const answerLine = `<span lang="zh-CN">${escapeHtml(word.chinese)}</span> (${colorizePinyin(word.pinyin)}) &mdash; ${escapeHtml(word.english)}`;
    const feedback = this.container.querySelector('#feedback');
    feedback.className = `feedback ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}`;
    feedback.innerHTML = `<strong>${isCorrect ? 'Correct!' : 'Not quite.'}</strong> ${answerLine}`;

    const isLast = this.currentQuestionIndex === this.questions.length - 1;
    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'btn-primary';
    nextBtn.innerHTML = isLast ? 'See results' : 'Next question &rarr;';
    nextBtn.addEventListener('click', () => {
      if (isLast) {
        this.showResults();
      } else {
        this.currentQuestionIndex++;
        this.render();
      }
    });
    this.container.querySelector('#quizNext').appendChild(nextBtn);
    nextBtn.focus();
  }

  showResults() {
    this.container.innerHTML = '';
    const total = this.questions.length;
    const percentage = Math.round((this.score / total) * 100);
    const missed = this.answers.filter(a => !a.isCorrect);

    const verdict = percentage >= 80 ? 'Excellent work!' : percentage >= 60 ? 'Good job, keep practising.' : 'Review the words below and try again.';

    const results = document.createElement('div');
    results.className = 'quiz-results';
    results.innerHTML = `
      <h2>Quiz complete</h2>
      <div class="results-score">
        <div class="score-circle ${percentage >= 60 ? 'is-pass' : 'is-fail'}">${percentage}%</div>
        <p>${this.score} / ${total} correct &middot; ${verdict}</p>
      </div>

      ${missed.length ? `
        <div class="review-list">
          <h3>Words to review</h3>
          <ul>
            ${missed.map(a => `
              <li>
                <span class="review-zh" lang="zh-CN">${escapeHtml(a.word.chinese)}</span>
                <span class="review-pinyin">${colorizePinyin(a.word.pinyin)}</span>
                <span class="review-en">${escapeHtml(a.word.english)}</span>
              </li>`).join('')}
          </ul>
        </div>` : ''}

      <div class="results-actions">
        <button class="btn-primary" id="btnRetry" type="button">Try again</button>
        <button class="btn-secondary" id="btnExit" type="button">Save &amp; back to lessons</button>
      </div>
    `;

    this.container.appendChild(results);
    this.attachResultsListeners();
  }

  attachResultsListeners() {
    const total = this.questions.length;
    this.container.querySelector('#btnRetry')?.addEventListener('click', () => {
      if (this.onQuizComplete) this.onQuizComplete(this.score, total, true);
    });
    this.container.querySelector('#btnExit')?.addEventListener('click', () => {
      if (this.onQuizComplete) this.onQuizComplete(this.score, total, false);
    });
  }

  show() {
    this.container.style.display = 'block';
  }

  hide() {
    this.container.style.display = 'none';
  }
}
