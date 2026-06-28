let omrAudio: HTMLAudioElement | null = null;

export function playOMRFillSound(enabled: boolean) {
  if (!enabled) return;
  if (typeof window === "undefined") return;
  try {
    if (!omrAudio) {
      omrAudio = new Audio("/sounds/omr-fill.mp3");
      omrAudio.volume = 0.35;
      omrAudio.preload = "auto";
    }
    omrAudio.currentTime = 0;
    void omrAudio.play().catch(() => {
      // Ignore autoplay or browser audio errors silently
    });
  } catch {
    // Ignore audio errors
  }
}
