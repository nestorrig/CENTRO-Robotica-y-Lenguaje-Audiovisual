import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/mdx-components";

const CONTENT_DIR = path.join(process.cwd(), "content/entradas");

export type EntradaMeta = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  sesion: number;
  tags: string[];
};

function assertMeta(
  data: Record<string, unknown>,
  slug: string,
): Omit<EntradaMeta, "slug"> {
  const { title, excerpt, date, sesion, tags } = data;
  const sesionNumero = Number(sesion);

  if (
    typeof title !== "string" ||
    typeof excerpt !== "string" ||
    typeof date !== "string" ||
    Number.isNaN(sesionNumero) ||
    !Array.isArray(tags)
  ) {
    throw new Error(`Frontmatter incompleto en ${slug}.mdx`);
  }

  return {
    title,
    excerpt,
    date,
    sesion: sesionNumero,
    tags: tags.map(String),
  };
}

export function getEntradaSlugs() {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getAllEntradas(): EntradaMeta[] {
  return getEntradaSlugs()
    .map((slug) => {
      const raw = fs.readFileSync(
        path.join(CONTENT_DIR, `${slug}.mdx`),
        "utf8",
      );
      const { data } = matter(raw);
      return { slug, ...assertMeta(data, slug) };
    })
    .sort((a, b) => a.sesion - b.sesion);
}

export async function getEntrada(slug: string) {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const source = fs.readFileSync(filePath, "utf8");
  const { content, frontmatter } = await compileMDX<Omit<EntradaMeta, "slug">>({
    source,
    components: mdxComponents,
    options: { parseFrontmatter: true },
  });

  return {
    content,
    meta: { slug, ...assertMeta(frontmatter, slug) },
  };
}

export function formatFecha(iso: string) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${iso}T12:00:00`));
}

export function formatSesion(sesion: number) {
  return String(sesion).padStart(2, "0");
}
