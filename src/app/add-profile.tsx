import { AVATARS, COLORS, PROFILE_COLORS } from "@/constants/colors";
import { useProfiles } from "@/contexts/ProfileContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

function randomItem<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function AddProfile() {
  const { addProfile, setActiveProfile } = useProfiles();
  const { theme } = useTheme();
  const router = useRouter();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState<string>(() => randomItem(AVATARS));
  const [color, setColor] = useState<string>(() => randomItem(PROFILE_COLORS));

  const canSubmit = name.trim().length > 0 && !isLoading;

  const handleAdd = async () => {
    if (!canSubmit) return;
    setIsLoading(true);
    const profile = await addProfile(name.trim(), avatar, color);
    setActiveProfile(profile);
    setIsLoading(false);
    router.replace("/home");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <Pressable style={styles.back} onPress={() => router.back()}>
          <Text style={styles.backText}>← Indietro</Text>
        </Pressable>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Preview */}
          <View style={[styles.preview, { backgroundColor: color }]}>
            <Text style={styles.previewEmoji}>{avatar}</Text>
          </View>

          {/* Name */}
          <Text style={[styles.label, { color: theme.text }]}>Come ti chiami?</Text>
          <TextInput
            style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: theme.surface }]}
            value={name}
            onChangeText={setName}
            placeholder="Nome del bambino"
            placeholderTextColor={theme.textMuted}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleAdd}
            maxLength={20}
          />

          {/* Avatar picker */}
          <Text style={[styles.label, { color: theme.text }]}>Scegli il tuo avatar</Text>
          <View style={styles.avatarGrid}>
            {AVATARS.map((emoji) => (
              <Pressable
                key={emoji}
                style={[
                  styles.avatarBtn,
                  { borderColor: color, backgroundColor: theme.surface2 },
                  avatar === emoji && styles.avatarBtnSelected,
                  avatar === emoji && { backgroundColor: color },
                ]}
                onPress={() => setAvatar(emoji)}
              >
                <Text style={styles.avatarEmoji}>{emoji}</Text>
              </Pressable>
            ))}
          </View>

          {/* Color picker */}
          <Text style={[styles.label, { color: theme.text }]}>Scegli il tuo colore</Text>
          <View style={styles.colorRow}>
            {PROFILE_COLORS.map((c) => (
              <Pressable
                key={c}
                style={[styles.colorDot, { backgroundColor: c }, color === c && styles.colorDotSelected]}
                onPress={() => setColor(c)}
              >
                {color === c && <Text style={styles.colorCheck}>✓</Text>}
              </Pressable>
            ))}
          </View>

          {/* Submit */}
          <Pressable style={[styles.button, !canSubmit && styles.buttonDisabled]} onPress={handleAdd} disabled={!canSubmit}>
            <Text style={styles.buttonText}>Inizia!</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  back: {
    alignSelf: "flex-start",
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  backText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "600",
  },
  scroll: {
    padding: 24,
    paddingTop: 8,
    alignItems: "center",
    gap: 16,
    paddingBottom: 48,
  },
  preview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  previewEmoji: {
    fontSize: 52,
  },
  label: {
    fontSize: 18,
    fontWeight: "800",
    alignSelf: "flex-start",
    marginTop: 4,
  },
  input: {
    width: "100%",
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 22,
    textAlign: "center",
    fontWeight: "700",
  },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
    width: "100%",
  },
  avatarBtn: {
    width: 62,
    height: 62,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarBtnSelected: {
    borderWidth: 3,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
  },
  avatarEmoji: {
    fontSize: 32,
  },
  colorRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
    width: "100%",
  },
  colorDot: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  colorDotSelected: {
    borderWidth: 3,
    borderColor: COLORS.dark,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  colorCheck: {
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.white,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 32,
    marginTop: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: COLORS.disabled,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.white,
  },
});
