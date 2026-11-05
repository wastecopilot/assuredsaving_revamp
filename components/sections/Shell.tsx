"use client";
import { ArrowLeft, Building2, Home, MapPin, PhoneCall, RotateCcw, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { FOOTER_LINKS, SERVICE_ORDER, siteUrl } from "@/data/catalog";
import type { Key } from "@/lib/i18n";
import { STAGE_NAMES, useStore, type StageName } from "@/lib/store";
import { service } from "@/lib/tokens";
import { cleanText, nameOk } from "@/lib/schedule";
import { SERVICE_ICON } from "../ui";

/** The brand's four-point sparkle (as beside "Saving" on assuredsaving.com), flat. */
export function Sparkle({ className, color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path d="M12 1.5c.5 5.6 2.9 8 8.5 8.5-5.6.5-8 2.9-8.5 8.5-.5-5.6-2.9-8-8.5-8.5 5.6-.5 8-2.9 8.5-8.5Z" fill={color} />
      <path d="M19.5 15c.2 2.2 1.1 3.1 3.3 3.3-2.2.2-3.1 1.1-3.3 3.3-.2-2.2-1.1-3.1-3.3-3.3 2.2-.2 3.1-1.1 3.3-3.3Z" fill={color} />
    </svg>
  );
}

/** A small flat US flag, as in the official "ASSURED SAVING" pill. */
export function UsFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 18" aria-hidden className={className}>
      <rect width="28" height="18" rx="2.5" fill="#FFFFFF" />
      {[0, 2, 4, 6, 8, 10, 12].map((i) => (
        <rect key={i} y={(i * 18) / 13} width="28" height={18 / 13} fill="#E0262D" />
      ))}
      <rect width="12.5" height={(7 * 18) / 13} rx="1" fill="#1E3A8A" />
      {[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => <circle key={`${r}${c}`} cx={2 + c * 2.9} cy={1.9 + r * 2.6} r="0.6" fill="#FFFFFF" />))}
    </svg>
  );
}

/**
 * The Assured Saving wordmark: "Assured" in a light weight, "Saving" in black, then the
 * sparkle, the same contrast the brand uses on its home page. `compact` is the header pill.
 */
export function Wordmark({ compact, dark = true }: { compact?: boolean; dark?: boolean }) {
  const { t } = useStore();
  if (compact)
    return (
      <span className={clsx("inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full px-3 ring-1 sm:gap-2.5 sm:px-3.5", dark ? "bg-navy2 ring-navy-line" : "bg-surface ring-line")}>
        <UsFlag className="h-3.5 w-auto shrink-0" />
        <span className={clsx("caps text-[11px] tracking-[0.12em] max-[359px]:sr-only sm:text-[13px] sm:tracking-[0.18em]", dark ? "text-on-dark" : "text-ink")}>{t("brand")}</span>
      </span>
    );
  return (
    <span className={clsx("inline-flex items-baseline gap-1.5 text-xl leading-none tracking-[-0.02em]", dark ? "text-on-dark" : "text-ink")}>
      <span className="font-light" aria-hidden>Assured</span>
      <span className="font-black" aria-hidden>Saving</span>
      <span className="sr-only">{t("brand")}</span>
      <Sparkle className="size-4 self-start text-primary" />
    </span>
  );
}

/** The stages that apply to this visitor (usage only with internet, TV setup only with TV). */
export function useVisibleStages(): StageName[] {
  const { s } = useStore();
  return STAGE_NAMES.filter((n) => (n === "usage" ? s.services.includes("internet") : n === "tv" ? s.services.includes("tv") : true));
}

/**
 * The step name shown at the top, as on the official site (no step numbers):
 * Intent, then Name & Address (also covers usage), then Details for TV, scan and results.
 */
export const STAGE_LABEL: Record<StageName, Key> = {
  intent: "stage_intent",
  address: "stage_address",
  usage: "stage_address",
  tv: "stage_details",
  scan: "stage_details",
  results: "stage_details",
};

