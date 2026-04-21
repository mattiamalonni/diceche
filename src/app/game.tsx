import { COLORS, getBgColor } from "@/constants/colors";
import { useGame } from "@/contexts/GameContext";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import Animated, {
  cancelAnimation,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export default function Game() {
  const { items, currentIndex, markCorrect, markWrong, isFinished, config, finishRound } = useGame();
  const router = useRouter();

  const syllableTimerSeconds = config?.syllableTimer ?? null;
  const roundTimerSeconds = config?.roundTimer ?? null;

  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const flashColor = useSharedValue(0); // 0 = normal, 1 = red flash
  const syllableProgress = useSharedValue(1); // 1 = full bar, 0 = empty
  const barWidthShared = useSharedValue(0);
  const countdownScale = useSharedValue(1.5);

  const [countdown, setCountdown] = useState<number | null>(3);
  const countdownRef = useRef<number | null>(3);
  const [roundSecondsLeft, setRoundSecondsLeft] = useState<number | null>(roundTimerSeconds);
  const roundIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const roundSecondsLeftRef = useRef<number | null>(roundTimerSeconds);
  const isTransitioningRef = useRef(false);

  useEffect(() => {
    if (isFinished) {
      router.replace("/completion");
    }
  }, [isFinished]);

  // Countdown: decrement 3 → 2 → 1 → null
  useEffect(() => {
    if (countdown === null) return;
    const t = setTimeout(() => {
      setCountdown((c) => {
        const next = c !== null && c > 1 ? c - 1 : null;
        countdownRef.current = next;
        return next;
      });
    }, 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // Animate each countdown number
  useEffect(() => {
    if (countdown === null) return;
    countdownScale.value = 1.5;
    countdownScale.value = withSpring(1, { damping: 10, stiffness: 120 });
  }, [countdown]);

  // Round timer: start after countdown ends
  useEffect(() => {
    if (!roundTimerSeconds || countdown !== null) return;
    const endTime = Date.now() + roundTimerSeconds * 1000;
    roundIntervalRef.current = setInterval(() => {
      const remaining = Math.ceil((endTime - Date.now()) / 1000);
      if (remaining <= 0) {
        if (roundIntervalRef.current) clearInterval(roundIntervalRef.current);
        roundSecondsLeftRef.current = 0;
        setRoundSecondsLeft(0);
      } else {
        roundSecondsLeftRef.current = remaining;
        setRoundSecondsLeft(remaining);
      }
    }, 500);
    return () => {
      if (roundIntervalRef.current) clearInterval(roundIntervalRef.current);
    };
  }, [countdown]);

  // Round timer expiry: current syllable counts as wrong, finish round
  useEffect(() => {
    if (roundSecondsLeft === 0 && !isFinished) {
      cancelAnimation(syllableProgress);
      if (roundIntervalRef.current) clearInterval(roundIntervalRef.current);
      finishRound();
    }
  }, [roundSecondsLeft]);

  const scheduleUnlock = () => {
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 400);
  };

  const animateAndAdvance = (action: () => void) => {
    isTransitioningRef.current = true;
    opacity.value = withTiming(0, { duration: 120 }, () => {
      translateX.value = -60;
      runOnJS(action)();
      runOnJS(scheduleUnlock)();
      translateX.value = withSpring(0, { damping: 20, stiffness: 200 });
      opacity.value = withTiming(1, { duration: 150 });
    });
  };

  // Syllable timer: reset and start on each new card (only after countdown)
  useEffect(() => {
    if (!syllableTimerSeconds || isFinished || countdown !== null) return;
    syllableProgress.value = 1;
    syllableProgress.value = withTiming(0, { duration: syllableTimerSeconds * 1000 }, (finished) => {
      if (finished) runOnJS(animateAndAdvance)(markWrong);
    });
    return () => {
      cancelAnimation(syllableProgress);
    };
  }, [currentIndex, countdown]);

  const handleCorrect = () => {
    if (isTransitioningRef.current) return;
    cancelAnimation(syllableProgress);
    animateAndAdvance(markCorrect);
  };

  const handleWrong = () => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    cancelAnimation(syllableProgress);
    flashColor.value = withSequence(
      withTiming(1, { duration: 80 }),
      withTiming(1, { duration: 200 }),
      withTiming(0, { duration: 150 }, () => {
        runOnJS(animateAndAdvance)(markWrong);
      }),
    );
  };

  const handleExit = () => {
    // Pause both timers before showing Alert
    cancelAnimation(syllableProgress);
    if (roundIntervalRef.current) {
      clearInterval(roundIntervalRef.current);
      roundIntervalRef.current = null;
    }

    const resumeTimers = () => {
      if (countdownRef.current !== null) return;
      // Resume syllable timer from frozen progress value
      if (syllableTimerSeconds && !isFinished) {
        const remainingMs = syllableProgress.value * syllableTimerSeconds * 1000;
        if (remainingMs > 50) {
          syllableProgress.value = withTiming(0, { duration: remainingMs }, (finished) => {
            if (finished) runOnJS(animateAndAdvance)(markWrong);
          });
        } else {
          animateAndAdvance(markWrong);
        }
      }
      // Resume round timer from last known seconds
      const secsLeft = roundSecondsLeftRef.current;
      if (roundTimerSeconds && secsLeft !== null && secsLeft > 0) {
        const endTime = Date.now() + secsLeft * 1000;
        roundIntervalRef.current = setInterval(() => {
          const remaining = Math.ceil((endTime - Date.now()) / 1000);
          if (remaining <= 0) {
            if (roundIntervalRef.current) clearInterval(roundIntervalRef.current);
            roundSecondsLeftRef.current = 0;
            setRoundSecondsLeft(0);
          } else {
            roundSecondsLeftRef.current = remaining;
            setRoundSecondsLeft(remaining);
          }
        }, 500);
      }
    };

    Alert.alert("Esci dal gioco", "Vuoi davvero uscire? Il progresso andrà perso.", [
      { text: "Continua", style: "cancel", onPress: resumeTimers },
      {
        text: "Esci",
        style: "destructive",
        onPress: () => {
          if (roundIntervalRef.current) clearInterval(roundIntervalRef.current);
          router.replace("/home");
        },
      },
    ]);
  };

  const countdownStyle = useAnimatedStyle(() => ({
    transform: [{ scale: countdownScale.value }],
  }));

  const syllableStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
    color: flashColor.value === 1 ? COLORS.danger : "#FFFFFF",
  }));

  const timerBarStyle = useAnimatedStyle(() => {
    const color = interpolateColor(syllableProgress.value, [0, 0.3, 1], [COLORS.danger, COLORS.warning, COLORS.success]);
    return {
      width: syllableProgress.value * barWidthShared.value,
      backgroundColor: color,
    };
  });

  if (items.length === 0) {
    router.replace("/");
    return null;
  }

  const current = items[currentIndex];
  const bgColor = getBgColor(currentIndex);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Progress / exit button */}
      <View style={styles.progressContainer}>
        <Pressable style={styles.exitBtn} onPress={handleExit} hitSlop={8}>
          <Text style={styles.exitBtnText}>×</Text>
        </Pressable>
        {countdown === null && (
          <View style={styles.progressRow}>
            <Text style={styles.progressText}>
              {Math.min(currentIndex + 1, items.length)} / {items.length}
            </Text>
            {roundTimerSeconds !== null && roundSecondsLeft !== null && (
              <Text style={[styles.progressText, roundSecondsLeft <= 30 && styles.progressTextWarning]}>
                {"  ⏱ " + formatTime(roundSecondsLeft)}
              </Text>
            )}
          </View>
        )}
      </View>

      {countdown !== null ? (
        <View style={styles.center}>
          <Animated.Text style={[styles.countdownNumber, countdownStyle]}>{countdown}</Animated.Text>
        </View>
      ) : (
        <>
          {/* Syllable timer bar */}
          {syllableTimerSeconds !== null && (
            <View
              style={styles.timerBarContainer}
              onLayout={(e) => {
                barWidthShared.value = e.nativeEvent.layout.width;
              }}
            >
              <Animated.View style={[styles.timerBarFill, timerBarStyle]} />
            </View>
          )}

          {/* Syllable */}
          <View style={styles.center}>
            <Animated.Text style={[styles.syllable, syllableStyle]}>{current}</Animated.Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttons}>
            <Pressable
              style={[styles.btn, styles.wrongBtn]}
              onPress={handleWrong}
              android_ripple={{ color: "rgba(255,255,255,0.3)" }}
            >
              <Text style={styles.btnIcon}>✗</Text>
              <Text style={styles.btnLabel}>Sbagliato</Text>
            </Pressable>
            <Pressable
              style={[styles.btn, styles.correctBtn]}
              onPress={handleCorrect}
              android_ripple={{ color: "rgba(255,255,255,0.3)" }}
            >
              <Text style={styles.btnIcon}>✓</Text>
              <Text style={styles.btnLabel}>Giusto</Text>
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  exitBtn: {
    position: "absolute",
    top: 20,
    left: 20,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  exitBtnText: {
    fontSize: 18,
    fontWeight: "700",
    color: "rgba(255,255,255,0.9)",
    lineHeight: 22,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressText: {
    fontSize: 20,
    fontWeight: "700",
    color: "rgba(255,255,255,0.85)",
  },
  progressTextWarning: {
    color: COLORS.danger,
  },
  timerBarContainer: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 4,
    marginHorizontal: 24,
    marginTop: 12,
    overflow: "hidden",
  },
  timerBarFill: {
    height: 8,
    borderRadius: 4,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  syllable: {
    fontSize: 120,
    fontWeight: "900",
    textShadowColor: "rgba(0,0,0,0.15)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
    letterSpacing: 4,
  },
  countdownNumber: {
    fontSize: 160,
    fontWeight: "900",
    color: "rgba(255,255,255,0.9)",
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 6 },
    textShadowRadius: 16,
  },
  buttons: {
    flexDirection: "row",
    gap: 16,
    padding: 24,
    paddingBottom: 32,
  },
  btn: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 24,
    alignItems: "center",
    gap: 4,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  wrongBtn: {
    backgroundColor: COLORS.danger,
  },
  correctBtn: {
    backgroundColor: COLORS.success,
  },
  btnIcon: {
    fontSize: 28,
    color: "#FFFFFF",
    fontWeight: "900",
    lineHeight: 32,
  },
  btnLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
});
