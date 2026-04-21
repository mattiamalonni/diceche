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
