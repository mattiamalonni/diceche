import { COLORS } from "@/constants/colors";
import { useGame } from "@/contexts/GameContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ALL_CONSONANTS, ALL_VOWELS } from "@/utils/syllables";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ConfigBaseLetters() {
  const { pendingDictionary, setPendingDictionary } = useGame();
  const { theme } = useTheme();
  const router = useRouter();

  const toggleVowel = (vowel: string) => {
    const vowels = pendingDictionary.vowels.includes(vowel)
      ? pendingDictionary.vowels.filter((v) => v !== vowel)
      : [...pendingDictionary.vowels, vowel];
    setPendingDictionary({ ...pendingDictionary, vowels });
  };

  const toggleConsonant = (consonant: string) => {
    const consonants = pendingDictionary.consonants.includes(consonant)
      ? pendingDictionary.consonants.filter((c) => c !== consonant)
      : [...pendingDictionary.consonants, consonant];
    setPendingDictionary({ ...pendingDictionary, consonants });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Pressable style={{ width: 44 }} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={COLORS.primary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Vocali e consonanti</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Vocali */}
        <View style={[styles.section, { backgroundColor: theme.surface2 }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Vocali</Text>
          {ALL_VOWELS.map((vowel) => (
            <View key={vowel} style={styles.row}>
              <Text style={[styles.rowLabel, { color: theme.text }]}>{vowel.toUpperCase()}</Text>
              <Switch
                value={pendingDictionary.vowels.includes(vowel)}
                onValueChange={() => toggleVowel(vowel)}
                trackColor={{ true: COLORS.primary, false: theme.border }}
                thumbColor={COLORS.white}
              />
            </View>
          ))}
        </View>

        {/* Consonanti */}
        <View style={[styles.section, { backgroundColor: theme.surface2 }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Consonanti</Text>
          {ALL_CONSONANTS.map((consonant) => (
            <View key={consonant} style={styles.row}>
              <Text style={[styles.rowLabel, { color: theme.text }]}>{consonant.toUpperCase()}</Text>
              <Switch
                value={pendingDictionary.consonants.includes(consonant)}
                onValueChange={() => toggleConsonant(consonant)}
                trackColor={{ true: COLORS.primary, false: theme.border }}
                thumbColor={COLORS.white}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  scrollContent: {
    padding: 20,
    gap: 12,
  },
  section: {
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLabel: {
    fontSize: 15,
    flex: 1,
    paddingRight: 8,
  },
});
