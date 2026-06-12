import { useCallback, useEffect, useRef, useState } from "react";
import { useVoices } from "./useVoices";
import { usePosition } from "./usePosition";

export type SpeechStatus = "idle" | "playing" | "paused" | "finished";

export interface UseSpeechOptions {
  text: string;
  startPosition?: number;
  onPositionChange?: (position: number) => void;
  onFinished?: () => void;
}

export function useSpeech({
  text,
  startPosition = 0,
  onPositionChange,
  onFinished,
}: UseSpeechOptions) {
  const [status, setStatus] = useState<SpeechStatus>("idle");
  const [rate, setRate] = useState(1.0);
  const { voices, selectedVoice, setSelectedVoice } = useVoices();
  const { positionRef, startTracking, onBoundary, reset, update } =
    usePosition(startPosition, onPositionChange);
  const stopTrackingRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      stopTrackingRef.current?.();
    };
  }, []);

  const play = useCallback(() => {
    window.speechSynthesis.cancel();
    stopTrackingRef.current?.();

    const slice = text.slice(positionRef.current);
    if (!slice.trim()) {
      setStatus("finished");
      onFinished?.();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(slice);
    utterance.rate = rate;
    if (selectedVoice) utterance.voice = selectedVoice;

    utterance.onboundary = onBoundary;
    stopTrackingRef.current = startTracking(rate, text.length);

    utterance.onend = () => {
      stopTrackingRef.current?.();
      update(text.length);
      setStatus("finished");
      onFinished?.();
    };

    utterance.onerror = (e) => {
      stopTrackingRef.current?.();
      if (e.error !== "interrupted") setStatus("idle");
    };

    window.speechSynthesis.speak(utterance);
    setStatus("playing");
  }, [text, rate, selectedVoice, onBoundary, startTracking, update, onFinished, positionRef]);

  const pause = useCallback(() => {
    window.speechSynthesis.pause();
    stopTrackingRef.current?.();
    setStatus("paused");
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    stopTrackingRef.current?.();
    reset(startPosition);
    setStatus("idle");
  }, [startPosition, reset]);

  return {
    status,
    position: positionRef.current,
    voices,
    selectedVoice,
    rate,
    setSelectedVoice,
    setRate,
    play,
    pause,
    stop,
  };
}