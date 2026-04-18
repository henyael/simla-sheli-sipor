/**
 * Tiny Web Audio "lullaby" generator — no external assets needed.
 * Produces a soft, slowly-modulating ambient drone in a warm major chord
 * with gentle filtered pink-ish noise (like a distant breeze).
 *
 * Designed to be calming, not melodic — perfect bedtime ambience.
 */
type AudioCtx = AudioContext;

let ctx: AudioCtx | null = null;
let master: GainNode | null = null;
let nodes: { stop: () => void }[] = [];

const NOTES_HZ = [
  // C major chord (low octave) — soft, warm, no dissonance
  130.81, // C3
  164.81, // E3
  196.0, // G3
  261.63, // C4
];

export async function startAmbientMusic(volume = 0.12): Promise<boolean> {
  if (ctx) {
    // Already created — make sure it's actually running (browsers may auto-suspend).
    if (ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch {
        return false;
      }
    }
    return true;
  }

  const Ctor =
    (window as unknown as { AudioContext?: typeof AudioContext }).AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return false;

  ctx = new Ctor();

  // Browsers require a user gesture to start audio. If we were called from
  // a real click handler this resume() succeeds; otherwise the play call is
  // silently dropped. We surface failure so the UI can stay in "off" state.
  if (ctx.state === "suspended") {
    try {
      await ctx.resume();
    } catch {
      ctx = null;
      return false;
    }
  }

  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);
  // Gentle fade-in
  master.gain.linearRampToValueAtTime(volume, ctx.currentTime + 2.5);

  // Warm sine pad — each note gets its own gentle tremolo
  for (const freq of NOTES_HZ) {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;

    const gain = ctx.createGain();
    gain.gain.value = 0.18;

    // Slow LFO to make the pad breathe
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.08 + Math.random() * 0.1;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.06;
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);

    osc.connect(gain);
    gain.connect(master);

    osc.start();
    lfo.start();

    nodes.push({
      stop: () => {
        osc.stop();
        lfo.stop();
      },
    });
  }

  // Soft filtered noise — like a faraway breeze
  const bufferSize = 2 * ctx.sampleRate;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const channel = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    channel[i] = (Math.random() * 2 - 1) * 0.3;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  noise.loop = true;

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = "lowpass";
  noiseFilter.frequency.value = 380;
  noiseFilter.Q.value = 0.7;

  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.08;

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(master);
  noise.start();

  nodes.push({ stop: () => noise.stop() });
}

export function stopAmbientMusic() {
  if (!ctx || !master) return;
  const c = ctx;
  const m = master;
  m.gain.linearRampToValueAtTime(0, c.currentTime + 0.8);
  setTimeout(() => {
    nodes.forEach((n) => {
      try {
        n.stop();
      } catch {
        // already stopped
      }
    });
    nodes = [];
    c.close().catch(() => {});
    ctx = null;
    master = null;
  }, 900);
}

export function isAmbientPlaying() {
  return ctx !== null;
}
