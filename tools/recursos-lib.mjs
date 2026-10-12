// Shared helpers for the Recursos section (ozmetra.com/recursos/…) and the sitemap.
//
// Content lives in contenido/recursos/<slug>/:
//   articulo.md  the article body in Markdown (the only file a person needs to edit)
//   datos.json   title, description, dates, FAQ, downloadable resource and related links
// Authors live in contenido/recursos/autores.json.

import { readFileSync, readdirSync, existsSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const OUT = join(ROOT, "diseno-landing");
export const CONTENT = join(ROOT, "contenido", "recursos");
export const SITE_URL = process.env.SITE_URL || "https://ozmetra.com";
export const LANGS = ["es", "en", "fr", "de", "it"];
export const DEFAULT_LANG = "es";

// A block the founder still has to write. The build shows it highlighted in previews
// and the "Recursos" check on the pull request fails while any is left.
export const PENDING_RE = /\[\[TU EXPERIENCIA:([\s\S]*?)\]\]/g;

export const TEMAS = {
  inversores: { nombre: "Inversores", icono: "ph-handshake" },
  escalar: { nombre: "Escalar procesos", icono: "ph-trend-up" },
  okr: { nombre: "OKR", icono: "ph-target" },
  iso: { nombre: "Normas ISO", icono: "ph-seal-check" },
  madurez: { nombre: "Madurez de procesos", icono: "ph-stairs" },
};

export const pageUrl = (lang) => (lang === DEFAULT_LANG ? `${SITE_URL}/` : `${SITE_URL}/${lang}/`);
export const articleUrl = (slug) => `${SITE_URL}/recursos/${slug}/`;

export function readAuthors() {
  const file = join(CONTENT, "autores.json");
  return existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : {};
}

// Every article folder that has both files, newest first.
export function readArticles() {
  if (!existsSync(CONTENT)) return [];
  return readdirSync(CONTENT, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => join(CONTENT, d.name))
    .filter((dir) => existsSync(join(dir, "datos.json")) && existsSync(join(dir, "articulo.md")))
    .map((dir) => {
      const datos = JSON.parse(readFileSync(join(dir, "datos.json"), "utf8"));
      const markdown = readFileSync(join(dir, "articulo.md"), "utf8");
      return { ...datos, markdown, dir };
    })
    .sort((a, b) => (b.publicado || "").localeCompare(a.publicado || "") || a.slug.localeCompare(b.slug));
}

// Last commit date that touched any of the paths (YYYY-MM-DD), so the sitemap
// does not change on every build. Falls back to today outside a git checkout.
export function lastChange(...paths) {
  try {
    const d = execFileSync("git", ["log", "-1", "--format=%cs", "--", ...paths], { cwd: ROOT, encoding: "utf8" }).trim();
    if (d) return d;
  } catch { /* not a git checkout */ }
  return new Date().toISOString().slice(0, 10);
}

export function writeSitemap(articles = readArticles()) {
  const homeDate = lastChange("tools/index.template.html", "diseno-landing/i18n.js");
  const alts = LANGS.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${pageUrl(l)}"/>`).join("\n");
  const home = LANGS.map((l) => `  <url>
    <loc>${pageUrl(l)}</loc>
    <lastmod>${homeDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${l === DEFAULT_LANG ? "1.0" : "0.9"}</priority>
${alts}
    <xhtml:link rel="alternate" hreflang="x-default" href="${pageUrl(DEFAULT_LANG)}"/>
  </url>`);
  const recursos = articles.length
    ? [`  <url>
    <loc>${SITE_URL}/recursos/</loc>
    <lastmod>${articles.map((a) => a.actualizado || a.publicado).sort().at(-1)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`, ...articles.map((a) => `  <url>
    <loc>${articleUrl(a.slug)}</loc>
    <lastmod>${a.actualizado || a.publicado}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${a.pilar ? "0.8" : "0.7"}</priority>
  </url>`)]
    : [];
  writeFileSync(join(OUT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${[...home, ...recursos].join("\n")}
</urlset>
`);
}
