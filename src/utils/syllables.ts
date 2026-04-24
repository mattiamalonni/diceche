export type SpecialGroup =
  | "CH"
  | "GH"
  | "GL"
  | "GN"
  | "SC"
  | "QU"
  | "BR"
  | "CR"
  | "DR"
  | "FR"
  | "GR"
  | "PR"
  | "TR"
  | "BL"
  | "CL"
  | "FL"
  | "PL";
export type WordPack = "articoli_det" | "articoli_indet" | "prep_semplici" | "prep_articolate";

export interface DictionaryConfig {
  combinations: boolean;
  singleLetters: boolean;
  vowels: string[];
  consonants: string[];
  specials: SpecialGroup[];
  packs: WordPack[];
}

export interface RoundConfig {
  dictionary: DictionaryConfig;
  count: number;
  syllableTimer: number | null; // seconds per card, null = disabled
  roundTimer: number | null; // total round seconds, null = disabled
  hideTimer: number | null; // seconds before word is hidden (shows ???), null = disabled
  speech: boolean; // show pronunciation button (incompatible with syllableTimer)
  uppercase: boolean; // display syllables in uppercase
}

export const ALL_VOWELS: string[] = ["a", "e", "i", "o", "u"];
export const ALL_CONSONANTS: string[] = ["b", "c", "d", "f", "g", "l", "m", "n", "p", "q", "r", "s", "t", "v", "z"];

export const DEFAULT_CONFIG: RoundConfig = {
  dictionary: {
    combinations: true,
    singleLetters: false,
    vowels: [...ALL_VOWELS],
    consonants: [...ALL_CONSONANTS],
    specials: ["CH", "GH", "GL", "GN", "SC", "QU", "BR", "CR", "DR", "FR", "GR", "PR", "TR", "BL", "CL", "FL", "PL"],
    packs: ["articoli_det", "articoli_indet", "prep_semplici", "prep_articolate"],
  },
  count: 30,
  syllableTimer: null,
  roundTimer: null,
  hideTimer: null,
  speech: true,
  uppercase: true,
};

export function generateBase(vowels: string[], consonants: string[]): string[] {
  const result: string[] = [];
  for (const consonant of consonants) {
    for (const vowel of vowels) {
      result.push(`${consonant}${vowel}`);
    }
  }
  return result;
}

export function generateSingleLetters(vowels: string[], consonants: string[]): string[] {
  return [...vowels, ...consonants];
}

const SPECIALS: Record<SpecialGroup, string[]> = {
  CH: ["che", "chi"],
  GH: ["ghe", "ghi"],
  GL: ["gla", "gle", "gli", "glo", "glu"],
  GN: ["gna", "gne", "gni", "gno", "gnu"],
  SC: ["sca", "sce", "sci", "sco", "scu"],
  QU: ["qua", "que", "qui", "quo"],
  BR: ["bra", "bre", "bri", "bro", "bru"],
  CR: ["cra", "cre", "cri", "cro", "cru"],
  DR: ["dra", "dre", "dri", "dro", "dru"],
  FR: ["fra", "fre", "fri", "fro", "fru"],
  GR: ["gra", "gre", "gri", "gro", "gru"],
  PR: ["pra", "pre", "pri", "pro", "pru"],
  TR: ["tra", "tre", "tri", "tro", "tru"],
  BL: ["bla", "ble", "bli", "blo", "blu"],
  CL: ["cla", "cle", "cli", "clo", "clu"],
  FL: ["fla", "fle", "fli", "flo", "flu"],
  PL: ["pla", "ple", "pli", "plo", "plu"],
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
  const { combinations, singleLetters, vowels, consonants } = config.dictionary;

  if (combinations) {
    const baseConsonants = consonants.filter((c) => c !== "q");
    items.push(...generateBase(vowels, baseConsonants));
  }

  if (singleLetters) {
    items.push(...generateSingleLetters(vowels, consonants));
  }

  items.push(...generateSpecials(config.dictionary.specials));

  for (const pack of config.dictionary.packs) {
    items.push(...WORD_PACKS[pack]);
  }

  return shuffle([...new Set(items)]);
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
  const items: string[] = [];
  const { combinations, singleLetters, vowels, consonants } = config.dictionary;
  if (combinations) items.push(...generateBase(vowels, consonants));
  if (singleLetters) items.push(...generateSingleLetters(vowels, consonants));
  items.push(...generateSpecials(config.dictionary.specials));
  for (const pack of config.dictionary.packs) {
    items.push(...WORD_PACKS[pack]);
  }
  return new Set(items).size;
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
  GL: "GL (gla, gle, gli, glo, glu)",
  GN: "GN (gna, gne, gni, gno, gnu)",
  SC: "SC (sca, sce, sci, sco, scu)",
  QU: "QU (qua, que, qui, quo)",
  BR: "BR (bra, bre, bri, bro, bru)",
  CR: "CR (cra, cre, cri, cro, cru)",
  DR: "DR (dra, dre, dri, dro, dru)",
  FR: "FR (fra, fre, fri, fro, fru)",
  GR: "GR (gra, gre, gri, gro, gru)",
  PR: "PR (pra, pre, pri, pro, pru)",
  TR: "TR (tra, tre, tri, tro, tru)",
  BL: "BL (bla, ble, bli, blo, blu)",
  CL: "CL (cla, cle, cli, clo, clu)",
  FL: "FL (fla, fle, fli, flo, flu)",
  PL: "PL (pla, ple, pli, plo, plu)",
};

export const ALL_SPECIALS: SpecialGroup[] = [
  "CH",
  "GH",
  "GL",
  "GN",
  "SC",
  "QU",
  "BR",
  "CR",
  "DR",
  "FR",
  "GR",
  "PR",
  "TR",
  "BL",
  "CL",
  "FL",
  "PL",
];
export const ALL_PACKS: WordPack[] = ["articoli_det", "articoli_indet", "prep_semplici", "prep_articolate"];
