'use client';

import { formatTime } from '../utils/time';

interface TimerDisplayProps {
  remainingTime: number;
  phase: 'work' | 'break' | 'idle';
  isRunning: boolean;
}

export function TimerDisplay({ remainingTime, phase, isRunning }: TimerDisplayProps) {
  const phaseText = phase === 'work' ? 'Work' : phase === 'break' ? 'Break' : 'Ready';
  const phaseColor =
    phase === 'work'
      ? 'text-red-600'
      : phase === 'break'
      ? 'text-green-600'
      : 'text-gray-800';

  return (
    <div className="text-center space-y-4">
      <div className={`text-2xl font-semibold ${phaseColor}`}>
        {phaseText}
      </div>
      <div className="text-7xl font-mono font-bold">
        {formatTime(remainingTime)}
      </div>
      {isRunning && (
        <div className="text-sm text-gray-700">Running...</div>
      )}
    </div>
  );
}
