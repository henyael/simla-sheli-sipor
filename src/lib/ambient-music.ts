/**
 * Magical sleepy lullaby — Web Audio, no external assets.
 *
 * Layers:
 *  - A warm low sine pad in a gentle Cmaj7-ish voicing (very soft, slowly drifting).
 *  - A faint filtered noise "night air" bed (almost subliminal).
 *  - Occasional slow, sparkly high bell tones (sine + short envelope) — like
 *    distant stars chiming, very rare so it doesn't wake anyone.
 *
 * Tuned to feel like the soundtrack of a children's bedtime book:
 * spacious, dreamy, slow, never melodic enough to demand attention.
 */
type AudioCtx = AudioContext;

let ctx: AudioCtx | null = null;
let master: GainNode | null = null;
let nodes: { stop: () => void }[] = [];
let bellTimer: number | null = null;

// Cmaj7 voicing, low octaves — warm, soft, slightly dreamy (the 7th adds magic).
const PAD_NOTES = [
  130.81, // C3
  164.81, // E3
  196.0, // G3
  246.94, // B3  (the magical 7th)
];

// Pentatonic high notes for the bell twinkles — always consonant, never harsh.
const BELL_NOTES = [
  1046.5, // C6
  1174.66, // D6
  1318.51, // E6
  1567.98, // G6
  1760.0, // A6
];

function scheduleBell(c: AudioCtx, out: GainNode) {
  const freq = BELL_NOTES[Math.floor(Math.random() * BELL_NOTES.length)];

  // Two stacked sines = soft glockenspiel/celesta vibe
  const o1 = c.createOscillator();
  o1.type = "sine";
  o1.frequency.value = freq;

  const o2 = c.createOscillator();
  o2.type = "sine";
  o2.frequency.value = freq * 2; // octave above, very quiet

  const g = c.createGain();
  g.gain.value = 0;

  // Gentle low-pass so it never feels metallic
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 3200;
  lp.Q.value = 0.4;

  const o2g = c.createGain();
  o2g.gain.value = 0.25;

  o1.connect(g);
  o2.connect(o2g);
  o2g.connect(g);
  g.connect(lp);
  lp.connect(out);

  const t = c.currentTime;
  // Soft bell envelope — quick attack, long sleepy tail
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.18, t + 0.04);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 4.5);

  o1.start(t);
  o2.start(t);
  o1.stop(t + 4.6);
  o2.stop(t + 4.6);
}

export async function startAmbientMusic(volume = 0.14): Promise<boolean> {
  if (ctx) {
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
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return false;

  ctx = new Ctor();

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
  // Gentle global low-pass so nothing pokes through harshly
  const masterLP = ctx.createBiquadFilter();
  masterLP.type = "lowpass";
  masterLP.frequency.value = 5000;
  masterLP.Q.value = 0.3;
  master.connect(masterLP);
  masterLP.connect(ctx.destination);
  master.gain.linearRampToValueAtTime(volume, ctx.currentTime + 3.5);

  // ----- Warm sleepy pad -----
  const padBus = ctx.createGain();
  padBus.gain.value = 0.85;
  padBus.connect(master);

  for (const freq of PAD_NOTES) {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;

    // A second osc detuned slightly — gives the pad a warm chorus shimmer
    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.value = freq * 1.003;

    const gain = ctx.createGain();
    gain.gain.value = 0.13;

    // Very slow LFO — the pad breathes like someone sleeping
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.05 + Math.random() * 0.06;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.045;
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(padBus);

    osc.start();
    osc2.start();
    lfo.start();

    nodes.push({
      stop: () => {
        try {
          osc.stop();
        } catch {
          /* noop */
        }
        try {
          osc2.stop();
        } catch {
          /* noop */
        }
        try {
          lfo.stop();
        } catch {
          /* noop */
        }
      },
    });
  }

  // ----- Faint "night air" noise -----
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
  noiseFilter.frequency.value = 280;
  noiseFilter.Q.value = 0.7;

  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.04;

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(master);
  noise.start();

  nodes.push({
    stop: () => {
      try {
        noise.stop();
      } catch {
        /* noop */
      }
    },
  });

  // ----- Occasional sparkle bells -----
  const bellBus = ctx.createGain();
  bellBus.gain.value = 0.55;
  bellBus.connect(master);

  const tick = () => {
    if (!ctx || !master) return;
    scheduleBell(ctx, bellBus);
    // Random gap between 7s and 16s — sparse, never pushy
    const next = 7000 + Math.random() * 9000;
    bellTimer = window.setTimeout(tick, next);
  };
  // First bell after a longer pause so the pad sets the mood first
  bellTimer = window.setTimeout(tick, 6000);

  return true;
}

export function stopAmbientMusic() {
  if (bellTimer !== null) {
    clearTimeout(bellTimer);
    bellTimer = null;
  }
  if (!ctx || !master) return;
  const c = ctx;
  const m = master;
  m.gain.linearRampToValueAtTime(0, c.currentTime + 1.0);
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
  }, 1100);
}

export function isAmbientPlaying() {
  return ctx !== null;
}
