import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EntradaPanel } from "@/components/entrada-panel";
import {
  formatFecha,
  getAllEntradas,
  getEntrada,
  getEntradaSlugs,
} from "@/lib/entradas";

type Props = {
  params: Promise<{ slug: string }>;
};

function withDateLabel<T extends { date: string }>(item: T) {
  return { ...item, dateLabel: formatFecha(item.date) };
}

export function generateStaticParams() {
  return getEntradaSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entrada = await getEntrada(slug);

  if (!entrada) {
    return { title: "Entrada no encontrada" };
  }

  return {
    title: entrada.meta.title,
    description: entrada.meta.excerpt,
  };
}

export default async function EntradaPage({ params }: Props) {
  const { slug } = await params;
  const entrada = await getEntrada(slug);

  if (!entrada) notFound();

  const { meta, content } = entrada;
  const todas = getAllEntradas();
  const index = todas.findIndex((item) => item.slug === slug);
  const anterior = index > 0 ? todas[index - 1] : null;
  const siguiente = index < todas.length - 1 ? todas[index + 1] : null;

  return (
    <EntradaPanel
      meta={withDateLabel(meta)}
      anterior={anterior ? withDateLabel(anterior) : null}
      siguiente={siguiente ? withDateLabel(siguiente) : null}
    >
      {content}
    </EntradaPanel>
  );
}
