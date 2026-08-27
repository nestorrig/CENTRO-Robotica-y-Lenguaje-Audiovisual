export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--line)]">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[var(--muted)]">
          Bitácora de prácticas · 5 sesiones
        </p>
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[var(--muted)]">
          Tercer semestre
        </p>
      </div>
    </footer>
  );
}
