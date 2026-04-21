import { COLORS } from "@/constants/colors";
import { useProfiles } from "@/contexts/ProfileContext";
import { useRouter } from "expo-router";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function Home() {
  const { activeProfile } = useProfiles();
  const router = useRouter();

  if (!activeProfile) {
    router.replace("/");
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.replace("/")}>
          <Text style={styles.changeText}>Cambia</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarLetter}>{activeProfile.name.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.greeting}>Ciao,</Text>
        <Text style={styles.name}>{activeProfile.name}!</Text>
      </View>

      <Pressable style={styles.playButton} onPress={() => router.push("/config")}>
        <Text style={styles.playButtonText}>▶ Gioca</Text>
      </Pressable>
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
  avatarLetter: {
    fontSize: 48,
    fontWeight: "800",
    color: COLORS.bg2,
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
  },
  playButton: {
    margin: 32,
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
});