function LangSwitch() {
  const { s, dispatch } = useStore();
  return (
    <div className="flex shrink-0 items-center whitespace-nowrap rounded-full bg-navy2 px-0.5 ring-1 ring-navy-line">
      {(["en", "es"] as const).map((l, i) => (
        <span key={l} className="flex items-center">
          {i === 1 && (
            <span aria-hidden className="text-xs text-on-dark-muted">
              |
            </span>
          )}
          <button
            type="button"
            lang={l}
            aria-pressed={s.lang === l}
            onClick={() => dispatch({ type: "patch", patch: { lang: l } })}
            className={clsx("caps min-h-11 min-w-10 rounded-full px-1.5 text-[11px] tracking-[0.1em] transition-colors sm:min-w-11 sm:px-2 sm:text-[12px]", s.lang === l ? "text-accent" : "text-on-dark-muted hover:text-on-dark")}
          >
            {l === "en" ? "ENG" : "ESP"}
          </button>
        </span>
      ))}
    </div>
  );
}

/** The midnight header: the brand pill, the step name (never a number), language and region. */
export function Header() {
  const { s, dispatch, t } = useStore();
  const visible = useVisibleStages();
  const current = STAGE_NAMES[s.stage];
  const idx = Math.max(0, visible.indexOf(current));
  return (
    <header className="on-dark sticky top-0 z-40 border-b border-navy-line bg-surface text-on-dark [@media(max-height:500px)]:static">
      <div className="mx-auto flex h-16 max-w-5xl items-center gap-2 px-4 sm:gap-3 sm:px-6">
        {s.stage > 0 ? (
          <button
            type="button"
            onClick={() => dispatch({ type: "back" })}
            className="press -ml-2 inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full px-2 text-sm font-semibold text-on-dark hover:bg-surface2"
          >
            <ArrowLeft aria-hidden className="size-4" />
            <span className="max-sm:sr-only">{t("back")}</span>
          </button>
        ) : null}
        <a href="#section-intent" aria-label={t("brand")} className="flex min-h-11 items-center rounded-full">
          <Wordmark compact />
        </a>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-3">
          {s.stage > 0 && <p className="caps hidden text-[12px] text-accent md:block">{t(STAGE_LABEL[current])}</p>}
          <LangSwitch />
          <span className="caps hidden rounded-full px-2 text-[12px] text-on-dark-muted sm:inline-block">{t("usOnly")}</span>
        </div>
      </div>
      {/* Progress: one segment per step that applies */}
      <div className="flex gap-0.5 bg-surface" aria-hidden>
        {visible.map((n, i) => (
          <span key={n} className={clsx("h-1 flex-1 transition-colors", i <= idx ? "bg-primary" : "bg-line")} />
        ))}
      </div>
      <ContextBar />
    </header>
  );
}

