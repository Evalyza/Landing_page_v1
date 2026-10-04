// Ozmetra Recursos: builds the blog at ozmetra.com/recursos/ from contenido/recursos/.
//
//   cd tools && npm ci && node build-recursos.mjs        (or: npm run todo, which also runs build-pages)
//
// Output: diseno-landing/recursos/index.html, diseno-landing/recursos/<slug>/index.html,
//         diseno-landing/recursos/<slug>/og.png and the sitemap entries.
// Run tools/build-pages.mjs too when the first article appears or the last one goes,
// so the home page shows or hides its "Recursos" link.
//
// Each article ships as static HTML (title, description, canonical, Open Graph,
// JSON-LD Article/FAQ/Breadcrumb) so it is indexable without JavaScript;
// recursos.js adds the downloadable resource behind the email form.

import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { Marked, Renderer } from "marked";
import { Resvg } from "@resvg/resvg-js";
import {
  ROOT, OUT, SITE_URL, TEMAS, PENDING_RE, articleUrl, readArticles, readAuthors, writeSitemap,
} from "./recursos-lib.mjs";

const VERSION = "1"; // cache-busting for recursos.css / recursos.js
const STYLES_VERSION = "14"; // must match the ?v= used by the landing for styles.css
const DIR = join(OUT, "recursos");

const PAPERS = [
  {
    "@type": "ScholarlyArticle",
    name: "Towards a lightweight framework for service management evaluation in SMEs",
    url: "https://doi.org/10.1007/s10257-022-00576-1",
    isPartOf: "Information Systems and e-Business Management", datePublished: "2022",
  },
  {
    "@type": "ScholarlyArticle",
    name: "Towards a Framework for Service Quality Improvement in Startup Companies",
    url: "https://hdl.handle.net/10125/109456",
    isPartOf: "HICSS 58", datePublished: "2025",
  },
];

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escAttr = (s) => esc(s).replace(/"/g, "&quot;");
const jsonLd = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, "\\u003c")}</script>`;
const slugify = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const fecha = (iso) => { const [y, m, d] = iso.split("-").map(Number); return `${d} de ${MONTHS[m - 1]} de ${y}`; };

// ---------- Markdown ----------
function renderMarkdown(md) {
  const toc = [];
  const used = new Set();
  const marked = new Marked({
    gfm: true,
    renderer: {
      heading({ tokens, depth }) {
        const html = this.parser.parseInline(tokens);
        const text = html.replace(/<[^>]+>/g, "");
        let id = slugify(text) || `seccion-${toc.length + 1}`;
        while (used.has(id)) id += "-2";
        used.add(id);
        if (depth === 2) toc.push({ id, text });
        return `<h${depth} id="${id}">${html}</h${depth}>\n`;
      },
      link({ href, title, tokens }) {
        const html = this.parser.parseInline(tokens);
        const external = /^https?:\/\//.test(href) && !href.startsWith(SITE_URL);
        return `<a href="${escAttr(href)}"${title ? ` title="${escAttr(title)}"` : ""}${external ? ' target="_blank" rel="noopener"' : ""}>${html}</a>`;
      },
      table(token) {
        return `<div class="table-wrap">${Renderer.prototype.table.call(this, token)}</div>\n`;
      },
    },
  });
  // The founder's pending blocks become a highlighted aside (and fail the PR check)
  const withPending = md.replace(PENDING_RE, (_, text) =>
    `\n\n<aside class="pending" data-pending><b>Pendiente · tu experiencia</b><p>${esc(text.trim())}</p></aside>\n\n`);
  const html = marked.parse(withPending);
  const words = md.replace(/[#>*_`\[\]()|-]/g, " ").split(/\s+/).filter(Boolean).length;
  return { html, toc, minutes: Math.max(2, Math.round(words / 220)) };
}

