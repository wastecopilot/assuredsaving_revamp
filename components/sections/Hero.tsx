"use client";
import { useState } from "react";
import { AlertCircle, ArrowRight, Check, Info, Plus, Sparkles } from "lucide-react";
import clsx from "clsx";
import { BUNDLE_PRESETS, PRICE_DISCLAIMER, SERVICE_ORDER, type ServiceId } from "@/data/catalog";
import { presetFor } from "@/lib/presets";
import { STAGE, useStore } from "@/lib/store";
import { service } from "@/lib/tokens";
import { Button, SERVICE_ICON } from "../ui";
import { TrustStrip } from "./Shell";

export function Hero() {
  const { s, dispatch, t, goNext } = useStore();
  const [tried, setTried] = useState(false);
  const active = presetFor(s.services);

  const go = () => {
    if (!s.services.length) {
      setTried(true);
      window.setTimeout(() => document.getElementById("pick-err")?.focus(), 20);
      return;
    }
    setTried(false);
    goNext(STAGE.intent);
  };

  return (
    <section id="section-intent" aria-labelledby="hero-h" className="relative mx-auto max-w-5xl scroll-mt-24 px-4 pb-6 pt-10 text-center sm:px-6 sm:pt-16">
      {/* Wordmark */}
      <p
        className="rise inline-flex items-center gap-2 font-display text-2xl leading-none text-ink sm:text-3xl"
      >
        <span className="font-semibold">{t("brandFirst")}</span>
        <span className="font-extrabold text-brand">{t("brandSecond")}</span>
        <Sparkles aria-hidden className="size-6 text-phone-text" strokeWidth={2.4} />
      </p>
      <h1 id="hero-h" tabIndex={-1} className="mx-auto mt-4 max-w-3xl font-display text-[2.6rem] font-extrabold leading-[1] text-ink outline-none sm:text-7xl">
        {t("heroTitleA")} <span className="text-brand">{t("heroTitleB")}</span>
      </h1>
      <p className="mt-5 text-sm font-extrabold uppercase tracking-[0.16em] text-ink">{t("heroSubtitle")}</p>
      <p className="mx-auto mt-2 max-w-xl text-base text-muted sm:text-lg">{t("heroInstruction")}</p>

      {/* Single services */}
      <div className="mt-8 text-left">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-extrabold uppercase tracking-[0.16em] text-ink">{t("singles")}</h2>
          <p className="text-sm font-semibold text-muted" aria-live="polite">
            {s.services.length > 0 && t("selected", { n: s.services.length })}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-6 sm:gap-4 lg:grid-cols-5">
          {SERVICE_ORDER.map((id, i) => (
            <ServiceTile key={id} id={id} wide={i >= 3} last={i === 4} on={s.services.includes(id)} onToggle={() => dispatch({ type: "toggleService", s: id })} />
          ))}
        </div>
        {tried && !s.services.length && (
          <p id="pick-err" tabIndex={-1} role="alert" className="mt-4 flex items-center gap-2 rounded-md bg-danger-soft px-4 py-3 text-sm font-semibold text-danger outline-none">
            <AlertCircle aria-hidden className="size-5" />
            {t("pickService")}
          </p>
        )}
      </div>

      {/* Bundles */}
      <div className="mt-8 text-left">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-xs font-extrabold uppercase tracking-[0.16em] text-ink">{t("bundles")}</h2>
          {active && (
            <span className="pop inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-white">
              <Sparkles aria-hidden className="size-3.5" />
              {t("bundleMode")}
            </span>
          )}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {BUNDLE_PRESETS.map((b) => (
            <BundleChip
              key={b.id}
              services={b.services}
              label={t(`preset_${b.id.replaceAll("-", "_")}` as "preset_quad")}
              on={active?.id === b.id}
              onPick={() => dispatch({ type: "setServices", s: active?.id === b.id ? [] : b.services })}
            />
          ))}
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-md">
        <Button size="lg" block onClick={go} iconRight={<ArrowRight aria-hidden className="size-5" strokeWidth={2.6} />}>
          {t("continue")}
        </Button>
      </div>
      <div className="mt-8">
        <TrustStrip />
      </div>
      <p className="mx-auto mt-6 flex max-w-2xl items-start gap-2 text-left text-xs leading-relaxed text-muted">
        <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
        <span>
          <span className="sr-only">{t("disclaimerTitle")}: </span>
          {PRICE_DISCLAIMER[s.lang]}
        </span>
      </p>
    </section>
  );
}

