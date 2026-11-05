/**
 * DESIGN SPEC (design-driven development): the Assured Saving brand system. Written before
 * the redesign; the UI was rebuilt until these passed. The look is taken from the brand's own
 * signatures on assuredsaving.com, made flat and bright, instead of a generic template:
 *
 * 1. Flat colour only: no gradients, glows, blur/glass, or decorative shadows.
 * 2. Brand colours: midnight navy stage, the brand mint for the main action (ink text),
 *    and the official service colours (cyan, fuchsia, blue, amber, green).
 * 3. Every text colour pair passes WCAG AA.
 * 4. Interactive controls are at least 44px tall.
 * 5. Shape: 14px cards, pill search and actions; nothing oversized.
 * 6. Type: Inter (the brand's face), with the brand's light/black weight contrast and
 *    letter-spaced capitals for labels.
 * 7. Brand marks: the "Assured" (light) / "Saving" (black) wordmark with the sparkle, the
 *    US-flag pill; no stock shield logo, no highlighter marker under the headline.
 * 8. Official wording only (copy.test.ts) and the official home-page structure.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { color, contrastPairs, radius, service } from "@/lib/tokens";

const ROOT = join(__dirname, "..");
const files = (dir: string): string[] =>
  readdirSync(join(ROOT, dir)).flatMap((f) => {
    const p = join(dir, f);
    return statSync(join(ROOT, p)).isDirectory() ? files(p) : /\.(tsx?|css)$/.test(f) ? [p] : [];
  });
const SOURCE = [...files("app"), ...files("components")].map((f) => ({ f, src: readFileSync(join(ROOT, f), "utf8") }));

const ratio = (a: string, b: string) => {
  const lum = (h: string) => {
    const [r, g, bl] = (h.replace("#", "").match(/\w\w/g) ?? []).map((x) => {
      const v = parseInt(x, 16) / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

describe("1. flat colour only", () => {
  it.each(SOURCE)("$f has no gradients, glows, blur or glass", ({ src }) => {
    // The range slider's two-colour track uses a hard stop (two flat colours), allowed only in globals.css
    const s = src.replace(/background: linear-gradient\(90deg, var\(--fill[^;]+;/g, "");
    expect(s).not.toMatch(/gradient\(|bg-gradient|text-gradient|from-\[|via-\[|to-\[#/);
    expect(s).not.toMatch(/backdrop-blur|blur-\w|drop-shadow|shadow-glow|text-shadow|\.glass/);
  });
});

describe("2. brand colours", () => {
  it("uses the brand mint for the main action, with ink text", () => {
    expect(color.primary.toUpperCase()).toBe("#00D492");
    expect(color.onPrimary.toUpperCase()).toBe(color.ink.toUpperCase());
  });
  it("sets step 1 on a midnight-navy stage, with light content sections below", () => {
    expect(color.navy.toUpperCase()).toBe("#0B1430");
    expect(ratio("#FFFFFF", color.navy)).toBeGreaterThanOrEqual(15);
    expect(ratio(color.canvas, "#FFFFFF")).toBeLessThan(1.1);
  });
  it("gives each service its official colour, all distinct from the mint", () => {
    const vivid = Object.values(service).map((c) => c.vivid.toUpperCase());
    expect(new Set(vivid).size).toBe(5);
    expect(vivid).not.toContain(color.primary.toUpperCase());
  });
});

describe("3. contrast", () => {
  it.each(contrastPairs())("%s on %s (%s) passes AA", (fg, bg) => {
    expect(ratio(fg, bg)).toBeGreaterThanOrEqual(4.5);
  });
});

describe("4. touch targets", () => {
  it.each(SOURCE.filter((x) => x.f.endsWith(".tsx")))("$f: buttons and links are at least 44px", ({ src }) => {
    // Every <button ... className="..."> and <a ... className="..."> must carry min-h-11+ or size-11+ (or use <Button>)
    const tags = [...src.matchAll(/<(button|a)\b[^>]*className=(?:"([^"]*)"|\{clsx\(([^)]*)\)|\{`([^`]*)`\})/g)];
    for (const m of tags) {
      const cls = m[2] ?? m[3] ?? m[4] ?? "";
      if (/sr-only/.test(cls)) continue;
      const px = Number(/min-h-\[(\d+)px\]/.exec(cls)?.[1] ?? 0);
      const ok = px >= 44 || /min-h-(11|12|13|14|16|20|24|28|32)\b|size-(11|12)\b|h-(11|12)\b|\$\{|link/.test(cls);
      expect(ok, `${m[0].slice(0, 90)}`).toBe(true);
    }
  });
});

describe("5. shape", () => {
  it("keeps card radii at 14px or less", () => {
    for (const r of [radius.sm, radius.md, radius.lg]) expect(parseInt(r)).toBeLessThanOrEqual(14);
  });
  it.each(SOURCE.filter((x) => x.f.endsWith(".tsx")))("$f uses no oversized rounding", ({ src }) => {
    expect(src).not.toMatch(/rounded-(2xl|3xl|\[(1[5-9]|[2-9]\d)px\])/);
  });
});

describe("6. type", () => {
  it("uses Inter, the brand's face, with light and black weights", () => {
    const layout = readFileSync(join(ROOT, "app/layout.tsx"), "utf8");
    expect(layout).toMatch(/Inter\(/);
    expect(layout).toMatch(/"300"/);
    expect(layout).toMatch(/"900"/);
    expect(layout).not.toMatch(/Instrument_Sans|Public_Sans|Plus_Jakarta|Geist|Manrope|Figtree/);
  });
  it("labels with letter-spaced capitals (the brand's caps style)", () => {
    const css = readFileSync(join(ROOT, "app/globals.css"), "utf8");
    expect(css).toMatch(/@utility caps/);
  });
});

describe("6b. brand marks", () => {
  const shell = readFileSync(join(ROOT, "components/sections/Shell.tsx"), "utf8");
  const hero = readFileSync(join(ROOT, "components/sections/Hero.tsx"), "utf8");
  it("uses the Assured / Saving wordmark with the sparkle and the US-flag pill", () => {
    expect(shell).toMatch(/export function Wordmark/);
    expect(shell).toMatch(/font-light[^"]*"[^>]*>\s*Assured|Assured<\/span>/);
    expect(shell).toMatch(/Sparkle/);
    expect(shell).toMatch(/UsFlag/);
  });
  it("has no stock shield logo and no highlighter marker", () => {
    for (const { src, f } of SOURCE) expect(src, f).not.toMatch(/M16 6\.5 8\.5 9\.4/);
    expect(hero).not.toMatch(/h-\[0\.28em\] bg-primary/);
  });
  it("sets the headline in the brand's light/black contrast on the navy stage", () => {
    expect(hero).toMatch(/bg-navy/);
    expect(hero).toMatch(/font-light/);
    expect(hero).toMatch(/font-black/);
  });
});

describe("8. official home-page structure", () => {
  it("puts the official headline, services, address search and Check Availability in step 1", () => {
    const hero = ["Hero.tsx", "AddressSearch.tsx"].map((f) => readFileSync(join(ROOT, "components/sections", f), "utf8")).join("\n");
    for (const k of ['"heroTitle"', '"heroTitleHighlight"', '"addrSearchLabel"', '"checkAvailability"', '"smartMatch"', '"heroDescription"']) expect(hero).toContain(k);
  });
  it("shows step names without step numbers", () => {
    for (const { f, src } of SOURCE) if (f.endsWith(".tsx")) expect(src, f).not.toMatch(/t\("step"\)|stepOf|Step \{/);
  });
});
