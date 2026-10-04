// Ozmetra legal pages: renders LEGAL[doc][lang] and shares the language switch with the landing
(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const doc = document.body.dataset.doc; // "terms" | "privacy"
  const LANGS = Object.keys(window.LEGAL[doc]);

  const store = {
    get: () => { try { return localStorage.getItem("ozmetra-lang"); } catch { return null; } },
    set: (v) => { try { localStorage.setItem("ozmetra-lang", v); } catch { /* private mode */ } },
  };
  const fromUrl = new URLSearchParams(location.search).get("lang");
  const fromBrowser = (navigator.language || "es").slice(0, 2);
  let lang = [fromUrl, store.get(), fromBrowser].find((l) => LANGS.includes(l)) || "es";

  const t = (key) => window.I18N[lang][key] ?? window.I18N.es[key] ?? key;
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Legal data fills the tokens; a value still in [BRACKETS] is highlighted as pending.
  // Cross-links point to the other legal page and the email opens the mail client.
  function inline(text) {
    const ph = window.LEGAL.placeholders[lang];
    return esc(text).replace(/\{\{(\w+)\}\}/g, (_, k) => {
      if (k === "PRIVACY") return `<a href="privacidad.html">${esc(ph.PRIVACY)}</a>`;
      if (k === "TERMS") return `<a href="terminos.html">${esc(ph.TERMS)}</a>`;
      const v = ph[k] ?? k;
      if (v.startsWith("[")) return `<mark class="todo">${esc(v)}</mark>`;
      if (k === "EMAIL") return `<a href="mailto:${esc(v)}">${esc(v)}</a>`;
      return esc(v);
    });
  }
  const block = (b) => Array.isArray(b)
    ? `<ul>${b.map((li) => `<li>${inline(li)}</li>`).join("")}</ul>`
    : `<p>${inline(b)}</p>`;

  function render() {
    const d = window.LEGAL[doc][lang];
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach((n) => (n.textContent = t(n.dataset.i18n)));
    $$("[data-i18n-aria]").forEach((n) => n.setAttribute("aria-label", t(n.dataset.i18nAria)));
    // Links back to the landing go to that language's own page (/, /en/, /fr/…)
    $$("a[data-home]").forEach((a) => {
      a.href = `${lang === "es" ? "index.html" : `${lang}/`}${a.dataset.home}`;
    });
    $$('a[href^="terminos.html"], a[href^="privacidad.html"]').forEach((a) => {
      a.href = `${a.getAttribute("href").split("?")[0]}${lang === "es" ? "" : `?lang=${lang}`}`;
    });

    $("[data-doc-title]").textContent = d.title;
    $("[data-doc-intro]").innerHTML = d.intro.map(block).join("");
    $("[data-doc-body]").innerHTML = d.sections.map((s, i) => `
      <section class="legal-section" id="s-${i + 1}" aria-labelledby="h-${i + 1}">
        <h2 id="h-${i + 1}"><span class="legal-num mono">${i + 1}.</span> ${esc(s.h)}</h2>
        ${s.b.map(block).join("")}
      </section>`).join("");
    const toc = d.sections.map((s, i) => `<li><a href="#s-${i + 1}" data-toc-link="${i + 1}">${esc(s.h)}</a></li>`).join("");
    $$("[data-toc]").forEach((ol) => (ol.innerHTML = toc));
    observeSections();
  }

  // Highlight the section being read in the desktop table of contents
  let obs;
  function observeSections() {
    obs?.disconnect();
    obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const n = e.target.id.slice(2);
        $$("[data-toc-link]").forEach((a) => a.toggleAttribute("aria-current", a.dataset.tocLink === n));
      });
    }, { rootMargin: "-20% 0px -70% 0px" });
    $$(".legal-section").forEach((s) => obs.observe(s));
  }

  // Close the mobile table of contents after picking a section
  document.addEventListener("click", (e) => {
    if (e.target.closest(".legal-toc-mobile a")) $(".legal-toc-mobile").open = false;
  });

  const select = $("[data-lang]");
  select.value = lang;
  select.addEventListener("change", () => { lang = select.value; store.set(lang); render(); });
  render();
  if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
})();
