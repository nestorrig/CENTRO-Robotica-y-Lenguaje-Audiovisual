import Link from "next/link";

export default function NotFound() {
  return (
    <main className="pointer-events-auto relative z-20 flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="text-[0.7rem] tracking-[0.28em] text-paper/55 uppercase">
        Fuera de plano
      </p>
      <h1 className="mt-4 text-4xl font-bold tracking-[-0.04em] text-paper sm:text-5xl">
        Esa entrada no está en la bitácora.
      </h1>
      <Link
        href="/"
        className="mt-8 text-[0.7rem] tracking-[0.2em] text-paper uppercase hover:text-accent"
      >
        ← Volver al registro
      </Link>
    </main>
  );
}
