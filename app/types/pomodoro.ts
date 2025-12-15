// Pomodoro timer types

export type PomodoroMode = 'default' | 'planned';

export type TimerPhase = 'work' | 'break';

export interface PomodoroSettings {
  workDuration: number; // in minutes (1-60)
  breakDuration: number; // in minutes (1-15)
  autoRepeat: boolean;
  volume: number; // 0-1
}

export interface PlannedPomodoro {
  id: string;
  name: string;
  startTime: string; // HH:MM format
  workEndTime: string; // HH:MM format
  breakEndTime: string; // HH:MM format
}

export interface PomodoroState {
  mode: PomodoroMode;
  phase: TimerPhase | 'idle';
  remainingTime: number; // in seconds
  settings: PomodoroSettings;
  plannedPomodoros: PlannedPomodoro[];
  currentPlannedIndex: number | null;
  isPaused: boolean;
}

export const DEFAULT_SETTINGS: PomodoroSettings = {
  workDuration: 25,
  breakDuration: 5,
  autoRepeat: true,
  volume: 0.5,
};

export const DEFAULT_PLANNED_START_TIME = '09:00';

// Validation constraints
export const CONSTRAINTS = {
  MIN_WORK_DURATION: 1,
  MAX_WORK_DURATION: 60,
  MIN_BREAK_DURATION: 1,
  MAX_BREAK_DURATION: 15,
  MIN_TOTAL_DURATION: 2,
  MAX_TOTAL_DURATION: 120,
  TIME_INCREMENTS: [1, 5, 25] as const,
};
