import { COLORS } from "@/constants/colors";
import { useGame } from "@/contexts/GameContext";
import { useProfiles } from "@/contexts/ProfileContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

function ConfettiPiece({ delay, x, color }: { delay: number; x: number; color: string }) {
  const y = useSharedValue(-20);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withSequence(withTiming(1, { duration: 200 }), withDelay(1200, withTiming(0, { duration: 400 }))),
    );
    y.value = withDelay(delay, withTiming(700, { duration: 1800, easing: Easing.out(Easing.quad) }));
    rotate.value = withDelay(delay, withRepeat(withTiming(360, { duration: 600 }), -1));
  }, []);

  const style = useAnimatedStyle(() => ({
    position: "absolute",
    left: x,
    top: y.value,
    opacity: opacity.value,
    transform: [{ rotate: `${rotate.value}deg` }],
    width: 10,
    height: 10,
    backgroundColor: color,
    borderRadius: 2,
  }));

  return <Animated.View style={style} />;
}

const CONFETTI_COLORS = [COLORS.primary, COLORS.secondary, COLORS.accent, COLORS.bg4, COLORS.bg5, COLORS.bg6];

function Confetti() {
  const pieces = Array.from({ length: 30 }, (_, i) => ({
    key: i,
    delay: Math.random() * 600,
    x: Math.random() * 380,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {pieces.map((p) => (
        <ConfettiPiece key={p.key} delay={p.delay} x={p.x} color={p.color} />
      ))}
    </View>
  );
}

export default function Completion() {
  const { activeProfile, incrementGamesPlayed } = useProfiles();
  const { restartRound, correctCount, items } = useGame();
  const router = useRouter();

  useEffect(() => {
    if (activeProfile) incrementGamesPlayed(activeProfile.id);
  }, []);

  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSequence(
      withTiming(1.1, { duration: 300, easing: Easing.out(Easing.back(2)) }),
      withTiming(1, { duration: 150 }),
    );
    opacity.value = withTiming(1, { duration: 400 });
  }, []);

  const heroStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePlayAgain = () => {
    restartRound();
    router.replace("/countdown");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Confetti />

      <View style={styles.content}>
        <Animated.View style={heroStyle}>
          <Text style={styles.emoji}>🎉</Text>
          <Text style={styles.title} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.5}>
            Bravo{activeProfile ? `, ${activeProfile.name}` : ""}!
          </Text>
          <Text style={styles.subtitle}>Hai finito la partita!</Text>
          <Text style={styles.score}>
            {correctCount} / {items.length} corrette
          </Text>
        </Animated.View>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.primaryButton} onPress={handlePlayAgain}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Ionicons name="play" size={22} color={COLORS.white} />
            <Text style={styles.primaryButtonText}>Gioca ancora</Text>
          </View>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={() => router.replace("/home")}>
          <Text style={styles.secondaryButtonText}>Torna al menù</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg3,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  emoji: {
    fontSize: 80,
    textAlign: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "900",
    color: COLORS.dark,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "600",
    color: COLORS.dark,
    opacity: 0.7,
    textAlign: "center",
  },
  score: {
    fontSize: 32,
    fontWeight: "900",
    color: COLORS.success,
    textAlign: "center",
  },
  actions: {
    padding: 28,
    gap: 14,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: 36,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  primaryButtonText: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.white,
  },
  secondaryButton: {
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.dark,
    opacity: 0.7,
  },
});