/** Once the visitor has told us something: name, address and type, services. */
function ContextBar() {
  const { s, t, dispatch } = useStore();
  const chosen = SERVICE_ORDER.filter((x) => s.services.includes(x));
  if (s.stage < 1 || !chosen.length) return null;
  const first = cleanText(s.name).split(" ")[0];
  const item = "inline-flex shrink-0 items-center gap-1.5 text-sm text-on-dark";
  return (
    <div className="border-t border-navy-line bg-navy">
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-1.5 sm:px-6">
        {/* relative: screen-reader-only labels are absolutely positioned and must be clipped here too */}
        <ul className="relative flex min-w-0 flex-1 items-center gap-4 overflow-hidden">
          {nameOk(s.name) && (
            <li className="inline-flex min-w-0 shrink items-center gap-1.5 text-sm text-on-dark max-xl:hidden">
              <User aria-hidden className="size-4 text-accent" />
              <span className="max-w-[9rem] truncate [overflow-wrap:normal]">{first}</span>
            </li>
          )}
          {s.address && (
            <li className="inline-flex min-w-0 items-center gap-1.5 overflow-hidden text-sm text-on-dark">
              <MapPin aria-hidden className="size-4 shrink-0 text-accent" />
              <span className="min-w-0 max-w-[16rem] truncate [overflow-wrap:normal]">{s.address.line1}</span>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-surface px-2 py-0.5 text-xs font-semibold text-on-dark-muted ring-1 ring-navy-line">
                {s.address.type === "business" ? <Building2 aria-hidden className="size-3" /> : <Home aria-hidden className="size-3" />}
                <span className="max-lg:sr-only">{t(s.address.type === "business" ? "businessAddress" : "homeAddress")}</span>
              </span>
            </li>
          )}
          <li className={item}>
            <span aria-hidden className="flex gap-0.5">
              {chosen.map((x) => {
                const Icon = SERVICE_ICON[x];
                return (
                  <span key={x} className="flex size-5 items-center justify-center rounded-full" style={{ background: service[x].vivid, color: service[x].on }}>
                    <Icon className="size-3" strokeWidth={2.5} />
                  </span>
                );
              })}
            </span>
            <span className="max-md:sr-only">{chosen.map((x) => t(`svc_${x}`)).join(" + ")}</span>
          </li>
        </ul>
        <button
          type="button"
          onClick={() => dispatch({ type: "patch", patch: { modal: { kind: "callback", planId: null } } })}
          className="hidden min-h-11 shrink-0 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-accent hover:bg-surface2 md:inline-flex"
        >
          <PhoneCall aria-hidden className="size-4" />
          {t("scheduleCallback")}
        </button>
        <StartOver />
      </div>
    </div>
  );
}

/** "Start a new search" asks first (official "Start Over" / "Cancel"), so a stray tap can't wipe the visit. */
function StartOver() {
  const { t, dispatch } = useStore();
  const [asking, setAsking] = useState(false);
  const confirmRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (asking) confirmRef.current?.focus();
  }, [asking]);
  if (asking)
    return (
      <div className="flex shrink-0 items-center gap-1" role="group" aria-label={t("startOver")}>
        <button
          ref={confirmRef}
          type="button"
          onClick={() => {
            setAsking(false);
            dispatch({ type: "reset" });
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="inline-flex min-h-11 items-center rounded-full bg-primary px-3.5 text-sm font-bold text-ink"
        >
          {t("startOverConfirm")}
        </button>
        <button type="button" onClick={() => setAsking(false)} className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-semibold text-on-dark hover:bg-surface2">
          {t("startOverCancel")}
        </button>
      </div>
    );
  return (
    <button
      type="button"
      onClick={() => setAsking(true)}
      className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-1.5 rounded-full px-3 text-sm font-semibold text-on-dark-muted hover:bg-surface2 hover:text-on-dark"
    >
      <RotateCcw aria-hidden className="size-4" />
      <span className="max-sm:sr-only">{t("startOver")}</span>
    </button>
  );
}

export function Footer() {
  const { s, t } = useStore();
  return (
    <footer className="on-dark bg-ink text-white">
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.2fr_2fr]">
          <div>
            <Wordmark />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-on-dark-muted">{t("disclaimer")}</p>
          </div>
          <nav aria-label={t("footerNav")} className="grid gap-8 sm:grid-cols-3">
            {FOOTER_LINKS.map((g) => (
              <div key={g.group}>
                <h2 className="caps text-[12px] text-primary">{t(g.group)}</h2>
                <ul className="mt-3 space-y-0.5">
                  {g.links.map((l) => (
                    <li key={l.slug}>
                      <a href={siteUrl(l.slug, s.lang)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-sm text-white hover:text-primary">
                        {t(l.key)}
                        <span className="sr-only"> {t("newTab")}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <p className="mt-10 border-t border-white/15 pt-6 text-sm text-on-dark-muted">© {new Date().getFullYear()} Assured Saving</p>
      </div>
    </footer>
  );
}