// ---------- Shared page chrome ----------
function head({ title, description, url, image, type = "article", extra = "" }) {
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${escAttr(description)}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="${type}">
  <meta property="og:site_name" content="Ozmetra">
  <meta property="og:locale" content="es_ES">
  <meta property="og:title" content="${escAttr(title)}">
  <meta property="og:description" content="${escAttr(description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escAttr(title)}">
  <meta name="twitter:description" content="${escAttr(description)}">
  <meta name="twitter:image" content="${image}">
${extra}
  <meta name="theme-color" content="#F5F1E8">
  <meta name="color-scheme" content="light dark">
  <link rel="icon" href="/assets/ozmetra-icono-app.svg" type="image/svg+xml">
  <link rel="icon" href="/assets/ozmetra-icono-app-192.png" type="image/png" sizes="192x192">
  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
  <link rel="alternate" type="application/rss+xml" title="Recursos · Ozmetra" href="/recursos/feed.xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700&family=Instrument+Sans:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css">
  <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/bold/style.css">
  <link rel="stylesheet" href="/styles.css?v=${STYLES_VERSION}">
  <link rel="stylesheet" href="/recursos.css?v=${VERSION}">
  <script>var t;try{t=localStorage.getItem("ozmetra-theme")}catch(e){}if(t!=="dark")document.documentElement.dataset.theme="light"</script>
</head>`;
}

const NAV = `<header class="nav is-scrolled" id="top">
  <div class="wrap">
    <a class="brand" href="/" aria-label="Ozmetra, inicio">
      <img class="logo-on-dark" src="/assets/ozmetra-logo-horizontal-blanco.svg" alt="Ozmetra" width="616" height="200"><img class="logo-on-light" src="/assets/ozmetra-logo-horizontal.svg" alt="Ozmetra" width="616" height="200">
    </a>
    <ul class="nav-links">
      <li><a href="/#como-funciona">Cómo funciona</a></li>
      <li><a href="/#iso">Normas ISO</a></li>
      <li><a href="/recursos/" aria-current="page">Recursos</a></li>
    </ul>
    <div class="nav-actions">
      <button class="theme-toggle" type="button" data-theme-toggle aria-pressed="false" aria-label="Cambiar a modo claro">
        <i class="ph ph-sun" aria-hidden="true"></i>
        <i class="ph ph-moon" aria-hidden="true"></i>
      </button>
      <a class="btn btn-dark btn-small nav-cta" href="/#lista" data-cta="nav">Unirme a la lista</a>
    </div>
  </div>
</header>`;

const FOOTER = `<footer class="footer">
  <div class="wrap">
    <a class="brand" href="/"><img class="logo-on-dark" src="/assets/ozmetra-logo-horizontal-blanco.svg" alt="Ozmetra" width="616" height="200" style="height:52px"><img class="logo-on-light" src="/assets/ozmetra-logo-horizontal.svg" alt="Ozmetra" width="616" height="200" style="height:52px"></a>
    <nav aria-label="Pie de página">
      <a href="/">Inicio</a>
      <a href="/recursos/">Recursos</a>
      <a href="/terminos.html">Términos de Servicio</a>
      <a href="/privacidad.html">Política de Privacidad</a>
    </nav>
    <span>© 2026 Ozmetra</span>
  </div>
</footer>`;

const SCRIPTS = `<script>window.I18N={es:{"theme.toLight":"Cambiar a modo claro","theme.toDark":"Cambiar a modo oscuro"}}</script>
<script src="/theme.js?v=${STYLES_VERSION}"></script>
<script src="/recursos.js?v=${VERSION}"></script>`;

// Bottom call to action: the waitlist on the home page, tagged with the article
function ctaBlock(slug) {
  return `<section class="rc-cta" aria-labelledby="cta-h">
      <div>
        <p class="rc-kicker">Ozmetra</p>
        <h2 id="cta-h">¿Quieres ver tus procesos con este nivel de detalle?</h2>
        <p>Estamos construyendo Ozmetra: una herramienta con IA que diagnostica los procesos de tu startup, los compara con lo esperado para tu fase y te dice qué arreglar primero. Buscamos fundadores que nos ayuden a darle forma.</p>
      </div>
      <a class="btn btn-primary" href="/?utm_source=blog&amp;utm_medium=organic&amp;utm_campaign=${slug}#lista" data-cta="final"><span>Unirme a la lista de espera</span><i class="ph-bold ph-arrow-right" aria-hidden="true"></i></a>
    </section>`;
}

// ---------- Downloadable resource ----------
function resourceBlock(a) {
  const r = a.recurso;
  if (!r) return "";
  const icon = r.tipo === "plantilla" ? "ph-table" : "ph-list-checks";
  const what = r.tipo === "plantilla" ? "Plantilla editable · CSV para Excel o Google Sheets" : "Checklist interactiva con puntuación · descargable en PDF";
  return `<section class="rc-resource" id="recurso" aria-labelledby="recurso-h" data-resource data-article="${a.slug}">
      <div class="rc-resource-head">
        <span class="rc-resource-icon"><i class="ph ${icon}" aria-hidden="true"></i></span>
        <div>
          <p class="rc-kicker">Recurso gratuito</p>
          <h2 id="recurso-h">${esc(r.titulo)}</h2>
          <p>${esc(r.descripcion)}</p>
          <p class="rc-resource-what">${what}</p>
        </div>
      </div>
      <form class="rc-gate" data-gate novalidate>
        <label for="rc-email">Email de trabajo</label>
        <div class="join-row">
          <input id="rc-email" name="email" type="email" autocomplete="email" placeholder="tu@startup.com" required>
          <button class="btn btn-primary" type="submit"><span class="btn-label">Obtener el recurso</span><i class="ph-bold ph-arrow-right" aria-hidden="true"></i></button>
        </div>
        <label class="consent rc-check"><input type="checkbox" name="consent" required><span>Acepto los <a href="/terminos.html" target="_blank">Términos de Servicio</a> y he leído la <a href="/privacidad.html" target="_blank">Política de Privacidad</a>. Te avisaremos cuando abramos Ozmetra.</span></label>
        <label class="consent rc-check"><input type="checkbox" name="marketing"><span>Opcional: quiero recibir por email nuevas guías y plantillas como esta (como mucho dos al mes; puedes darte de baja cuando quieras).</span></label>
        <p class="field-msg" role="status" aria-live="polite"></p>
      </form>
      <div class="rc-tool" data-tool hidden></div>
      <script type="application/json" data-resource-json>${JSON.stringify(r).replace(/</g, "\\u003c")}</script>
    </section>`;
}

// ---------- Article page ----------
function articlePage(a, all, authors) {
  const author = authors[a.autor] || Object.values(authors)[0] || { nombre: "Equipo de Ozmetra" };
  const tema = TEMAS[a.tema] || { nombre: a.tema, icono: "ph-article" };
  const url = articleUrl(a.slug);
  const image = `${SITE_URL}/recursos/${a.slug}/og.png`;
  const { html, toc, minutes } = renderMarkdown(a.markdown);
  const updated = a.actualizado || a.publicado;

  // Related: explicit list first, then the topic's pillar, then the rest of the topic
  const bySlug = new Map(all.map((x) => [x.slug, x]));
  const related = [...new Set([
    ...(a.relacionados || []),
    ...all.filter((x) => x.tema === a.tema && x.pilar).map((x) => x.slug),
    ...all.filter((x) => x.tema === a.tema).map((x) => x.slug),
  ])].filter((s) => s !== a.slug && bySlug.has(s)).slice(0, 3).map((s) => bySlug.get(s));

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article", "@id": `${url}#article`, headline: a.titulo, description: a.descripcion,
        image, datePublished: a.publicado, dateModified: updated, inLanguage: "es",
        mainEntityOfPage: url, articleSection: tema.nombre, keywords: [a.palabraClave, ...(a.palabrasSecundarias || [])].join(", "),
        author: { "@type": "Person", name: author.nombre, jobTitle: author.cargo, ...(author.url ? { url: author.url } : {}), ...(author.sameAs?.length ? { sameAs: author.sameAs } : {}) },
        publisher: { "@type": "Organization", "@id": `${SITE_URL}/#org`, name: "Ozmetra", url: `${SITE_URL}/`, logo: { "@type": "ImageObject", url: `${SITE_URL}/assets/ozmetra-icono-app-512.png` } },
        citation: PAPERS,
      },
      {
        "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Recursos", item: `${SITE_URL}/recursos/` },
          { "@type": "ListItem", position: 3, name: a.titulo, item: url },
        ],
      },
      ...(a.faq?.length ? [{
        "@type": "FAQPage", "@id": `${url}#faq`, inLanguage: "es",
        mainEntity: a.faq.map((f) => ({ "@type": "Question", name: f.pregunta, acceptedAnswer: { "@type": "Answer", text: f.respuesta } })),
      }] : []),
    ],
  };

  const extra = [
    `  <meta property="article:published_time" content="${a.publicado}">`,
    `  <meta property="article:modified_time" content="${updated}">`,
    `  <meta property="article:section" content="${escAttr(tema.nombre)}">`,
    `  ${jsonLd(ld)}`,
  ].join("\n");

  return `${head({ title: `${a.tituloSeo || a.titulo} · Ozmetra`, description: a.descripcion, url, image, extra })}
<body class="rc-page" data-article="${a.slug}">

${NAV}

<main class="rc">
  <div class="wrap">
    <nav class="rc-crumbs" aria-label="Migas de pan"><a href="/">Inicio</a><i class="ph ph-caret-right" aria-hidden="true"></i><a href="/recursos/">Recursos</a><i class="ph ph-caret-right" aria-hidden="true"></i><span>${esc(tema.nombre)}</span></nav>

    <header class="rc-head">
      <p class="rc-topic"><i class="ph ${tema.icono}" aria-hidden="true"></i>${esc(tema.nombre)}${a.pilar ? '<span class="rc-pillar">Guía principal</span>' : ""}</p>
      <h1>${esc(a.titulo)}</h1>
      <p class="rc-deck">${esc(a.entradilla || a.descripcion)}</p>
      <div class="rc-byline">
        <span class="rc-avatar" aria-hidden="true">${esc(author.iniciales || author.nombre.split(" ").map((w) => w[0]).slice(0, 2).join(""))}</span>
        <span><b>${esc(author.nombre)}</b> · ${esc(author.cargo || "")}</span>
        <span class="rc-meta"><time datetime="${updated}">Actualizado el ${fecha(updated)}</time> · ${minutes} min de lectura</span>
      </div>
    </header>

    <div class="rc-layout">
      <aside class="rc-toc" aria-labelledby="toc-h">
        <p class="rc-toc-title" id="toc-h">En este artículo</p>
        <ol>
${toc.map((h) => `          <li><a href="#${h.id}">${h.text}</a></li>`).join("\n")}
          ${a.recurso ? '<li><a href="#recurso">Recurso gratuito</a></li>' : ""}
          ${a.faq?.length ? '<li><a href="#preguntas">Preguntas frecuentes</a></li>' : ""}
        </ol>
        ${a.recurso ? `<a class="rc-toc-cta" href="#recurso"><i class="ph ph-download-simple" aria-hidden="true"></i>${esc(a.recurso.titulo)}</a>` : ""}
      </aside>

      <article class="rc-body">
        <div class="prose">
${html}
        </div>

        ${resourceBlock(a)}

        ${a.faq?.length ? `<section class="rc-faq" id="preguntas" aria-labelledby="faq-h">
          <h2 id="faq-h">Preguntas frecuentes</h2>
