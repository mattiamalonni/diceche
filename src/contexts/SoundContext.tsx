import { SOUNDS, SoundKey } from "@/utils/sounds";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAudioPlayer } from "expo-audio";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

interface SoundContextValue {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  playSound: (key: SoundKey) => void;
}

const STORAGE_KEY = "diceche:soundEnabled";

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [soundEnabled, setSoundEnabledState] = useState(true);
  const player = useAudioPlayer(null);

  // Load persisted value once on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw === "false") {
        setSoundEnabledState(false);
      }
    });
  }, []);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    setSoundEnabledState(enabled);
    AsyncStorage.setItem(STORAGE_KEY, String(enabled));
  }, []);

  const playSound = useCallback(
    (key: SoundKey) => {
      if (!soundEnabled) return;
      player.replace(SOUNDS[key]);
      player.play();
    },
    [soundEnabled, player],
  );

  return <SoundContext.Provider value={{ soundEnabled, setSoundEnabled, playSound }}>{children}</SoundContext.Provider>;
}

export function useSoundContext() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSoundContext must be used within SoundProvider");
  return ctx;
}
