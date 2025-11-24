'use client';

import { useEffect } from 'react';
import { useMachine } from '@xstate/react';
import { pomodoroMachine } from '../machines/pomodoroMachine';
import { loadSettings, saveSettings, loadPlannedPomodoros, savePlannedPomodoros } from '../utils/storage';

export function usePomodoro() {
  const [state, send] = useMachine(pomodoroMachine);

  // Load settings and planned pomodoros from localStorage on mount
  useEffect(() => {
    const savedSettings = loadSettings();
    const savedPlannedPomodoros = loadPlannedPomodoros();

    send({ type: 'UPDATE_SETTINGS', settings: savedSettings });
    send({ type: 'LOAD_PLANNED_POMODOROS', pomodoros: savedPlannedPomodoros });
  }, [send]);

  // Persist settings to localStorage
  useEffect(() => {
    saveSettings(state.context.settings);
  }, [state.context.settings]);

  // Persist planned pomodoros to localStorage
  useEffect(() => {
    savePlannedPomodoros(state.context.plannedPomodoros);
  }, [state.context.plannedPomodoros]);

  return {
    state: state.value,
    context: state.context,
    send,
    isIdle: state.matches('idle'),
    isRunning: state.matches('running'),
    isPaused: state.matches('paused'),
    isCompleted: state.matches('completed'),
  };
}
