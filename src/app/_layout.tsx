import { GameProvider } from "@/contexts/GameContext";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <ProfileProvider>
      <GameProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </GameProvider>
    </ProfileProvider>
  );
}