${a.faq.map((f) => `          <details><summary>${esc(f.pregunta)}<i class="ph ph-plus" aria-hidden="true"></i></summary><p>${esc(f.respuesta)}</p></details>`).join("\n")}
        </section>` : ""}

        <section class="rc-author" aria-label="Sobre el autor">
          <span class="rc-avatar rc-avatar-lg" aria-hidden="true">${esc(author.iniciales || "OZ")}</span>
          <div>
            <p class="rc-author-name">${esc(author.nombre)}</p>
            <p class="rc-author-role">${esc(author.cargo || "")}</p>
            <p>${esc(author.bio || "")}</p>
            <ul class="rc-papers">
              <li><a href="${PAPERS[0].url}" target="_blank" rel="noopener">LightSME · Information Systems and e-Business Management, 2022</a></li>
              <li><a href="${PAPERS[1].url}" target="_blank" rel="noopener">LightStartup · HICSS 58, 2025</a></li>
            </ul>
          </div>
        </section>

        ${ctaBlock(a.slug)}
      </article>
    </div>

    ${related.length ? `<section class="rc-related" aria-labelledby="rel-h">
      <h2 id="rel-h">Sigue leyendo</h2>
      <div class="rc-grid">
${related.map(card).join("\n")}
      </div>
    </section>` : ""}
  </div>
</main>

${FOOTER}

${SCRIPTS}
</body>
</html>
`;
}

