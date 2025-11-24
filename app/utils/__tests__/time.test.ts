import {
  formatTime,
  formatClockTime,
  parseClockTime,
  addMinutesToTime,
  isTimeBefore,
  getMinutesBetween,
} from '../time';

describe('Time Utilities', () => {
  describe('formatTime', () => {
    it('should format seconds to MM:SS', () => {
      expect(formatTime(0)).toBe('00:00');
      expect(formatTime(59)).toBe('00:59');
      expect(formatTime(60)).toBe('01:00');
      expect(formatTime(125)).toBe('02:05');
      expect(formatTime(3599)).toBe('59:59');
    });
  });

  describe('formatClockTime', () => {
    it('should format hours and minutes to HH:MM', () => {
      expect(formatClockTime(0, 0)).toBe('00:00');
      expect(formatClockTime(9, 0)).toBe('09:00');
      expect(formatClockTime(9, 30)).toBe('09:30');
      expect(formatClockTime(23, 59)).toBe('23:59');
    });
  });

  describe('parseClockTime', () => {
    it('should parse HH:MM to hours and minutes', () => {
      expect(parseClockTime('00:00')).toEqual({ hours: 0, minutes: 0 });
      expect(parseClockTime('09:00')).toEqual({ hours: 9, minutes: 0 });
      expect(parseClockTime('09:30')).toEqual({ hours: 9, minutes: 30 });
      expect(parseClockTime('23:59')).toEqual({ hours: 23, minutes: 59 });
    });
  });

  describe('addMinutesToTime', () => {
    it('should add minutes to a time string', () => {
      expect(addMinutesToTime('09:00', 25)).toBe('09:25');
      expect(addMinutesToTime('09:30', 30)).toBe('10:00');
      expect(addMinutesToTime('23:30', 45)).toBe('00:15'); // wraps to next day
    });
  });

  describe('isTimeBefore', () => {
    it('should correctly compare two times', () => {
      expect(isTimeBefore('09:00', '10:00')).toBe(true);
      expect(isTimeBefore('10:00', '09:00')).toBe(false);
      expect(isTimeBefore('09:30', '09:30')).toBe(false);
    });
  });

  describe('getMinutesBetween', () => {
    it('should calculate minutes between two times', () => {
      expect(getMinutesBetween('09:00', '10:00')).toBe(60);
      expect(getMinutesBetween('09:00', '09:30')).toBe(30);
      expect(getMinutesBetween('23:30', '00:15')).toBe(45); // crosses midnight
    });
  });
});
