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

const siteTitle = "Bitácora · Robótica y lenguaje audiovisual";
const siteDescription =
  "Registro vivo del curso Robótica y lenguaje audiovisual en CENTRO: teoría, proceso de los proyectos terminales y reflexiones. Se actualiza sesión a sesión.";

export const metadata: Metadata = {
  title: {
    default: siteTitle,
    template: "%s · Bitácora",
  },
  description: siteDescription,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    locale: "es_MX",
    type: "website",
    images: [
      {
        url: "/img/cover.png",
        width: 1200,
        height: 630,
        alt: "Robótica y Lenguaje Audiovisual",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/img/cover.png"],
  },
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