function card(a) {
  const tema = TEMAS[a.tema] || { nombre: a.tema, icono: "ph-article" };
  return `        <a class="rc-card" href="/recursos/${a.slug}/">
          <span class="rc-topic"><i class="ph ${tema.icono}" aria-hidden="true"></i>${esc(tema.nombre)}</span>
          <span class="rc-card-title">${esc(a.titulo)}</span>
          <span class="rc-card-desc">${esc(a.descripcion)}</span>
          <span class="rc-card-foot">${a.recurso ? `<span><i class="ph ph-download-simple" aria-hidden="true"></i>${a.recurso.tipo === "plantilla" ? "Plantilla" : "Checklist"} gratis</span>` : "<span></span>"}<i class="ph ph-arrow-right" aria-hidden="true"></i></span>
        </a>`;
}

// ---------- Index page ----------
function indexPage(all) {
  const url = `${SITE_URL}/recursos/`;
  const title = "Recursos para ordenar los procesos de tu startup · Ozmetra";
  const description = "Guías, checklists y plantillas para preparar una due diligence, escalar procesos, fijar OKR, preparar la ISO 9001 y medir la madurez de tu startup.";
  const groups = Object.entries(TEMAS)
    .map(([key, t]) => ({ key, t, items: all.filter((a) => a.tema === key).sort((x, y) => (y.pilar ? 1 : 0) - (x.pilar ? 1 : 0)) }))
    .filter((g) => g.items.length);
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "CollectionPage", "@id": `${url}#page`, url, name: title, description, inLanguage: "es", isPartOf: { "@id": `${SITE_URL}/#website` } },
      { "@type": "ItemList", itemListElement: all.map((a, i) => ({ "@type": "ListItem", position: i + 1, url: articleUrl(a.slug), name: a.titulo })) },
    ],
  };
  return `${head({ title, description, url, image: `${SITE_URL}/og/og-es.png`, type: "website", extra: `  ${jsonLd(ld)}` })}
<body class="rc-page rc-index">

${NAV}

<main class="rc">
  <div class="wrap">
    <header class="rc-index-head">
      <p class="rc-kicker">Recursos</p>
      <h1>Procesos claros para una startup que crece</h1>
      <p class="rc-deck">Guías prácticas con checklists y plantillas gratuitas. Escritas desde el método de Ozmetra, basado en los marcos LightStartup y LightSME de la Universidad Rey Juan Carlos.</p>
    </header>
${groups.map((g) => `
    <section class="rc-group" aria-labelledby="g-${g.key}">
      <h2 id="g-${g.key}"><i class="ph ${g.t.icono}" aria-hidden="true"></i>${esc(g.t.nombre)}</h2>
      <div class="rc-grid">
