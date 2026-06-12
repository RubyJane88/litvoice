import { createContext, useContext, useState } from "react";

export type ActiveBook = {
  text: string;
  title: string;
  startPosition: number;
  onPositionChange: (pos: number) => void;
};

type PlayerContextValue = {
  activeBook: ActiveBook | null;
  startPlaying: (book: ActiveBook) => void;
  stopPlaying: () => void;
};

const PlayerContext = createContext<PlayerContextValue>({
  activeBook: null,
  startPlaying: () => {},
  stopPlaying: () => {},
});

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [activeBook, setActiveBook] = useState<ActiveBook | null>(null);

  return (
    <PlayerContext.Provider
      value={{
        activeBook,
        startPlaying: setActiveBook,
        stopPlaying: () => setActiveBook(null),
      }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
}
