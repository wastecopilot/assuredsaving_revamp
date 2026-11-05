"use client";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import clsx from "clsx";
import { sectionId, type StageName } from "@/lib/store";

/**
 * A step band: full width, divided by a hairline. On desktop the first child (the
 * heading) sits in a sticky left column and the rest in the right column, like a
 * well-made settings or checkout form. `wide` (results) uses the full width.
 */
export function Section({ stage, children, className, wide, tone = "plain" }: { stage: StageName; children: ReactNode; className?: string; wide?: boolean; tone?: "plain" | "warm" }) {
  const reduce = useReducedMotion();
  return (
    <motion.section
      id={sectionId(stage)}
      aria-labelledby={`${sectionId(stage)}-h`}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0.1 : 0.3, ease: [0.2, 0, 0, 1] }}
      className={clsx("scroll-mt-28 border-b border-line", tone === "warm" ? "bg-surface2" : "bg-surface", className)}
    >
      <div className={clsx("mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14", !wide && "md:grid md:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] md:gap-x-12 [&>*:first-child]:md:sticky [&>*:first-child]:md:top-32 [&>*:first-child]:md:row-span-6 [&>*:first-child]:md:self-start [&>*:not(:first-child)]:md:col-start-2")}>
        {children}
      </div>
    </motion.section>
  );
}

/** Section heading: optional eyebrow, a title with one underlined phrase, a subtitle. */
export function Heading({ id, eyebrow, a, b, after, sub }: { id: string; eyebrow?: string; a: string; b?: string; after?: string; sub?: string; dark?: boolean }) {
  return (
    <div className="mb-6 md:mb-0">
      {eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">{eyebrow}</p>}
      <h2 id={id} tabIndex={-1} className="text-[1.75rem] font-bold leading-tight text-ink outline-none sm:text-[2rem]">
        {a}{" "}
        {b && <span className="underline decoration-primary decoration-[0.14em] underline-offset-[0.14em]">{b}</span>}
        {after}
      </h2>
      {sub && <p className="mt-2 text-base text-muted">{sub}</p>}
    </div>
  );
}
