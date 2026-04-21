import { COLORS } from "@/constants/colors";
import { useGame } from "@/contexts/GameContext";
import { useProfiles } from "@/contexts/ProfileContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const { activeProfile } = useProfiles();
  const { startRound, config: lastConfig } = useGame();
  const router = useRouter();

  if (!activeProfile) {
    router.replace("/");
    return null;
  }

  const handleQuickPlay = () => {
    const cfg = lastConfig ?? activeProfile.config;
    startRound(cfg);
    router.push("/game");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeProfile.color ?? COLORS.bg2 }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.replace("/")}>
          <Text style={styles.changeText}>Cambia</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarEmoji}>{activeProfile.avatar ?? activeProfile.name.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.greeting}>Ciao,</Text>
        <Text style={styles.name} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.5}>
          {activeProfile.name}!
        </Text>
      </View>

      <View style={styles.buttons}>
        <Pressable style={styles.playButton} onPress={() => router.push("/config")}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Ionicons name="play" size={22} color={activeProfile.color ?? COLORS.bg2} />
            <Text style={[styles.playButtonText, { color: activeProfile.color ?? COLORS.bg2 }]}>Gioca</Text>
          </View>
        </Pressable>
        {(lastConfig ?? activeProfile.config) && (
          <Pressable style={styles.quickPlayButton} onPress={handleQuickPlay}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Ionicons name="flash" size={18} color={COLORS.white} />
              <Text style={styles.quickPlayText}>Ripeti</Text>
            </View>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg2,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    alignItems: "flex-end",
  },
  changeText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: "600",
    opacity: 0.8,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  avatarEmoji: {
    fontSize: 52,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "600",
    color: COLORS.white,
    opacity: 0.85,
  },
  name: {
    fontSize: 48,
    fontWeight: "800",
    color: COLORS.white,
    maxWidth: "90%",
  },
  buttons: {
    margin: 32,
    gap: 12,
  },
  playButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 20,
    borderRadius: 40,
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  playButtonText: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.bg2,
  },
  quickPlayButton: {
    paddingVertical: 14,
    borderRadius: 40,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  quickPlayText: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.white,
  },
});
