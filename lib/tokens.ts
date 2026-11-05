/**
 * DESIGN TOKENS (single source of truth; checked by tests/design.test.ts and scripts/contrast.ts).
 *
 * Light, editorial, flat. Warm white page, near-black ink, one bright orange for actions
 * (with ink text), and one solid colour per service. No gradients, glows or glass.
 */
import type { ServiceId } from "@/data/catalog";

export const color = {
  ink: "#141414",
  muted: "#55575E",
  line: "#E7E5E0",
  lineStrong: "#CFCCC5",
  canvas: "#FFFFFF",
  surface: "#FFFFFF",
  surface2: "#F6F5F2", // warm panel
  primary: "#FF5A1F", // bright orange: buttons, selected states
  primaryStrong: "#E84A10",
  primarySoft: "#FFEEE6",
  onPrimary: "#141414",
  link: "#B53A0C", // orange-brown for text links on white (AA)
  focus: "#141414",
  danger: "#B42318",
  dangerSoft: "#FEF3F2",
  success: "#067647",
  successSoft: "#ECFDF3",
  warning: "#8A4B00",
  warningSoft: "#FFF6E0",
  // kept for components shared with the other build; same light values here
  navy: "#141414",
  navy2: "#F6F5F2",
  navyLine: "#E7E5E0",
  onDark: "#FFFFFF",
  onDarkMuted: "#D5D3CE",
  accent: "#FF5A1F",
} as const;

/** One solid colour per service: vivid = fill · on = text on fill · text = AA text on white · soft = tint. */
export const service: Record<ServiceId, { vivid: string; on: string; text: string; soft: string }> = {
  internet: { vivid: "#2962F2", on: "#FFFFFF", text: "#1F4FD1", soft: "#EBF1FF" },
  tv: { vivid: "#FF3D71", on: "#141414", text: "#C2124A", soft: "#FFECF1" },
  phone: { vivid: "#7A3FF2", on: "#FFFFFF", text: "#6229D6", soft: "#F2ECFF" },
  mobile: { vivid: "#FFC21A", on: "#141414", text: "#8A5A00", soft: "#FFF7DC" },
  security: { vivid: "#12B76A", on: "#141414", text: "#067647", soft: "#E8F8F0" },
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
export const radius = { sm: "4px", md: "6px", lg: "8px", full: "9999px" };
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
    [color.onPrimary, color.primary, "ink on orange"],
    [color.onPrimary, color.primaryStrong, "ink on orange hover"],
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
