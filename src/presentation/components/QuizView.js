export class QuizView {
  constructor(container) {
    this.container = container;
    this.currentQuestionIndex = 0;
    this.questions = [];
    this.score = 0;
    this.answers = [];
    this.onQuizComplete = null;
  }

  generateQuestions(words) {
    this.questions = words.map((word, index) => ({
      id: word.id,
      question: `What is the English meaning of "${word.chinese}"?`,
      correct: word.english,
      chinese: word.chinese,
      options: this.generateOptions(word, words),
    }));

    this.currentQuestionIndex = 0;
    this.score = 0;
    this.answers = [];
    this.render();
  }

  generateOptions(correctWord, allWords) {
    const correct = correctWord.english;
    const options = [correct];

    while (options.length < 4) {
      const randomWord = allWords[Math.floor(Math.random() * allWords.length)];
      if (!options.includes(randomWord.english)) {
        options.push(randomWord.english);
      }
    }

    return options.sort(() => Math.random() - 0.5);
  }

  render() {
    this.container.innerHTML = '';
    const question = this.questions[this.currentQuestionIndex];
    const progress = Math.round(((this.currentQuestionIndex + 1) / this.questions.length) * 100);

    const content = document.createElement('div');
    content.className = 'quiz-view';
    content.innerHTML = `
      <div class="quiz-header">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progress}%"></div>
        </div>
        <p class="progress-text">${this.currentQuestionIndex + 1} / ${this.questions.length}</p>
      </div>

      <div class="question-card">
        <h3>${question.question}</h3>
        <div class="options">
          ${question.options.map((option, idx) => `
            <button class="option-btn" data-index="${idx}">${option}</button>
          `).join('')}
        </div>
      </div>

      <div class="quiz-info">
        <p>Score: <span class="score-value">${this.score}/${this.questions.length}</span></p>
      </div>
    `;

    this.container.appendChild(content);
    this.attachEventListeners(question);
  }

  attachEventListeners(question) {
    const buttons = this.container.querySelectorAll('.option-btn');
    buttons.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        const selectedAnswer = question.options[idx];
        this.answers.push({
          questionId: question.id,
          selected: selectedAnswer,
          correct: question.correct,
          isCorrect: selectedAnswer === question.correct,
        });

        if (selectedAnswer === question.correct) {
          this.score++;
        }

        if (this.currentQuestionIndex < this.questions.length - 1) {
          this.currentQuestionIndex++;
          this.render();
        } else {
          this.showResults();
        }
      });
    });
  }

  showResults() {
    this.container.innerHTML = '';
    const percentage = Math.round((this.score / this.questions.length) * 100);

    const results = document.createElement('div');
    results.className = 'quiz-results';
    results.innerHTML = `
      <h2>Quiz Complete!</h2>
      <div class="results-score">
        <div class="score-circle">${percentage}%</div>
        <p>${this.score} / ${this.questions.length} correct</p>
      </div>
      <button class="btn-primary" id="btnRetry">Try Again</button>
      <button class="btn-secondary" id="btnExit">Back to Lessons</button>
    `;

    this.container.appendChild(results);
    this.attachResultsListeners();
  }

  attachResultsListeners() {
    const btnRetry = this.container.querySelector('#btnRetry');
    const btnExit = this.container.querySelector('#btnExit');

    if (btnRetry) {
      btnRetry.addEventListener('click', () => {
        if (this.onQuizComplete) this.onQuizComplete(this.score, this.questions.length, true);
      });
    }

    if (btnExit) {
      btnExit.addEventListener('click', () => {
        if (this.onQuizComplete) this.onQuizComplete(this.score, this.questions.length, false);
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
