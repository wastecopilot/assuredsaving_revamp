"use client";
import { ArrowRight, Check, PhoneCall, Sparkles, Tag, Zap } from "lucide-react";
import clsx from "clsx";
import type { Plan } from "@/data/sample";
import { allInAfter, allInNow, isPriced, money, planReasons, speedText, techLabel, type Label } from "@/lib/plans";
import type { Key } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { service } from "@/lib/tokens";

/** Earned labels: flat colour, official wording. */
export const LABEL_STYLE: Record<Label, { bg: string; fg: string; icon: typeof Tag; key: Key }> = {
  mostAffordable: { bg: service.security.vivid, fg: service.security.on, icon: Tag, key: "label_mostAffordable" },
  bestValue: { bg: "#FF5A1F", fg: "#141414", icon: Sparkles, key: "label_bestValue" },
  fastest: { bg: service.internet.vivid, fg: service.internet.on, icon: Zap, key: "label_fastest" },
};

/**
 * One plan as a comparison row: who and what | the facts | the price | actions.
 * Stacks on phones. The top pick gets an orange bar and the official "Our Top Pick".
 */
export function PlanCard({ plan, rank, labels, top, featured }: { plan: Plan; rank: number; labels: Label[]; top?: Plan; featured?: boolean }) {
  const { s, t, dispatch } = useStore();
  const lang = s.lang;
  const speed = speedText(plan, lang);
  const open = (kind: "details" | "callback") => dispatch({ type: "patch", patch: { modal: { kind, planId: plan.id } } });
  const reasons = planReasons(plan, top, lang);
  const biz = s.addressType === "business";
  const promo = isPriced(plan) && plan.pricing.promo;

  return (
    <article data-plan-card aria-labelledby={`p-${plan.id}`} className={clsx("relative rounded-md border bg-surface", featured ? "border-ink" : "border-line-strong")}>
      {featured && <span aria-hidden className="absolute inset-y-0 left-0 w-1.5 rounded-l-md bg-primary" />}
      <div className="grid gap-5 p-5 sm:p-6 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,0.9fr)_auto] md:items-start md:gap-6">
        {/* Who and what */}
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-semibold text-muted tabular">#{rank}</span>
            {featured && <span className="font-semibold text-ink">{t("ourTopPick")}</span>}
            {labels.map((l) => {
              const st = LABEL_STYLE[l];
              return (
                <span key={l} className="inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-xs font-semibold" style={{ background: st.bg, color: st.fg }}>
                  <st.icon aria-hidden className="size-3.5" />
                  {t(st.key)}
                </span>
              );
            })}
          </p>
          <p className="mt-2 text-xl font-bold text-ink">{plan.provider}</p>
          <h3 id={`p-${plan.id}`} className="text-sm text-muted">
            {plan.name}
          </h3>
          {reasons.length > 0 && (
            <ul className="mt-3 space-y-1 text-sm">
              {reasons.slice(0, 2).map((r) => (
                <li key={r} className="flex gap-2 text-muted">
                  <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-success" />
                  {r}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Facts */}
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm md:grid-cols-1">
          <div>
            <dt className="text-muted">{t("technology")}</dt>
            <dd className="font-semibold text-ink">{techLabel(plan, lang)}</dd>
          </div>
          {speed && (
            <div>
              <dt className="text-muted">{t("downloadSpeed")}</dt>
              <dd className="font-semibold text-ink tabular">{speed}</dd>
            </div>
          )}
          <div>
            <dt className="text-muted">{t("contractTerm")}</dt>
            <dd className="font-semibold text-ink">{plan.contractMonths ? t("contractMonths", { n: plan.contractMonths }) : t("noContract")}</dd>
          </div>
        </dl>

        {/* Price */}
        <div className="md:text-right">
          {isPriced(plan) ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">{t("monthly")}</p>
              <p className="mt-1 whitespace-nowrap">
                <span className="text-[2rem] font-bold leading-none text-ink tabular">{money(allInNow(plan))}</span>
                <span className="text-sm font-semibold text-muted">{t("perMo")}</span>
              </p>
              {promo && (
                <p className="mt-1 text-sm text-muted tabular">
                  {t("reg")} {money(allInAfter(plan))}
                  {t("perMo")}
                </p>
              )}
            </>
          ) : (
            <p className="text-lg font-bold text-ink">{t(biz ? "callForPricingBusinessCta" : "callForPricing")}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 sm:flex-row md:w-44 md:flex-col">
          <button
            type="button"
            onClick={() => open("callback")}
            className="press inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-on-primary hover:bg-primary-strong"
          >
            {isPriced(plan) ? t("getStarted") : t("callForPricingCta")}
            {isPriced(plan) ? <ArrowRight aria-hidden className="size-4" /> : <PhoneCall aria-hidden className="size-4" />}
            <span className="sr-only">
              : {plan.provider} {plan.name}
            </span>
          </button>
          <button type="button" onClick={() => open("details")} className="press inline-flex min-h-11 flex-1 items-center justify-center rounded-md border border-ink px-4 text-sm font-semibold text-ink hover:bg-surface2">
            {t("showDetails")}
            <span className="sr-only">
              : {plan.provider} {plan.name}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}
