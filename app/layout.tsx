import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SceneShell } from "@/components/scene/scene-shell";
import { formatFecha, getVisibleEntradas } from "@/lib/entradas";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Bitácora · Robótica y lenguaje audiovisual",
    template: "%s · Bitácora",
  },
  description:
    "Registro de prácticas del curso Robótica y lenguaje audiovisual. Cinco sesiones sobre máquina, cuerpo y encuadre.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const entradas = getVisibleEntradas().map((entrada) => ({
    ...entrada,
    dateLabel: formatFecha(entrada.date),
  }));

  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/gmw1cry.css" />
      </head>
      <body className="h-full overflow-hidden bg-ink font-sans text-paper">
        <SceneShell entradas={entradas}>{children}</SceneShell>
      </body>
    </html>
  );
}
