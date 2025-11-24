import { PomodoroSettings, PlannedPomodoro, DEFAULT_SETTINGS } from '../types/pomodoro';

const STORAGE_KEYS = {
  SETTINGS: 'pomodoro_settings',
  PLANNED_POMODOROS: 'pomodoro_planned',
} as const;

// Settings persistence
export function saveSettings(settings: PomodoroSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}

export function loadSettings(): PomodoroSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!stored) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  } catch (error) {
    console.error('Failed to load settings:', error);
    return DEFAULT_SETTINGS;
  }
}

export function clearSettings(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  } catch (error) {
    console.error('Failed to clear settings:', error);
  }
}

// Planned pomodoros persistence
export function savePlannedPomodoros(pomodoros: PlannedPomodoro[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.PLANNED_POMODOROS, JSON.stringify(pomodoros));
  } catch (error) {
    console.error('Failed to save planned pomodoros:', error);
  }
}

export function loadPlannedPomodoros(): PlannedPomodoro[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PLANNED_POMODOROS);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load planned pomodoros:', error);
    return [];
  }
}

export function clearPlannedPomodoros(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEYS.PLANNED_POMODOROS);
  } catch (error) {
    console.error('Failed to clear planned pomodoros:', error);
  }
}
