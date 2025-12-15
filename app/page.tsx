'use client';

import { useState } from 'react';
import { DefaultMode } from './components/DefaultMode';
import { PlannedMode } from './components/PlannedMode';
import { ModeSwitch } from './components/ModeSwitch';
import { usePomodoro } from './hooks/usePomodoro';
import { PomodoroMode } from './types/pomodoro';

export default function Home() {
  const { context, send, isIdle, isRunning, isPaused, isCompleted } = usePomodoro();
  const [localMode, setLocalMode] = useState<PomodoroMode>('default');

  const handleModeChange = (mode: PomodoroMode) => {
    setLocalMode(mode);
    send({ type: 'SWITCH_MODE', mode });
  };

  const sharedProps = {
    context,
    send,
    isIdle,
    isRunning,
    isPaused,
    isCompleted,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Pomodoro Timer</h1>
          <p className="text-gray-800">Stay focused and productive with the Pomodoro Technique</p>
        </header>

        <div className="mb-8">
          <ModeSwitch
            currentMode={localMode}
            onModeChange={handleModeChange}
            disabled={isRunning || isPaused}
          />
        </div>

        {localMode === 'default' ? <DefaultMode {...sharedProps} /> : <PlannedMode {...sharedProps} />}
      </div>
    </div>
  );
}
