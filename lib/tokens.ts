/**
 * DESIGN TOKENS, "Berry & Sunshine" (checked by tests/design.test.ts).
 *
 * Our own bright palette, not the official site's navy and mint: a vivid berry stage for
 * step 1 (and the header), sunflower yellow for the main action with ink text, a deep plum
 * ink, and five bright service colours. Light, warm-white sections for the later steps.
 * Flat colour only: no gradients, glows or glass. (The token names "navy*" are kept for the
 * stage so the components didn't need renaming.)
 */
import type { ServiceId } from "@/data/catalog";

export const color = {
  ink: "#1A1033", // deep plum ink
  muted: "#5A4E6E",
  line: "#EDE4EC",
  lineStrong: "#D5C6D3",
  canvas: "#FFFBF8", // warm white page
  surface: "#FFFFFF",
  surface2: "#FFF3F7", // blush band
  primary: "#FFD60A", // sunflower: the main action
  primaryStrong: "#F5C400",
  primarySoft: "#FFF6C2",
  onPrimary: "#1A1033",
  link: "#A6104D", // dark berry for text links on white (AA)
  focus: "#1A1033",
  danger: "#B42318",
  dangerSoft: "#FEF3F2",
  success: "#067647",
  successSoft: "#ECFDF3",
  warning: "#8A4B00",
  warningSoft: "#FFF6E0",
  // the berry stage (step 1, header, scan); names kept from the earlier build
  navy: "#B8124F",
  navy2: "#96093F", // raised surface on the stage (service tiles, pills)
  navyLine: "#E5679A",
  onDark: "#FFFFFF",
  onDarkMuted: "#FFE6F0",
  accent: "#FFD60A", // sunflower for small text on the stage
} as const;

/** Five bright service colours: vivid = fill · on = text on fill · text = AA text on white · soft = tint. */
export const service: Record<ServiceId, { vivid: string; on: string; text: string; soft: string }> = {
  internet: { vivid: "#4DA3FF", on: "#1A1033", text: "#1557B8", soft: "#E6F1FF" },
  tv: { vivid: "#FF8A3D", on: "#1A1033", text: "#B04A00", soft: "#FFEEDF" },
  phone: { vivid: "#B49CFF", on: "#1A1033", text: "#5B3DC4", soft: "#F1ECFF" },
  mobile: { vivid: "#7CE36B", on: "#1A1033", text: "#2E7A1F", soft: "#EAFBE6" },
  security: { vivid: "#2EE6C5", on: "#1A1033", text: "#0B7A66", soft: "#DDFBF5" },
};

export const type = {
  xs: ["0.75rem", "1rem"],
  sm: ["0.875rem", "1.375rem"],
  base: ["1rem", "1.5rem"],
  lg: ["1.125rem", "1.75rem"],
  xl: ["1.25rem", "1.75rem"],
  "2xl": ["1.5rem", "2rem"],
  "3xl": ["2rem", "2.375rem"],
  "4xl": ["2.75rem", "1.05"],
  "5xl": ["3.75rem", "1"],
} as const;

export const space = { unit: 4 };
export const radius = { sm: "6px", md: "10px", lg: "14px", full: "9999px" };
export const shadow = {
  sm: "0 1px 2px rgb(20 20 20 / 0.05)",
  md: "0 1px 2px rgb(20 20 20 / 0.06)",
  lg: "0 8px 24px -12px rgb(20 20 20 / 0.18)",
  overlay: "0 24px 48px -16px rgb(20 20 20 / 0.28)",
};
export const motion = {
  fast: 0.12,
  base: 0.2,
  slow: 0.32,
  ease: [0.2, 0, 0, 1] as [number, number, number, number],
  spring: { type: "spring" as const, stiffness: 500, damping: 40 },
  soft: { type: "spring" as const, stiffness: 320, damping: 36 },
};

export function contrastPairs(): [string, string, string][] {
  const p: [string, string, string][] = [
    [color.ink, color.canvas, "ink/canvas"],
    [color.ink, color.surface2, "ink/surface2"],
    [color.muted, color.canvas, "muted/canvas"],
    [color.muted, color.surface2, "muted/surface2"],
    [color.onPrimary, color.primary, "ink on sunflower"],
    [color.onPrimary, color.primaryStrong, "ink on sunflower hover"],
    [color.ink, color.primarySoft, "ink/primarySoft"],
    [color.link, color.canvas, "link/canvas"],
    [color.link, color.surface2, "link/surface2"],
    [color.link, color.primarySoft, "link/primarySoft"],
    [color.danger, color.canvas, "danger/canvas"],
    [color.danger, color.dangerSoft, "danger/dangerSoft"],
    [color.success, color.canvas, "success/canvas"],
    [color.success, color.successSoft, "success/successSoft"],
    [color.warning, color.warningSoft, "warning/warningSoft"],
    [color.onDark, color.ink, "white/ink"],
    [color.onDarkMuted, color.navy, "soft white/berry"],
    [color.onDarkMuted, color.navy2, "soft white/berry raised"],
    [color.accent, color.navy, "sunflower/berry"],
    [color.onDark, color.navy, "white/berry"],
    [color.link, color.surface, "search icon/white"],
    [color.onDark, color.ink, "white/plum footer"],
    [color.accent, color.ink, "sunflower/plum footer"],
    [color.onDark, color.navy2, "white/berry raised"],
  ];
  for (const [k, c] of Object.entries(service)) {
    p.push([c.on, c.vivid, `${k} on/vivid`], [c.text, color.canvas, `${k} text/canvas`], [c.text, c.soft, `${k} text/soft`]);
  }
  return p;
}

export function cssVariables(): string {
  const v: string[] = [];
  const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`).replace(/(\D)(\d)/, "$1-$2");
  for (const [k, c] of Object.entries(color)) v.push(`--${kebab(k)}:${c}`);
  for (const [k, c] of Object.entries(service)) v.push(`--${k}:${c.vivid}`, `--${k}-on:${c.on}`, `--${k}-text:${c.text}`, `--${k}-soft:${c.soft}`);
  for (const [k, s] of Object.entries(shadow)) v.push(`--sh-${k}:${s}`);
  return `:root{${v.join(";")}}`;
}
