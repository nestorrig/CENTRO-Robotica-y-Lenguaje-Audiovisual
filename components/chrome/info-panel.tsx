"use client";

export function InfoPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label="Cerrar panel"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-transparent"
        />
      ) : null}
      <aside
        className={`fixed top-16 right-5 z-40 w-[min(20rem,calc(100vw-2.5rem))] border border-neutral-300 bg-white/95 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.08)] backdrop-blur-sm transition-all duration-300 sm:right-7 ${
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <h2 className="text-lg font-semibold tracking-tight">
          Sobre esta bitácora
        </h2>
        <p className="mt-3 text-sm leading-6 text-neutral-600">
          Registro de prácticas del curso Robótica y lenguaje audiovisual en
          CENTRO.
        </p>
        <p className="mt-6 text-[0.7rem] tracking-[0.16em] text-neutral-400 uppercase">
          CENTRO · Tercer semestre
        </p>
      </aside>
    </>
  );
}
