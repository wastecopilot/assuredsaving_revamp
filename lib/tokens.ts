/**
 * DESIGN TOKENS: the Assured Saving brand system (checked by tests/design.test.ts).
 *
 * Taken from the brand's own site and made flat: a midnight-navy stage, the brand mint
 * (the green of "Saving") for the main action with ink text, the official service colours,
 * and a cool light page for the steps. No gradients, glows or glass.
 */
import type { ServiceId } from "@/data/catalog";

export const color = {
  ink: "#0B1430", // midnight: body text on light, and the stage colour
  muted: "#4B5672",
  line: "#E3E8F2",
  lineStrong: "#C5CEDF",
  canvas: "#F6F8FC", // cool light page
  surface: "#FFFFFF",
  surface2: "#EEF2F9",
  primary: "#00D492", // brand mint: the main action, selected states on navy
  primaryStrong: "#00B87E",
  primarySoft: "#DDFBEF",
  onPrimary: "#0B1430",
  link: "#00704D", // mint dark enough for text on white (AA)
  focus: "#0B1430",
  danger: "#B42318",
  dangerSoft: "#FEF3F2",
  success: "#067647",
  successSoft: "#ECFDF3",
  warning: "#8A4B00",
  warningSoft: "#FFF6E0",
  // the midnight stage (step 1, header, footer)
  navy: "#0B1430",
  navy2: "#16224A", // raised surface on the stage (service tiles, search)
  navyLine: "#2A3A6B",
  onDark: "#FFFFFF",
  onDarkMuted: "#C9D3EA",
  accent: "#7CF5CB", // light mint for small text on navy
} as const;

/** The official service colours, flat: vivid = fill · on = text on fill · text = AA text on white · soft = tint. */
export const service: Record<ServiceId, { vivid: string; on: string; text: string; soft: string }> = {
  internet: { vivid: "#22D3EE", on: "#0B1430", text: "#0E7490", soft: "#E0F8FC" },
  tv: { vivid: "#E879F9", on: "#0B1430", text: "#A21CAF", soft: "#FBEAFE" },
  phone: { vivid: "#60A5FA", on: "#0B1430", text: "#1D4ED8", soft: "#E6F0FF" },
  mobile: { vivid: "#FBBF24", on: "#0B1430", text: "#8A5A00", soft: "#FFF5D6" },
  security: { vivid: "#4ADE80", on: "#0B1430", text: "#15803D", soft: "#E4FBEA" },
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
    [color.onPrimary, color.primary, "ink on mint"],
    [color.onPrimary, color.primaryStrong, "ink on mint hover"],
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
    [color.onDarkMuted, color.navy, "soft white/navy"],
    [color.onDarkMuted, color.navy2, "soft white/navy raised"],
    [color.accent, color.navy, "light mint/navy"],
    [color.primary, color.navy, "mint/navy"],
    ["#FCA5A5", color.navy, "error/navy"],
    ["#0E7C5A", color.surface, "search icon/white"],
    [color.onDark, color.navy2, "white/navy raised"],
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
