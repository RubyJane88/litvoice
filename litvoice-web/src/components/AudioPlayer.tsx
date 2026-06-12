import { useState, useEffect } from "react";
import { Play, Pause, Square, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { useSpeech } from "../hooks/useSpeech";
import { Slider } from "./ui/slider";

export interface AudioPlayerProps {
  text: string;
  title: string;
  startPosition?: number;
  onPositionChange?: (position: number) => void;
  onClose?: () => void;
}

export function AudioPlayer({
  text,
  title,
  startPosition = 0,
  onPositionChange,
  onClose,
}: AudioPlayerProps) {
  const [expanded, setExpanded] = useState(false);

  const {
    status,
    position,
    voices,
    selectedVoice,
    rate,
    setSelectedVoice,
    setRate,
    play,
    pause,
    stop,
  } = useSpeech({ text, startPosition, onPositionChange });

  useEffect(() => {
    play();
  }, []);

  const progressPercent =
    text.length > 0 ? Math.round((position / text.length) * 100) : 0;

  const handleClose = () => {
    stop();
    onClose?.();
  };

  const togglePlayPause = () => {
    if (status === "playing") {
      pause();
    } else {
      play();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/80 bg-card/95 backdrop-blur-md">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={togglePlayPause}
          aria-label={status === "playing" ? "Pause" : "Play"}>
          {status === "playing" ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
        </Button>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{title}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground shrink-0">
              {progressPercent}%
            </span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setExpanded((e) => !e)}
          aria-label={expanded ? "Collapse player" : "Expand player"}>
          {expanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronUp className="w-4 h-4" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          aria-label="Stop and close">
          <Square className="w-4 h-4" />
        </Button>
      </div>

      {expanded && (
        <div className="max-w-2xl mx-auto px-4 pb-4 space-y-4 border-t border-border/40 pt-3">
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-16">Speed</span>
            <Slider
              min={0.5}
              max={2}
              step={0.25}
              value={[rate]}
              onValueChange={([val]) => setRate(val ?? 1.0)}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-8 text-right">
              {rate}x
            </span>
          </div>

          {voices.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-16">Voice</span>
              <select
                value={selectedVoice?.name ?? ""}
                onChange={(e) => {
                  const voice = voices.find((v) => v.name === e.target.value);
                  if (voice) setSelectedVoice(voice);
                }}
                className="flex-1 text-sm bg-background border border-border rounded-md px-2 py-1">
                {voices.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
