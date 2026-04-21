import { COLORS } from "@/constants/colors";
import { useProfiles } from "@/contexts/ProfileContext";
import { useTheme } from "@/contexts/ThemeContext";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Modal, Pressable, SafeAreaView, StyleSheet, Switch, Text, View } from "react-native";

export default function ProfileSelection() {
  const { profiles, setActiveProfile, deleteProfile, isLoaded } = useProfiles();
  const { theme, override, setOverride } = useTheme();
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
          <Text style={[styles.modalDedication, { color: theme.textMuted }]}>{"Dedicato a Dodi e Nene.\nCon amore\npapà"}</Text>
          <View style={[styles.modalDivider, { backgroundColor: theme.border }]} />
          {/* Dark mode toggle */}
          <View style={styles.themeRow}>
            <Text style={[styles.themeLabel, { color: theme.text }]}>{theme.isDark ? "🌙 Tema scuro" : "☀️ Tema chiaro"}</Text>
            <Switch
              value={theme.isDark}
              onValueChange={(val) => setOverride(val ? "dark" : "light")}
              trackColor={{ true: COLORS.bg4, false: COLORS.border }}
              thumbColor={COLORS.white}
            />
          </View>
          {override !== null && (
            <Pressable onPress={() => setOverride(null)}>
              <Text style={[styles.themeReset, { color: theme.textMuted }]}>Usa tema di sistema</Text>
            </Pressable>
          )}
          <View style={[styles.modalDivider, { backgroundColor: theme.border }]} />
          <Text style={[styles.modalVersion, { color: theme.textMuted }]}>v{version}</Text>
          <Pressable style={[styles.modalClose, { backgroundColor: theme.surface2 }]} onPress={() => setAboutVisible(false)}>
            <Text style={[styles.modalCloseText, { color: theme.textMuted }]}>Chiudi</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );

  const aboutButton = (
    <Pressable style={[styles.aboutBtn, { borderColor: theme.textMuted }]} onPress={() => setAboutVisible(true)}>
      <Text style={[styles.aboutBtnText, { color: theme.textMuted }]}>?</Text>
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
              <Text style={styles.profileName}>{profile.name}</Text>
              {isEditMode && (
                <Pressable style={styles.deleteBadge} onPress={() => handleDeleteProfile(profile.id, profile.name)} hitSlop={8}>
                  <Text style={styles.deleteBadgeText}>✕</Text>
                </Pressable>
              )}
            </Pressable>
          ))}
          {canAdd && !isEditMode && (
            <Pressable
              style={[styles.addCard, { backgroundColor: theme.surface2, borderColor: theme.border }]}
              onPress={() => router.push("/add-profile")}
            >
              <Text style={[styles.addIcon, { color: theme.textMuted }]}>+</Text>
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
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  aboutBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.muted,
    lineHeight: 16,
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
  modalDedication: {
    fontSize: 14,
    fontWeight: "400",
    color: COLORS.muted,
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
  themeReset: {
    fontSize: 12,
    textDecorationLine: "underline",
    marginTop: -8,
  },
  modalVersion: {
    fontSize: 13,
    color: COLORS.muted,
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
    color: COLORS.muted,
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
  addIcon: {
    fontSize: 40,
    lineHeight: 44,
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
  deleteBadgeText: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.white,
    lineHeight: 16,
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
