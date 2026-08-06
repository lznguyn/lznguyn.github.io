import { Word } from '../../domain/entities/Word.js';
import { HSK_LEVELS } from '../../config/constants.js';

export class WordRepository {
  constructor(dataSource) {
    this.dataSource = dataSource;
    this.cache = new Map();
  }

  async getWordsByLevel(hskLevel) {
    const cacheKey = `words_level_${hskLevel}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const data = await this.dataSource.fetchWordsByLevel(hskLevel);
      const words = data.map(item => Word.create(item));
      this.cache.set(cacheKey, words);
      return words;
    } catch (error) {
      console.error(`Error fetching words for level ${hskLevel}:`, error);
      return [];
    }
  }

  async getWordById(wordId) {
    try {
      const data = await this.dataSource.fetchWordById(wordId);
      return Word.create(data);
    } catch (error) {
      console.error(`Error fetching word ${wordId}:`, error);
      return null;
    }
  }

  async searchWords(query, hskLevel = null) {
    try {
      const data = await this.dataSource.searchWords(query, hskLevel);
      return data.map(item => Word.create(item));
    } catch (error) {
      console.error('Error searching words:', error);
      return [];
    }
  }

  async getRandomWords(hskLevel, count = 10) {
    const words = await this.getWordsByLevel(hskLevel);
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  clearCache() {
    this.cache.clear();
  }
}
