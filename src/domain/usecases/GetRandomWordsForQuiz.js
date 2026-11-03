import { MIN_HSK_LEVEL, MAX_HSK_LEVEL } from '../../config/constants.js';

export class GetRandomWordsForQuiz {
  constructor(wordRepository) {
    this.wordRepository = wordRepository;
  }

  async execute(hskLevel, count = 10) {
    if (!Number.isInteger(hskLevel) || hskLevel < MIN_HSK_LEVEL || hskLevel > MAX_HSK_LEVEL) {
      throw new Error(`Invalid HSK level. Must be between ${MIN_HSK_LEVEL} and ${MAX_HSK_LEVEL}.`);
    }

    if (count < 1 || count > 50) {
      throw new Error('Quiz count must be between 1 and 50.');
    }

    const words = await this.wordRepository.getRandomWords(hskLevel, count);
    if (words.length === 0) {
      throw new Error(`No words available for level ${hskLevel}.`);
    }

    return words;
  }
}
