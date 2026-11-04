/**
 * DESIGN TOKENS: the single source of truth.
 * Colour, type scale, spacing (8px grid), radius, shadow and motion live here.
 * layout.tsx writes them as CSS variables; Tailwind maps them to utilities in
 * app/globals.css; scripts/contrast.ts checks every text pair for WCAG AA.
 */
import type { ServiceId } from "@/data/catalog";

export const color = {
  ink: "#14123A", // 17.4:1 on canvas
  muted: "#565377", // 7.1:1 on canvas
  line: "#ECE7F6",
  lineStrong: "#D9D2EC",
  canvas: "#FFFCF7",
  surface: "#FFFFFF",
  surface2: "#F6F3FF",
  primary: "#5B3DF5", // electric violet, white text 6.1:1
  primaryStrong: "#4628DB",
  primarySoft: "#EBE8FE",
  danger: "#C1263A",
  dangerSoft: "#FDECEE",
  success: "#0A7B5F",
} as const;

/**
 * One colour per service, carried through tiles, chips, stripes and badges.
 * vivid = fills and glows · text = AA-safe text shade · on = text on vivid · soft = tint
 */
export const service: Record<ServiceId, { vivid: string; text: string; on: string; soft: string }> = {
  internet: { vivid: "#1F6BFF", text: "#1C5FE3", on: "#FFFFFF", soft: "#E4EDFF" },
  tv: { vivid: "#FF5C4D", text: "#B84237", on: "#14123A", soft: "#FFEBEA" },
  mobile: { vivid: "#A23DF5", text: "#9036DA", on: "#FFFFFF", soft: "#F4E8FE" },
  security: { vivid: "#10C79A", text: "#0A7B5F", on: "#14123A", soft: "#E2F8F3" },
  phone: { vivid: "#FFC02E", text: "#8C6A19", on: "#14123A", soft: "#FFF7E6" },
};

/** Brand gradient (violet to electric blue): white text passes AA at both ends. */
export const gradient = { from: "#5B3DF5", to: "#1F6BFF", text: "#FFFFFF" };

/** Type scale in rem with line heights. Display uses the heading font. */
export const type = {
  xs: ["0.75rem", "1rem"],
  sm: ["0.875rem", "1.375rem"],
  base: ["1rem", "1.625rem"],
  lg: ["1.125rem", "1.75rem"],
  xl: ["1.375rem", "1.875rem"],
  "2xl": ["1.75rem", "2.25rem"],
  "3xl": ["2.25rem", "2.625rem"],
  "4xl": ["3rem", "3.25rem"],
  "5xl": ["4rem", "4.125rem"],
} as const;

/** 8px grid. Tailwind's spacing base is set to 4px; layouts use even steps. */
export const space = { unit: 8 };
export const radius = { sm: "12px", md: "16px", lg: "24px", xl: "32px", full: "9999px" };
export const shadow = {
  sm: "0 1px 2px rgb(20 18 58 / 0.05), 0 4px 12px -2px rgb(20 18 58 / 0.06)",
  md: "0 2px 4px rgb(20 18 58 / 0.04), 0 16px 36px -10px rgb(20 18 58 / 0.14)",
  glow: "0 18px 40px -14px rgb(91 61 245 / 0.45)",
  overlay: "0 24px 80px -12px rgb(20 18 58 / 0.35)",
};
export const motion = {
  fast: 0.15,
  base: 0.25,
  slow: 0.45,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  spring: { type: "spring" as const, stiffness: 520, damping: 26 },
  soft: { type: "spring" as const, stiffness: 260, damping: 30 },
};

export function contrastPairs(): [string, string, string][] {
  const p: [string, string, string][] = [
    [color.ink, color.canvas, "ink/canvas"],
    [color.ink, color.surface2, "ink/surface2"],
    [color.muted, color.canvas, "muted/canvas"],
    [color.muted, color.surface, "muted/surface"],
    [color.muted, color.surface2, "muted/surface2"],
    [color.muted, color.primarySoft, "muted/primarySoft"],
    [color.primary, color.surface, "primary text/surface"],
    [color.primary, color.primarySoft, "primary text/primarySoft"],
    ["#FFFFFF", color.primary, "white/primary"],
    ["#FFFFFF", color.primaryStrong, "white/primaryStrong"],
    [color.danger, color.surface, "danger/surface"],
    [color.danger, color.dangerSoft, "danger/dangerSoft"],
    [color.success, color.surface, "success/surface"],
    [gradient.text, gradient.from, "white/gradient start"],
    [gradient.text, gradient.to, "white/gradient end"],
  ];
  for (const [k, c] of Object.entries(service)) {
    p.push([c.text, color.surface, `${k} text/surface`], [c.text, color.canvas, `${k} text/canvas`], [c.text, c.soft, `${k} text/soft`], [c.on, c.vivid, `${k} on/vivid`]);
  }
  return p;
}

export function cssVariables(): string {
  const v: string[] = [];
  const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
  for (const [k, c] of Object.entries(color)) v.push(`--${kebab(k)}:${c}`);
  for (const [k, c] of Object.entries(service)) v.push(`--${k}:${c.vivid}`, `--${k}-text:${c.text}`, `--${k}-on:${c.on}`, `--${k}-soft:${c.soft}`);
  v.push(`--grad-from:${gradient.from}`, `--grad-to:${gradient.to}`);
  for (const [k, s] of Object.entries(shadow)) v.push(`--sh-${k}:${s}`);
  return `:root{${v.join(";")}}`;
}
