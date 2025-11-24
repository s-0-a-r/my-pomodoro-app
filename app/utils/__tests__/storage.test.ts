import {
  saveSettings,
  loadSettings,
  clearSettings,
  savePlannedPomodoros,
  loadPlannedPomodoros,
  clearPlannedPomodoros,
} from '../storage';
import { DEFAULT_SETTINGS, PomodoroSettings, PlannedPomodoro } from '../../types/pomodoro';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
});

describe('Storage Utilities', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('Settings', () => {
    it('should save and load settings', () => {
      const settings: PomodoroSettings = {
        workDuration: 30,
        breakDuration: 10,
        autoRepeat: false,
        volume: 0.8,
      };

      saveSettings(settings);
      const loaded = loadSettings();

      expect(loaded).toEqual(settings);
    });

    it('should return default settings when none are saved', () => {
      const loaded = loadSettings();

      expect(loaded).toEqual(DEFAULT_SETTINGS);
    });

    it('should clear settings', () => {
      const settings: PomodoroSettings = {
        workDuration: 30,
        breakDuration: 10,
        autoRepeat: false,
        volume: 0.8,
      };

      saveSettings(settings);
      clearSettings();
      const loaded = loadSettings();

      expect(loaded).toEqual(DEFAULT_SETTINGS);
    });
  });

  describe('Planned Pomodoros', () => {
    it('should save and load planned pomodoros', () => {
      const pomodoros: PlannedPomodoro[] = [
        {
          id: '1',
          name: 'Task 1',
          startTime: '09:00',
          workEndTime: '09:25',
          breakEndTime: '09:30',
        },
        {
          id: '2',
          name: 'Task 2',
          startTime: '09:30',
          workEndTime: '09:55',
          breakEndTime: '10:00',
        },
      ];

      savePlannedPomodoros(pomodoros);
      const loaded = loadPlannedPomodoros();

      expect(loaded).toEqual(pomodoros);
    });

    it('should return empty array when none are saved', () => {
      const loaded = loadPlannedPomodoros();

      expect(loaded).toEqual([]);
    });

    it('should clear planned pomodoros', () => {
      const pomodoros: PlannedPomodoro[] = [
        {
          id: '1',
          name: 'Task 1',
          startTime: '09:00',
          workEndTime: '09:25',
          breakEndTime: '09:30',
        },
      ];

      savePlannedPomodoros(pomodoros);
      clearPlannedPomodoros();
      const loaded = loadPlannedPomodoros();

      expect(loaded).toEqual([]);
    });
  });
});
