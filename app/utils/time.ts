/**
 * Format seconds to MM:SS format
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Format time to HH:MM format for planned pomodoros
 */
export function formatClockTime(hours: number, minutes: number): string {
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/**
 * Parse HH:MM format to { hours, minutes }
 */
export function parseClockTime(time: string): { hours: number; minutes: number } {
  const [hours, minutes] = time.split(':').map(Number);
  return { hours: hours || 0, minutes: minutes || 0 };
}

/**
 * Add minutes to a time string (HH:MM format)
 */
export function addMinutesToTime(time: string, minutesToAdd: number): string {
  const { hours, minutes } = parseClockTime(time);
  const totalMinutes = hours * 60 + minutes + minutesToAdd;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMinutes = totalMinutes % 60;
  return formatClockTime(newHours, newMinutes);
}

/**
 * Get current time in HH:MM format
 */
export function getCurrentTime(): string {
  const now = new Date();
  return formatClockTime(now.getHours(), now.getMinutes());
}

/**
 * Check if time1 is before time2 (both in HH:MM format)
 */
export function isTimeBefore(time1: string, time2: string): boolean {
  const { hours: h1, minutes: m1 } = parseClockTime(time1);
  const { hours: h2, minutes: m2 } = parseClockTime(time2);
  return h1 * 60 + m1 < h2 * 60 + m2;
}

/**
 * Calculate minutes between two times (HH:MM format)
 */
export function getMinutesBetween(startTime: string, endTime: string): number {
  const { hours: h1, minutes: m1 } = parseClockTime(startTime);
  const { hours: h2, minutes: m2 } = parseClockTime(endTime);
  let diff = (h2 * 60 + m2) - (h1 * 60 + m1);
  if (diff < 0) diff += 24 * 60; // Handle crossing midnight
  return diff;
}
