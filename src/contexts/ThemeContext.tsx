import { AppTheme, DARK_THEME, LIGHT_THEME } from "@/constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

type ThemeOverride = "light" | "dark" | null; // null = follow system

interface ThemeContextValue {
  theme: AppTheme;
  override: ThemeOverride;
  setOverride: (o: ThemeOverride) => void;
}

const STORAGE_KEY = "diceche:themeOverride";

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme(); // "light" | "dark" | null
  const [override, setOverrideState] = useState<ThemeOverride>(null);

  // Load persisted override once on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw === "light" || raw === "dark") {
        setOverrideState(raw);
      }
    });
  }, []);

  const setOverride = useCallback((o: ThemeOverride) => {
    setOverrideState(o);
    if (o === null) {
      AsyncStorage.removeItem(STORAGE_KEY);
    } else {
      AsyncStorage.setItem(STORAGE_KEY, o);
    }
  }, []);

  const effectiveScheme = override ?? systemScheme ?? "light";
  const theme = effectiveScheme === "dark" ? DARK_THEME : LIGHT_THEME;

  return <ThemeContext.Provider value={{ theme, override, setOverride }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
