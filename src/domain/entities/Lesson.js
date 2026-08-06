export class Lesson {
  constructor(id, title, hskLevel, words, description, order) {
    this.id = id;
    this.title = title;
    this.hskLevel = hskLevel;
    this.words = words || [];
    this.description = description || '';
    this.order = order || 0;
  }

  addWord(word) {
    this.words.push(word);
  }

  getWordCount() {
    return this.words.length;
  }

  static create(data) {
    return new Lesson(
      data.id,
      data.title,
      data.hskLevel,
      data.words || [],
      data.description,
      data.order
    );
  }
}
