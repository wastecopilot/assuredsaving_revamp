"use client";
import { useRef, useState } from "react";
import { AlertCircle, ArrowRight, Check, Eye, MonitorPlay, ShieldCheck, Wifi, Zap } from "lucide-react";
import clsx from "clsx";
import { BUNDLE_PRESETS, SERVICE_ORDER, type SampleAddress, type ServiceId } from "@/data/catalog";
import { presetFor } from "@/lib/presets";
import { businessAllows } from "@/lib/selection";
import { STAGE, useStore } from "@/lib/store";
import { service } from "@/lib/tokens";
import { Button, SERVICE_ICON } from "../ui";
import { AddressSearch, type AddressSearchHandle } from "./AddressSearch";
import { Sparkle } from "./Shell";

/**
 * Step 1, laid out like the official home page: headline, the five services,
 * "Search USA address" and "Check Availability". Selection rules: lib/selection.ts.
 */
export function Hero() {
  const { s, dispatch, t, goNext } = useStore();
  const [tried, setTried] = useState(false);
  const [panelPing, setPanelPing] = useState(0);
  const addr = useRef<AddressSearchHandle>(null);
  const panel = useRef<HTMLDivElement>(null);
  const servicesHead = useRef<HTMLHeadingElement>(null);
  const active = presetFor(s.services);
  const needsBusinessChoice = !!s.address && s.address.type === "business" && s.services.length > 0 && !businessAllows(s.services);
  const noService = !s.services.length;
  // The official headline is about Internet; without Internet, use the official intent headline
  const internetHeadline = noService || s.services.includes("internet");

  /** Changing services or address after moving on returns to step 1; earlier answers are kept. */
  const collapse = () => dispatch({ type: "patch", patch: { stage: STAGE.intent, scanDone: false } });

  const toggle = (id: ServiceId) => {
    dispatch({ type: "toggleService", s: id });
    if (s.stage > STAGE.intent) collapse();
  };
  const choose = (a: SampleAddress) => {
    // Usage tiles differ for home and business, so only reset them when the type changes
    dispatch({ type: "patch", patch: { address: a, addressType: a.type, ...(a.type !== s.addressType ? { usage: [] } : {}) } });
    if (s.stage > STAGE.intent) collapse();
  };
  const clear = () => dispatch({ type: "patch", patch: { address: null, stage: STAGE.intent, scanDone: false } });

  const check = () => {
    if (noService) {
      setTried(true);
      servicesHead.current?.scrollIntoView({ block: "center", behavior: "smooth" });
      window.setTimeout(() => document.getElementById("hero-err")?.focus(), 20);
      return;
    }
    if (!s.address) {
      setTried(true);
      addr.current?.focus();
      return;
    }
    if (needsBusinessChoice) {
      setPanelPing((n) => n + 1);
      window.setTimeout(() => {
        panel.current?.scrollIntoView({ block: "center", behavior: "smooth" });
        panel.current?.focus();
      }, 20);
      return;
    }
    setTried(false);
    goNext(STAGE.intent);
  };
  const chooseBusiness = (services: ServiceId[]) => {
    dispatch({ type: "setServices", s: services });
    setTried(false);
    goNext(STAGE.intent, { services });
  };

  return (
    <section id="section-intent" aria-labelledby="hero-h" className="on-dark scroll-mt-28 bg-navy text-white">
      <div className="mx-auto max-w-5xl px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-14">
        {/* The brand type contrast: a light line, then a black line in sunflower with the sparkle */}
        <h1 id="hero-h" tabIndex={-1} className="rise outline-none">
          <span className="block text-[2.25rem] font-light leading-[1.05] tracking-[-0.03em] text-white sm:text-[3.75rem]">{internetHeadline ? t("heroTitle") : t("intentTitle1")}</span>{" "}
          <span className="relative inline-flex items-start gap-2 text-[2.75rem] font-black leading-[1] tracking-[-0.045em] text-primary sm:text-[4.75rem]">
            {internetHeadline ? t("heroTitleHighlight") : t("intentTitle2")}
            <Sparkle className="mt-1 size-7 shrink-0 text-accent sm:mt-2 sm:size-10" />
          </span>
        </h1>
        <p className="rise mt-4 max-w-2xl sm:mt-6">
          <strong className="caps block text-[13px] tracking-[0.18em] text-accent sm:text-[14px]">{t("smartMatch")}</strong>
          <span className="mt-2 block text-base text-on-dark-muted max-sm:hidden sm:text-lg">{t("heroDescription")}</span>
        </p>

        {/* Services */}
        <div className="mt-8 sm:mt-12">
          <h2 ref={servicesHead} className="caps text-[13px] tracking-[0.16em] text-white">
            {t("serviceLabel")}
          </h2>
          <p className="mt-1 text-sm text-on-dark-muted max-sm:hidden">{t("multiSelectHint")}</p>
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
                  className={clsx("press inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-3.5 text-sm font-semibold ring-1", on ? "bg-white text-ink ring-white" : "text-white ring-navy-line hover:ring-on-dark-muted")}
                >
                  <span aria-hidden className="flex -space-x-1">
                    {b.services.map((x) => (
                      <span key={x} className={clsx("size-3 rounded-full ring-2", on ? "ring-white" : "ring-navy")} style={{ background: service[x].vivid }} />
                    ))}
                  </span>
                  {t(`preset_${b.id.replaceAll("-", "_")}` as "preset_quad")}
                </button>
              );
            })}
          </div>
          {tried && noService && (
            <p id="hero-err" tabIndex={-1} role="alert" className="mt-3 flex items-center gap-2 w-fit rounded-full bg-white px-3 py-1 text-sm font-bold text-danger outline-none">
              <AlertCircle aria-hidden className="size-4 shrink-0" />
              {t("pickServiceHint")}
            </p>
          )}
        </div>

        {/* Address + Check Availability */}
        <div className="mt-8 sm:mt-10">
          <AddressSearch
            ref={addr}
            onChoose={choose}
            onClear={clear}
            onSubmit={check}
            invalid={tried && !s.address && !noService}
            action={
              <Button size="lg" variant={needsBusinessChoice ? "secondary" : "primary"} onClick={check} className="min-h-14 shrink-0 rounded-full px-7 text-[17px]" iconRight={<ArrowRight aria-hidden className="size-5" />}>
                {t("checkAvailability")}
              </Button>
            }
          />
          {needsBusinessChoice && (
            <div
              ref={panel}
              key={panelPing}
              tabIndex={-1}
              role={panelPing ? "alert" : "group"}
              aria-label={t("businessOnlyTitle")}
              className="mt-4 rounded-lg border-l-4 border-primary bg-navy2 p-4 text-white outline-none ring-1 ring-navy-line focus-visible:ring-2 focus-visible:ring-accent"
            >
              <p className="caps text-[13px] tracking-[0.14em] text-accent">{t("businessOnlyTitle")}</p>
              <p className="mt-1.5 text-sm text-on-dark-muted">{t("businessOnlyBody")}</p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <Button onClick={() => chooseBusiness(["internet"])} iconLeft={<Wifi aria-hidden className="size-4" />}>
                  {t("businessOptionInternet")}
                </Button>
                <Button onClick={() => chooseBusiness(["internet", "tv"])} iconLeft={<MonitorPlay aria-hidden className="size-4" />}>
                  {t("businessOptionBundle")}
                </Button>
              </div>
            </div>
          )}
        </div>

        <ul className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-navy-line pt-6 sm:mt-12">
          {[
            { icon: ShieldCheck, label: t("trust") },
            { icon: Eye, label: t("transparency") },
            { icon: Zap, label: t("speed") },
          ].map((i, n) => (
            <li key={i.label} className="caps inline-flex items-center gap-2 text-[12px] tracking-[0.2em] text-on-dark-muted">
              {n > 0 && <span aria-hidden className="mr-3 hidden size-1 rounded-full bg-navy-line sm:block" />}
              <i.icon aria-hidden className="size-4 text-accent" />
              {i.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** A service tile on the navy stage: the official colour as an icon square; filled with it when selected. */
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
        "press relative flex min-h-14 items-center gap-2.5 rounded-lg px-3 text-left ring-1 sm:min-h-[112px] sm:flex-col sm:items-start sm:justify-between sm:p-3.5",
        id === "security" && "max-sm:col-span-2",
        !on && "bg-navy2 ring-navy-line hover:ring-on-dark-muted",
      )}
      style={on ? { background: c.vivid, color: c.on, boxShadow: `0 0 0 1px ${c.vivid}` } : undefined}
    >
      <span className="flex shrink-0 items-center justify-between gap-2 sm:w-full sm:items-start">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md sm:size-9" style={on ? { background: "#1A1033", color: c.vivid } : { background: c.vivid, color: c.on }}>
          <Icon aria-hidden className="size-[18px]" strokeWidth={2.25} />
        </span>
        <span aria-hidden className={clsx("hidden size-5 items-center justify-center rounded-full sm:flex", on ? "bg-ink text-white" : "ring-1 ring-on-dark-muted")}>
          {on && <Check className="size-3.5" strokeWidth={3} />}
        </span>
      </span>
      <span className={clsx("caps min-w-0 flex-1 text-[12px] tracking-[0.12em] [overflow-wrap:normal] sm:flex-none", on ? "text-ink" : "text-white")}>{t(`svc_${id}`)}</span>
      {on && <Check aria-hidden className="size-4 shrink-0 sm:hidden" strokeWidth={3} />}
    </button>
  );
}
