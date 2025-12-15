import { setup, assign, fromCallback } from 'xstate';
import {
  PomodoroMode,
  PomodoroSettings,
  PlannedPomodoro,
  DEFAULT_SETTINGS,
  TimerPhase,
} from '../types/pomodoro';
import { playBeep } from '../utils/audio';
import { getCurrentTime, getMinutesBetween } from '../utils/time';

// Context type for the machine
export interface PomodoroContext {
  mode: PomodoroMode;
  phase: TimerPhase | 'idle';
  remainingTime: number; // in seconds
  settings: PomodoroSettings;
  plannedPomodoros: PlannedPomodoro[];
  currentPlannedIndex: number | null;
}

// Events
export type PomodoroEvent =
  | { type: 'START_WORK' }
  | { type: 'START_BREAK' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'STOP' }
  | { type: 'RESET' }
  | { type: 'TICK' }
  | { type: 'COMPLETE' }
  | { type: 'SWITCH_MODE'; mode: PomodoroMode }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<PomodoroSettings> }
  | { type: 'ADD_PLANNED_POMODORO'; pomodoro: PlannedPomodoro }
  | { type: 'LOAD_PLANNED_POMODOROS'; pomodoros: PlannedPomodoro[] }
  | { type: 'UPDATE_PLANNED_POMODORO'; id: string; pomodoro: Partial<PlannedPomodoro> }
  | { type: 'DELETE_PLANNED_POMODORO'; id: string }
  | { type: 'START_PLANNED' };

// Timer callback that emits TICK events every second
const timerLogic = fromCallback<PomodoroEvent>(({ sendBack }) => {
  const interval = setInterval(() => {
    sendBack({ type: 'TICK' });
  }, 1000);

  return () => clearInterval(interval);
});

