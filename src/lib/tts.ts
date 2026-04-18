/**
 * Browser SpeechSynthesis helpers tuned for calm Hebrew bedtime narration.
 */

let cachedVoice: SpeechSynthesisVoice | null = null;

function pickHebrewVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice) return cachedVoice;
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  cachedVoice =
    voices.find((v) => v.lang?.toLowerCase().startsWith("he")) ??
    voices.find((v) => v.lang?.toLowerCase().startsWith("iw")) ??
    null;
  return cachedVoice;
}

export function isTTSAvailable(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speak(text: string, onEnd?: () => void) {
  if (!isTTSAvailable()) return;
  window.speechSynthesis.cancel();

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "he-IL";
  utter.rate = 0.88; // slow, sleepy
  utter.pitch = 0.95;
  utter.volume = 1;

  const voice = pickHebrewVoice();
  if (voice) utter.voice = voice;

  if (onEnd) utter.onend = () => onEnd();
  window.speechSynthesis.speak(utter);
}

export function stopSpeaking() {
  if (!isTTSAvailable()) return;
  window.speechSynthesis.cancel();
}

// Pre-warm voices list (some browsers load it asynchronously)
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null;
    pickHebrewVoice();
  };
}
