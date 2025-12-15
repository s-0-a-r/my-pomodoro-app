'use client';

import { PomodoroSettings, CONSTRAINTS } from '../types/pomodoro';
import { testBeep } from '../utils/audio';

interface SettingsPanelProps {
  settings: PomodoroSettings;
  onUpdateSettings: (settings: Partial<PomodoroSettings>) => void;
  onResetSettings: () => void;
  isDisabled?: boolean;
  showDurationSettings?: boolean;
}

export function SettingsPanel({
  settings,
  onUpdateSettings,
  onResetSettings,
  isDisabled = false,
  showDurationSettings = true,
}: SettingsPanelProps) {
  const handleWorkDurationChange = (increment: number) => {
    const newDuration = Math.max(
      CONSTRAINTS.MIN_WORK_DURATION,
      Math.min(CONSTRAINTS.MAX_WORK_DURATION, settings.workDuration + increment)
    );
    onUpdateSettings({ workDuration: newDuration });
  };

  const handleBreakDurationChange = (increment: number) => {
    const newDuration = Math.max(
      CONSTRAINTS.MIN_BREAK_DURATION,
      Math.min(CONSTRAINTS.MAX_BREAK_DURATION, settings.breakDuration + increment)
    );
    onUpdateSettings({ breakDuration: newDuration });
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    onUpdateSettings({ volume });
  };

  const handleTestBeep = () => {
    testBeep(settings.volume);
  };

  return (
    <div className="bg-gray-100 rounded-lg p-6 space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Settings</h3>

      {/* Auto Repeat */}
      <div className="flex items-center justify-between">
        <label className="font-medium text-gray-900">Auto Repeat</label>
        <button
          onClick={() => onUpdateSettings({ autoRepeat: !settings.autoRepeat })}
          disabled={isDisabled}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            settings.autoRepeat ? 'bg-blue-600' : 'bg-gray-300'
          } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.autoRepeat ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Work Duration */}
      {showDurationSettings && (
        <>
          <div className="space-y-2">
            <label className="font-medium text-gray-900 block">Work Duration: {settings.workDuration} min</label>
            <div className="flex gap-2">
              {CONSTRAINTS.TIME_INCREMENTS.map((increment) => (
                <button
                  key={`work-minus-${increment}`}
                  onClick={() => handleWorkDurationChange(-increment)}
                  disabled={isDisabled || settings.workDuration - increment < CONSTRAINTS.MIN_WORK_DURATION}
                  className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  -{increment}
                </button>
              ))}
              {CONSTRAINTS.TIME_INCREMENTS.map((increment) => (
                <button
                  key={`work-plus-${increment}`}
                  onClick={() => handleWorkDurationChange(increment)}
                  disabled={isDisabled || settings.workDuration + increment > CONSTRAINTS.MAX_WORK_DURATION}
                  className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +{increment}
                </button>
              ))}
            </div>
          </div>

          {/* Break Duration */}
          <div className="space-y-2">
            <label className="font-medium text-gray-900 block">Break Duration: {settings.breakDuration} min</label>
            <div className="flex gap-2">
              {CONSTRAINTS.TIME_INCREMENTS.map((increment) => (
                <button
                  key={`break-minus-${increment}`}
                  onClick={() => handleBreakDurationChange(-increment)}
                  disabled={isDisabled || settings.breakDuration - increment < CONSTRAINTS.MIN_BREAK_DURATION}
                  className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  -{increment}
                </button>
              ))}
              {CONSTRAINTS.TIME_INCREMENTS.map((increment) => (
                <button
                  key={`break-plus-${increment}`}
                  onClick={() => handleBreakDurationChange(increment)}
                  disabled={isDisabled || settings.breakDuration + increment > CONSTRAINTS.MAX_BREAK_DURATION}
                  className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +{increment}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Volume */}
      <div className="space-y-2">
        <label className="font-medium text-gray-900 block">Volume: {Math.round(settings.volume * 100)}%</label>
        <div className="flex gap-3 items-center">
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.volume}
            onChange={handleVolumeChange}
            disabled={isDisabled}
            className="flex-1"
          />
          <button
            onClick={handleTestBeep}
            disabled={isDisabled}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Test
          </button>
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={onResetSettings}
        disabled={isDisabled}
        className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Reset to Default
      </button>
    </div>
  );
}
