export class MockDataSource {
  constructor() {
    this.mockWords = {
      1: [
        {
          id: '1', chinese: '你好', pinyin: 'nǐ hǎo', english: 'Hello',
          hskLevel: 1, partOfSpeech: 'greeting', example: '你好，我是小王。'
        },
        {
          id: '2', chinese: '谢谢', pinyin: 'xièxie', english: 'Thank you',
          hskLevel: 1, partOfSpeech: 'verb', example: '谢谢你的帮助。'
        },
        {
          id: '3', chinese: '请', pinyin: 'qǐng', english: 'Please',
          hskLevel: 1, partOfSpeech: 'verb', example: '请坐。'
        },
      ],
      2: [
        {
          id: '4', chinese: '喜欢', pinyin: 'xǐhuān', english: 'Like',
          hskLevel: 2, partOfSpeech: 'verb', example: '我喜欢看书。'
        },
        {
          id: '5', chinese: '学习', pinyin: 'xuéxí', english: 'Study',
          hskLevel: 2, partOfSpeech: 'verb', example: '我每天学习中文。'
        },
      ],
    };

    this.mockLessons = {
      1: [
        {
          id: 'L1', title: 'Basic Greetings', hskLevel: 1,
          words: ['1', '2', '3'], description: 'Learn basic greetings', order: 1
        },
      ],
      2: [
        {
          id: 'L2', title: 'Likes and Preferences', hskLevel: 2,
          words: ['4', '5'], description: 'Express preferences', order: 1
        },
      ],
    };
  }

  async fetchWordsByLevel(hskLevel) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.mockWords[hskLevel] || []);
      }, 300);
    });
  }

  async fetchWordById(wordId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const allWords = Object.values(this.mockWords).flat();
        const word = allWords.find(w => w.id === wordId);
        resolve(word);
      }, 200);
    });
  }

  async searchWords(query, hskLevel = null) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let allWords = Object.values(this.mockWords).flat();
        if (hskLevel) {
          allWords = allWords.filter(w => w.hskLevel === hskLevel);
        }
        const filtered = allWords.filter(w =>
          w.chinese.includes(query) || w.english.toLowerCase().includes(query.toLowerCase())
        );
        resolve(filtered);
      }, 300);
    });
  }

  async fetchLessonsByLevel(hskLevel) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.mockLessons[hskLevel] || []);
      }, 300);
    });
  }

  async fetchLessonById(lessonId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const allLessons = Object.values(this.mockLessons).flat();
        const lesson = allLessons.find(l => l.id === lessonId);
        resolve(lesson);
      }, 200);
    });
  }

  async fetchLessonWithWords(lessonId) {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const allLessons = Object.values(this.mockLessons).flat();
        const lesson = allLessons.find(l => l.id === lessonId);
        if (lesson) {
          const words = await Promise.all(
            lesson.words.map(wordId => this.fetchWordById(wordId))
          );
          resolve({ ...lesson, words });
        } else {
          resolve(null);
        }
      }, 400);
    });
  }
}
