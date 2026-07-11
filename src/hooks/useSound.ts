import { useCallback } from 'react';

export function useSound() {
  const click = useCallback(() => {
    try {
      const ctx = new AudioContext();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.frequency.setValueAtTime(600, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.06);
      g.gain.setValueAtTime(0.18, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      o.start();
      o.stop(ctx.currentTime + 0.1);
    } catch {
      /* ignore */
    }
  }, []);

  const success = useCallback(() => {
    try {
      const ctx = new AudioContext();
      [[523, 0], [659, 0.12], [784, 0.24], [1047, 0.36]].forEach(([freq, time]) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.connect(g);
        g.connect(ctx.destination);
        o.frequency.value = freq as number;
        g.gain.setValueAtTime(0, ctx.currentTime + (time as number));
        g.gain.linearRampToValueAtTime(0.15, ctx.currentTime + (time as number) + 0.04);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (time as number) + 0.22);
        o.start(ctx.currentTime + (time as number));
        o.stop(ctx.currentTime + (time as number) + 0.25);
      });
    } catch {
      /* ignore */
    }
  }, []);

  return { click, success };
}
