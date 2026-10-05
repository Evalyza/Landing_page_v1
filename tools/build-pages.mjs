// Ozmetra landing: builds one static, indexable page per language plus SEO files.
//
//   node tools/build-pages.mjs
//
// Source: tools/index.template.html (edit THIS file, not diseno-landing/index.html).
// Output: diseno-landing/index.html (es), diseno-landing/{en,fr,de,it}/index.html,
//         diseno-landing/sitemap.xml, diseno-landing/robots.txt, diseno-landing/site.webmanifest
//
// Every page ships its texts already translated in the HTML, so search engines index
// each language at its own URL; app.js keeps the interactive parts working on top.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

// ---- Change this when the final domain is known (no trailing slash) ----
const SITE_URL = process.env.SITE_URL || "https://ozmetra.com";
const VERSION = "15"; // cache-busting for styles/scripts

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "diseno-landing");
const LANGS = ["es", "en", "fr", "de", "it"];
const DEFAULT = "es";
const today = new Date().toISOString().slice(0, 10);

// Load the translations exactly as the browser does
const sandbox = { window: {} };
vm.runInNewContext(readFileSync(join(OUT, "i18n.js"), "utf8"), sandbox);
const I18N = sandbox.window.I18N;

const template = readFileSync(join(ROOT, "tools", "index.template.html"), "utf8");

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escAttr = (s) => esc(s).replace(/"/g, "&quot;");
const pageUrl = (l) => (l === DEFAULT ? `${SITE_URL}/` : `${SITE_URL}/${l}/`);

function t(lang, key) {
  const v = I18N[lang][key] ?? I18N[DEFAULT][key];
  if (v === undefined) throw new Error(`Missing translation ${lang}:${key}`);
  return v;
}

// Relative links inside a language subfolder must climb one level
function relink(html, base, lang) {
  if (!base) return html;
  return html.replace(/\b(href|src)="(?!https?:|#|\/|data:|mailto:|tel:)([^"]+)"/g, (_, attr, path) => `${attr}="${base}${path}"`);
}
// Legal pages render their language from ?lang=
function legalLinks(html, base, lang) {
  return html.replace(/href="((?:\.\.\/)?)(terminos|privacidad)\.html"/g, (_, b, page) =>
    `href="${b}${page}.html${lang === DEFAULT ? "" : `?lang=${lang}`}"`);
}

function seoHead(lang, base) {
  const title = t(lang, "meta.title");
  const desc = t(lang, "meta.desc");
  const url = pageUrl(lang);
  const ogImage = `${SITE_URL}/og/og-${lang}.png`;
  const alternates = LANGS.map((l) => `  <link rel="alternate" hreflang="${l}" href="${pageUrl(l)}">`).join("\n");
  const ogAlternates = LANGS.filter((l) => l !== lang).map((l) => `  <meta property="og:locale:alternate" content="${t(l, "seo.locale")}">`).join("\n");

  const faq = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
    "@type": "Question",
    name: t(lang, `faq.q${n}`),
    acceptedAnswer: { "@type": "Answer", text: t(lang, `faq.a${n}`) },
  }));
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": `${SITE_URL}/#org`, name: "Ozmetra", url: `${SITE_URL}/`, logo: `${SITE_URL}/assets/ozmetra-icono-app-512.png`, sameAs: ["https://www.linkedin.com/company/ozmetra/"] },
      { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: "Ozmetra", inLanguage: LANGS, publisher: { "@id": `${SITE_URL}/#org` } },
      { "@type": "WebPage", "@id": `${url}#webpage`, url, name: title, description: desc, inLanguage: lang, isPartOf: { "@id": `${SITE_URL}/#website` }, primaryImageOfPage: ogImage },
      {
        "@type": "SoftwareApplication", "@id": `${SITE_URL}/#software`, name: "Ozmetra",
        applicationCategory: "BusinessApplication", operatingSystem: "Web",
        description: desc, inLanguage: lang, url, image: ogImage, publisher: { "@id": `${SITE_URL}/#org` },
        audience: { "@type": "BusinessAudience", audienceType: "Startups, SMEs" },
        keywords: t(lang, "seo.keywords"),
      },
      { "@type": "FAQPage", "@id": `${url}#faq`, inLanguage: lang, mainEntity: faq },
    ],
  };

  return [
    `  <title data-i18n="meta.title">${esc(title)}</title>`,
    `  <meta name="description" data-i18n-content="meta.desc" content="${escAttr(desc)}">`,
    `  <meta name="keywords" content="${escAttr(t(lang, "seo.keywords"))}">`,
    `  <meta name="robots" content="index, follow, max-image-preview:large">`,
    `  <link rel="canonical" href="${url}">`,
    alternates,
    `  <link rel="alternate" hreflang="x-default" href="${pageUrl(DEFAULT)}">`,
    `  <meta property="og:type" content="website">`,
    `  <meta property="og:site_name" content="Ozmetra">`,
    `  <meta property="og:title" content="${escAttr(title)}">`,
    `  <meta property="og:description" content="${escAttr(desc)}">`,
    `  <meta property="og:url" content="${url}">`,
    `  <meta property="og:image" content="${ogImage}">`,
    `  <meta property="og:image:width" content="1200">`,
    `  <meta property="og:image:height" content="630">`,
    `  <meta property="og:image:alt" content="${escAttr(t(lang, "seo.ogAlt"))}">`,
    `  <meta property="og:locale" content="${t(lang, "seo.locale")}">`,
    ogAlternates,
    `  <meta name="twitter:card" content="summary_large_image">`,
    `  <meta name="twitter:title" content="${escAttr(title)}">`,
    `  <meta name="twitter:description" content="${escAttr(desc)}">`,
    `  <meta name="twitter:image" content="${ogImage}">`,
    `  <link rel="icon" href="${base}assets/ozmetra-icono-app.svg" type="image/svg+xml">`,
    `  <link rel="icon" href="${base}assets/ozmetra-icono-app-192.png" type="image/png" sizes="192x192">`,
    `  <link rel="apple-touch-icon" href="${base}assets/apple-touch-icon.png">`,
    `  <link rel="manifest" href="${base}site.webmanifest">`,
    `  <script type="application/ld+json">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script>`,
  ].join("\n");
}

