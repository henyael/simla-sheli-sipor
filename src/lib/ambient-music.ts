/**
 * Theta/Delta sleep brainwave audio — Web Audio, no external assets.
 *
 * Uses BINAURAL BEATS to gently entrain the brain toward sleep:
 *  - Delta beat (3 Hz) = deep sleep range (0.5–4 Hz)
 *  - Theta beat (6 Hz) = drowsy / pre-sleep range (4–8 Hz)
 *
 * How binaural beats work: send a slightly different pure sine into each ear.
 * The brain perceives a "beat" at the frequency *difference*. So 200 Hz left
 * and 203 Hz right = perceived 3 Hz delta beat. **Headphones are required**
 * for the binaural effect — without them it just sounds like a soft drone.
 *
 * On top of the binaural carriers we add a very soft pink-ish noise bed
 * (like distant rain) so it never feels clinical or sterile.
 *
 * IMPORTANT: We use a ChannelMerger so left/right oscillators stay strictly
 * separated — that's what makes binaural beats actually work.
 */
type AudioCtx = AudioContext;

let ctx: AudioCtx | null = null;
let master: GainNode | null = null;
let nodes: { stop: () => void }[] = [];

// Carrier base frequencies. Low-mid sines feel warm and don't fatigue the ear.
// Delta carrier pair: 200 Hz / 203 Hz  → 3 Hz delta beat (deep sleep)
// Theta carrier pair: 144 Hz / 150 Hz  → 6 Hz theta beat (drowsy / dreamy)
const DELTA = { left: 200, right: 203 };
const THETA = { left: 144, right: 150 };

function createBinauralPair(
  c: AudioCtx,
  merger: ChannelMergerNode,
  leftHz: number,
  rightHz: number,
  level: number,
) {
  const oscL = c.createOscillator();
  oscL.type = "sine";
  oscL.frequency.value = leftHz;

  const oscR = c.createOscillator();
  oscR.type = "sine";
  oscR.frequency.value = rightHz;

  const gL = c.createGain();
  gL.gain.value = level;
  const gR = c.createGain();
  gR.gain.value = level;

  oscL.connect(gL);
  oscR.connect(gR);
  // Strict left/right routing — required for the binaural effect
  gL.connect(merger, 0, 0);
  gR.connect(merger, 0, 1);

  oscL.start();
  oscR.start();

  return () => {
    try {
      oscL.stop();
    } catch {
      /* noop */
    }
    try {
      oscR.stop();
    } catch {
      /* noop */
    }
  };
}

export async function startAmbientMusic(volume = 0.12): Promise<boolean> {
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
  master.connect(ctx.destination);
  master.gain.linearRampToValueAtTime(volume, ctx.currentTime + 4.0);

  // Stereo merger keeps L/R strictly separated for binaural beats
  const merger = ctx.createChannelMerger(2);
  merger.connect(master);

  // Delta beat (3 Hz) — slightly louder, the primary sleep driver
  const stopDelta = createBinauralPair(
    ctx,
    merger,
    DELTA.left,
    DELTA.right,
    0.22,
  );
  // Theta beat (6 Hz) — quieter, layered on top for the dreamy "drift off" feel
  const stopTheta = createBinauralPair(
    ctx,
    merger,
    THETA.left,
    THETA.right,
    0.14,
  );

  nodes.push({ stop: stopDelta });
  nodes.push({ stop: stopTheta });

  // ----- Soft "rain-like" noise bed so it doesn't sound clinical -----
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
  noiseFilter.frequency.value = 320;
  noiseFilter.Q.value = 0.5;

  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.05;

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

  return true;
}

export function stopAmbientMusic() {
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
