"use client";
import { ArrowRight, Briefcase, Check, CircleCheck, CloudUpload, Gamepad2, Globe, Laptop, MonitorPlay, Smartphone, User, Video, Wifi, WifiOff } from "lucide-react";
import clsx from "clsx";
import { DEVICES, GENRES, PACKS, USAGE } from "@/data/catalog";
import { cleanText, nameOk } from "@/lib/schedule";
import { STAGE, nextStage, useStore, type State } from "@/lib/store";
import { Button, Chip, Slider, fieldClass } from "../ui";
import { Heading, Section } from "./Section";

/* ================================== Name ================================== */
/** The official "Please enter your full name." step (after the address, as on the official home page). */
export function NameSection() {
  const { s, dispatch, t, goNext } = useStore();
  const valid = nameOk(s.name);
  return (
    <Section stage="address">
      <Heading id="section-address-h" a={t("nameTitle")} />
      <div className="max-w-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (valid) goNext(STAGE.address);
          }}
        >
          <label htmlFor="full-name" className="mb-1.5 block text-sm font-semibold text-ink">
            {t("namePlaceholder")}
          </label>
          <div className="relative">
            <User aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted" />
            <input
              id="full-name"
              autoComplete="name"
              autoCapitalize="words"
              autoCorrect="off"
              spellCheck={false}
              maxLength={80}
              value={s.name}
              onChange={(e) => dispatch({ type: "patch", patch: { name: e.target.value } })}
              className={clsx(fieldClass, "border-ink pl-11 pr-11")}
            />
            {valid && <CircleCheck aria-hidden className="absolute right-3.5 top-1/2 size-5 -translate-y-1/2 text-success" />}
          </div>
          {valid && <p className="mt-3 text-sm font-semibold text-ink">{t("welcome", { name: cleanText(s.name).split(" ")[0] })}</p>}
          {s.stage === STAGE.address && (
            <Button type="submit" size="lg" disabled={!valid} className="mt-6 w-full sm:w-auto sm:min-w-44" iconRight={<ArrowRight aria-hidden className="size-5" />}>
              {t("continue")}
            </Button>
          )}
        </form>
      </div>
    </Section>
  );
}

/* ================================== Usage ================================== */
const USAGE_ICON: Record<string, typeof Briefcase> = { office: Briefcase, streaming: Video, data: CloudUpload, basic: Globe, casual: Smartphone, remote: Laptop, "4k": MonitorPlay, gaming: Gamepad2 };

