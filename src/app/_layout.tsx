import { GameProvider } from "@/contexts/GameContext";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ProfileProvider>
        <GameProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </GameProvider>
      </ProfileProvider>
    </ThemeProvider>
  );
}
