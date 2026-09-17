"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import { detailScroll } from "@/lib/journey-store";
import type { EntradaSlide } from "@/lib/types";

export function EntradaPanel({
  meta,
  anterior,
  siguiente,
  children,
}: {
  meta: EntradaSlide;
  anterior: EntradaSlide | null;
  siguiente: EntradaSlide | null;
  children: ReactNode;
}) {
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    detailScroll.set(0);
    scroller.current?.scrollTo({ top: 0 });
    return () => detailScroll.set(0);
  }, [meta.slug]);

  return (
    <div
      ref={scroller}
      className="pointer-events-auto fixed inset-0 z-20 overflow-y-auto overscroll-none"
      onScroll={(event) => {
        const target = event.currentTarget;
        detailScroll.set(target.scrollTop / target.clientHeight);
      }}
    >
      <header className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <p className="text-[0.7rem] font-medium tracking-[0.32em] text-paper/55 uppercase">
          Sesión {meta.sesion}
        </p>
        <h1 className="font-didot italic mt-4 max-w-4xl text-[clamp(3rem,6.4vw,6.4rem)] font-bold leading-[0.95] tracking-[-0.045em] text-paper">
          {meta.title}
        </h1>
        <p className="mt-6 text-sm text-paper/55">{meta.dateLabel}</p>
      </header>

      <div className="relative mx-auto mb-24 w-full max-w-3xl bg-paper px-6 pt-12 pb-24 text-ink sm:px-12">
        <p className="max-w-2xl text-[1.05rem] leading-7 text-ink/55">
          {meta.excerpt}
        </p>
        <article className="max-w-2xl pt-2">{children}</article>

        <nav className="mt-16 grid gap-8 border-t border-ink/15 pt-8 sm:grid-cols-2">
          {anterior ? (
            <Link href={`/sesiones/${anterior.slug}`} className="group">
              <p className="text-[0.65rem] tracking-[0.2em] text-ink/40 uppercase">
                ← Sesión {anterior.sesion}
              </p>
              <p className="font-didot italic mt-2 text-lg font-semibold tracking-tight group-hover:text-primary-1">
                {anterior.title}
              </p>
            </Link>
          ) : (
            <div />
          )}
          {siguiente ? (
            <Link
              href={`/sesiones/${siguiente.slug}`}
              className="group sm:text-right"
            >
              <p className="text-[0.65rem] tracking-[0.2em] text-ink/40 uppercase">
                Sesión {siguiente.sesion} →
              </p>
              <p className="font-didot italic mt-2 text-lg font-semibold tracking-tight group-hover:text-primary-1">
                {siguiente.title}
              </p>
            </Link>
          ) : null}
        </nav>
      </div>
    </div>
  );
}
