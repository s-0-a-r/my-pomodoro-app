import { createActor } from 'xstate';
import { pomodoroMachine } from '../pomodoroMachine';
import { DEFAULT_SETTINGS } from '../../types/pomodoro';

describe('Pomodoro State Machine', () => {
  describe('Initial State', () => {
    it('should start in idle state', () => {
      const actor = createActor(pomodoroMachine);
      actor.start();

      expect(actor.getSnapshot().matches('idle')).toBe(true);
      expect(actor.getSnapshot().context.phase).toBe('idle');
      expect(actor.getSnapshot().context.remainingTime).toBe(0);
    });

    it('should have default settings', () => {
      const actor = createActor(pomodoroMachine);
      actor.start();

      expect(actor.getSnapshot().context.settings).toEqual(DEFAULT_SETTINGS);
    });
  });

  describe('Start Work', () => {
    it('should transition to running state when START_WORK is sent', () => {
      const actor = createActor(pomodoroMachine);
      actor.start();

      actor.send({ type: 'START_WORK' });

      expect(actor.getSnapshot().matches('running')).toBe(true);
      expect(actor.getSnapshot().context.phase).toBe('work');
      expect(actor.getSnapshot().context.remainingTime).toBe(25 * 60);
    });
  });

  describe('Pause and Resume', () => {
    it('should pause when PAUSE is sent during running', () => {
      const actor = createActor(pomodoroMachine);
      actor.start();

      actor.send({ type: 'START_WORK' });
      actor.send({ type: 'PAUSE' });

      expect(actor.getSnapshot().matches('paused')).toBe(true);
    });

    it('should resume when RESUME is sent during paused', () => {
      const actor = createActor(pomodoroMachine);
      actor.start();

      actor.send({ type: 'START_WORK' });
      actor.send({ type: 'PAUSE' });
      actor.send({ type: 'RESUME' });

      expect(actor.getSnapshot().matches('running')).toBe(true);
    });
  });

  describe('Stop', () => {
    it('should return to idle when STOP is sent during running', () => {
      const actor = createActor(pomodoroMachine);
      actor.start();

      actor.send({ type: 'START_WORK' });
      actor.send({ type: 'STOP' });

      expect(actor.getSnapshot().matches('idle')).toBe(true);
      expect(actor.getSnapshot().context.phase).toBe('idle');
      expect(actor.getSnapshot().context.remainingTime).toBe(0);
    });

    it('should return to idle when STOP is sent during paused', () => {
      const actor = createActor(pomodoroMachine);
      actor.start();

      actor.send({ type: 'START_WORK' });
      actor.send({ type: 'PAUSE' });
      actor.send({ type: 'STOP' });

      expect(actor.getSnapshot().matches('idle')).toBe(true);
    });
  });

  describe('Settings', () => {
    it('should update settings when UPDATE_SETTINGS is sent', () => {
      const actor = createActor(pomodoroMachine);
      actor.start();

      actor.send({
        type: 'UPDATE_SETTINGS',
        settings: { workDuration: 30, volume: 0.8 }
      });

      expect(actor.getSnapshot().context.settings.workDuration).toBe(30);
      expect(actor.getSnapshot().context.settings.volume).toBe(0.8);
      expect(actor.getSnapshot().context.settings.breakDuration).toBe(5); // unchanged
    });

    it('should reset settings to default when RESET is sent', () => {
      const actor = createActor(pomodoroMachine);
      actor.start();

      actor.send({
        type: 'UPDATE_SETTINGS',
        settings: { workDuration: 30 }
      });
      actor.send({ type: 'RESET' });

      expect(actor.getSnapshot().context.settings).toEqual(DEFAULT_SETTINGS);
    });
  });

  describe('Mode Switching', () => {
    it('should switch mode when SWITCH_MODE is sent', () => {
      const actor = createActor(pomodoroMachine);
      actor.start();

      expect(actor.getSnapshot().context.mode).toBe('default');

      actor.send({ type: 'SWITCH_MODE', mode: 'planned' });

      expect(actor.getSnapshot().context.mode).toBe('planned');
    });

    it('should only allow mode switching when in idle state', () => {
      const actor = createActor(pomodoroMachine);
      actor.start();

      actor.send({ type: 'START_WORK' });

      // Mode switch should not happen during running
      actor.send({ type: 'SWITCH_MODE', mode: 'planned' });
      expect(actor.getSnapshot().context.mode).toBe('default'); // should stay default
      expect(actor.getSnapshot().matches('running')).toBe(true); // should stay running

      // Stop first, then switch mode
      actor.send({ type: 'STOP' });
      actor.send({ type: 'SWITCH_MODE', mode: 'planned' });

      expect(actor.getSnapshot().matches('idle')).toBe(true);
      expect(actor.getSnapshot().context.mode).toBe('planned');
    });
  });

  describe('Planned Pomodoros', () => {
    it('should add planned pomodoro', () => {
      const actor = createActor(pomodoroMachine);
      actor.start();

      const pomodoro = {
        id: '1',
        name: 'Test Task',
        startTime: '09:00',
        workEndTime: '09:25',
        breakEndTime: '09:30',
      };

      actor.send({ type: 'ADD_PLANNED_POMODORO', pomodoro });

      expect(actor.getSnapshot().context.plannedPomodoros).toHaveLength(1);
      expect(actor.getSnapshot().context.plannedPomodoros[0]).toEqual(pomodoro);
    });

    it('should update planned pomodoro', () => {
      const actor = createActor(pomodoroMachine);
      actor.start();

      const pomodoro = {
        id: '1',
        name: 'Test Task',
        startTime: '09:00',
        workEndTime: '09:25',
        breakEndTime: '09:30',
      };

      actor.send({ type: 'ADD_PLANNED_POMODORO', pomodoro });
      actor.send({
        type: 'UPDATE_PLANNED_POMODORO',
        id: '1',
        pomodoro: { name: 'Updated Task' }
      });

      expect(actor.getSnapshot().context.plannedPomodoros[0].name).toBe('Updated Task');
    });

    it('should delete planned pomodoro', () => {
      const actor = createActor(pomodoroMachine);
      actor.start();

      const pomodoro = {
        id: '1',
        name: 'Test Task',
        startTime: '09:00',
        workEndTime: '09:25',
        breakEndTime: '09:30',
      };

      actor.send({ type: 'ADD_PLANNED_POMODORO', pomodoro });
      actor.send({ type: 'DELETE_PLANNED_POMODORO', id: '1' });

      expect(actor.getSnapshot().context.plannedPomodoros).toHaveLength(0);
    });
  });
});
