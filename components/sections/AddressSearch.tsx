"use client";
/**
 * "Search USA address" with suggestions (mocked engine, lib/address.ts).
 * Keyboard: arrows move, Enter picks, Escape closes. Picking a suggestion verifies it
 * and detects home or business. Editing a verified address clears it.
 */
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Building2, Check, Home, MapPin, Search } from "lucide-react";
import clsx from "clsx";
import type { SampleAddress } from "@/data/catalog";
import { formatAddress as fmt, getAddressSuggestions } from "@/lib/address";
import { useStore } from "@/lib/store";
import { fieldClass } from "../ui";

export function AddressSearch({ onChoose, onClear, action, invalid }: { onChoose: (a: SampleAddress) => void; onClear: () => void; action?: React.ReactNode; invalid?: boolean }) {
  const { s, t } = useStore();
  const [q, setQ] = useState(s.address ? fmt(s.address) : "");
  const [dismissed, setDismissed] = useState(false);
  const [active, setActive] = useState(-1);
  const listId = useId();
  const wrap = useRef<HTMLDivElement>(null);

  const lastChosen = useRef("");
  // "Start a new search" clears the store: clear the field too (but not while the visitor is editing)
  useEffect(() => {
    if (!s.address && q && q === lastChosen.current) setQ("");
  }, [s.address, q]);

  const verified = !!s.address && fmt(s.address) === q;
  const matches = verified ? [] : getAddressSuggestions(q);
  const open = q.trim().length > 0 && !dismissed && matches.length > 0;
  const noMatch = q.trim().length > 0 && !verified && matches.length === 0;

  useEffect(() => {
    const onDown = (e: MouseEvent) => wrap.current && !wrap.current.contains(e.target as Node) && setDismissed(true);
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const choose = (a: SampleAddress) => {
    const v = fmt(a);
    lastChosen.current = v;
    setQ(v);
    setDismissed(true);
    setActive(-1);
    onChoose(a);
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % matches.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? matches.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(matches[Math.max(active, 0)]);
    } else if (e.key === "Escape") setDismissed(true);
  };
  const tryAgain = () => {
    setQ("");
    setDismissed(false);
    onClear();
    window.setTimeout(() => document.getElementById("addr")?.focus(), 20);
  };

  return (
    <div ref={wrap} className="relative">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted" />
          <input
            id="addr"
            role="combobox"
            aria-label={t("addrSearchLabel")}
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
            aria-invalid={noMatch || invalid || undefined}
            aria-describedby={noMatch ? "addr-err" : undefined}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            maxLength={120}
            placeholder={t("addrPlaceholder")}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setDismissed(false);
              setActive(-1);
              if (s.address) onClear();
            }}
            onFocus={() => setDismissed(false)}
            onKeyDown={onKey}
            className={clsx(fieldClass, "min-h-14 pl-11 text-[17px]", noMatch || invalid ? "border-danger" : "border-ink")}
          />
        </div>
        {action}
      </div>

      <ul id={listId} role="listbox" aria-label={t("addrSearchLabel")} hidden={!open} className="absolute inset-x-0 top-full z-30 mt-1 max-h-80 overflow-auto rounded-md border border-ink bg-surface py-1 shadow-lg">
        {matches.map((a, i) => (
          <li
            key={a.id}
            id={`${listId}-${i}`}
            role="option"
            aria-selected={i === active}
            onMouseDown={(e) => e.preventDefault()}
            onMouseMove={() => active !== i && setActive(i)}
            onClick={() => choose(a)}
            className={clsx("flex min-h-12 cursor-pointer items-center gap-3 px-4 py-2", i === active && "bg-primary-soft")}
          >
            <MapPin aria-hidden className="size-4 shrink-0 text-muted" />
            <span className="min-w-0 flex-1 text-[15px]">
              <span className="font-semibold text-ink">{a.line1}</span>
              <span className="text-muted">
                , {a.city}, {a.state} {a.zip}
              </span>
            </span>
          </li>
        ))}
      </ul>

      {noMatch && (
        <p id="addr-err" role="status" className="mt-2 text-sm font-medium text-danger">
          {t("usError")}
        </p>
      )}

      {s.address && verified && (
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm" aria-live="polite">
          <span className="inline-flex items-center gap-1.5 font-semibold text-success">
            <Check aria-hidden className="size-4" strokeWidth={2.5} />
            {t("addressFound")}
          </span>
          <span className="inline-flex items-center gap-1.5 text-ink">
            {s.address.type === "business" ? <Building2 aria-hidden className="size-4" /> : <Home aria-hidden className="size-4" />}
            {t(s.address.type === "business" ? "businessAddress" : "homeAddress")}
          </span>
          <button type="button" onClick={tryAgain} className="inline-flex min-h-11 items-center font-semibold text-link underline underline-offset-4">
            <span aria-hidden>←&nbsp;</span>
            {t("tryDifferentAddress")}
          </button>
        </div>
      )}
    </div>
  );
}