function ServiceTile({ id, on, onToggle, wide, last }: { id: ServiceId; on: boolean; onToggle: () => void; wide: boolean; last: boolean }) {
  const { t } = useStore();
  const Icon = SERVICE_ICON[id];
  const c = service[id];
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onToggle}
      className={clsx(
        "tile-pop relative flex min-h-[140px] w-full flex-col items-start justify-between gap-4 overflow-hidden rounded-lg border-2 p-4 text-left transition-[box-shadow,border-color,background-color] duration-200 sm:min-h-[168px] sm:p-5 lg:col-span-1",
        wide ? "sm:col-span-3" : "sm:col-span-2",
        last && "col-span-2",
        !on && "border-line bg-surface hover:border-line-strong hover:shadow-sm",
      )}
      style={on ? { borderColor: c.vivid, background: c.soft, boxShadow: `0 18px 36px -16px ${c.vivid}` } : undefined}
    >
      <span className="flex size-14 items-center justify-center rounded-md transition-colors" style={{ background: on ? c.vivid : c.soft, color: on ? c.on : c.text }}>
        <Icon aria-hidden className="size-7" strokeWidth={2.4} />
      </span>
      <span>
        <span className="block font-display text-xl font-extrabold text-ink">{t(`svc_${id}`)}</span>
        <span className="mt-0.5 block text-sm text-muted">{t(`svcDesc_${id}`)}</span>
      </span>
      <span
        aria-hidden
        className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-full border-2 transition-all"
        style={on ? { background: c.vivid, borderColor: c.vivid, color: c.on } : { borderColor: "var(--line-strong)" }}
      >
        {on && <Check className="size-4" strokeWidth={3.5} />}
      </span>
    </button>
  );
}

function BundleChip({ services, label, on, onPick }: { services: ServiceId[]; label: string; on: boolean; onPick: () => void }) {
  const ring = `linear-gradient(115deg, ${services.map((x) => service[x].vivid).join(", ")})`;
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onPick}
      className={clsx("tile-pop rounded-lg p-[3px] text-left transition-shadow", on ? "shadow-glow" : "hover:shadow-sm")}
      style={{ background: on ? ring : `linear-gradient(rgb(255 255 255 / 0.6), rgb(255 255 255 / 0.6)), ${ring}` }}
    >
      <span className={clsx("flex min-h-[72px] items-center gap-3 rounded-[21px] px-4 py-3", on ? "bg-surface/92" : "bg-surface")}>
        <span aria-hidden className="flex shrink-0 items-center">
          {services.map((x, i) => {
            const Icon = SERVICE_ICON[x];
            return (
              <span key={x} className="flex items-center">
                {i > 0 && <Plus className="mx-0.5 size-3 text-muted" strokeWidth={3} />}
                <span className="flex size-8 items-center justify-center rounded-full" style={{ background: service[x].vivid, color: service[x].on }}>
                  <Icon className="size-4" strokeWidth={2.6} />
                </span>
              </span>
            );
          })}
        </span>
        <span className="min-w-0 flex-1 font-display text-base font-extrabold leading-tight text-ink">{label}</span>
        <span aria-hidden className={clsx("flex size-7 shrink-0 items-center justify-center rounded-full border-2", on ? "border-ink bg-ink text-white" : "border-line-strong")}>
          {on && <Check className="size-4" strokeWidth={3.5} />}
        </span>
      </span>
    </button>
  );
}
