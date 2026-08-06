import { API_CONFIG } from '../../config/constants.js';

export class ApiDataSource {
  constructor(baseUrl = 'https://api.example.com') {
    this.baseUrl = baseUrl;
    this.timeout = API_CONFIG.TIMEOUT;
    this.retryAttempts = API_CONFIG.RETRY_ATTEMPTS;
  }

  async fetch(endpoint, options = {}) {
    let lastError;
    for (let attempt = 0; attempt < this.retryAttempts; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          ...options,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        lastError = error;
        console.warn(`Attempt ${attempt + 1}/${this.retryAttempts} failed:`, error.message);
        if (attempt < this.retryAttempts - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        }
      }
    }
    throw lastError;
  }

  async fetchWordsByLevel(hskLevel) {
    return this.fetch(`/words?level=${hskLevel}`);
  }

  async fetchWordById(wordId) {
    return this.fetch(`/words/${wordId}`);
  }

  async searchWords(query, hskLevel = null) {
    const params = new URLSearchParams({ q: query });
    if (hskLevel) params.append('level', hskLevel);
    return this.fetch(`/words/search?${params}`);
  }

  async fetchLessonsByLevel(hskLevel) {
    return this.fetch(`/lessons?level=${hskLevel}`);
  }

  async fetchLessonById(lessonId) {
    return this.fetch(`/lessons/${lessonId}`);
  }

  async fetchLessonWithWords(lessonId) {
    return this.fetch(`/lessons/${lessonId}/words`);
  }

  async submitQuizAnswer(quizId, answer) {
    return this.fetch(`/quiz/${quizId}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer }),
    });
  }
}
