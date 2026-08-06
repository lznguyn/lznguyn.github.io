export function formatDate(date) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
}

export function formatPercentage(value) {
  return `${Math.round(value)}%`;
}

export function formatScore(score) {
  return `${score.toFixed(1)}/100`;
}

export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

export function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function truncate(str, maxLength) {
  return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
}
