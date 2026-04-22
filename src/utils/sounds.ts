import { createAudioPlayer } from "expo-audio";

export const SOUNDS = {
  beep: createAudioPlayer(require("../../assets/sounds/beep.mp3")),
  start: createAudioPlayer(require("../../assets/sounds/start.mp3")),
  correct: createAudioPlayer(require("../../assets/sounds/correct.mp3")),
  wrong: createAudioPlayer(require("../../assets/sounds/wrong.mp3")),
  completion: createAudioPlayer(require("../../assets/sounds/completion.mp3")),
} as const;

export type AudioKey = keyof typeof SOUNDS;
