import type { ReactNode } from "react";

function MediaFigure({
  pie,
  children,
}: {
  pie?: ReactNode;
  children: ReactNode;
}) {
  return (
    <figure className="not-prose my-10">
      <div className="overflow-hidden bg-ink/8">{children}</div>
      {pie ? (
        <figcaption className="mt-3 text-[0.68rem] leading-5 tracking-[0.22em] text-ink/50 uppercase [&_p]:m-0">
          {pie}
        </figcaption>
      ) : null}
    </figure>
  );
}

function youtubeId(input: string) {
  const value = input.trim();
  if (!value) return null;
  if (/^[\w-]{11}$/.test(value)) return value;

  try {
    const url = new URL(value.startsWith("http") ? value : `https://${value}`);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id ? id.slice(0, 11) : null;
    }

    if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      const fromQuery = url.searchParams.get("v");
      if (fromQuery) return fromQuery;

      const parts = url.pathname.split("/").filter(Boolean);
      const marker = parts.findIndex((part) =>
        ["embed", "shorts", "live", "v"].includes(part),
      );
      if (marker >= 0 && parts[marker + 1]) {
        return parts[marker + 1].slice(0, 11);
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function YouTube({
  src,
  id,
  titulo,
  pie,
  start,
  children,
}: {
  src?: string;
  id?: string;
  titulo?: string;
  pie?: string;
  start?: number | string;
  children?: ReactNode;
}) {
  const videoId = youtubeId(id ?? src ?? "");
  const caption = pie ?? children;
  const iframeTitle =
    titulo ?? (typeof caption === "string" ? caption : "Video de YouTube");

  if (!videoId) {
    return (
      <p className="not-prose my-10 text-sm text-ink/50">
        No se pudo leer el enlace de YouTube.
      </p>
    );
  }

  const params = new URLSearchParams({ rel: "0" });
  if (start) params.set("start", String(start));

  return (
    <MediaFigure pie={caption}>
      <div className="relative aspect-video">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`}
          title={iframeTitle}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </MediaFigure>
  );
}

export function Video({
  src,
  pie,
  poster,
  titulo,
  loop,
  muted,
  children,
}: {
  src: string;
  pie?: string;
  poster?: string;
  titulo?: string;
  loop?: boolean;
  muted?: boolean;
  children?: ReactNode;
}) {
  return (
    <MediaFigure pie={pie ?? children}>
      <video
        className="block w-full"
        src={src}
        poster={poster}
        controls
        playsInline
        preload="metadata"
        loop={loop}
        muted={muted}
        aria-label={titulo}
      >
        <a href={src}>Descargar video</a>
      </video>
    </MediaFigure>
  );
}

export function Imagen({
  src,
  alt,
  pie,
  children,
}: {
  src: string;
  alt: string;
  pie?: string;
  children?: ReactNode;
}) {
  return (
    <MediaFigure pie={pie ?? children}>
      {/* MDX recibe rutas sueltas de public/; el ratio se deja nativo. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="block h-auto w-full" />
    </MediaFigure>
  );
}
