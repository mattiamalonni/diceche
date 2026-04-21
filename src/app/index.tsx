import { COLORS } from "@/constants/colors";
import { useProfiles } from "@/contexts/ProfileContext";
import { useSoundContext } from "@/contexts/SoundContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Modal, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileSelection() {
  const { profiles, setActiveProfile, deleteProfile, isLoaded } = useProfiles();
  const { theme, setOverride } = useTheme();
  const { soundEnabled, setSoundEnabled } = useSoundContext();
  const router = useRouter();
  const [aboutVisible, setAboutVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const version = Constants.expoConfig?.version ?? "1.0.0";

  const handleDeleteProfile = (id: string, name: string) => {
    Alert.alert("Elimina profilo", `Vuoi eliminare il profilo di ${name}?`, [
      { text: "Annulla", style: "cancel" },
      {
        text: "Elimina",
        style: "destructive",
        onPress: async () => {
          await deleteProfile(id);
          if (profiles.length === 1) setIsEditMode(false);
        },
      },
    ]);
  };

  const aboutModal = (
    <Modal visible={aboutVisible} transparent animationType="fade" onRequestClose={() => setAboutVisible(false)}>
      <Pressable style={styles.overlay} onPress={() => setAboutVisible(false)}>
        <Pressable style={[styles.modalCard, { backgroundColor: theme.surface }]} onPress={() => {}}>
          {/* App name */}
          <Text style={[styles.modalAppName, { color: theme.text }]}>diceche</Text>

          <View style={[styles.modalDivider, { backgroundColor: theme.border }]} />

          {/* Dedica */}
          <Text style={[styles.modalDedication, { color: theme.textMuted }]}>{"Dedicato a Dodi e Nene.\nCon amore, papà"}</Text>

          <View style={[styles.modalDivider, { backgroundColor: theme.border }]} />

          {/* Dark mode toggle */}
          <View style={styles.themeRow}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Ionicons name={theme.isDark ? "moon" : "sunny"} size={16} color={theme.text} />
              <Text style={[styles.themeLabel, { color: theme.text }]}>{theme.isDark ? "Tema scuro" : "Tema chiaro"}</Text>
            </View>
            <Switch
              value={theme.isDark}
              onValueChange={(val) => setOverride(val ? "dark" : "light")}
              trackColor={{ true: COLORS.bg4, false: COLORS.border }}
              thumbColor={COLORS.white}
            />
          </View>
          <View style={[styles.modalDivider, { backgroundColor: theme.border }]} />

          {/* Sound toggle */}
          <View style={styles.themeRow}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Ionicons name={soundEnabled ? "notifications" : "notifications-off"} size={16} color={theme.text} />
              <Text style={[styles.themeLabel, { color: theme.text }]}>{soundEnabled ? "Suoni attivi" : "Suoni disattivi"}</Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ true: COLORS.bg4, false: COLORS.border }}
              thumbColor={COLORS.white}
            />
          </View>

          <View style={[styles.modalDivider, { backgroundColor: theme.border }]} />

          {/* Footer: copyright + version */}
          <Text style={[styles.modalFooter, { color: theme.textMuted }]}>
            {`\u00A9 ${new Date().getFullYear()} Mattia Malonni \u00B7 v${version}`}
          </Text>

          <Pressable style={[styles.modalClose, { backgroundColor: theme.surface2 }]} onPress={() => setAboutVisible(false)}>
            <Text style={[styles.modalCloseText, { color: theme.textMuted }]}>Chiudi</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );

  const aboutButton = (
    <Pressable style={styles.aboutBtn} onPress={() => setAboutVisible(true)}>
      <Ionicons name="information-circle-outline" size={24} color={theme.textMuted} />
    </Pressable>
  );

  if (!isLoaded) {
    return (
      <View style={[styles.center, { backgroundColor: theme.surface }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (profiles.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
        {aboutModal}
        <View style={styles.topBar}>{aboutButton}</View>
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.text }]}>Ciao! 👋</Text>
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>Come ti chiami?</Text>
          <Pressable style={styles.addButton} onPress={() => router.push("/add-profile")}>
            <Text style={styles.addButtonText}>Aggiungi bambino</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const canAdd = profiles.length < 4;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
      {aboutModal}
      <View style={styles.topBar}>{aboutButton}</View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>Chi gioca?</Text>
        <View style={styles.grid}>
          {profiles.map((profile) => (
            <Pressable
              key={profile.id}
              style={[styles.profileCard, { backgroundColor: profile.color ?? COLORS.bg4 }]}
              onPress={() => {
                if (isEditMode) {
                  router.push({ pathname: "/edit-profile", params: { id: profile.id } });
                  return;
                }
                setActiveProfile(profile);
                router.replace("/home");
              }}
            >
              <Text style={styles.profileEmoji}>{profile.avatar ?? profile.name.charAt(0).toUpperCase()}</Text>
              <Text style={styles.profileName} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
                {profile.name}
              </Text>
              {isEditMode && (
                <Pressable style={styles.deleteBadge} onPress={() => handleDeleteProfile(profile.id, profile.name)} hitSlop={8}>
                  <Ionicons name="close" size={14} color={COLORS.white} />
                </Pressable>
              )}
            </Pressable>
          ))}
          {canAdd && isEditMode && (
            <Pressable
              style={[styles.addCard, { backgroundColor: theme.surface2, borderColor: theme.border }]}
              onPress={() => router.push("/add-profile")}
            >
              <Ionicons name="add" size={40} color={theme.textMuted} />
              <Text style={[styles.addLabel, { color: theme.textMuted }]}>Aggiungi</Text>
            </Pressable>
          )}
        </View>
        <Pressable style={[styles.editButton, { backgroundColor: theme.surface2 }]} onPress={() => setIsEditMode((v) => !v)}>
          <Text style={[styles.editButtonText, { color: theme.textMuted }]}>{isEditMode ? "Fatto" : "Modifica"}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  aboutBtn: {
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  modalCard: {
    width: "100%",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    gap: 16,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  modalAppName: {
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 1,
  },
  modalDedication: {
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
    lineHeight: 22,
    fontStyle: "italic",
  },
  modalDivider: {
    width: "60%",
    height: 1,
  },
  themeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 4,
  },
  themeLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
  modalFooter: {
    fontSize: 12,
    fontWeight: "500",
  },
  modalClose: {
    marginTop: 4,
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 20,
  },
  modalCloseText: {
    fontSize: 15,
    fontWeight: "700",
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 40,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
    marginTop: 16,
  },
  profileCard: {
    width: 140,
    height: 160,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  profileEmoji: {
    fontSize: 52,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
    width: "100%",
    textAlign: "center",
  },
  addCard: {
    width: 140,
    height: 160,
    borderRadius: 24,
    borderWidth: 2,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  addLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 32,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.white,
  },
  deleteBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.danger,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },

  editButton: {
    alignSelf: "center",
    marginTop: 24,
    marginBottom: 8,
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 20,
  },
  editButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },
});
