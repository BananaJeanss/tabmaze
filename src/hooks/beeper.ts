let sharedAudioContext: AudioContext | null = null;

export default function PlayBeep(
  length: number,
  frequency: number,
  gain?: number
) {
  // Lazy load the context only once
  if (!sharedAudioContext) {
    sharedAudioContext = new AudioContext();
  }

  // gain, frequency, duration
  const oscillator = sharedAudioContext.createOscillator();
  const gainer = sharedAudioContext.createGain();

  oscillator.connect(gainer);
  gainer.connect(sharedAudioContext.destination);

  if (gain) {
    gainer.gain.value = gain;
  }
  oscillator.frequency.value = frequency;
  oscillator.type = "square";

  oscillator.start(sharedAudioContext.currentTime);
  // passed length is in seconds (0.1), so we use it directly
  oscillator.stop(sharedAudioContext.currentTime + length);

  // We no longer close the context, we just let the oscillator stop garbage collect naturally
  return;
}