export interface AppTheme {
  surface: string; // main screen background
  surface2: string; // card / section background
  text: string; // primary text
  textMuted: string; // secondary / muted text
  border: string; // borders and dividers
  isDark: boolean;
}

export const LIGHT_THEME: AppTheme = {
  surface: "#FFFFFF",
  surface2: "#F0F0F0",
  text: "#2D3436",
  textMuted: "#636E72",
  border: "#DFE6E9",
  isDark: false,
};

export const DARK_THEME: AppTheme = {
  surface: "#1C1C1E",
  surface2: "#2C2C2E",
  text: "#F2F2F7",
  textMuted: "#A0A0A5",
  border: "#3A3A3C",
  isDark: true,
};

export const COLORS = {
  primary: "#FF6B6B",
  secondary: "#4ECDC4",
  accent: "#FFE66D",

  bg1: "#FF6B6B",
  bg2: "#4ECDC4",
  bg3: "#FFE66D",
  bg4: "#A29BFE",
  bg5: "#FD79A8",
  bg6: "#00B894",
  bg7: "#FDCB6E",
  bg8: "#74B9FF",

  white: "#FFFFFF",
  dark: "#2D3436",
  muted: "#636E72",
  border: "#DFE6E9",
  disabled: "#B2BEC3",
  disabledBg: "#F0F0F0",

  success: "#00B894",
  danger: "#D63031",
  warning: "#FDCB6E",
} as const;

export const BG_PALETTE = [
  COLORS.bg1,
  COLORS.bg2,
  COLORS.bg3,
  COLORS.bg4,
  COLORS.bg5,
  COLORS.bg6,
  COLORS.bg7,
  COLORS.bg8,
] as const;

export function getBgColor(index: number): string {
  return BG_PALETTE[index % BG_PALETTE.length];
}

export const PROFILE_COLORS = [
  "#FF6B6B", // coral red
  "#FF8E53", // orange
  "#FFD93D", // yellow
  "#6BCB77", // green
  "#4ECDC4", // teal
  "#45B7D1", // sky blue
  "#4D96FF", // blue
  "#A29BFE", // lavender
  "#C77DFF", // violet
  "#FF69B4", // pink
  "#FD79A8", // rose
  "#00CEC9", // cyan
  "#55EFC4", // mint
  "#FDCB6E", // amber
  "#E17055", // terracotta
  "#636E72", // slate
] as const;

export const AVATARS = ["🦊", "🐼", "🦋", "🚀", "⭐", "🎮", "🌈", "🦄", "🐸", "🐯", "🦁", "🐧", "🎨", "🎵", "🏆", "🌙"] as const;
