"use client";

import Link from "next/link";

export function NavChrome({
  infoOpen,
  onToggleInfo,
}: {
  infoOpen: boolean;
  onToggleInfo: () => void;
}) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-start justify-between px-5 py-5 sm:px-7">
      <Link
        href="/"
        aria-label="Inicio"
        className="pointer-events-auto text-paper transition-opacity hover:opacity-50"
      >
        <HomeIcon />
      </Link>
      <button
        type="button"
        aria-label={infoOpen ? "Cerrar información" : "Abrir información"}
        aria-expanded={infoOpen}
        onClick={onToggleInfo}
        className="pointer-events-auto text-paper transition-opacity hover:opacity-50"
      >
        <InfoIcon />
      </button>
    </div>
  );
}

function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 11.2 12 4l8 7.2V20a1 1 0 0 1-1 1h-5.2v-6.2H10.2V21H5a1 1 0 0 1-1-1v-8.8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 11v6M12 7.5h.01"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