${g.items.map(card).join("\n")}
      </div>
    </section>`).join("\n")}

    ${ctaBlock("recursos")}
  </div>
</main>

${FOOTER}

${SCRIPTS}
</body>
</html>
`;
}

// ---------- RSS ----------
function feed(all) {
  const items = all.slice(0, 30).map((a) => `    <item>
      <title>${esc(a.titulo)}</title>
      <link>${articleUrl(a.slug)}</link>
      <guid>${articleUrl(a.slug)}</guid>
      <pubDate>${new Date(`${a.publicado}T08:00:00Z`).toUTCString()}</pubDate>
      <description>${esc(a.descripcion)}</description>
    </item>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Recursos · Ozmetra</title>
    <link>${SITE_URL}/recursos/</link>
    <description>Guías, checklists y plantillas para los procesos de tu startup.</description>
    <language>es-es</language>
${items}
  </channel>
</rss>
`;
}

// ---------- Social card (1200x630 PNG, rendered without a browser) ----------
const FONT_DIR = join(ROOT, "tools", "fonts");
const LOGO = `data:image/svg+xml;base64,${readFileSync(join(OUT, "assets", "ozmetra-logo-horizontal-blanco.svg")).toString("base64")}`;
const SYMBOL = `data:image/svg+xml;base64,${readFileSync(join(OUT, "assets", "ozmetra-simbolo-claro.svg")).toString("base64")}`;

// Greedy wrap by an approximate glyph width (Bricolage Grotesque Bold ≈ 0.53em)
function wrap(text, size, width) {
  const max = Math.floor(width / (size * 0.53));
  const lines = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    if ((line + " " + word).trim().length > max && line) { lines.push(line); line = word; } else line = (line + " " + word).trim();
  }
  if (line) lines.push(line);
  return lines;
}