function buildPage(lang) {
  const base = lang === DEFAULT ? "" : "../";
  let html = template;

  // Translate every marked element so the HTML is already in the page language
  html = html.replace(/(<(\w+)\b[^>]*\bdata-i18n="([^"]+)"[^>]*>)([^<]*)(<\/\2>)/g,
    (_, open, tag, key, _text, close) => `${open}${esc(t(lang, key))}${close}`);
  html = html.replace(/(<span\b[^>]*\bdata-i18n-html="([^"]+)"[^>]*>)([\s\S]*?)(<\/span>)/g,
    (_, open, key, _inner, close) => `${open}${t(lang, key)}${close}`);
  html = html.replace(/(\bdata-i18n-ph="([^"]+)"[^>]*?\bplaceholder=")[^"]*"/g, (_, pre, key) => `${pre}${escAttr(t(lang, key))}"`);
  html = html.replace(/(\bdata-i18n-aria="([^"]+)"[^>]*?\baria-label=")[^"]*"/g, (_, pre, key) => `${pre}${escAttr(t(lang, key))}"`);

  html = relink(html, base, lang);
  html = legalLinks(html, base, lang);
  html = html.replace("<!--SEO-->", seoHead(lang, base).trimStart());
  html = html.replace(/<html lang="es"><!--HTMLATTRS-->/, `<html lang="${lang}" data-page-lang="${lang}"${base ? ` data-base="${base}"` : ""}>`);
  html = html.replaceAll("__V__", VERSION);

  const dir = lang === DEFAULT ? OUT : join(OUT, lang);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), html);
  const left = (html.match(/data-i18n="/g) || []).length;
  return `${lang}: ${pageUrl(lang)} (${left} textos traducidos en el HTML)`;
}

function buildSitemap() {
  const alts = LANGS.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${pageUrl(l)}"/>`).join("\n");
  const urls = LANGS.map((l) => `  <url>
    <loc>${pageUrl(l)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${l === DEFAULT ? "1.0" : "0.9"}</priority>
${alts}
    <xhtml:link rel="alternate" hreflang="x-default" href="${pageUrl(DEFAULT)}"/>
  </url>`).join("\n");
  writeFileSync(join(OUT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`);
  writeFileSync(join(OUT, "robots.txt"), `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`);
  writeFileSync(join(OUT, "site.webmanifest"), JSON.stringify({
    name: "Ozmetra", short_name: "Ozmetra", lang: DEFAULT, start_url: "/",
    display: "browser", background_color: "#F5F1E8", theme_color: "#0F2B24",
    icons: [
      { src: "/assets/ozmetra-icono-app-192.png", sizes: "192x192", type: "image/png" },
      { src: "/assets/ozmetra-icono-app-512.png", sizes: "512x512", type: "image/png" },
    ],
  }, null, 2) + "\n");
}

console.log(`SITE_URL = ${SITE_URL}`);
for (const l of LANGS) console.log(buildPage(l));
buildSitemap();
console.log("sitemap.xml, robots.txt, site.webmanifest");
if (SITE_URL.includes("REEMPLAZAR")) console.warn("AVISO: SITE_URL es provisional. Ejecuta: SITE_URL=https://tu-dominio node tools/build-pages.mjs");
