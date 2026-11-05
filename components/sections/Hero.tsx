"use client";
import { useState } from "react";
import { AlertCircle, ArrowRight, Check, Eye, MonitorPlay, ShieldCheck, Wifi, Zap } from "lucide-react";
import clsx from "clsx";
import { BUNDLE_PRESETS, SERVICE_ORDER, type SampleAddress, type ServiceId } from "@/data/catalog";
import { presetFor } from "@/lib/presets";
import { businessAllows } from "@/lib/selection";
import { STAGE, useStore } from "@/lib/store";
import { service } from "@/lib/tokens";
import { Button, SERVICE_ICON } from "../ui";
import { AddressSearch } from "./AddressSearch";

/**
 * Step 1, laid out like the official home page: headline, the five services,
 * "Search USA address" and "Check Availability". Selection rules: lib/selection.ts.
 */
export function Hero() {
  const { s, dispatch, t, goNext } = useStore();
  const [tried, setTried] = useState(false);
  const active = presetFor(s.services);
  const needsBusinessChoice = !!s.address && s.address.type === "business" && s.services.length > 0 && !businessAllows(s.services);
  const missing = !s.services.length || !s.address;

  /** Changing services or address after moving on sends the visitor back to step 1. */
  const collapse = () => dispatch({ type: "patch", patch: { stage: STAGE.intent, scanDone: false, usage: [] } });

  const toggle = (id: ServiceId) => {
    dispatch({ type: "toggleService", s: id });
    if (s.stage > STAGE.intent) collapse();
  };
  const choose = (a: SampleAddress) => {
    dispatch({ type: "patch", patch: { address: a, addressType: a.type, usage: [] } });
    if (s.stage > STAGE.intent) collapse();
  };
  const clear = () => dispatch({ type: "patch", patch: { address: null, stage: STAGE.intent, scanDone: false, usage: [] } });

  const check = () => {
    if (missing) {
      setTried(true);
      window.setTimeout(() => document.getElementById("hero-err")?.focus(), 20);
      return;
    }
    if (needsBusinessChoice) return;
    setTried(false);
    goNext(STAGE.intent);
  };
  const chooseBusiness = (services: ServiceId[]) => {
    dispatch({ type: "setServices", s: services });
    setTried(false);
    goNext(STAGE.intent, { services });
  };

  return (
    <section id="section-intent" aria-labelledby="hero-h" className="scroll-mt-28 border-b border-line bg-surface">
      <div className="mx-auto max-w-5xl px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-16">
        <p className="rise text-sm font-semibold uppercase tracking-[0.14em] text-muted">{t("brand")}</p>
        <h1 id="hero-h" tabIndex={-1} className="rise mt-3 text-[2.75rem] font-bold leading-[1.02] text-ink outline-none sm:text-[4rem]">
          {t("heroTitle")}{" "}
          <span className="relative inline-block">
            <span className="relative z-10">{t("heroTitleHighlight")}</span>
            <span aria-hidden className="absolute inset-x-0 bottom-[0.08em] z-0 h-[0.28em] bg-primary" />
          </span>
        </h1>
        <p className="rise mt-5 max-w-2xl text-lg text-muted">
          <strong className="font-semibold text-ink">{t("smartMatch")}</strong> {t("heroDescription")}
        </p>

        {/* Services */}
        <div className="mt-10">
          <h2 className="text-base font-semibold text-ink">{t("serviceLabel")}</h2>
          <p className="mt-0.5 text-sm text-muted">{t("multiSelectHint")}</p>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-3">
            {SERVICE_ORDER.map((id) => (
              <ServiceTile key={id} id={id} on={s.services.includes(id)} onToggle={() => toggle(id)} />
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {BUNDLE_PRESETS.map((b) => {
              const on = active?.id === b.id;
              return (
                <button
                  key={b.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    dispatch({ type: "setServices", s: b.services });
                    if (s.stage > STAGE.intent) collapse();
                  }}
                  className={clsx("press inline-flex min-h-11 items-center gap-2 rounded-md border px-3 text-sm font-medium", on ? "border-ink bg-ink text-white" : "border-line-strong text-ink hover:border-ink")}
                >
                  <span aria-hidden className="flex gap-0.5">
                    {b.services.map((x) => (
                      <span key={x} className="size-2 rounded-full" style={{ background: service[x].vivid }} />
                    ))}
                  </span>
                  {t(`preset_${b.id.replaceAll("-", "_")}` as "preset_quad")}
                </button>
              );
            })}
          </div>
        </div>

        {/* Address + Check Availability */}
        <div className="mt-8">
          <AddressSearch
            onChoose={choose}
            onClear={clear}
            invalid={tried && !s.address}
            action={
              <Button size="lg" onClick={check} className="min-h-14 shrink-0 px-7 text-[17px]" iconRight={<ArrowRight aria-hidden className="size-5" />}>
                {t("checkAvailability")}
              </Button>
            }
          />
          {tried && missing && (
            <p id="hero-err" tabIndex={-1} role="alert" className="mt-3 flex items-center gap-2 text-sm font-semibold text-danger outline-none">
              <AlertCircle aria-hidden className="size-4 shrink-0" />
              {t("pickServiceHint")}
            </p>
          )}
          {needsBusinessChoice && (
            <div role="group" aria-label={t("businessOnlyTitle")} className="mt-4 rounded-md border border-ink bg-warning-soft p-4">
              <p className="font-semibold text-ink">{t("businessOnlyTitle")}</p>
              <p className="mt-1 text-sm text-ink">{t("businessOnlyBody")}</p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <Button variant="secondary" onClick={() => chooseBusiness(["internet"])} iconLeft={<Wifi aria-hidden className="size-4" />}>
                  {t("businessOptionInternet")}
                </Button>
                <Button variant="secondary" onClick={() => chooseBusiness(["internet", "tv"])} iconLeft={<MonitorPlay aria-hidden className="size-4" />}>
                  {t("businessOptionBundle")}
                </Button>
              </div>
            </div>
          )}
        </div>

        <ul className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-6 text-sm font-semibold text-ink">
          {[
            { icon: ShieldCheck, label: t("trust") },
            { icon: Eye, label: t("transparency") },
            { icon: Zap, label: t("speed") },
          ].map((i) => (
            <li key={i.label} className="inline-flex items-center gap-2">
              <i.icon aria-hidden className="size-4 text-primary-strong" />
              {i.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** A service tile: white with a coloured top bar, or filled with the service colour when selected. */
function ServiceTile({ id, on, onToggle }: { id: ServiceId; on: boolean; onToggle: () => void }) {
  const { t } = useStore();
  const Icon = SERVICE_ICON[id];
  const c = service[id];
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onToggle}
      className={clsx(
        "press relative flex min-h-[104px] flex-col justify-between rounded-md border border-t-4 p-3.5 text-left",
        id === "security" && "max-sm:col-span-2",
        !on && "bg-surface hover:bg-surface2",
      )}
      style={on ? { background: c.vivid, borderColor: c.vivid, color: c.on } : { borderColor: "var(--line-strong)", borderTopColor: c.vivid }}
    >
      <span className="flex w-full items-start justify-between">
        <Icon aria-hidden className="size-6" style={on ? undefined : { color: c.text }} strokeWidth={2} />
        <span aria-hidden className={clsx("flex size-5 items-center justify-center rounded-sm border", on ? "border-transparent bg-white" : "border-line-strong")} style={on ? { color: "#141414" } : undefined}>
          {on && <Check className="size-3.5" strokeWidth={3} />}
        </span>
      </span>
      <span className={clsx("mt-4 text-base font-semibold", !on && "text-ink")}>{t(`svc_${id}`)}</span>
    </button>
  );
}
