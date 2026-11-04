"use client";
import { ArrowLeft, Eye, ShieldCheck, Zap } from "lucide-react";
import clsx from "clsx";
import { SERVICE_ORDER } from "@/data/catalog";
import { STAGE_NAMES, useStore } from "@/lib/store";
import { color, service } from "@/lib/tokens";

export function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden className="shrink-0">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--grad-from)" />
          <stop offset="1" stopColor="var(--grad-to)" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="10" fill="url(#lg)" />
      <path d="M8.5 22 14.6 8.5h2.8L23.5 22h-3.2l-1.2-3h-6.2l-1.2 3H8.5Zm5.6-5.6h3.8L16 11.8l-1.9 4.6Z" fill="#fff" />
      <circle cx="25" cy="7" r="3" fill="var(--phone)" stroke="#fff" strokeWidth="1.5" />
    </svg>
  );
}

function Flag() {
  return (
    <svg viewBox="0 0 20 14" aria-hidden className="h-3 w-[18px] rounded-[2px]">
      <rect width="20" height="14" fill="#fff" />
      {[0, 2, 4, 6, 8, 10, 12].map((y) => (
        <rect key={y} y={y} width="20" height="1" fill="#E0314B" />
      ))}
      <rect width="9" height="7" fill="#1F6BFF" />
    </svg>
  );
}

export function Header() {
  const { s, dispatch, t } = useStore();
  const visible = STAGE_NAMES.filter((n) => (n === "usage" ? s.services.includes("internet") : n === "tv" ? s.services.includes("tv") : true));
  const current = STAGE_NAMES[s.stage];
  const idx = Math.max(0, visible.indexOf(current));
  const pct = ((idx + 1) / visible.length) * 100;
  const colors = SERVICE_ORDER.filter((x) => s.services.includes(x)).map((x) => service[x].vivid);
  const bar = colors.length > 1 ? `linear-gradient(90deg, ${colors.join(", ")})` : colors[0] ?? `linear-gradient(90deg, ${color.primary}, #1F6BFF)`;
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2.5 sm:gap-3 sm:px-6">
        {s.stage > 0 ? (
          <button
            type="button"
            onClick={() => dispatch({ type: "back" })}
            aria-label={t("backAria")}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full border-2 border-line bg-surface px-3 text-sm font-bold text-ink transition-colors hover:border-primary hover:text-primary"
          >
            <ArrowLeft aria-hidden className="size-4" strokeWidth={2.6} />
            <span className="hidden sm:inline">{t("back")}</span>
          </button>
        ) : (
          <a href="#section-intent" className="flex min-h-11 min-w-11 items-center gap-2 rounded-full" aria-label="Assured Saving">
            <Logo size={34} />
            <span className="hidden font-display text-lg leading-none text-ink sm:inline">
              <span className="font-semibold">Assured</span> <span className="font-extrabold">Saving</span>
            </span>
          </a>
        )}
        <div className="min-w-0 flex-1 px-1">
          <p className="truncate text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted" aria-live="polite">
            <span className="text-primary">{t("step", { n: idx + 1 })}</span> · {t(`stage_${current}`)}
          </p>
          {s.name.trim().length >= 2 && <p className="hidden truncate text-xs font-semibold text-ink sm:block">{s.name}</p>}
        </div>
        <div role="group" aria-label={t("language")} className="flex rounded-full border-2 border-line bg-surface p-0.5">
          {(["en", "es"] as const).map((l) => (
            <button
              key={l}
              type="button"
              lang={l}
              aria-pressed={s.lang === l}
              onClick={() => dispatch({ type: "patch", patch: { lang: l } })}
              className={clsx("min-h-11 min-w-11 rounded-full px-2.5 text-xs font-extrabold transition-colors", s.lang === l ? "bg-ink text-white" : "text-muted hover:text-ink")}
            >
              {l === "en" ? "ENG" : "ESP"}
            </button>
          ))}
        </div>
        <span title={t("usOnlyTitle")} className="hidden items-center gap-1.5 rounded-full border-2 border-line bg-surface px-3 py-2 text-xs font-extrabold uppercase text-ink md:inline-flex">
          <Flag />
          {t("usOnly")}
        </span>
        {s.stage > 0 && (
          <span className="hidden sm:block">
            <Logo size={34} />
          </span>
        )}
      </div>
      <div className="h-1.5 w-full bg-line" role="progressbar" aria-label={t("step", { n: idx + 1 })} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct)}>
        <div className="h-full rounded-r-full transition-[width] duration-500 ease-out" style={{ background: bar, width: `${pct}%` }} />
      </div>
    </header>
  );
}

export function TrustStrip() {
  const { t } = useStore();
  const items = [
    { icon: ShieldCheck, label: t("trust"), c: service.security.text },
    { icon: Eye, label: t("transparency"), c: service.internet.text },
    { icon: Zap, label: t("speed"), c: service.tv.text },
  ];
  return (
    <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
      {items.map((i) => (
        <li key={i.label} className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-ink">
          <i.icon aria-hidden className="size-4" style={{ color: i.c }} strokeWidth={2.6} />
          {i.label}
        </li>
      ))}
    </ul>
  );
}

/** Soft colour glows painted as cheap CSS gradients (no blur layers). */
export function Glows() {
  return <div className="glows" aria-hidden />;
}

