import { render, screen, fireEvent } from '@testing-library/react';
import { PlannedMode } from '../PlannedMode';
import { DEFAULT_SETTINGS } from '../../types/pomodoro';

// Mock the time utils module
jest.mock('../../utils/time', () => ({
  ...jest.requireActual('../../utils/time'),
  getCurrentTime: jest.fn(() => '09:00'),
}));

import * as timeUtils from '../../utils/time';

describe('PlannedMode', () => {
  const mockSend = jest.fn();
  const mockContext = {
    mode: 'planned' as const,
    phase: 'idle' as const,
    remainingTime: 0,
    settings: DEFAULT_SETTINGS,
    plannedPomodoros: [],
    currentPlannedIndex: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Add Pomodoro Form', () => {
    it('should render all time input fields', () => {
      render(
        <PlannedMode
          context={mockContext}
          send={mockSend}
          isIdle={true}
          isRunning={false}
          isPaused={false}
          isCompleted={false}
        />
      );

      expect(screen.getByText('Start Time')).toBeInTheDocument();
      expect(screen.getByText('Work End')).toBeInTheDocument();
      expect(screen.getByText('Break End')).toBeInTheDocument();
    });

    it('should auto-fill work end and break end when start time is changed', () => {
      render(
        <PlannedMode
          context={mockContext}
          send={mockSend}
          isIdle={true}
          isRunning={false}
          isPaused={false}
          isCompleted={false}
        />
      );

      const timeInputs = screen.getAllByDisplayValue(/^\d{2}:\d{2}$/);
      const startTimeInput = timeInputs[0];

      // Change start time to 10:00
      fireEvent.change(startTimeInput, { target: { value: '10:00' } });

      // Work end should be 10:25 (10:00 + 25min default)
      // Break end should be 10:30 (10:25 + 5min default)
      const updatedTimeInputs = screen.getAllByDisplayValue(/^\d{2}:\d{2}$/);
      expect((updatedTimeInputs[0] as HTMLInputElement).value).toBe('10:00');
      expect((updatedTimeInputs[1] as HTMLInputElement).value).toBe('10:25');
      expect((updatedTimeInputs[2] as HTMLInputElement).value).toBe('10:30');
    });

    it('should auto-fill break end when work end is changed', () => {
      render(
        <PlannedMode
          context={mockContext}
          send={mockSend}
          isIdle={true}
          isRunning={false}
          isPaused={false}
          isCompleted={false}
        />
      );

      const timeInputs = screen.getAllByDisplayValue(/^\d{2}:\d{2}$/);
      const workEndInput = timeInputs[1];

      // Change work end time to 11:00
      fireEvent.change(workEndInput, { target: { value: '11:00' } });

      // Break end should be 11:05 (11:00 + 5min default)
      const updatedTimeInputs = screen.getAllByDisplayValue(/^\d{2}:\d{2}$/);
      expect((updatedTimeInputs[1] as HTMLInputElement).value).toBe('11:00');
      expect((updatedTimeInputs[2] as HTMLInputElement).value).toBe('11:05');
    });

    it('should have default time values', () => {
      render(
        <PlannedMode
          context={mockContext}
          send={mockSend}
          isIdle={true}
          isRunning={false}
          isPaused={false}
          isCompleted={false}
        />
      );

      const timeInputs = screen.getAllByDisplayValue(/^\d{2}:\d{2}$/);
      expect(timeInputs).toHaveLength(3);
      expect((timeInputs[0] as HTMLInputElement).value).toBe('09:00');
      expect((timeInputs[1] as HTMLInputElement).value).toBe('09:25');
      expect((timeInputs[2] as HTMLInputElement).value).toBe('09:30');
    });

    it('should allow editing all time fields', () => {
      render(
        <PlannedMode
          context={mockContext}
          send={mockSend}
          isIdle={true}
          isRunning={false}
          isPaused={false}
          isCompleted={false}
        />
      );

      const timeInputs = screen.getAllByDisplayValue(/^\d{2}:\d{2}$/);
      const startTimeInput = timeInputs[0];
      fireEvent.change(startTimeInput, { target: { value: '10:00' } });

      expect((startTimeInput as HTMLInputElement).value).toBe('10:00');
    });

    it('should send ADD_PLANNED_POMODORO event with custom times', () => {
      render(
        <PlannedMode
          context={mockContext}
          send={mockSend}
          isIdle={true}
          isRunning={false}
          isPaused={false}
          isCompleted={false}
        />
      );

      const timeInputs = screen.getAllByDisplayValue(/^\d{2}:\d{2}$/);
      const [startTimeInput, workEndInput, breakEndInput] = timeInputs;
      const taskNameInput = screen.getByPlaceholderText('Task name (optional)');

      fireEvent.change(taskNameInput, { target: { value: 'My Task' } });
      fireEvent.change(startTimeInput, { target: { value: '10:00' } });
      fireEvent.change(workEndInput, { target: { value: '10:30' } });
      fireEvent.change(breakEndInput, { target: { value: '10:40' } });

      const addButton = screen.getByText('Add Pomodoro');
      fireEvent.click(addButton);

      expect(mockSend).toHaveBeenCalledWith({
        type: 'ADD_PLANNED_POMODORO',
        pomodoro: expect.objectContaining({
          name: 'My Task',
          startTime: '10:00',
          workEndTime: '10:30',
          breakEndTime: '10:40',
        }),
      });
    });
  });

  describe('Pomodoro List', () => {
    it('should render existing pomodoros with editable time fields', () => {
      const contextWithPomodoros = {
        ...mockContext,
        plannedPomodoros: [
          {
            id: '1',
            name: 'Task 1',
            startTime: '09:00',
            workEndTime: '09:25',
            breakEndTime: '09:30',
          },
        ],
      };

      render(
        <PlannedMode
          context={contextWithPomodoros}
          send={mockSend}
          isIdle={true}
          isRunning={false}
          isPaused={false}
          isCompleted={false}
        />
      );

      expect(screen.getByDisplayValue('Task 1')).toBeInTheDocument();
      const timeInputs = screen.getAllByDisplayValue('09:00');
      expect(timeInputs.length).toBeGreaterThan(0);
    });

    it('should allow editing pomodoro times', () => {
      const contextWithPomodoros = {
        ...mockContext,
        plannedPomodoros: [
          {
            id: '1',
            name: 'Task 1',
            startTime: '10:00',
            workEndTime: '10:25',
            breakEndTime: '10:30',
          },
        ],
      };

      render(
        <PlannedMode
          context={contextWithPomodoros}
          send={mockSend}
          isIdle={true}
          isRunning={false}
          isPaused={false}
          isCompleted={false}
        />
      );

      const workEndInput = screen.getByDisplayValue('10:25');

      fireEvent.change(workEndInput, { target: { value: '10:35' } });

      expect(mockSend).toHaveBeenCalledWith({
        type: 'UPDATE_PLANNED_POMODORO',
        id: '1',
        pomodoro: { workEndTime: '10:35' },
      });
    });
  });

  describe('Settings Panel', () => {
    it('should not show duration settings in planned mode', () => {
      render(
        <PlannedMode
          context={mockContext}
          send={mockSend}
          isIdle={true}
          isRunning={false}
          isPaused={false}
          isCompleted={false}
        />
      );

      // Duration settings should not be present
      expect(screen.queryByText(/Work Duration:/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Break Duration:/)).not.toBeInTheDocument();

      // But other settings should be present
      expect(screen.getByText('Auto Repeat')).toBeInTheDocument();
      expect(screen.getByText(/Volume:/)).toBeInTheDocument();
    });
  });

  describe('Disabled state during running/paused', () => {
    it('should disable time inputs when running', () => {
      render(
        <PlannedMode
          context={mockContext}
          send={mockSend}
          isIdle={false}
          isRunning={true}
          isPaused={false}
          isCompleted={false}
        />
      );

      const timeInputs = screen.getAllByDisplayValue(/^\d{2}:\d{2}$/);
      expect(timeInputs[0]).toBeDisabled();
    });

    it('should disable add button when running', () => {
      render(
        <PlannedMode
          context={mockContext}
          send={mockSend}
          isIdle={false}
          isRunning={true}
          isPaused={false}
          isCompleted={false}
        />
      );

      const addButton = screen.getByText('Add Pomodoro');
      expect(addButton).toBeDisabled();
    });
  });

  describe('Auto-start feature', () => {
    const mockGetCurrentTime = timeUtils.getCurrentTime as jest.Mock;

    beforeEach(() => {
      jest.useFakeTimers();
      mockGetCurrentTime.mockClear();
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    it('should auto-start when current time reaches scheduled time with auto-repeat enabled', () => {
      // Mock getCurrentTime to return a time after the scheduled start time
      mockGetCurrentTime.mockReturnValue('09:05');

      const contextWithAutoRepeat = {
        ...mockContext,
        settings: {
          ...mockContext.settings,
          autoRepeat: true,
        },
        plannedPomodoros: [
          {
            id: '1',
            name: 'Task 1',
            startTime: '09:00',
            workEndTime: '09:25',
            breakEndTime: '09:30',
          },
        ],
      };

      render(
        <PlannedMode
          context={contextWithAutoRepeat}
          send={mockSend}
          isIdle={true}
          isRunning={false}
          isPaused={false}
          isCompleted={false}
        />
      );

      // Fast-forward time by 10 seconds (the check interval)
      jest.advanceTimersByTime(10000);

      // Should have called send with START_PLANNED
      expect(mockSend).toHaveBeenCalledWith({ type: 'START_PLANNED' });
    });

    it('should not auto-start when auto-repeat is disabled', () => {
      mockGetCurrentTime.mockReturnValue('09:05');

      const contextWithoutAutoRepeat = {
        ...mockContext,
        settings: {
          ...mockContext.settings,
          autoRepeat: false,
        },
        plannedPomodoros: [
          {
            id: '1',
            name: 'Task 1',
            startTime: '09:00',
            workEndTime: '09:25',
            breakEndTime: '09:30',
          },
        ],
      };

      render(
        <PlannedMode
          context={contextWithoutAutoRepeat}
          send={mockSend}
          isIdle={true}
          isRunning={false}
          isPaused={false}
          isCompleted={false}
        />
      );

      jest.advanceTimersByTime(10000);

      // Should NOT have called send
      expect(mockSend).not.toHaveBeenCalled();
    });

    it('should not auto-start when current time is before scheduled time', () => {
      mockGetCurrentTime.mockReturnValue('08:50');

      const contextWithAutoRepeat = {
        ...mockContext,
        settings: {
          ...mockContext.settings,
          autoRepeat: true,
        },
        plannedPomodoros: [
          {
            id: '1',
            name: 'Task 1',
            startTime: '09:00',
            workEndTime: '09:25',
            breakEndTime: '09:30',
          },
        ],
      };

      render(
        <PlannedMode
          context={contextWithAutoRepeat}
          send={mockSend}
          isIdle={true}
          isRunning={false}
          isPaused={false}
          isCompleted={false}
        />
      );

      jest.advanceTimersByTime(10000);

      // Should NOT have called send because it's not time yet
      expect(mockSend).not.toHaveBeenCalled();
    });
  });
});
