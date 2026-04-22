export const SOUNDS = {
  beep: require("../../assets/sounds/beep.mp3"),
  start: require("../../assets/sounds/start.mp3"),
} as const;

export type SoundKey = keyof typeof SOUNDS;
