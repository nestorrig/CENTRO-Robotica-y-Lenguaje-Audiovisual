import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-ink/15">
      <div className="mx-auto flex w-full max-w-5xl items-baseline justify-between gap-6 px-5 py-5 sm:px-8">
        <Link href="/" className="group">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-accent">
            CENTRO · 2026
          </p>
          <p className="mt-1 font-serif text-2xl leading-none tracking-[-0.03em] text-ink group-hover:text-primary-1">
            Bitácora
          </p>
        </Link>
        <p className="max-w-[14rem] text-right font-mono text-[0.65rem] uppercase leading-5 tracking-[0.16em] text-ink/50 sm:max-w-none">
          Robótica y lenguaje audiovisual
        </p>
      </div>
    </header>
  );
}
