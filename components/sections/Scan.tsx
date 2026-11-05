"use client";
import { useEffect, useRef, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import clsx from "clsx";
import { resultsFor } from "@/lib/plans";
import { STAGE, useStore } from "@/lib/store";
import { Section } from "./Section";
import { Sparkle } from "./Shell";

const TOTAL = 4500;
const STATUS = ["status0", "status1", "status2", "status3", "status4"] as const;

/** The official "Assured Saving Agent — Live" step. About 4.5 s; a fallback timer always finishes it. */
export function ScanSection() {
  const { s, dispatch, t, goNext } = useStore();
  const [elapsed, setElapsed] = useState(0);
  const finished = useRef(false);

  useEffect(() => {
    finished.current = false;
    const start = performance.now();
    const finish = () => {
      if (finished.current) return;
      finished.current = true;
      dispatch({ type: "patch", patch: { scanDone: true } });
      goNext(STAGE.scan);
    };
    const id = window.setInterval(() => {
      const e = performance.now() - start;
      setElapsed(e);
      if (e >= TOTAL) finish();
    }, 100);
    const fallback = window.setTimeout(finish, TOTAL + 1500);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(fallback);
    };
  }, [dispatch, goNext]);

  const pct = Math.min(100, Math.round((elapsed / TOTAL) * 100));
  const idx = Math.min(STATUS.length - 1, Math.floor((elapsed / TOTAL) * STATUS.length));
  const providers = [...new Set(resultsFor(s.services).plans.map((p) => p.provider))];
  const providerDone = (i: number) => elapsed / TOTAL > 0.2 + i * 0.12;

  return (
    <Section stage="scan" tone="navy">
      <div>
        <h2 id="section-scan-h" tabIndex={-1} className="flex items-center gap-3 text-[1.875rem] font-black leading-tight tracking-[-0.03em] text-white outline-none sm:text-[2.375rem]">
          <Sparkle className="size-7 shrink-0 animate-pulse text-primary" />
          {t("agentLive")}
        </h2>
        {s.address && (
          <p className="mt-2 text-on-dark-muted">
            {s.address.line1}, {s.address.city}, {s.address.state} {s.address.zip}
          </p>
        )}
      </div>
      <div>
        <div aria-hidden className="h-2 overflow-hidden rounded-full bg-navy2">
          <div className="h-full rounded-full bg-primary transition-[width] duration-150 ease-linear" style={{ width: `${pct}%` }} />
        </div>
        <ol className="mt-6 space-y-3">
          {STATUS.map((k, i) => {
            const state = i < idx || pct >= 100 ? "done" : i === idx ? "now" : "wait";
            return (
              <li key={k} className={clsx("flex items-center gap-3", state === "wait" ? "text-on-dark-muted" : "text-white")}>
                <span className={clsx("flex size-6 shrink-0 items-center justify-center rounded-full", state === "done" ? "bg-primary text-ink" : state === "now" ? "border-2 border-primary text-primary" : "border border-navy-line")}>
                  {state === "done" ? <Check aria-hidden className="size-3.5" strokeWidth={3} /> : state === "now" ? <Loader2 aria-hidden className="size-3.5 animate-spin" /> : null}
                </span>
                <span className={clsx(state === "now" && "font-semibold")}>{t(k)}</span>
              </li>
            );
          })}
        </ol>
        <p className="sr-only" role="status" aria-live="polite">
          {t(STATUS[idx])}
        </p>

        {providers.length > 0 && (
          <div className="mt-8 rounded-lg bg-navy2 p-5 ring-1 ring-navy-line">
            <p className="caps text-[12px] tracking-[0.16em] text-accent">{t("availableNow")}</p>
            <p className="mt-1 text-sm text-on-dark-muted">{t("scanSubtitle")}</p>
            <ul className="mt-3 divide-y divide-navy-line">
              {providers.map((p, i) => (
                <li key={p} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <span className="font-black tracking-[-0.01em] text-white">{p}</span>
                  {providerDone(i) ? (
                    <Check aria-hidden className="size-4 text-primary" strokeWidth={3} />
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-on-dark-muted">
                      <Loader2 aria-hidden className="size-3.5 animate-spin" />
                      {t("confirming")}
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs leading-relaxed text-on-dark-muted">{t("priceFooter")}</p>
          </div>
        )}
      </div>
    </Section>
  );
}
