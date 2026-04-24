import { COLORS } from "@/constants/colors";
import { useGame } from "@/contexts/GameContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ALL_PACKS, ALL_SPECIALS, SPECIAL_LABELS, SpecialGroup, WORD_PACK_LABELS, WordPack } from "@/utils/syllables";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ConfigDictionary() {
  const { pendingDictionary, setPendingDictionary } = useGame();
  const { theme } = useTheme();
  const router = useRouter();

  const { vowels, consonants, combinations, singleLetters } = pendingDictionary;
  const combinationsCount = vowels.length * consonants.filter((c) => c !== "q").length;
  const singleLettersCount = vowels.length + consonants.length;
  const canEnableCombinations = vowels.length > 0 && combinationsCount > 0;

  useEffect(() => {
    if (!canEnableCombinations && pendingDictionary.combinations) {
      setPendingDictionary({ ...pendingDictionary, combinations: false });
    }
  }, [canEnableCombinations, pendingDictionary]);

  const toggleCombinations = (val: boolean) => {
    setPendingDictionary({ ...pendingDictionary, combinations: val });
  };

  const toggleSingleLetters = (val: boolean) => {
    setPendingDictionary({ ...pendingDictionary, singleLetters: val });
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

  const toggleAllSpecials = () => {
    const allSelected = pendingDictionary.specials.length === ALL_SPECIALS.length;
    setPendingDictionary({ ...pendingDictionary, specials: allSelected ? [] : [...ALL_SPECIALS] });
  };

  const toggleAllPacks = () => {
    const allSelected = pendingDictionary.packs.length === ALL_PACKS.length;
    setPendingDictionary({ ...pendingDictionary, packs: allSelected ? [] : [...ALL_PACKS] });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Pressable style={{ width: 44 }} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={COLORS.primary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Dizionario</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Lettere e sillabe */}
        <View style={[styles.section, { backgroundColor: theme.surface2 }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Lettere e sillabe</Text>
          <Text style={[styles.sectionSub, { color: theme.textMuted }]}>
            {vowels.length} vocali, {consonants.length} consonanti → {combinationsCount} sillabe + {singleLettersCount} lettere
            singole
          </Text>
          <Pressable style={[styles.row, styles.pressableRow]} onPress={() => router.push("/config-base-letters")}>
            <Text style={[styles.rowLabel, { color: theme.text }]}>Vocali e consonanti</Text>
            <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
          </Pressable>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={[styles.row, !canEnableCombinations && { opacity: 0.4 }]}>
            <Text style={[styles.rowLabel, { color: theme.text }]}>Includi sillabe</Text>
            <Switch
              value={canEnableCombinations ? combinations : false}
              onValueChange={toggleCombinations}
              disabled={!canEnableCombinations}
              trackColor={{ true: COLORS.primary, false: theme.border }}
              thumbColor={COLORS.white}
            />
          </View>
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: theme.text }]}>Includi lettere singole</Text>
            <Switch
              value={singleLetters}
              onValueChange={toggleSingleLetters}
              trackColor={{ true: COLORS.primary, false: theme.border }}
              thumbColor={COLORS.white}
            />
          </View>
        </View>

        {/* Suoni speciali */}
        <View style={[styles.section, { backgroundColor: theme.surface2 }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Suoni speciali</Text>
            <Switch
              value={pendingDictionary.specials.length === ALL_SPECIALS.length}
              onValueChange={toggleAllSpecials}
              trackColor={{ true: COLORS.secondary, false: theme.border }}
              thumbColor={COLORS.white}
            />
          </View>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
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
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Parole</Text>
            <Switch
              value={pendingDictionary.packs.length === ALL_PACKS.length}
              onValueChange={toggleAllPacks}
              trackColor={{ true: COLORS.bg4, false: theme.border }}
              thumbColor={COLORS.white}
            />
          </View>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  divider: {
    height: 1,
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
  pressableRow: {
    minHeight: 44,
    paddingVertical: 4,
  },
  rowLabel: {
    fontSize: 15,
    flex: 1,
    paddingRight: 8,
  },
});