export function UsageSection() {
  const { s, dispatch, t, goNext } = useStore();
  const toTv = nextStage(s, STAGE.usage) === STAGE.tv;
  const ready = s.usage.length > 0;
  return (
    <Section stage="usage" tone="warm">
      <Heading id="section-usage-h" a={t("usageTitle")} b={t("usageTitleHighlight")} after="?" sub={t("selectAll")} />
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {USAGE[s.addressType].map((u) => {
          const on = s.usage.includes(u.id);
          const Icon = USAGE_ICON[u.id] ?? Globe;
          return (
            <button
              key={u.id}
              type="button"
              aria-pressed={on}
              aria-describedby={`use-${u.id}-d`}
              onClick={() => dispatch({ type: "patch", patch: { usage: on ? s.usage.filter((x) => x !== u.id) : [...s.usage, u.id] } })}
              className={clsx("press relative flex min-h-28 flex-col items-start gap-1.5 rounded-md border p-4 text-left", on ? "border-ink bg-surface ring-1 ring-ink" : "border-line-strong bg-surface hover:border-ink")}
            >
              <span aria-hidden className="flex size-10 items-center justify-center rounded-md bg-primary-soft text-ink">
                <Icon className="size-5" />
              </span>
              <span className="mt-2 font-semibold leading-tight text-ink">{t(u.title)}</span>
              <span id={`use-${u.id}-d`} className="text-sm text-muted">
                <span className="sr-only">, </span>
                {t(u.desc)}
              </span>
              <span aria-hidden className={clsx("absolute right-3 top-3 flex size-5 items-center justify-center rounded-sm border", on ? "border-ink bg-ink text-white" : "border-line-strong")}>
                {on && <Check className="size-3.5" strokeWidth={3} />}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-6 rounded-md border border-line-strong bg-surface p-5">
        <Slider
          label={t("devices")}
          min={DEVICES.min}
          max={DEVICES.max}
          value={s.devices}
          onChange={(v) => dispatch({ type: "patch", patch: { devices: v } })}
          display={s.devices >= DEVICES.max ? t("hundredPlus") : String(s.devices)}
          minLabel={String(DEVICES.min)}
          maxLabel={t("hundredPlus")}
        />
      </div>
      {s.stage === STAGE.usage && (
      <div className="mt-6">
        <Button size="lg" disabled={!ready} onClick={() => goNext(STAGE.usage)} iconRight={ready ? <ArrowRight aria-hidden className="size-5" /> : undefined} className="w-full sm:w-auto sm:min-w-56">
          {!ready ? t("usageCtaWaiting") : toTv ? t("usageCtaTv") : t("usageCta")}
        </Button>
      </div>
      )}
    </Section>
  );
}

/* ================================= TV needs ================================= */
function Group({ id, title, hint, children }: { id: string; title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="border-t border-line py-6 first:border-t-0 first:pt-0">
      <h3 id={id} className="text-base font-semibold text-ink">
        {title}
      </h3>
      {hint && <p className="mt-0.5 text-sm text-muted">{hint}</p>}
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function TvSection() {
  const { s, dispatch, t, goNext } = useStore();
  const set = (patch: Partial<State>) => dispatch({ type: "patch", patch });
  const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const bundle = s.services.includes("internet");
  const ready = s.hasInternet !== null;
  const nonSmart = s.tvs - Math.min(s.smartTvs, s.tvs);
  return (
    <Section stage="tv">
      <Heading id="section-tv-h" a={t("tvTitlePrefix")} b={t(bundle ? "tvTitleBundle" : "tvTitleTv")} sub={t("tvSubtitle")} />
      <div>
        <Group id="g-watch" title={t("watchMost")}>
          <div role="group" aria-labelledby="g-watch" className="flex flex-wrap gap-2">
            {GENRES.map((g) => (
              <Chip key={g.id} selected={s.genres.includes(g.id)} onClick={() => set({ genres: toggle(s.genres, g.id) })}>
                {t(g.label)}
              </Chip>
            ))}
          </div>
        </Group>
        <Group id="g-intl" title={t("international")} hint={t("internationalHint")}>
          <div role="group" aria-labelledby="g-intl" className="flex flex-wrap gap-2">
            {PACKS.map((g) => (
              <Chip key={g.id} selected={s.intl.includes(g.id)} onClick={() => set({ intl: toggle(s.intl, g.id) })}>
                {t(g.label)}
              </Chip>
            ))}
          </div>
        </Group>
        <Group id="g-tvs" title={t("yourTvs")}>
          <div className="grid gap-6 sm:grid-cols-2">
            <Slider label={t("howManyTvs")} min={1} max={10} value={s.tvs} onChange={(v) => set({ tvs: v, smartTvs: Math.min(s.smartTvs, v) })} minLabel="1" maxLabel="10" />
            <Slider label={t("howManySmart")} min={0} max={s.tvs} value={Math.min(s.smartTvs, s.tvs)} onChange={(v) => set({ smartTvs: v })} minLabel="0" maxLabel={String(s.tvs)} />
          </div>
          {nonSmart > 0 && <p className="mt-3 text-sm text-muted">{t(nonSmart === 1 ? "nonSmartOne" : "nonSmartMany", { n: nonSmart })}</p>}
        </Group>
        <Group id="g-net" title={t(bundle ? "haveInternetBundle" : "haveInternet")} hint={bundle ? t("bundleInternetNote") : undefined}>
          <div role="radiogroup" aria-labelledby="g-net" className="grid grid-cols-2 gap-2 sm:max-w-sm">
            {[true, false].map((v) => {
              const on = s.hasInternet === v;
              const Icon = v ? Wifi : WifiOff;
              return (
                <button
                  key={String(v)}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => set({ hasInternet: v })}
                  className={clsx("press flex min-h-12 items-center justify-center gap-2 rounded-md border text-base font-semibold", on ? "border-ink bg-ink text-white" : "border-line-strong text-ink hover:border-ink")}
                >
                  <Icon aria-hidden className="size-5" />
                  {t(v ? "yes" : "no")}
                </button>
              );
            })}
          </div>
        </Group>
        {s.stage === STAGE.tv && (
        <div className="pt-2">
          <Button size="lg" disabled={!ready} onClick={() => goNext(STAGE.tv)} iconRight={ready ? <ArrowRight aria-hidden className="size-5" /> : undefined} className="w-full sm:w-auto sm:min-w-56">
            {!ready ? t("answerToContinue") : t(bundle ? "ctaBundle" : "ctaTv")}
          </Button>
        </div>
        )}
      </div>
    </Section>
  );
}
