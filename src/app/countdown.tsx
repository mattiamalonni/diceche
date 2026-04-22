import { useGame } from "@/contexts/GameContext";
import { useSoundContext } from "@/contexts/SoundContext";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Countdown() {
  const { items } = useGame();
  const router = useRouter();
  const { play } = useSoundContext();

  const [countdown, setCountdown] = useState<number | null>(3);
  const countdownScale = useSharedValue(1.5);

  // Decrement 3 → 2 → 1 → null
  useEffect(() => {
    if (countdown === null) return;
    const t = setTimeout(() => {
      setCountdown((c) => (c !== null && c > 1 ? c - 1 : null));
    }, 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // Animate + beep on each tick; navigate when countdown ends
  useEffect(() => {
    if (countdown === null) {
      router.replace("/game");
      return;
    }
    play("beep");
    countdownScale.value = 1.5;
    countdownScale.value = withSpring(1, { damping: 10, stiffness: 120 });
  }, [countdown]);

  const countdownStyle = useAnimatedStyle(() => ({
    transform: [{ scale: countdownScale.value }],
  }));

  if (items.length === 0) {
    router.replace("/");
    return null;
  }

  return (
    <>
      <Stack.Screen options={{ gestureEnabled: false }} />
      <SafeAreaView style={styles.container}>
        <Animated.Text style={[styles.countdownNumber, countdownStyle]}>{countdown}</Animated.Text>
        <Pressable style={styles.skipBtn} onPress={() => router.replace("/game")}>
          <Text style={styles.skipBtnText}>Salta</Text>
        </Pressable>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1E",
    alignItems: "center",
    justifyContent: "center",
  },
  countdownNumber: {
    fontSize: 160,
    fontWeight: "900",
    color: "rgba(255,255,255,0.9)",
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 6 },
    textShadowRadius: 16,
  },
  skipBtn: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  skipBtnText: {
    fontSize: 18,
    fontWeight: "700",
    color: "rgba(255,255,255,0.85)",
  },
});