function ogImage(a, authorName) {
  const tema = TEMAS[a.tema]?.nombre || "Recursos";
  let size = 64, lines = wrap(a.titulo, size, 780);
  while (lines.length > 3 && size > 44) { size -= 4; lines = wrap(a.titulo, size, 780); }
  const top = 268 + size * 0.75; // first baseline, under the topic chip
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0f2b24"/>
  <image href="${LOGO}" x="66" y="52" width="216" height="70"/>
  <image href="${SYMBOL}" x="900" y="175" width="280" height="280" opacity="0.9"/>
  <rect x="80" y="190" rx="18" width="${tema.length * 11 + 44}" height="36" fill="#163a31"/>
  <text x="102" y="214" font-family="Instrument Sans" font-weight="500" font-size="19" fill="#a9c4b8">${esc(tema)}</text>
  ${lines.map((l, i) => `<text x="80" y="${top + i * size * 1.08}" font-family="Bricolage Grotesque" font-weight="700" font-size="${size}" letter-spacing="-1.5" fill="#f5f1e8">${esc(l)}</text>`).join("\n  ")}
  <rect x="80" y="540" width="64" height="8" rx="4" fill="#c6f24e"/>
  <text x="164" y="550" font-family="Instrument Sans" font-size="24" fill="#a9c4b8">${esc(authorName)} · ozmetra.com/recursos</text>
</svg>`;
  const png = new Resvg(svg, {
    fitTo: { mode: "width", value: 1200 },
    font: { fontFiles: readdirSync(FONT_DIR).filter((f) => f.endsWith(".ttf")).map((f) => join(FONT_DIR, f)), loadSystemFonts: false, defaultFontFamily: "Instrument Sans" },
  }).render().asPng();
  return png;
}

// ---------- Build ----------
const articles = readArticles();
const authors = readAuthors();

// Validate before writing anything
const slugs = new Set();
for (const a of articles) {
  for (const k of ["slug", "titulo", "descripcion", "tema", "publicado", "palabraClave"]) {
    if (!a[k]) throw new Error(`${a.dir}/datos.json: falta "${k}"`);
  }
  if (!/^[a-z0-9-]{1,120}$/.test(a.slug)) throw new Error(`Slug no válido: ${a.slug}`);
  if (slugs.has(a.slug)) throw new Error(`Slug repetido: ${a.slug}`);
  slugs.add(a.slug);
  if (a.descripcion.length > 170) console.warn(`AVISO ${a.slug}: la descripción tiene ${a.descripcion.length} caracteres (Google muestra unos 155).`);
}

// Remove pages of articles that no longer exist
if (existsSync(DIR)) {
  for (const d of readdirSync(DIR, { withFileTypes: true })) {
    if (d.isDirectory() && !slugs.has(d.name)) rmSync(join(DIR, d.name), { recursive: true });
  }
}

if (articles.length) {
  mkdirSync(DIR, { recursive: true });
  for (const a of articles) {
    const dir = join(DIR, a.slug);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), articlePage(a, articles, authors));
    writeFileSync(join(dir, "og.png"), ogImage(a, (authors[a.autor] || {}).nombre || "Ozmetra"));
    const pending = (a.markdown.match(PENDING_RE) || []).length;
    console.log(`/recursos/${a.slug}/${pending ? `  (${pending} bloque(s) pendientes de tu experiencia)` : ""}`);
  }
  writeFileSync(join(DIR, "index.html"), indexPage(articles));
  writeFileSync(join(DIR, "feed.xml"), feed(articles));
} else if (existsSync(DIR)) {
  rmSync(DIR, { recursive: true });
}
writeSitemap(articles);
console.log(`${articles.length} artículo(s) · sitemap.xml actualizado`);
