"use client";

import { ConcienciaCamaraYConceptoScene } from "@/components/scene/scenes/conciencia-camara-y-concepto";
import { ConceptoIdeaSolucionScene } from "@/components/scene/scenes/concepto-idea-solucion";
import { FallbackScene } from "@/components/scene/scenes/fallback";
import { HomeScene } from "@/components/scene/scenes/home";
import { LenguajeAudiovisualScene } from "@/components/scene/scenes/lenguaje-audiovisual";
import { SoonScene } from "@/components/scene/scenes/soon";
import { VerdadNoVerdadScene } from "@/components/scene/scenes/verdad-no-verdad";

export function getJourneyPageIds(slugs: string[]) {
  return ["home", ...slugs, "soon"];
}

export function EntryScene({ slug }: { slug: string }) {
  switch (slug) {
    case "home":
      return <HomeScene />;
    case "concepto-idea-solucion":
      return <ConceptoIdeaSolucionScene />;
    case "lenguaje-audiovisual":
      return <LenguajeAudiovisualScene />;
    case "verdad-no-verdad":
      return <VerdadNoVerdadScene />;
    case "conciencia-camara-y-concepto":
      return <ConcienciaCamaraYConceptoScene />;
    case "soon":
      return <SoonScene />;
    default:
      return <FallbackScene />;
  }
}
