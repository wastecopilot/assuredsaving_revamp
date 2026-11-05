/**
 * DESIGN TOKENS, "Sky & Tangerine" (checked by tests/design.test.ts).
 *
 * Our own bright palette, not the official site's navy and mint. A light page: a soft sky
 * stage for step 1 and the header, white sections below, deep ink text. The colour sits on
 * the accents: tangerine for the main action (ink text), electric blue for the headline word
 * and links, a sunny sparkle, and five vivid service colours. Flat only.
 * (Token names "navy*" / "onDark*" are kept for the stage so components didn't need renaming.)
 */
import type { ServiceId } from "@/data/catalog";

export const color = {
  ink: "#0F1B3D",
  muted: "#4A5A7A",
  line: "#E1E8F3",
  lineStrong: "#C3D0E4",
  canvas: "#FFFFFF",
  surface: "#FFFFFF",
  surface2: "#F4F8FF", // faint sky band
  primary: "#FF7A1A", // tangerine: the main action
  primaryStrong: "#F2650A",
  primarySoft: "#FFEEDD",
  onPrimary: "#0F1B3D",
  link: "#1D4ED8", // electric blue for links and the headline word (AA on white and sky)
  focus: "#0F1B3D",
  danger: "#B42318",
  dangerSoft: "#FEF3F2",
  success: "#067647",
  successSoft: "#ECFDF3",
  warning: "#8A4B00",
  warningSoft: "#FFF6E0",
  // the light sky stage (step 1, header, scan)
  navy: "#EAF4FF",
  navy2: "#FFFFFF", // raised surface on the stage (service tiles, pills, search)
  navyLine: "#C7DAF5",
  onDark: "#0F1B3D", // text on the stage
  onDarkMuted: "#3F4F72",
  accent: "#1D4ED8", // electric blue for small text on the stage
} as const;

/** Five vivid service colours: vivid = fill · on = text on fill · text = AA text on white · soft = tint. */
export const service: Record<ServiceId, { vivid: string; on: string; text: string; soft: string }> = {
  internet: { vivid: "#38BDF8", on: "#0F1B3D", text: "#0369A1", soft: "#E0F4FE" },
  tv: { vivid: "#FB7185", on: "#0F1B3D", text: "#BE123C", soft: "#FFE7EB" },
  phone: { vivid: "#A78BFA", on: "#0F1B3D", text: "#6D28D9", soft: "#F1ECFF" },
  mobile: { vivid: "#A3E635", on: "#0F1B3D", text: "#3F6212", soft: "#F1FBDF" },
  security: { vivid: "#14C8AE", on: "#0F1B3D", text: "#0F766E", soft: "#DDF8F3" },
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
    [color.onPrimary, color.primary, "ink on tangerine"],
    [color.onPrimary, color.primaryStrong, "ink on tangerine hover"],
    [color.ink, color.primarySoft, "ink/primarySoft"],
    [color.link, color.canvas, "link/canvas"],
    [color.link, color.surface2, "link/surface2"],
    [color.link, color.primarySoft, "link/primarySoft"],
    [color.danger, color.canvas, "danger/canvas"],
    [color.danger, color.dangerSoft, "danger/dangerSoft"],
    [color.success, color.canvas, "success/canvas"],
    [color.success, color.successSoft, "success/successSoft"],
    [color.warning, color.warningSoft, "warning/warningSoft"],
    ["#FFFFFF", color.ink, "white/ink"],
    [color.onDarkMuted, color.navy, "muted/sky"],
    [color.onDarkMuted, color.navy2, "muted/raised"],
    [color.accent, color.navy, "blue/sky"],
    [color.onDark, color.navy, "ink/sky"],
    [color.link, color.surface, "search icon/white"],
    ["#FFFFFF", color.ink, "white/ink footer"],
    [color.primary, color.ink, "tangerine/ink footer"],
    [color.onDark, color.navy2, "ink/raised"],
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
