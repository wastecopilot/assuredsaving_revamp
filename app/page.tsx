"use client";
import dynamic from "next/dynamic";
import { StoreProvider, STAGE, useStore } from "@/lib/store";
import { ToastProvider } from "@/components/ui/Toast";
import { Glows, Header } from "@/components/sections/Shell";
import { Hero } from "@/components/sections/Hero";

/*
 * Sections below the hero unlock one by one, so their code (and the animation
 * library) loads on demand instead of slowing the first paint.
 */
const AddressSection = dynamic(() => import("@/components/sections/Steps").then((m) => m.AddressSection), { ssr: false });
const UsageSection = dynamic(() => import("@/components/sections/Steps").then((m) => m.UsageSection), { ssr: false });
const TvSection = dynamic(() => import("@/components/sections/Steps").then((m) => m.TvSection), { ssr: false });
const ScanSection = dynamic(() => import("@/components/sections/Scan").then((m) => m.ScanSection), { ssr: false });
const ResultsSection = dynamic(() => import("@/components/sections/Results").then((m) => m.ResultsSection), { ssr: false });
const DetailsDrawer = dynamic(() => import("@/components/sections/Details").then((m) => m.DetailsDrawer), { ssr: false });
const CallbackModal = dynamic(() => import("@/components/sections/Callback").then((m) => m.CallbackModal), { ssr: false });

/** One page. Sections unlock in order, exactly like the original one-pager. */
function OnePager() {
  const { s, t } = useStore();
  return (
    <ToastProvider closeLabel={t("close")}>
      <Glows />
      <Header />
      <main className="space-y-14 pb-28 sm:space-y-20">
        <Hero />
        {s.stage >= STAGE.address && <AddressSection />}
        {s.stage >= STAGE.usage && s.services.includes("internet") && <UsageSection />}
        {s.stage >= STAGE.tv && s.services.includes("tv") && <TvSection />}
        {s.stage >= STAGE.scan && !s.scanDone && <ScanSection />}
        {s.scanDone && s.stage >= STAGE.results && <ResultsSection />}
      </main>
      <p className="mx-auto -mt-16 mb-6 w-fit rounded-full bg-ink/85 px-2.5 py-1 text-[11px] font-semibold text-white sm:pointer-events-none sm:fixed sm:bottom-3 sm:left-3 sm:z-30 sm:m-0">{t("previewTag")}</p>
      {s.modal.kind === "details" && <DetailsDrawer />}
      {s.modal.kind === "callback" && <CallbackModal />}
    </ToastProvider>
  );
}

export default function Page() {
  return (
    <StoreProvider>
      <OnePager />
    </StoreProvider>
  );
}
