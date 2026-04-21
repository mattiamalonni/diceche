import { GameProvider } from "@/contexts/GameContext";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { SoundProvider } from "@/contexts/SoundContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SoundProvider>
        <ProfileProvider>
          <GameProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </GameProvider>
        </ProfileProvider>
      </SoundProvider>
    </ThemeProvider>
  );
}
