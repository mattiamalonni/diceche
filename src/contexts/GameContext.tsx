import { buildPool, RoundConfig } from "@/utils/syllables";
import React, { createContext, useCallback, useContext, useState } from "react";

interface GameContextValue {
  items: string[];
  currentIndex: number;
  correctCount: number;
  wrongCount: number;
  wrongItems: string[];
  config: RoundConfig | null;
  startRound: (config: RoundConfig) => void;
  markCorrect: () => void;
  markWrong: () => void;
  isFinished: boolean;
  restartRound: () => void;
  finishRound: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [wrongItems, setWrongItems] = useState<string[]>([]);
  const [config, setConfig] = useState<RoundConfig | null>(null);

  const startRound = useCallback((cfg: RoundConfig) => {
    const pool = buildPool(cfg);
    const selected = pool.slice(0, cfg.count);
    setItems(selected);
    setCurrentIndex(0);
    setCorrectCount(0);
    setWrongCount(0);
    setWrongItems([]);
    setConfig(cfg);
  }, []);

  const restartRound = useCallback(() => {
    if (!config) return;
    const pool = buildPool(config);
    const selected = pool.slice(0, config.count);
    setItems(selected);
    setCurrentIndex(0);
    setCorrectCount(0);
    setWrongCount(0);
    setWrongItems([]);
  }, [config]);

  const advance = (len: number) => {
    setCurrentIndex((i) => Math.min(i + 1, len));
  };

  const markCorrect = useCallback(() => {
    setCorrectCount((c) => c + 1);
    setCurrentIndex((i) => Math.min(i + 1, items.length));
  }, [items.length]);

  const markWrong = useCallback(() => {
    setWrongCount((c) => c + 1);
    setWrongItems((prev) => [...prev, items[currentIndex]]);
    setCurrentIndex((i) => Math.min(i + 1, items.length));
  }, [items, currentIndex]);

  const finishRound = useCallback(() => {
    setWrongCount((c) => c + 1);
    setWrongItems((prev) => [...prev, items[currentIndex]]);
    setCurrentIndex(items.length);
  }, [items, currentIndex]);

  const isFinished = items.length > 0 && currentIndex >= items.length;

  return (
    <GameContext.Provider
      value={{
        items,
        currentIndex,
        correctCount,
        wrongCount,
        wrongItems,
        config,
        startRound,
        markCorrect,
        markWrong,
        isFinished,
        restartRound,
        finishRound,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
