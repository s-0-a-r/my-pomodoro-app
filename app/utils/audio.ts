// Audio notification system for Pomodoro timer

let audioContext: AudioContext | null = null;
let currentBeep: { oscillator: OscillatorNode; gainNode: GainNode } | null = null;

/**
 * Initialize audio context (needed for Web Audio API)
 */
function getAudioContext(): AudioContext {
  if (!audioContext) {
    const AudioContextConstructor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioContext = new AudioContextConstructor();
  }
  return audioContext;
}

/**
 * Play a beep sound for the specified duration
 * @param duration Duration in milliseconds
 * @param volume Volume level (0-1)
 */
export function playBeep(duration: number = 5000, volume: number = 0.5): void {
  if (typeof window === 'undefined') return;

  try {
    // Stop any currently playing beep
    stopBeep();

    const context = getAudioContext();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    // Configure oscillator for a pleasant beep sound
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, context.currentTime); // 800 Hz tone

    // Configure volume with fade out
    gainNode.gain.setValueAtTime(volume, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration / 1000);

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    // Start and schedule stop
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + duration / 1000);

    currentBeep = { oscillator, gainNode };

    // Clean up after beep finishes
    oscillator.onended = () => {
      currentBeep = null;
    };
  } catch (error) {
    console.error('Failed to play beep:', error);
  }
}

/**
 * Stop the currently playing beep
 */
export function stopBeep(): void {
  if (currentBeep) {
    try {
      currentBeep.oscillator.stop();
      currentBeep.oscillator.disconnect();
      currentBeep.gainNode.disconnect();
    } catch {
      // Ignore errors when stopping
    }
    currentBeep = null;
  }
}

/**
 * Test the beep sound with current volume
 */
export function testBeep(volume: number = 0.5): void {
  playBeep(1000, volume); // 1 second test beep
}
