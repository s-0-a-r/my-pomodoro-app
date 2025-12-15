'use client';

import { PomodoroMode } from '../types/pomodoro';

interface ModeSwitchProps {
  currentMode: PomodoroMode;
  onModeChange: (mode: PomodoroMode) => void;
  disabled?: boolean;
}

export function ModeSwitch({ currentMode, onModeChange, disabled = false }: ModeSwitchProps) {
  return (
    <div className="flex gap-2 bg-gray-300 p-1 rounded-lg">
      <button
        onClick={() => onModeChange('default')}
        disabled={disabled}
        className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
          currentMode === 'default'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-800 hover:text-gray-900'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        Default Mode
      </button>
      <button
        onClick={() => onModeChange('planned')}
        disabled={disabled}
        className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
          currentMode === 'planned'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-800 hover:text-gray-900'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        Planned Mode
      </button>
    </div>
  );
}
