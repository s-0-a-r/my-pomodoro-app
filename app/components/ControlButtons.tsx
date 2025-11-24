'use client';

interface ControlButtonsProps {
  isIdle: boolean;
  isRunning: boolean;
  isPaused: boolean;
  isCompleted: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export function ControlButtons({
  isIdle,
  isRunning,
  isPaused,
  isCompleted,
  onStart,
  onPause,
  onResume,
  onStop,
}: ControlButtonsProps) {
  return (
    <div className="flex gap-4 justify-center">
      {isIdle && (
        <button
          onClick={onStart}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-colors"
        >
          Start
        </button>
      )}

      {isRunning && (
        <>
          <button
            onClick={onPause}
            className="px-8 py-4 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold text-lg transition-colors"
          >
            Pause
          </button>
          <button
            onClick={onStop}
            className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-lg transition-colors"
          >
            Stop
          </button>
        </>
      )}

      {isPaused && (
        <>
          <button
            onClick={onResume}
            className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-lg transition-colors"
          >
            Resume
          </button>
          <button
            onClick={onStop}
            className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-lg transition-colors"
          >
            Stop
          </button>
        </>
      )}

      {isCompleted && (
        <button
          onClick={onStart}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-colors"
        >
          Start New
        </button>
      )}
    </div>
  );
}
