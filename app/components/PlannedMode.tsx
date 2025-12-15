'use client';

import { useState, useEffect } from 'react';
import { TimerDisplay } from './TimerDisplay';
import { ControlButtons } from './ControlButtons';
import { SettingsPanel } from './SettingsPanel';
import { PomodoroContext, PomodoroEvent } from '../machines/pomodoroMachine';
import { PlannedPomodoro, DEFAULT_PLANNED_START_TIME } from '../types/pomodoro';
import type { PomodoroSettings } from '../types/pomodoro';
import { getCurrentTime, isTimeBefore } from '../utils/time';

interface PlannedModeProps {
  context: PomodoroContext;
  send: (event: PomodoroEvent) => void;
  isIdle: boolean;
  isRunning: boolean;
  isPaused: boolean;
  isCompleted: boolean;
}

export function PlannedMode({ context, send, isIdle, isRunning, isPaused, isCompleted }: PlannedModeProps) {
  const [newPomodoroName, setNewPomodoroName] = useState('');
  const [newPomodoroStartTime, setNewPomodoroStartTime] = useState(DEFAULT_PLANNED_START_TIME);
  const [newPomodoroWorkEndTime, setNewPomodoroWorkEndTime] = useState('09:25');
  const [newPomodoroBreakEndTime, setNewPomodoroBreakEndTime] = useState('09:30');

  // Auto-start when scheduled time is reached (if auto-repeat is enabled)
  useEffect(() => {
    if (!isIdle || !context.settings.autoRepeat || context.plannedPomodoros.length === 0) {
      return;
    }

    const checkInterval = setInterval(() => {
      const currentTime = getCurrentTime();
      const firstPomodoro = context.plannedPomodoros[0];

      // Check if current time is at or after the start time
      if (!isTimeBefore(currentTime, firstPomodoro.startTime)) {
        send({ type: 'START_PLANNED' });
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(checkInterval);
  }, [isIdle, context.settings.autoRepeat, context.plannedPomodoros, send]);

  const calculateTimeFromDuration = (startTime: string, durationMinutes: number): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
  };

  const handleStartTimeChange = (newStartTime: string) => {
    setNewPomodoroStartTime(newStartTime);
    // Auto-calculate work end and break end times
    const workEnd = calculateTimeFromDuration(newStartTime, context.settings.workDuration);
    const breakEnd = calculateTimeFromDuration(workEnd, context.settings.breakDuration);
    setNewPomodoroWorkEndTime(workEnd);
    setNewPomodoroBreakEndTime(breakEnd);
  };

  const handleWorkEndTimeChange = (newWorkEndTime: string) => {
    setNewPomodoroWorkEndTime(newWorkEndTime);
    // Auto-calculate break end time
    const breakEnd = calculateTimeFromDuration(newWorkEndTime, context.settings.breakDuration);
    setNewPomodoroBreakEndTime(breakEnd);
  };

  const handleAddPomodoro = () => {
    const newPomodoro: PlannedPomodoro = {
      id: Date.now().toString(),
      name: newPomodoroName || `Pomodoro ${context.plannedPomodoros.length + 1}`,
      startTime: newPomodoroStartTime,
      workEndTime: newPomodoroWorkEndTime,
      breakEndTime: newPomodoroBreakEndTime,
    };

    send({ type: 'ADD_PLANNED_POMODORO', pomodoro: newPomodoro });
    setNewPomodoroName('');

    // Set next pomodoro times to start after this one
    setNewPomodoroStartTime(newPomodoroBreakEndTime);
    const nextWorkEnd = calculateTimeFromDuration(newPomodoroBreakEndTime, context.settings.workDuration);
    const nextBreakEnd = calculateTimeFromDuration(nextWorkEnd, context.settings.breakDuration);
    setNewPomodoroWorkEndTime(nextWorkEnd);
    setNewPomodoroBreakEndTime(nextBreakEnd);
  };

  const handleDeletePomodoro = (id: string) => {
    send({ type: 'DELETE_PLANNED_POMODORO', id });
  };

  const handleUpdatePomodoro = (id: string, updates: Partial<PlannedPomodoro>) => {
    send({ type: 'UPDATE_PLANNED_POMODORO', id, pomodoro: updates });
  };

  const handleStart = () => {
    send({ type: 'START_PLANNED' });
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

      {/* Planned Pomodoros List */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Planned Pomodoros</h3>

        {/* Add New Pomodoro */}
        <div className="mb-6 p-4 bg-blue-100 rounded-lg">
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Task name (optional)"
              value={newPomodoroName}
              onChange={(e) => setNewPomodoroName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900"
              disabled={isRunning || isPaused}
            />
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Start Time</label>
                <input
                  type="time"
                  value={newPomodoroStartTime}
                  onChange={(e) => handleStartTimeChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900"
                  disabled={isRunning || isPaused}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Work End</label>
                <input
                  type="time"
                  value={newPomodoroWorkEndTime}
                  onChange={(e) => handleWorkEndTimeChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900"
                  disabled={isRunning || isPaused}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Break End</label>
                <input
                  type="time"
                  value={newPomodoroBreakEndTime}
                  onChange={(e) => setNewPomodoroBreakEndTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900"
                  disabled={isRunning || isPaused}
                />
              </div>
            </div>
            <button
              onClick={handleAddPomodoro}
              disabled={isRunning || isPaused}
              className="w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Pomodoro
            </button>
          </div>
        </div>

        {/* Pomodoros List */}
        {context.plannedPomodoros.length === 0 ? (
          <p className="text-gray-700 text-center py-8">No pomodoros planned yet. Add one to get started!</p>
        ) : (
          <div className="space-y-3">
            {context.plannedPomodoros.map((pomodoro, index) => (
              <div
                key={pomodoro.id}
                className={`p-4 rounded-lg border-2 ${
                  context.currentPlannedIndex === index
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={pomodoro.name}
                      onChange={(e) => handleUpdatePomodoro(pomodoro.id, { name: e.target.value })}
                      className="font-semibold text-lg text-gray-900 bg-white border border-gray-300 rounded px-2 py-1 w-full mb-2"
                      disabled={isRunning || isPaused}
                    />
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-gray-800">Start: </span>
                        <input
                          type="time"
                          value={pomodoro.startTime}
                          onChange={(e) => handleUpdatePomodoro(pomodoro.id, { startTime: e.target.value })}
                          className="bg-white border border-gray-300 rounded px-2 py-1 text-gray-900 font-medium"
                          disabled={isRunning || isPaused}
                        />
                      </div>
                      <div>
                        <span className="text-gray-800">Work End: </span>
                        <input
                          type="time"
                          value={pomodoro.workEndTime}
                          onChange={(e) => handleUpdatePomodoro(pomodoro.id, { workEndTime: e.target.value })}
                          className="bg-white border border-gray-300 rounded px-2 py-1 text-red-700 font-medium"
                          disabled={isRunning || isPaused}
                        />
                      </div>
                      <div>
                        <span className="text-gray-800">Break End: </span>
                        <input
                          type="time"
                          value={pomodoro.breakEndTime}
                          onChange={(e) => handleUpdatePomodoro(pomodoro.id, { breakEndTime: e.target.value })}
                          className="bg-white border border-gray-300 rounded px-2 py-1 text-green-800 font-medium"
                          disabled={isRunning || isPaused}
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeletePomodoro(pomodoro.id)}
                    disabled={isRunning || isPaused}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <SettingsPanel
        settings={context.settings}
        onUpdateSettings={handleUpdateSettings}
        onResetSettings={handleResetSettings}
        isDisabled={isRunning || isPaused}
        showDurationSettings={false}
      />
    </div>
  );
}
