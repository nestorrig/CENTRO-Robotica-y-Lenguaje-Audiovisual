"use client";

import dynamic from "next/dynamic";
import { Leva } from "leva";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { InfoPanel } from "@/components/chrome/info-panel";
import { NavChrome } from "@/components/chrome/nav-chrome";
import { JourneyHtml } from "@/components/scene/journey-html";
import type { EntradaSlide } from "@/lib/types";

const PersistentCanvas = dynamic(
  () => import("@/components/scene/persistent-canvas"),
  { ssr: false },
);

export function SceneShell({
  entradas,
  children,
}: {
  entradas: EntradaSlide[];
  children: ReactNode;
}) {
  const pathname = usePathname();
  const detail = pathname.startsWith("/sesiones/");
  const slug = detail ? (pathname.split("/")[2] ?? null) : null;
  const [infoOpen, setInfoOpen] = useState(false);

  useEffect(() => {
    setInfoOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="bitacora-canvas fixed inset-0 z-0">
        <PersistentCanvas entradas={entradas} detail={detail} slug={slug} />
      </div>

      <JourneyHtml entradas={entradas} hidden={detail} />

      <NavChrome
        infoOpen={infoOpen}
        onToggleInfo={() => setInfoOpen((open) => !open)}
      />
      <InfoPanel open={infoOpen} onClose={() => setInfoOpen(false)} />

      <div className="pointer-events-none relative z-20 empty:hidden">
        {children}
      </div>

      <Leva
        hidden
        collapsed
        oneLineLabels
        hideCopyButton
        titleBar={{ title: "Bitácora 3D", filter: false }}
      />
    </>
  );
}
