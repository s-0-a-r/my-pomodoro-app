'use client';

import { TimerDisplay } from './TimerDisplay';
import { ControlButtons } from './ControlButtons';
import { SettingsPanel } from './SettingsPanel';
import { PomodoroContext, PomodoroEvent } from '../machines/pomodoroMachine';
import type { PomodoroSettings } from '../types/pomodoro';

interface DefaultModeProps {
  context: PomodoroContext;
  send: (event: PomodoroEvent) => void;
  isIdle: boolean;
  isRunning: boolean;
  isPaused: boolean;
  isCompleted: boolean;
}

export function DefaultMode({ context, send, isIdle, isRunning, isPaused, isCompleted }: DefaultModeProps) {
  const handleStart = () => {
    send({ type: 'START_WORK' });
  };

  const handlePause = () => {
    send({ type: 'PAUSE' });
  };

  const handleResume = () => {
    send({ type: 'RESUME' });
  };

  const handleStop = () => {
    send({ type: 'STOP' });
  };

  const handleUpdateSettings = (settings: Partial<PomodoroSettings>) => {
    send({ type: 'UPDATE_SETTINGS', settings });
  };

  const handleResetSettings = () => {
    send({ type: 'RESET' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <TimerDisplay
          remainingTime={context.remainingTime}
          phase={context.phase}
          isRunning={isRunning}
        />
        <div className="mt-8">
          <ControlButtons
            isIdle={isIdle}
            isRunning={isRunning}
            isPaused={isPaused}
            isCompleted={isCompleted}
            onStart={handleStart}
            onPause={handlePause}
            onResume={handleResume}
            onStop={handleStop}
          />
        </div>
      </div>

      <SettingsPanel
        settings={context.settings}
        onUpdateSettings={handleUpdateSettings}
        onResetSettings={handleResetSettings}
        isDisabled={isRunning || isPaused}
      />
    </div>
  );
}
