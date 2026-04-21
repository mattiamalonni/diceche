import { COLORS } from "@/constants/colors";
import { useProfiles } from "@/contexts/ProfileContext";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Modal, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function ProfileSelection() {
  const { profiles, setActiveProfile, deleteProfile, isLoaded } = useProfiles();
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

  const AboutButton = () => (
    <Pressable style={styles.aboutBtn} onPress={() => setAboutVisible(true)}>
      <Text style={styles.aboutBtnText}>?</Text>
    </Pressable>
  );

  const AboutModal = () => (
    <Modal visible={aboutVisible} transparent animationType="fade" onRequestClose={() => setAboutVisible(false)}>
      <Pressable style={styles.overlay} onPress={() => setAboutVisible(false)}>
        <Pressable style={styles.modalCard} onPress={() => {}}>
          <Text style={styles.modalDedication}>{"Dedicato a Dodi e Nene.\nCon amore\npapà"}</Text>
          <View style={styles.modalDivider} />
          <Text style={styles.modalVersion}>v{version}</Text>
          <Pressable style={styles.modalClose} onPress={() => setAboutVisible(false)}>
            <Text style={styles.modalCloseText}>Chiudi</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );

  if (!isLoaded) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (profiles.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <AboutModal />
        <View style={styles.topBar}>
          <AboutButton />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>Ciao! 👋</Text>
          <Text style={styles.subtitle}>Come ti chiami?</Text>
          <Pressable style={styles.addButton} onPress={() => router.push("/add-profile")}>
            <Text style={styles.addButtonText}>Aggiungi bambino</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const canAdd = profiles.length < 4;

  return (
    <SafeAreaView style={styles.container}>
      <AboutModal />
      <View style={styles.topBar}>
        <AboutButton />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Chi gioca?</Text>
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
            <Pressable style={styles.addCard} onPress={() => router.push("/add-profile")}>
              <Text style={styles.addIcon}>+</Text>
              <Text style={styles.addLabel}>Aggiungi</Text>
            </Pressable>
          )}
        </View>
        <Pressable style={styles.editButton} onPress={() => setIsEditMode((v) => !v)}>
          <Text style={styles.editButtonText}>{isEditMode ? "Fatto" : "Modifica"}</Text>
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
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
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
    backgroundColor: COLORS.white,
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
    backgroundColor: COLORS.border,
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
    backgroundColor: COLORS.disabledBg,
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
    color: COLORS.dark,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: COLORS.muted,
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
    backgroundColor: COLORS.disabledBg,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  addIcon: {
    fontSize: 40,
    color: COLORS.muted,
    lineHeight: 44,
  },
  addLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.muted,
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
    backgroundColor: COLORS.disabledBg,
  },
  editButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.muted,
  },
});
