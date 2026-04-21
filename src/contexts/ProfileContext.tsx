import { DEFAULT_CONFIG, RoundConfig } from "@/utils/syllables";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export interface ProfileStats {
  gamesPlayed: number;
  totalCorrect: number;
  totalItems: number;
}

export interface Profile {
  id: string;
  name: string;
  avatar: string;
  color: string;
  config: RoundConfig;
  stats: ProfileStats;
}

interface ProfileContextValue {
  profiles: Profile[];
  activeProfile: Profile | null;
  setActiveProfile: (profile: Profile) => void;
  addProfile: (name: string, avatar: string, color: string) => Promise<Profile>;
  updateProfile: (id: string, name: string, avatar: string, color: string) => Promise<void>;
  deleteProfile: (id: string) => Promise<void>;
  updateProfileConfig: (id: string, config: RoundConfig) => Promise<void>;
  updateProfileStats: (id: string, correct: number, total: number) => Promise<void>;
  isLoaded: boolean;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

const STORAGE_KEY = "diceche:profiles";

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfile, setActiveProfileState] = useState<Profile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          const parsed: Profile[] = JSON.parse(raw);
          setProfiles(parsed);
        }
      })
      .finally(() => setIsLoaded(true));
  }, []);

  const persist = useCallback(async (updated: Profile[]) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setProfiles(updated);
  }, []);

  const addProfile = useCallback(
    async (name: string, avatar: string, color: string): Promise<Profile> => {
      const profile: Profile = {
        id: Date.now().toString(),
        name: name.trim(),
        avatar,
        color,
        config: { ...DEFAULT_CONFIG },
        stats: { gamesPlayed: 0, totalCorrect: 0, totalItems: 0 },
      };
      const updated = [...profiles, profile];
      await persist(updated);
      return profile;
    },
    [profiles, persist],
  );

  const updateProfile = useCallback(
    async (id: string, name: string, avatar: string, color: string) => {
      const updated = profiles.map((p) => (p.id === id ? { ...p, name: name.trim(), avatar, color } : p));
      await persist(updated);
      if (activeProfile?.id === id) {
        setActiveProfileState((prev) => (prev ? { ...prev, name: name.trim(), avatar, color } : prev));
      }
    },
    [profiles, activeProfile, persist],
  );

  const updateProfileConfig = useCallback(
    async (id: string, config: RoundConfig) => {
      const updated = profiles.map((p) => (p.id === id ? { ...p, config } : p));
      await persist(updated);
      if (activeProfile?.id === id) {
        setActiveProfileState((prev) => (prev ? { ...prev, config } : prev));
      }
    },
    [profiles, activeProfile, persist],
  );

  const deleteProfile = useCallback(
    async (id: string) => {
      const updated = profiles.filter((p) => p.id !== id);
      await persist(updated);
      setActiveProfileState((prev) => (prev?.id === id ? null : prev));
    },
    [profiles, persist],
  );

  const updateProfileStats = useCallback(
    async (id: string, correct: number, total: number) => {
      const updated = profiles.map((p) =>
        p.id === id
          ? {
              ...p,
              stats: {
                gamesPlayed: (p.stats?.gamesPlayed ?? 0) + 1,
                totalCorrect: (p.stats?.totalCorrect ?? 0) + correct,
                totalItems: (p.stats?.totalItems ?? 0) + total,
              },
            }
          : p,
      );
      await persist(updated);
      setActiveProfileState((prev) =>
        prev?.id === id
          ? {
              ...prev,
              stats: {
                gamesPlayed: (prev.stats?.gamesPlayed ?? 0) + 1,
                totalCorrect: (prev.stats?.totalCorrect ?? 0) + correct,
                totalItems: (prev.stats?.totalItems ?? 0) + total,
              },
            }
          : prev,
      );
    },
    [profiles, persist],
  );

  const setActiveProfile = useCallback((profile: Profile) => {
    setActiveProfileState(profile);
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profiles,
        activeProfile,
        setActiveProfile,
        addProfile,
        updateProfile,
        deleteProfile,
        updateProfileConfig,
        updateProfileStats,
        isLoaded,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfiles() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfiles must be used within ProfileProvider");
  return ctx;
}
