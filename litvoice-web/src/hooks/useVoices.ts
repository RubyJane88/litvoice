import { useEffect, useState } from "react";

export function useVoices() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const load = () => {
      const all = window.speechSynthesis.getVoices();
      const filtered = all.filter(
        (v) => v.localService && !v.name.includes("(Compact)"),
      );
      const list = filtered.length > 0 ? filtered : all;
      setVoices(list);
      setSelectedVoice((prev) => prev ?? list[0] ?? null);
    };

    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  return { voices, selectedVoice, setSelectedVoice };
}