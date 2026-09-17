"use client";

import Link from "next/link";
import { journeyOffset, journeyPageCount } from "@/lib/journey-store";
import type { EntradaSlide } from "@/lib/types";

function slideClass() {
  return "relative flex h-full w-full shrink-0 snap-start snap-always flex-col items-center justify-center px-6 text-center";
}

export function JourneyHtml({
  entradas,
  hidden,
}: {
  entradas: EntradaSlide[];
  hidden: boolean;
}) {
  const pages = journeyPageCount(entradas.length);

  return (
    <div
      className="journey-snap fixed inset-0 z-10 overflow-x-hidden overflow-y-auto overscroll-none"
      aria-hidden={hidden}
      style={{
        display: hidden ? "none" : "block",
        scrollSnapType: "y mandatory",
        scrollbarWidth: "none",
      }}
      onScroll={(event) => {
        const target = event.currentTarget;
        const max = target.scrollHeight - target.clientHeight;
        journeyOffset.set(max > 0 ? target.scrollTop / max : 0);
      }}
    >
      <section className={slideClass()}>
        <h1
          aria-label="Robótica y Lenguaje Audiovisual"
          className="grid w-full grid-cols-2 items-baseline gap-x-[clamp(0.5rem,2vw,1.4rem)] font-didot italic text-[clamp(2.2rem,8vw,5.8rem)] leading-[0.92] tracking-tighter text-accent"
        >
          <span className="justify-self-end text-[clamp(3rem,10vw,8rem)] -translate-y-[clamp(1.5rem,2vw,2.5rem)] translate-x-[clamp(1.5rem,2vw,3rem)]">
            Robótica
          </span>
          <span className="justify-self-start text-[clamp(5rem,13vw,12rem)] translate-x-[clamp(3rem,6vw,9rem)]">
            y
          </span>
          <span className="justify-self-end -translate-y-[clamp(0.5rem,2vw,2.5rem)] -translate-x-[clamp(1.5rem,2vw,3rem)]">
            Lenguaje
          </span>
          <span className="justify-self-start translate-y-[clamp(1.8rem,2vw,3.5rem)] -translate-x-[clamp(1.5rem,2vw,3rem)]">
            Audiovisual
          </span>
        </h1>
        <div className="absolute bottom-8 left-0 flex w-full flex-col items-center gap-2 text-paper/55">
          <MouseIcon />
          <p className="text-[0.65rem] tracking-[0.22em] uppercase">
            scroll para navegar
          </p>
        </div>
      </section>

      {entradas.map((entrada) => (
        <section key={entrada.slug} className={slideClass()}>
          <div className="relative max-w-4xl">
            <p className="absolute right-0 bottom-full left-0 mb-4 text-[0.7rem] font-medium tracking-[0.32em] text-paper/55 uppercase">
              Entrada {entrada.sesion}
            </p>
            <Link
              href={`/sesiones/${entrada.slug}`}
              className="block font-didot italic cursor-pointer text-[clamp(2.1rem,6.4vw,4.6rem)] font-bold leading-[0.95] tracking-[-0.045em] text-paper transition-opacity hover:text-accent"
            >
              {entrada.title}
            </Link>
            <p className="absolute top-full right-0 left-0 mt-6 text-sm text-paper/55">
              {entrada.dateLabel}
            </p>
          </div>
        </section>
      ))}

      <section className={slideClass()}>
        <h2 className="font-didot italic text-[clamp(3rem,7vw,6rem)] font-bold leading-[0.95] tracking-[-0.045em] text-paper">
          Más muy pronto ...
        </h2>
      </section>

      <span className="sr-only">{pages} secciones</span>
    </div>
  );
}

function MouseIcon() {
  return (
    <svg
      width="18"
      height="28"
      viewBox="0 0 18 28"
      fill="none"
      aria-hidden="true"
      className="animate-bounce"
    >
      <rect
        x="1"
        y="1"
        width="16"
        height="26"
        rx="8"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <rect x="8" y="6" width="2" height="5" rx="1" fill="currentColor" />
    </svg>
  );
}
