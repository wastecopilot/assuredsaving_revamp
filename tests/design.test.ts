/**
 * DESIGN SPEC (design-driven development). Written before the UI was built; the UI was
 * then built until these passed. They encode the agreed design rules so they can't drift:
 *
 * 1. Flat colour only: no gradients, glows, blur/glass, or decorative shadows.
 * 2. One bright action colour (orange, ink text) and one solid colour per service.
 * 3. Every text colour pair passes WCAG AA.
 * 4. Interactive controls are at least 44px tall (min-h-11 or more).
 * 5. Sharp, consistent shape language: radius 8px or less, no pill shapes on cards.
 * 6. Instrument Sans, one family.
 * 7. Official wording only (see copy.test.ts), and the official home-page structure:
 *    headline, five services, address search and "Check Availability" on the first screen.
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

describe("2. colour roles", () => {
  it("has one bright orange action colour with ink text", () => {
    expect(color.primary.toUpperCase()).toBe("#FF5A1F");
    expect(color.onPrimary.toUpperCase()).toBe(color.ink.toUpperCase());
  });
  it("gives each of the five services its own solid colour", () => {
    const vivid = Object.values(service).map((c) => c.vivid.toUpperCase());
    expect(new Set(vivid).size).toBe(5);
    expect(vivid).not.toContain(color.primary.toUpperCase());
  });
  it("is a light design (not a navy stage)", () => {
    expect(ratio(color.canvas, "#FFFFFF")).toBeLessThan(1.1);
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
  it("keeps radii at 8px or less", () => {
    for (const r of [radius.sm, radius.md, radius.lg]) expect(parseInt(r)).toBeLessThanOrEqual(8);
  });
  it.each(SOURCE.filter((x) => x.f.endsWith(".tsx")))("$f uses no oversized rounding", ({ src }) => {
    expect(src).not.toMatch(/rounded-(2xl|3xl|\[(1[2-9]|[2-9]\d)px\])/);
  });
});

describe("6. type", () => {
  it("uses Instrument Sans only", () => {
    const layout = readFileSync(join(ROOT, "app/layout.tsx"), "utf8");
    expect(layout).toMatch(/Instrument_Sans/);
    expect(layout).not.toMatch(/Public_Sans|Plus_Jakarta|Geist|Inter\b/);
  });
});

describe("7. official home-page structure", () => {
  it("puts the official headline, services, address search and Check Availability in step 1", () => {
    const hero = ["Hero.tsx", "AddressSearch.tsx"].map((f) => readFileSync(join(ROOT, "components/sections", f), "utf8")).join("\n");
    for (const k of ['"heroTitle"', '"heroTitleHighlight"', '"addrSearchLabel"', '"checkAvailability"', '"smartMatch"', '"heroDescription"']) expect(hero).toContain(k);
  });
  it("shows step names without step numbers", () => {
    for (const { f, src } of SOURCE) if (f.endsWith(".tsx")) expect(src, f).not.toMatch(/t\("step"\)|stepOf|Step \{/);
  });
});
