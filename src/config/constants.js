// HSK Levels Definition
export const HSK_LEVELS = {
  HSK1: { level: 1, name: 'HSK 1', words: 150, description: 'Beginner' },
  HSK2: { level: 2, name: 'HSK 2', words: 300, description: 'Elementary' },
  HSK3: { level: 3, name: 'HSK 3', words: 600, description: 'Pre-intermediate' },
  HSK4: { level: 4, name: 'HSK 4', words: 1200, description: 'Intermediate' },
  HSK5: { level: 5, name: 'HSK 5', words: 2500, description: 'Advanced' },
  HSK6: { level: 6, name: 'HSK 6', words: 5000, description: 'Mastery' },
};

// Learning modes
export const LEARNING_MODES = {
  VOCABULARY: 'vocabulary',
  READING: 'reading',
  LISTENING: 'listening',
  WRITING: 'writing',
  QUIZ: 'quiz',
};

// User progress constants
export const PROGRESS_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  REVIEWING: 'reviewing',
};

export const QUIZ_TYPES = {
  MULTIPLE_CHOICE: 'multiple_choice',
  FILL_BLANK: 'fill_blank',
  MATCHING: 'matching',
  LISTENING: 'listening',
};

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  CACHE_DURATION: 3600000, // 1 hour
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_PROFILE: 'user_profile',
  USER_PROGRESS: 'user_progress',
  VOCABULARY_CACHE: 'vocabulary_cache',
  SETTINGS: 'user_settings',
};
