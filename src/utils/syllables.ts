export type SpecialGroup = "CH" | "GH" | "GL" | "GN" | "SC" | "QU";
export type WordPack = "articoli_det" | "articoli_indet" | "prep_semplici" | "prep_articolate";

export interface RoundConfig {
  base: boolean;
  specials: SpecialGroup[];
  packs: WordPack[];
  count: number;
  syllableTimer: number | null; // seconds per card, null = disabled
  roundTimer: number | null; // total round seconds, null = disabled
  speech: boolean; // show pronunciation button (incompatible with syllableTimer)
  uppercase: boolean; // display syllables in uppercase
}

export const DEFAULT_CONFIG: RoundConfig = {
  base: true,
  specials: ["CH", "GH", "GL", "GN", "SC", "QU"],
  packs: ["articoli_det", "articoli_indet", "prep_semplici", "prep_articolate"],
  count: 30,
  syllableTimer: null,
  roundTimer: null,
  speech: false,
  uppercase: true,
};

const VOWELS = ["a", "e", "i", "o", "u"] as const;

const BASE_CONSONANTS = ["b", "c", "d", "f", "g", "l", "m", "n", "p", "r", "s", "t", "v", "z"] as const;

export function generateBase(): string[] {
  const result: string[] = [];

  for (const consonant of BASE_CONSONANTS) {
    for (const vowel of VOWELS) {
      result.push(`${consonant}${vowel}`);
    }
  }

  return result;
}

const SPECIALS: Record<SpecialGroup, string[]> = {
  CH: ["che", "chi"],
  GH: ["ghe", "ghi"],
  GL: ["gli"],
  GN: ["gna", "gne", "gni", "gno", "gnu"],
  SC: ["sca", "sce", "sci", "sco", "scu"],
  QU: ["qua", "que", "qui", "quo"],
};

export function generateSpecials(active: SpecialGroup[]): string[] {
  return active.flatMap((g) => SPECIALS[g]);
}

export const WORD_PACKS: Record<WordPack, string[]> = {
  articoli_det: ["il", "lo", "la", "i", "gli", "le"],
  articoli_indet: ["un", "uno", "una"],
  prep_semplici: ["di", "a", "da", "in", "con", "su", "per", "tra", "fra"],
  prep_articolate: [
    "del",
    "dello",
    "della",
    "dei",
    "degli",
    "delle",
    "al",
    "allo",
    "alla",
    "ai",
    "agli",
    "alle",
    "dal",
    "dallo",
    "dalla",
    "dai",
    "dagli",
    "dalle",
    "nel",
    "nello",
    "nella",
    "nei",
    "negli",
    "nelle",
    "sul",
    "sullo",
    "sulla",
    "sui",
    "sugli",
    "sulle",
  ],
};

export function buildPool(config: RoundConfig): string[] {
  const items: string[] = [];

  if (config.base) {
    items.push(...generateBase());
  }

  items.push(...generateSpecials(config.specials));

  for (const pack of config.packs) {
    items.push(...WORD_PACKS[pack]);
  }

  return shuffle(items);
}

export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function getPoolSize(config: RoundConfig): number {
  let size = 0;
  if (config.base) size += generateBase().length;
  size += generateSpecials(config.specials).length;
  for (const pack of config.packs) {
    size += WORD_PACKS[pack].length;
  }
  return size;
}

export const WORD_PACK_LABELS: Record<WordPack, string> = {
  articoli_det: "Articoli determinativi",
  articoli_indet: "Articoli indeterminativi",
  prep_semplici: "Preposizioni semplici",
  prep_articolate: "Preposizioni articolate",
};

export const SPECIAL_LABELS: Record<SpecialGroup, string> = {
  CH: "CH (che, chi)",
  GH: "GH (ghe, ghi)",
  GL: "GL (gli)",
  GN: "GN (gna, gne, gni, gno, gnu)",
  SC: "SC (sca, sce, sci, sco, scu)",
  QU: "QU (qua, que, qui, quo)",
};

export const ALL_SPECIALS: SpecialGroup[] = ["CH", "GH", "GL", "GN", "SC", "QU"];
export const ALL_PACKS: WordPack[] = ["articoli_det", "articoli_indet", "prep_semplici", "prep_articolate"];
