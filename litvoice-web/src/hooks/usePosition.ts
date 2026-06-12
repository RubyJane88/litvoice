import { useCallback, useRef } from "react";

const AVG_CHARS_PER_SECOND = 12.5;

export function usePosition(
  startPosition: number,
  onPositionChange?: (pos: number) => void,
) {
  const positionRef = useRef(startPosition);
  const playStartTimeRef = useRef<number | null>(null);
  const playStartPositionRef = useRef(startPosition);

  const update = useCallback(
    (newPos: number) => {
      positionRef.current = newPos;
      onPositionChange?.(newPos);
    },
    [onPositionChange],
  );

  const startTracking = useCallback(
    (rate: number, textLength: number) => {
      playStartTimeRef.current = Date.now();
      playStartPositionRef.current = positionRef.current;

      const interval = setInterval(() => {
        if (playStartTimeRef.current === null) return;
        const elapsed = (Date.now() - playStartTimeRef.current) / 1000;
        const estimated = Math.min(
          playStartPositionRef.current +
            Math.floor(elapsed * AVG_CHARS_PER_SECOND * rate),
          textLength,
        );
        if (estimated > positionRef.current) update(estimated);
      }, 2000);

      return () => clearInterval(interval);
    },
    [update],
  );

  const onBoundary = useCallback(
    (event: SpeechSynthesisEvent) => {
      if (event.name === "word") {
        update(playStartPositionRef.current + event.charIndex);
      }
    },
    [update],
  );

  const reset = useCallback(
    (pos: number) => {
      positionRef.current = pos;
      playStartTimeRef.current = null;
      onPositionChange?.(pos);
    },
    [onPositionChange],
  );

  return { positionRef, startTracking, onBoundary, reset, update };
}