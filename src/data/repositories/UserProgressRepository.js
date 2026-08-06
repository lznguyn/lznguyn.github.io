import { UserProgress } from '../../domain/entities/UserProgress.js';
import { STORAGE_KEYS } from '../../config/constants.js';

export class UserProgressRepository {
  constructor() {
    this.storageKey = STORAGE_KEYS.USER_PROGRESS;
  }

  saveProgress(userProgress) {
    try {
      const data = userProgress.toJSON();
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving progress:', error);
      return false;
    }
  }

  getProgress(userId, defaultLevel = 1) {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const parsed = JSON.parse(data);
        return UserProgress.fromJSON(parsed);
      }
      return new UserProgress(userId, defaultLevel);
    } catch (error) {
      console.error('Error loading progress:', error);
      return new UserProgress(userId, defaultLevel);
    }
  }

  deleteProgress() {
    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.error('Error deleting progress:', error);
      return false;
    }
  }

  resetProgress(userId, level) {
    try {
      const newProgress = new UserProgress(userId, level);
      this.saveProgress(newProgress);
      return newProgress;
    } catch (error) {
      console.error('Error resetting progress:', error);
      return null;
    }
  }
}
