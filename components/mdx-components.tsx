import type { MDXComponents } from "mdx/types";
import type { ReactNode } from "react";
import { Imagen, Video, YouTube } from "@/components/mdx/media";

function Nota({
  titulo = "Nota de taller",
  children,
}: {
  titulo?: string;
  children: ReactNode;
}) {
  return (
    <aside className="not-prose my-10 border border-neutral-200 bg-neutral-50 px-5 py-4 sm:px-6">
      <p className="text-[0.68rem] tracking-[0.22em] text-neutral-500 uppercase">
        {titulo}
      </p>
      <div className="mt-2 text-[1.02rem] leading-7 text-neutral-800 [&_p]:m-0">
        {children}
      </div>
    </aside>
  );
}

function Toma({
  numero,
  lugar,
  children,
}: {
  numero: string;
  lugar?: string;
  children: ReactNode;
}) {
  return (
    <figure className="not-prose my-10 border-l-2 border-black pl-5 sm:pl-6">
      <figcaption className="text-[0.68rem] tracking-[0.22em] text-neutral-500 uppercase">
        Toma {numero}
        {lugar ? ` · ${lugar}` : ""}
      </figcaption>
      <div className="mt-2 text-[1.15rem] leading-8 text-neutral-800 italic [&_p]:m-0">
        {children}
      </div>
    </figure>
  );
}

function Cita({ autor, children }: { autor?: string; children: ReactNode }) {
  return (
    <blockquote className="not-prose my-12">
      <div className="text-[1.4rem] leading-snug tracking-[-0.02em] text-black sm:text-[1.65rem] [&_p]:m-0">
        {children}
      </div>
      {autor ? (
        <footer className="mt-3 text-[0.72rem] tracking-[0.18em] text-neutral-500 uppercase">
          — {autor}
        </footer>
      ) : null}
    </blockquote>
  );
}

function Definicion({
  termino,
  fuente,
  children,
}: {
  termino: string;
  fuente?: string;
  children: ReactNode;
}) {
  return (
    <figure className="not-prose my-10 border-y border-neutral-200 p-6 bg-neutral-50">
      <figcaption className="text-[0.68rem] tracking-[0.22em] text-neutral-500 uppercase">
        Definición
      </figcaption>
      <dl className="mt-2">
        <dt className="font-didot text-[1.85rem] leading-tight tracking-[-0.03em] text-black italic">
          {termino}
        </dt>
        <dd className="mt-3 leading-7 text-neutral-800 [&_p]:m-0">
          {children}
          {fuente ? (
            <p className="mt-3 text-[0.72rem] tracking-[0.18em] text-neutral-500 uppercase">
              {fuente}
            </p>
          ) : null}
        </dd>
      </dl>
    </figure>
  );
}

export const mdxComponents: MDXComponents = {
  Nota,
  Toma,
  Cita,
  Definicion,
  YouTube,
  Video,
  Imagen,
  h2: (props) => (
    <h2
      className="font-didot-headline  mt-12 mb-4 text-[1.55rem] leading-tight font-semibold tracking-[-0.02em] text-black"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="font-didot italic mt-8 mb-3 text-[1.2rem] leading-snug font-semibold text-black"
      {...props}
    />
  ),
  p: (props) => (
    <p
      className="my-[1.15em] text-base leading-[1.75] text-neutral-800"
      {...props}
    />
  ),
  a: (props) => (
    <a
      className="underline decoration-neutral-400 underline-offset-4 hover:decoration-black"
      {...props}
    />
  ),
  ul: (props) => (
    <ul className="my-6 list-disc space-y-2 pl-6  leading-[1.7]" {...props} />
  ),
  ol: (props) => (
    <ol
      className="my-6 list-decimal space-y-2 pl-6  leading-[1.7]"
      {...props}
    />
  ),
  li: (props) => <li className="pl-1" {...props} />,
  strong: (props) => <strong className="font-semibold" {...props} />,
  em: (props) => <em className="italic" {...props} />,
  code: (props) => (
    <code
      className="rounded-sm bg-neutral-100 px-1 py-0.5 font-mono text-[0.85em]"
      {...props}
    />
  ),
  hr: () => <hr className="my-12 border-neutral-200" />,
  blockquote: (props) => (
    <blockquote
      className="my-8 border-l-2 border-neutral-300 pl-5 text-neutral-500 italic"
      {...props}
    />
  ),
};
