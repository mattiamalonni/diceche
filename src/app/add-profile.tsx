import { COLORS } from "@/constants/colors";
import { useProfiles } from "@/contexts/ProfileContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";

export default function AddProfile() {
  const { addProfile, setActiveProfile } = useProfiles();
  const router = useRouter();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const canSubmit = name.trim().length > 0 && !isLoading;

  const handleAdd = async () => {
    if (!canSubmit) return;
    setIsLoading(true);
    const profile = await addProfile(name.trim());
    setActiveProfile(profile);
    setIsLoading(false);
    router.replace("/home");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.inner} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <Pressable style={styles.back} onPress={() => router.back()}>
          <Text style={styles.backText}>← Indietro</Text>
        </Pressable>

        <View style={styles.content}>
          <Text style={styles.title}>Come ti chiami?</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Nome del bambino"
            placeholderTextColor={COLORS.muted}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleAdd}
            maxLength={20}
          />
          <Pressable style={[styles.button, !canSubmit && styles.buttonDisabled]} onPress={handleAdd} disabled={!canSubmit}>
            <Text style={styles.buttonText}>Inizia!</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  inner: {
    flex: 1,
    padding: 24,
  },
  back: {
    alignSelf: "flex-start",
    paddingVertical: 8,
  },
  backText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.dark,
    textAlign: "center",
  },
  input: {
    width: "100%",
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 22,
    color: COLORS.dark,
    textAlign: "center",
    fontWeight: "700",
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 32,
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
