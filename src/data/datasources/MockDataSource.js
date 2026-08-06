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
      3: [
        {
          id: '6', chinese: '工作', pinyin: 'gōngzuò', english: 'Work',
          hskLevel: 3, partOfSpeech: 'noun/verb', example: '我在这家公司工作。'
        },
        {
          id: '7', chinese: '家庭', pinyin: 'jiātíng', english: 'Family',
          hskLevel: 3, partOfSpeech: 'noun', example: '我有一个小家庭。'
        },
      ],
      7: [
        {
          id: '8', chinese: '抽象概念', pinyin: 'chōuxiàng gàiniàn', english: 'Abstract concept',
          hskLevel: 7, partOfSpeech: 'noun', example: '哲学研究抽象概念。'
        },
        {
          id: '9', chinese: '深刻理解', pinyin: 'shēnkè lǐjiě', english: 'Deep understanding',
          hskLevel: 7, partOfSpeech: 'noun phrase', example: '我对这个主题有深刻理解。'
        },
      ],
      8: [
        {
          id: '10', chinese: '精妙构思', pinyin: 'jīngmiào gòusī', english: 'Exquisite conception',
          hskLevel: 8, partOfSpeech: 'noun phrase', example: '这个设计的精妙构思令人印象深刻。'
        },
        {
          id: '11', chinese: '蕴含深意', pinyin: 'yùnhán shēnyì', english: 'Contain deep meaning',
          hskLevel: 8, partOfSpeech: 'verb phrase', example: '这部作品蕴含深意。'
        },
      ],
      9: [
        {
          id: '12', chinese: '洞察力', pinyin: 'dòngchá lì', english: 'Insight/Discernment',
          hskLevel: 9, partOfSpeech: 'noun', example: '他拥有敏锐的洞察力。'
        },
        {
          id: '13', chinese: '涵养文明', pinyin: 'hányǎng wénmíng', english: 'Cultivate civilization',
          hskLevel: 9, partOfSpeech: 'verb phrase', example: '我们应该涵养优秀的文明。'
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
      3: [
        {
          id: 'L3', title: 'Work and Family', hskLevel: 3,
          words: ['6', '7'], description: 'Discuss work and family topics', order: 1
        },
      ],
      7: [
        {
          id: 'L7', title: 'Abstract Concepts', hskLevel: 7,
          words: ['8', '9'], description: 'Advanced philosophical vocabulary', order: 1
        },
      ],
      8: [
        {
          id: 'L8', title: 'Sophisticated Expression', hskLevel: 8,
          words: ['10', '11'], description: 'Master nuanced language expression', order: 1
        },
      ],
      9: [
        {
          id: 'L9', title: 'Mastery Elite', hskLevel: 9,
          words: ['12', '13'], description: 'Professional and elite-level Chinese proficiency', order: 1
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
