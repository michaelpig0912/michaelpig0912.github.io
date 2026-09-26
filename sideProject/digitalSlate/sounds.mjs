// Locally synthesized samples keep every sound available without a network request.
// A short broadband impact and inharmonic resonances approximate a wooden clapper.
export function createSoundSamples(type, sampleRate) {
  const duration = type === 'beep' ? .13 : type === 'wood' ? .21 : .16;
  const samples = new Float32Array(Math.ceil(sampleRate * duration));
  let seed = 7319;
  let lowNoise = 0;
  let previousNoise = 0;
  let peak = 0;
  for (let i = 0; i < samples.length; i++) {
    const t = i / sampleRate;
    let value;
    if (type === 'beep') {
      const envelope = Math.min(1, t / .003, (duration - t) / .01);
      value = Math.sin(2 * Math.PI * 1000 * t) * envelope * .7;
    } else {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const noise = seed / 2147483648 - 1;
      lowNoise += .22 * (noise - lowNoise);
      const bright = noise - .7 * previousNoise;
      previousNoise = noise;
      if (type === 'wood') {
        value = .65 * lowNoise * Math.exp(-t / .009)
          + .55 * Math.sin(2 * Math.PI * 490 * t) * Math.exp(-t / .026)
          + .27 * Math.sin(2 * Math.PI * 1160 * t) * Math.exp(-t / .017)
          + .14 * Math.sin(2 * Math.PI * 2330 * t) * Math.exp(-t / .009);
      } else {
        value = .9 * bright * Math.exp(-t / .0035)
          + .36 * Math.sin(2 * Math.PI * 1280 * t) * Math.exp(-t / .011)
          + .24 * Math.sin(2 * Math.PI * 2810 * t) * Math.exp(-t / .006)
          + .2 * Math.sin(2 * Math.PI * 630 * t) * Math.exp(-t / .019);
        // A quieter, very close rebound gives a dry wooden "clack".
        if (t >= .007) value += .19 * bright * Math.exp(-(t - .007) / .003);
      }
      value *= Math.min(1, t / .00015, (duration - t) / .004);
    }
    samples[i] = value;
    peak = Math.max(peak, Math.abs(value));
  }
  const level = type === 'beep' ? .45 : .9;
  if (peak) for (let i = 0; i < samples.length; i++) samples[i] *= level / peak;
  return samples;
}
