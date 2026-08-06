export class Word {
  constructor(id, chinese, pinyin, english, hskLevel, partOfSpeech, example) {
    this.id = id;
    this.chinese = chinese;
    this.pinyin = pinyin;
    this.english = english;
    this.hskLevel = hskLevel;
    this.partOfSpeech = partOfSpeech;
    this.example = example;
  }

  static create(data) {
    return new Word(
      data.id,
      data.chinese,
      data.pinyin,
      data.english,
      data.hskLevel,
      data.partOfSpeech || 'noun',
      data.example || ''
    );
  }
}
