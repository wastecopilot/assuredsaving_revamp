"use client";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import clsx from "clsx";
import { STAGE_NAMES, sectionId, useStore, type StageName } from "@/lib/store";

/** A numbered stage card. Reveals with a subtle rise when it unlocks. */
export function Section({ stage, accent, children, wide, className }: { stage: StageName; accent: string; children: ReactNode; wide?: boolean; className?: string }) {
  const reduce = useReducedMotion();
  const { s } = useStore();
  const visible = STAGE_NAMES.filter((n) => (n === "usage" ? s.services.includes("internet") : n === "tv" ? s.services.includes("tv") : true));
  const num = visible.indexOf(stage) + 1;
  return (
    <motion.section
      id={sectionId(stage)}
      aria-labelledby={`${sectionId(stage)}-h`}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0.1 : 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={clsx("mx-auto scroll-mt-24 px-4 sm:px-6", wide ? "max-w-6xl" : "max-w-4xl", className)}
    >
      <div className="relative rounded-xl border border-line bg-surface p-5 shadow-md sm:p-10">
        <span
          aria-hidden
          className="absolute -top-5 left-5 flex size-10 items-center justify-center rounded-full font-display text-lg font-extrabold text-white shadow-glow ring-4 ring-canvas sm:left-10"
          style={{ background: accent }}
        >
          {num}
        </span>
        {children}
      </div>
    </motion.section>
  );
}

/** Section heading: an eyebrow, a big two-tone title, and an optional subtitle. */
export function Heading({ id, eyebrow, a, b, sub, as = "h2" }: { id: string; eyebrow?: string; a: string; b?: string; sub?: string; as?: "h1" | "h2" }) {
  const H = as;
  return (
    <div>
      {eyebrow && <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">{eyebrow}</p>}
      <H id={id} tabIndex={-1} className="mt-2 font-display text-3xl font-extrabold leading-[1.05] text-ink outline-none sm:text-5xl">
        {a} {b && <span className="text-brand">{b}</span>}
      </H>
      {sub && <p className="mt-3 max-w-2xl text-base text-muted sm:text-lg">{sub}</p>}
    </div>
  );
}

