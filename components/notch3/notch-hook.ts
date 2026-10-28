'use client';

import { useReducer, useCallback, useRef } from 'react';
import { transition, INITIAL_STATE, type NotchEvent, type NotchMachineState } from './notch-machine';

// Simulated upload duration in ms — tune by eye
const MOCK_UPLOAD_DURATION_MS = 2400;
// How often the progress ticker fires
const PROGRESS_INTERVAL_MS = 50;

export function useNotchMachine() {
  const [state, dispatch] = useReducer(
    (s: NotchMachineState, e: NotchEvent) => transition(s, e),
    INITIAL_STATE,
  );

  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressValueRef = useRef(0);

  const send = useCallback((event: NotchEvent) => {
    dispatch(event);

    if (event.type === 'DROP') {
      // Kick off simulated progress
      progressValueRef.current = 0;
      if (progressRef.current) clearInterval(progressRef.current);

      const steps = MOCK_UPLOAD_DURATION_MS / PROGRESS_INTERVAL_MS;
      let tick = 0;

      progressRef.current = setInterval(() => {
        tick++;
        const t = tick / steps;
        // Progress curve from spec: fast start, plateau, final push
        const progress = t < 0.40
          ? easeOutCubic(t / 0.40) * 0.60
          : t < 0.85
          ? 0.60 + easeInOutCubic((t - 0.40) / 0.45) * 0.32
          : 0.92 + easeInCubic((t - 0.85) / 0.15) * 0.08;

        progressValueRef.current = Math.min(progress, 0.92); // hold at 92% until done

        if (tick >= steps) {
          clearInterval(progressRef.current!);
          progressRef.current = null;
          dispatch({ type: 'UPLOAD_COMPLETE' });
        }
      }, PROGRESS_INTERVAL_MS);
    }

    if (event.type === 'CLOSE' || event.type === 'CANCEL_DROP' || event.type === 'DISMISS_ERROR') {
      if (progressRef.current) {
        clearInterval(progressRef.current);
        progressRef.current = null;
      }
      progressValueRef.current = 0;
    }
  }, []);

  return { state, send, progressRef: progressValueRef };
}

// Easing helpers (matches MOTION.md section 6)
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function easeInCubic(t: number): number {
  return t * t * t;
}
