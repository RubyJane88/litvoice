import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useVoices } from "./useVoices";
import { usePosition } from "./usePosition";

export type SpeechStatus = "idle" | "playing" | "paused" | "finished";

export interface UseSpeechOptions {
  text: string;
  startPosition?: number;
  onPositionChange?: (position: number) => void;
  onFinished?: () => void;
}

const MAX_CHUNK_WORDS = 180;

type Chunk = { content: string; offset: number };

function buildChunks(text: string): Chunk[] {
  const sentences = text.match(/[^.!?\n]+[.!?\n]+|[^.!?\n]+$/g) ?? [text];
  const chunks: Chunk[] = [];
  let current = "";
  let chunkOffset = 0;
  let consumed = 0;

  for (const sentence of sentences) {
    const sentenceWords = sentence.trim().split(/\s+/).filter(Boolean).length;
    const currentWords = current.trim()
      ? current.trim().split(/\s+/).filter(Boolean).length
      : 0;

    if (current && currentWords + sentenceWords > MAX_CHUNK_WORDS) {
      chunks.push({ content: current, offset: chunkOffset });
      chunkOffset = consumed;
      current = sentence;
    } else {
      current += sentence;
    }
    consumed += sentence.length;
  }

  if (current.trim()) chunks.push({ content: current, offset: chunkOffset });
  return chunks.length > 0 ? chunks : [{ content: text, offset: 0 }];
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
  const { positionRef, startTracking, reset, update } = usePosition(
    startPosition,
    onPositionChange,
  );
  const stopTrackingRef = useRef<(() => void) | null>(null);
  const currentChunkIndexRef = useRef(0);

  const chunks = useMemo(() => buildChunks(text), [text]);

  // Keep latest values accessible inside event callbacks without stale closures
  const chunksRef = useRef(chunks);
  chunksRef.current = chunks;
  const rateRef = useRef(rate);
  rateRef.current = rate;
  const selectedVoiceRef = useRef(selectedVoice);
  selectedVoiceRef.current = selectedVoice;
  const onFinishedRef = useRef(onFinished);
  onFinishedRef.current = onFinished;

  // Reset chunk cursor when text changes (new book/chapter)
  useEffect(() => {
    currentChunkIndexRef.current = 0;
  }, [text]);

  // Updated after every render so utterance.onend always calls the latest version
  const speakChunkRef = useRef<(index: number) => void>(() => {});
  useEffect(() => {
    speakChunkRef.current = (chunkIndex: number) => {
      const currentChunks = chunksRef.current;

      if (chunkIndex >= currentChunks.length) {
        stopTrackingRef.current?.();
        update(text.length);
        setStatus("finished");
        onFinishedRef.current?.();
        return;
      }

      const chunk = currentChunks[chunkIndex]!;
      currentChunkIndexRef.current = chunkIndex;

      // On resume, may start mid-chunk; all other chunks start at 0
      const resumeOffset =
        positionRef.current > chunk.offset
          ? Math.min(positionRef.current - chunk.offset, chunk.content.length)
          : 0;

      const utteranceText = chunk.content.slice(resumeOffset);
      if (!utteranceText.trim()) {
        speakChunkRef.current(chunkIndex + 1);
        return;
      }

      const utteranceStart = chunk.offset + resumeOffset;
      const utterance = new SpeechSynthesisUtterance(utteranceText);
      utterance.rate = rateRef.current;
      if (selectedVoiceRef.current) utterance.voice = selectedVoiceRef.current;

      // charIndex is relative to this utterance — add absolute start to fix progress tracking
      utterance.onboundary = (event) => {
        if (event.name === "word") update(utteranceStart + event.charIndex);
      };

      utterance.onend = () => {
        update(chunk.offset + chunk.content.length);
        speakChunkRef.current(chunkIndex + 1);
      };

      utterance.onerror = (e) => {
        if (e.error !== "interrupted") {
          stopTrackingRef.current?.();
          setStatus("idle");
        }
      };

      window.speechSynthesis.speak(utterance);
    };
  });

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      stopTrackingRef.current?.();
    };
  }, []);

  const play = useCallback(() => {
    window.speechSynthesis.cancel();
    stopTrackingRef.current?.();

    if (!text.trim() || positionRef.current >= text.length) {
      setStatus("finished");
      onFinished?.();
      return;
    }

    // Find the chunk that contains the current resume position
    const startIndex = Math.max(
      0,
      chunks.findIndex(
        (_, i) =>
          i === chunks.length - 1 ||
          positionRef.current < (chunks[i + 1]?.offset ?? text.length),
      ),
    );

    stopTrackingRef.current = startTracking(rate, text.length);
    setStatus("playing");
    speakChunkRef.current(startIndex);
  }, [text, rate, chunks, positionRef, startTracking, onFinished]);

  const pause = useCallback(() => {
    window.speechSynthesis.pause();
    stopTrackingRef.current?.();
    setStatus("paused");
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    stopTrackingRef.current?.();
    currentChunkIndexRef.current = 0;
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
