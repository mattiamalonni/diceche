export const SOUNDS = {
  beep: require("../../assets/sounds/beep.mp3"),
  start: require("../../assets/sounds/start.mp3"),
  correct: require("../../assets/sounds/correct.mp3"),
  wrong: require("../../assets/sounds/wrong.mp3"),
  completion: require("../../assets/sounds/completion.mp3"),
} as const;

export type SoundKey = keyof typeof SOUNDS;
