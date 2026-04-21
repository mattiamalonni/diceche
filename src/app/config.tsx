import { COLORS } from "@/constants/colors";
import { useGame } from "@/contexts/GameContext";
import { useProfiles } from "@/contexts/ProfileContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ALL_PACKS, ALL_SPECIALS, DictionaryConfig, getPoolSize, RoundConfig } from "@/utils/syllables";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

function buildDictionarySummary(d: DictionaryConfig): string {
  const SHORT_PACK_LABELS: Record<string, string> = {
    articoli_det: "Art. det.",
    articoli_indet: "Art. indet.",
    prep_semplici: "Prep. semplici",
    prep_articolate: "Prep. artic.",
  };
  const parts: string[] = [];
  if (d.base) parts.push("Base");
  parts.push(...d.specials);
  parts.push(...d.packs.map((p) => SHORT_PACK_LABELS[p] ?? p));
  return parts.length > 0 ? parts.join(", ") : "Nessun contenuto";
}

export default function Config() {
  const { activeProfile, updateProfileConfig } = useProfiles();
  const { startRound, pendingDictionary, setPendingDictionary } = useGame();
  const { theme } = useTheme();
  const router = useRouter();

  const [config, setConfig] = useState<RoundConfig>({
    ...{
      dictionary: {
        base: true,
        specials: [...ALL_SPECIALS],
        packs: [...ALL_PACKS],
      },
      count: 30,
      syllableTimer: null,
      roundTimer: null,
      hideTimer: null,
      speech: true,
      uppercase: true,
    },
    ...(activeProfile?.config ?? {}),
  });

  // Sync pendingDictionary from profile on mount / profile change
  useEffect(() => {
    if (activeProfile) {
      setPendingDictionary(activeProfile.config.dictionary);
    }
  }, [activeProfile?.id]);

  const poolSize = getPoolSize({ ...config, dictionary: pendingDictionary });
  const cappedCount = clamp(config.count, 1, Math.max(poolSize, 1));

  // Keep count in bounds when pool shrinks
  useEffect(() => {
    if (config.count > poolSize && poolSize > 0) {
      setConfig((c) => ({ ...c, count: poolSize }));
    }
  }, [poolSize]);

  const handleCountChange = (delta: number) => {
    setConfig((c) => ({
      ...c,
      count: clamp(c.count + delta, 1, poolSize),
    }));
  };

  const handleStart = async () => {
    if (poolSize === 0 || !activeProfile) return;
    const finalConfig = { ...config, dictionary: pendingDictionary, count: cappedCount };
    await updateProfileConfig(activeProfile.id, finalConfig);
    startRound(finalConfig);
    router.replace("/game");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Pressable style={{ width: 44 }} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={COLORS.primary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Configura la partita</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Count picker */}
        <View style={[styles.section, { backgroundColor: theme.surface2 }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Numero di combinazioni</Text>
          <Text style={[styles.sectionSub, { color: theme.textMuted }]}>Totale disponibile: {poolSize}</Text>
          <View style={styles.counter}>
            <Pressable
              style={[styles.counterBtn, cappedCount <= 1 && styles.counterBtnDisabled]}
              onPress={() => handleCountChange(-1)}
              disabled={cappedCount <= 1}
            >
              <Ionicons name="remove" size={22} color={COLORS.white} />
            </Pressable>
            <Text style={[styles.counterValue, { color: theme.text }]}>{cappedCount}</Text>
            <Pressable
              style={[styles.counterBtn, cappedCount >= poolSize && styles.counterBtnDisabled]}
              onPress={() => handleCountChange(1)}
              disabled={cappedCount >= poolSize}
            >
              <Ionicons name="add" size={22} color={COLORS.white} />
            </Pressable>
          </View>
        </View>

        {/* Dizionario */}
        <Pressable onPress={() => router.push("/config-dictionary")}>
          <View style={[styles.section, { backgroundColor: theme.surface2 }]}>
            <View style={styles.row}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Dizionario</Text>
              <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
            </View>
            <Text style={[styles.sectionSub, { color: theme.textMuted }]}>{buildDictionarySummary(pendingDictionary)}</Text>
          </View>
        </Pressable>

        {/* Visualizzazione */}
        <View style={[styles.section, { backgroundColor: theme.surface2 }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Visualizzazione</Text>
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: theme.text }]}>Testo sillabe</Text>
          </View>
          <View style={styles.segmented}>
            <Pressable
              style={[styles.segmentBtn, config.uppercase && { backgroundColor: COLORS.primary }]}
              onPress={() => setConfig((c) => ({ ...c, uppercase: true }))}
            >
              <Text style={[styles.segmentBtnText, { color: config.uppercase ? COLORS.white : theme.text }]}>AA</Text>
            </Pressable>
            <Pressable
              style={[styles.segmentBtn, !config.uppercase && { backgroundColor: COLORS.primary }]}
              onPress={() => setConfig((c) => ({ ...c, uppercase: false }))}
            >
              <Text style={[styles.segmentBtnText, { color: !config.uppercase ? COLORS.white : theme.text }]}>aa</Text>
            </Pressable>
          </View>
        </View>

        {/* Pronuncia */}
        <View style={[styles.section, { backgroundColor: theme.surface2 }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Pronuncia</Text>
          <View style={styles.row}>
            <View style={styles.timerLabelGroup}>
              <Text style={[styles.rowLabel, { color: theme.text }]}>Pulsante pronuncia</Text>
              <Text style={[styles.rowSub, { color: theme.textMuted }]}>Legge la sillaba ad alta voce</Text>
            </View>
            <Switch
              value={config.speech ?? true}
              onValueChange={(val) => setConfig((c) => ({ ...c, speech: val }))}
              trackColor={{ true: COLORS.bg5, false: theme.border }}
              thumbColor={COLORS.white}
            />
          </View>
        </View>

        {/* Timer */}
        <View style={[styles.section, { backgroundColor: theme.surface2 }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Timer</Text>

          {/* Syllable timer */}
          <View style={styles.row}>
            <View style={styles.timerLabelGroup}>
              <Text style={[styles.rowLabel, { color: theme.text }]}>Timer per sillaba</Text>
              <Text style={[styles.rowSub, { color: theme.textMuted }]}>Avanza automaticamente allo scadere</Text>
            </View>
            <Switch
              value={config.syllableTimer !== null}
              onValueChange={(val) =>
                setConfig((c) => {
                  const newSt = val ? 5 : null;
                  const newHt =
                    newSt !== null && c.hideTimer !== null && c.hideTimer >= newSt
                      ? newSt - 1 >= 1
                        ? newSt - 1
                        : null
                      : c.hideTimer;
                  return { ...c, syllableTimer: newSt, hideTimer: newHt };
                })
              }
              trackColor={{ true: COLORS.accent, false: theme.border }}
              thumbColor={COLORS.white}
            />
          </View>
          {config.syllableTimer !== null && (
            <View style={styles.counter}>
              <Pressable
                style={[styles.counterBtn, config.syllableTimer <= 1 && styles.counterBtnDisabled]}
                onPress={() =>
                  setConfig((c) => {
                    const newSt = clamp((c.syllableTimer ?? 5) - 1, 1, 30);
                    const newHt =
                      c.hideTimer !== null && c.hideTimer >= newSt ? (newSt - 1 >= 1 ? newSt - 1 : null) : c.hideTimer;
                    return { ...c, syllableTimer: newSt, hideTimer: newHt };
                  })
                }
                disabled={config.syllableTimer <= 1}
              >
                <Ionicons name="remove" size={22} color={COLORS.white} />
              </Pressable>
              <Text style={[styles.counterValue, { color: theme.text }]}>{config.syllableTimer}s</Text>
              <Pressable
                style={[styles.counterBtn, config.syllableTimer >= 30 && styles.counterBtnDisabled]}
                onPress={() =>
                  setConfig((c) => ({
                    ...c,
                    syllableTimer: clamp((c.syllableTimer ?? 5) + 1, 1, 30),
                  }))
                }
                disabled={config.syllableTimer >= 30}
              >
                <Ionicons name="add" size={22} color={COLORS.white} />
              </Pressable>
            </View>
          )}

          {/* Timer partita */}
          <View style={styles.row}>
            <View style={styles.timerLabelGroup}>
              <Text style={[styles.rowLabel, { color: theme.text }]}>Timer partita</Text>
              <Text style={[styles.rowSub, { color: theme.textMuted }]}>Termina la partita allo scadere</Text>
            </View>
            <Switch
              value={config.roundTimer !== null}
              onValueChange={(val) => setConfig((c) => ({ ...c, roundTimer: val ? 60 : null }))}
              trackColor={{ true: COLORS.accent, false: theme.border }}
              thumbColor={COLORS.white}
            />
          </View>
          {config.roundTimer !== null && (
            <View style={styles.counter}>
              <Pressable
                style={[styles.counterBtn, config.roundTimer <= 60 && styles.counterBtnDisabled]}
                onPress={() =>
                  setConfig((c) => ({
                    ...c,
                    roundTimer: clamp((c.roundTimer ?? 60) - 60, 60, 300),
                  }))
                }
                disabled={config.roundTimer <= 60}
              >
                <Ionicons name="remove" size={22} color={COLORS.white} />
              </Pressable>
              <Text style={[styles.counterValue, { color: theme.text }]}>{config.roundTimer / 60} min</Text>
              <Pressable
                style={[styles.counterBtn, config.roundTimer >= 300 && styles.counterBtnDisabled]}
                onPress={() =>
                  setConfig((c) => ({
                    ...c,
                    roundTimer: clamp((c.roundTimer ?? 60) + 60, 60, 300),
                  }))
                }
                disabled={config.roundTimer >= 300}
              >
                <Ionicons name="add" size={22} color={COLORS.white} />
              </Pressable>
            </View>
          )}
        </View>

        {/* Memoria */}
        <View style={[styles.section, { backgroundColor: theme.surface2 }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Memoria</Text>
          <View style={styles.row}>
            <View style={styles.timerLabelGroup}>
              <Text style={[styles.rowLabel, { color: theme.text }]}>Nascondi parola (in secondi)</Text>
              <Text style={[styles.rowSub, { color: theme.textMuted }]}>La parola diventa ??? dopo N secondi</Text>
            </View>
            <Switch
              value={config.hideTimer !== null}
              onValueChange={(val) => {
                if (val) {
                  const maxHide = config.syllableTimer !== null ? config.syllableTimer - 1 : 10;
                  const defaultHide = Math.min(1, maxHide);
                  if (defaultHide < 1) return;
                  setConfig((c) => ({ ...c, hideTimer: defaultHide }));
                } else {
                  setConfig((c) => ({ ...c, hideTimer: null }));
                }
              }}
              trackColor={{ true: COLORS.bg8, false: theme.border }}
              thumbColor={COLORS.white}
            />
          </View>
          {config.hideTimer !== null &&
            (() => {
              const maxHide = config.syllableTimer !== null ? config.syllableTimer - 1 : 10;
              return (
                <View style={styles.counter}>
                  <Pressable
                    style={[styles.counterBtn, config.hideTimer <= 1 && styles.counterBtnDisabled]}
                    onPress={() => setConfig((c) => ({ ...c, hideTimer: clamp((c.hideTimer ?? 3) - 1, 1, maxHide) }))}
                    disabled={config.hideTimer <= 1}
                  >
                    <Ionicons name="remove" size={22} color={COLORS.white} />
                  </Pressable>
                  <Text style={[styles.counterValue, { color: theme.text }]}>{config.hideTimer}s</Text>
                  <Pressable
                    style={[styles.counterBtn, config.hideTimer >= maxHide && styles.counterBtnDisabled]}
                    onPress={() => setConfig((c) => ({ ...c, hideTimer: clamp((c.hideTimer ?? 3) + 1, 1, maxHide) }))}
                    disabled={config.hideTimer >= maxHide}
                  >
                    <Ionicons name="add" size={22} color={COLORS.white} />
                  </Pressable>
                </View>
              );
            })()}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {poolSize === 0 && <Text style={styles.emptyWarning}>Seleziona almeno una sezione per iniziare</Text>}
        <Pressable
          style={[styles.startButton, poolSize === 0 && styles.startButtonDisabled]}
          onPress={handleStart}
          disabled={poolSize === 0}
        >
          <Text style={styles.startButtonText}>Inizia!</Text>
        </Pressable>
      </View>
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
  timerLabelGroup: {
    flex: 1,
    paddingRight: 8,
  },
  rowSub: {
    fontSize: 12,
    marginTop: 2,
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    paddingVertical: 4,
  },
  counterBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  counterBtnDisabled: {
    backgroundColor: COLORS.disabled,
  },
  counterValue: {
    fontSize: 36,
    fontWeight: "800",
    minWidth: 60,
    textAlign: "center",
  },
  segmented: {
    flexDirection: "row",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentBtnText: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 1,
  },
  footer: {
    padding: 20,
    gap: 8,
  },
  emptyWarning: {
    textAlign: "center",
    fontSize: 14,
    color: COLORS.danger,
    fontWeight: "600",
  },
  startButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: 36,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  startButtonDisabled: {
    backgroundColor: COLORS.disabled,
    elevation: 0,
    shadowOpacity: 0,
  },
  startButtonText: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.white,
  },
});
