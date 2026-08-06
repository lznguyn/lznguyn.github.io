export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidHSKLevel(level) {
  return Number.isInteger(level) && level >= 1 && level <= 6;
}

export function isValidScore(score) {
  return typeof score === 'number' && score >= 0 && score <= 100;
}

export function isNotEmpty(str) {
  return typeof str === 'string' && str.trim().length > 0;
}

export function isValidWordId(id) {
  return typeof id === 'string' && id.trim().length > 0;
}

export function isValidLessonId(id) {
  return typeof id === 'string' && id.trim().length > 0;
}
