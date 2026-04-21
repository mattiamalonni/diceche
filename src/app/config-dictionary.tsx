import { COLORS } from "@/constants/colors";
import { useGame } from "@/contexts/GameContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ALL_PACKS, ALL_SPECIALS, SPECIAL_LABELS, SpecialGroup, WORD_PACK_LABELS, WordPack } from "@/utils/syllables";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ConfigDictionary() {
  const { pendingDictionary, setPendingDictionary } = useGame();
  const { theme } = useTheme();
  const router = useRouter();

  const toggleBase = (val: boolean) => {
    setPendingDictionary({ ...pendingDictionary, base: val });
  };

  const toggleSpecial = (group: SpecialGroup) => {
    const specials = pendingDictionary.specials.includes(group)
      ? pendingDictionary.specials.filter((g) => g !== group)
      : [...pendingDictionary.specials, group];
    setPendingDictionary({ ...pendingDictionary, specials });
  };

  const togglePack = (pack: WordPack) => {
    const packs = pendingDictionary.packs.includes(pack)
      ? pendingDictionary.packs.filter((p) => p !== pack)
      : [...pendingDictionary.packs, pack];
    setPendingDictionary({ ...pendingDictionary, packs });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backText}>← Indietro</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Dizionario</Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Sillabe base */}
        <View style={[styles.section, { backgroundColor: theme.surface2 }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Sillabe base</Text>
          <Text style={[styles.sectionSub, { color: theme.textMuted }]}>≈70 sillabe (ba, be, ce, ci…)</Text>
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: theme.text }]}>Attiva</Text>
            <Switch
              value={pendingDictionary.base}
              onValueChange={toggleBase}
              trackColor={{ true: COLORS.primary, false: theme.border }}
              thumbColor={COLORS.white}
            />
          </View>
        </View>

        {/* Suoni speciali */}
        <View style={[styles.section, { backgroundColor: theme.surface2 }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Suoni speciali</Text>
          {ALL_SPECIALS.map((group) => (
            <View key={group} style={styles.row}>
              <Text style={[styles.rowLabel, { color: theme.text }]}>{SPECIAL_LABELS[group]}</Text>
              <Switch
                value={pendingDictionary.specials.includes(group)}
                onValueChange={() => toggleSpecial(group)}
                trackColor={{ true: COLORS.secondary, false: theme.border }}
                thumbColor={COLORS.white}
              />
            </View>
          ))}
        </View>

        {/* Parole */}
        <View style={[styles.section, { backgroundColor: theme.surface2 }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Parole</Text>
          {ALL_PACKS.map((pack) => (
            <View key={pack} style={styles.row}>
              <Text style={[styles.rowLabel, { color: theme.text }]}>{WORD_PACK_LABELS[pack]}</Text>
              <Switch
                value={pendingDictionary.packs.includes(pack)}
                onValueChange={() => togglePack(pack)}
                trackColor={{ true: COLORS.bg4, false: theme.border }}
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
  backText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "600",
    width: 80,
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
  sectionSub: {
    fontSize: 13,
    marginTop: -8,
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