export const pomodoroMachine = setup({
  types: {
    context: {} as PomodoroContext,
    events: {} as PomodoroEvent,
  },
  guards: {
    hasTimeRemaining: ({ context }) => context.remainingTime > 0,
    shouldAutoRepeat: ({ context }) => context.settings.autoRepeat,
    isDefaultMode: ({ context }) => context.mode === 'default',
    isPlannedMode: ({ context }) => context.mode === 'planned',
    hasPlannedPomodoros: ({ context }) => context.plannedPomodoros.length > 0,
    hasNextPlannedPomodoro: ({ context }) => {
      if (context.currentPlannedIndex === null) return false;
      return context.currentPlannedIndex < context.plannedPomodoros.length - 1;
    },
  },
  actions: {
    startWork: assign({
      phase: 'work',
      remainingTime: ({ context }) => context.settings.workDuration * 60,
    }),
    startBreak: assign({
      phase: 'break',
      remainingTime: ({ context }) => context.settings.breakDuration * 60,
    }),
    startPlannedWork: assign({
      phase: 'work',
      remainingTime: ({ context }) => {
        if (context.currentPlannedIndex === null) return context.settings.workDuration * 60;
        const pomodoro = context.plannedPomodoros[context.currentPlannedIndex];
        if (!pomodoro) return context.settings.workDuration * 60;

        const currentTime = getCurrentTime();
        const minutesRemaining = getMinutesBetween(currentTime, pomodoro.workEndTime);
        return minutesRemaining * 60;
      },
    }),
    startPlannedBreak: assign({
      phase: 'break',
      remainingTime: ({ context }) => {
        if (context.currentPlannedIndex === null) return context.settings.breakDuration * 60;
        const pomodoro = context.plannedPomodoros[context.currentPlannedIndex];
        if (!pomodoro) return context.settings.breakDuration * 60;

        const currentTime = getCurrentTime();
        const minutesRemaining = getMinutesBetween(currentTime, pomodoro.breakEndTime);
        return minutesRemaining * 60;
      },
    }),
    tick: assign({
      remainingTime: ({ context }) => Math.max(0, context.remainingTime - 1),
    }),
    resetToIdle: assign({
      phase: 'idle',
      remainingTime: 0,
    }),
    switchMode: assign({
      mode: ({ event }) => {
        if (event.type === 'SWITCH_MODE') return event.mode;
        return 'default';
      },
      phase: 'idle',
      remainingTime: 0,
      currentPlannedIndex: null,
    }),
    updateSettings: assign({
      settings: ({ context, event }) => {
        if (event.type === 'UPDATE_SETTINGS') {
          return { ...context.settings, ...event.settings };
        }
        return context.settings;
      },
    }),
    resetSettings: assign({
      settings: DEFAULT_SETTINGS,
    }),
    addPlannedPomodoro: assign({
      plannedPomodoros: ({ context, event }) => {
        if (event.type === 'ADD_PLANNED_POMODORO') {
          return [...context.plannedPomodoros, event.pomodoro];
        }
        return context.plannedPomodoros;
      },
    }),
    loadPlannedPomodoros: assign({
      plannedPomodoros: ({ event }) => {
        if (event.type === 'LOAD_PLANNED_POMODOROS') {
          return event.pomodoros;
        }
        return [];
      },
    }),
    updatePlannedPomodoro: assign({
      plannedPomodoros: ({ context, event }) => {
        if (event.type === 'UPDATE_PLANNED_POMODORO') {
          return context.plannedPomodoros.map((p) =>
            p.id === event.id ? { ...p, ...event.pomodoro } : p
          );
        }
        return context.plannedPomodoros;
      },
    }),
    deletePlannedPomodoro: assign({
      plannedPomodoros: ({ context, event }) => {
        if (event.type === 'DELETE_PLANNED_POMODORO') {
          return context.plannedPomodoros.filter((p) => p.id !== event.id);
        }
        return context.plannedPomodoros;
      },
    }),
    startPlannedPomodoro: assign({
      currentPlannedIndex: ({ context }) => {
        if (context.currentPlannedIndex === null) return 0;
        return context.currentPlannedIndex;
      },
    }),
    moveToNextPlannedPomodoro: assign({
      currentPlannedIndex: ({ context }) => {
        if (context.currentPlannedIndex === null) return null;
        return context.currentPlannedIndex + 1;
      },
    }),
    playBeep: ({ context }) => {
      playBeep(5000, context.settings.volume);
    },
  },
  actors: {
    timer: timerLogic,
  },
}).createMachine({
  id: 'pomodoro',
  initial: 'idle',
  context: {
    mode: 'default',
    phase: 'idle',
    remainingTime: 0,
    settings: DEFAULT_SETTINGS,
    plannedPomodoros: [],
    currentPlannedIndex: null,
  },
  states: {
    idle: {
      on: {
        START_WORK: {
          target: 'running',
          actions: 'startWork',
        },
        START_PLANNED: {
          target: 'running',
          guard: 'hasPlannedPomodoros',
          actions: ['startPlannedPomodoro', 'startPlannedWork'],
        },
        SWITCH_MODE: {
          actions: 'switchMode',
        },
        UPDATE_SETTINGS: {
          actions: 'updateSettings',
        },
        RESET: {
          actions: 'resetSettings',
        },
        ADD_PLANNED_POMODORO: {
          actions: 'addPlannedPomodoro',
        },
        LOAD_PLANNED_POMODOROS: {
          actions: 'loadPlannedPomodoros',
        },
        UPDATE_PLANNED_POMODORO: {
          actions: 'updatePlannedPomodoro',
        },
        DELETE_PLANNED_POMODORO: {
          actions: 'deletePlannedPomodoro',
        },
      },
    },
    running: {
      invoke: {
        src: 'timer',
      },
      on: {
        TICK: [
          {
            guard: 'hasTimeRemaining',
            actions: 'tick',
          },
          {
            target: 'completed',
          },
        ],
        PAUSE: {
          target: 'paused',
        },
        STOP: {
          target: 'idle',
          actions: 'resetToIdle',
        },
      },
    },
    paused: {
      on: {
        RESUME: {
          target: 'running',
        },
        STOP: {
          target: 'idle',
          actions: 'resetToIdle',
        },
      },
    },
    completed: {
      entry: 'playBeep',
      after: {
        5000: [
          {
            guard: ({ context }) =>
              context.phase === 'work' && context.settings.autoRepeat && context.mode === 'planned',
            target: 'running',
            actions: 'startPlannedBreak',
          },
          {
            guard: ({ context }) =>
              context.phase === 'work' && context.settings.autoRepeat && context.mode === 'default',
            target: 'running',
            actions: 'startBreak',
          },
          {
            guard: ({ context }) =>
              context.phase === 'break' &&
              context.settings.autoRepeat &&
              context.mode === 'default',
            target: 'running',
            actions: 'startWork',
          },
          {
            guard: ({ context }) =>
              context.phase === 'break' &&
              context.settings.autoRepeat &&
              context.mode === 'planned' &&
              context.currentPlannedIndex !== null &&
              context.currentPlannedIndex < context.plannedPomodoros.length - 1,
            target: 'running',
            actions: ['moveToNextPlannedPomodoro', 'startPlannedWork'],
          },
          {
            target: 'idle',
            actions: 'resetToIdle',
          },
        ],
      },
      on: {
        START_WORK: {
          target: 'running',
          actions: 'startWork',
        },
        START_BREAK: {
          target: 'running',
          actions: 'startBreak',
        },
        STOP: {
          target: 'idle',
          actions: 'resetToIdle',
        },
      },
    },
  },
});
