export class GetRandomWordsForQuiz {
  constructor(wordRepository) {
    this.wordRepository = wordRepository;
  }

  async execute(hskLevel, count = 10) {
    if (hskLevel < 1 || hskLevel > 6) {
      throw new Error('Invalid HSK level. Must be between 1 and 6.');
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
