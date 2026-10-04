// Ozmetra · Recursos: table of contents, attribution and the downloadable resource.
// The resource (checklist with score, or editable template) unlocks after the email
// form, which calls the validating Supabase function download_resource.
(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const store = {
    get(k, fallback = null) { try { const v = localStorage.getItem(k); return v === null ? fallback : JSON.parse(v); } catch { return fallback; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } },
  };

  const slug = document.body.dataset.article;

  // First article of the visit: the home page sends it with a waitlist sign-up
  if (slug) {
    try { if (!sessionStorage.getItem("ozmetra-articulo")) sessionStorage.setItem("ozmetra-articulo", slug); } catch { /* private mode */ }
  }

  /* ---------- Table of contents: highlight the section in view ---------- */
  const tocLinks = $$(".rc-toc a[href^='#']");
  if (tocLinks.length && "IntersectionObserver" in window) {
    const byId = new Map(tocLinks.map((a) => [a.getAttribute("href").slice(1), a]));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        tocLinks.forEach((a) => a.classList.remove("is-active"));
        byId.get(e.target.id)?.classList.add("is-active");
      });
    }, { rootMargin: "-20% 0px -70% 0px" });
    byId.forEach((_, id) => { const el = document.getElementById(id); if (el) io.observe(el); });
  }

  /* ---------- Resource ---------- */
  const box = $("[data-resource]");
  if (!box) return;
  const data = JSON.parse($("[data-resource-json]", box).textContent);
  const form = $("[data-gate]", box);
  const tool = $("[data-tool]", box);
  const UNLOCKED = "ozmetra-recursos";
  const STATE = `ozmetra-recurso-${slug}`;

  const SUPABASE_URL = "https://oobfyooytxscmqkrwemj.supabase.co";
  const SUPABASE_KEY = "sb_publishable_WlHIirz5kR1zG_LIIwNTRw_or0vUlkf";
  const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;

  async function rpc(fn, args) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 12000);
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
        method: "POST",
        headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" },
        body: JSON.stringify(args),
        signal: ctrl.signal,
      });
      if (!res.ok) throw new Error(`${fn} ${res.status}`);
    } finally {
      clearTimeout(timer);
    }
  }

  function unlock(focus) {
    form.hidden = true;
    tool.hidden = false;
    if (data.tipo === "plantilla") renderTemplate(); else renderChecklist();
    if (focus) tool.querySelector("h3, th, input")?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "nearest" });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = form.elements.email, consent = form.elements.consent, marketing = form.elements.marketing;
    const msg = $(".field-msg", form), btn = $("button[type=submit]", form);
    msg.className = "field-msg";
    [email, consent].forEach((el) => el.removeAttribute("aria-invalid"));
    const v = email.value.trim();
    if (!EMAIL_RE.test(v)) {
      msg.classList.add("is-error");
      msg.textContent = v ? "Revisa el email, parece que falta algo." : "Escribe tu email para recibir el recurso.";
      email.setAttribute("aria-invalid", "true");
      return email.focus();
    }
    if (!consent.checked) {
      msg.classList.add("is-error");
      msg.textContent = "Para continuar, acepta los Términos y la Política de Privacidad.";
      consent.setAttribute("aria-invalid", "true");
      return consent.focus();
    }
    btn.disabled = true;
    const label = $(".btn-label", btn), text = label.textContent;
    label.innerHTML = '<span class="spinner" aria-hidden="true"></span>Enviando';
    try {
      await rpc("download_resource", {
        p_email: v, p_article: slug, p_lang: "es", p_consent: true, p_marketing_consent: marketing.checked,
      });
    } catch {
      btn.disabled = false;
      label.textContent = text;
      msg.classList.add("is-error");
      msg.textContent = "No hemos podido enviarlo. Inténtalo de nuevo en un momento.";
      return;
    }
    store.set(UNLOCKED, [...new Set([...(store.get(UNLOCKED, []) || []), slug])]);
    unlock(true);
  });

  if ((store.get(UNLOCKED, []) || []).includes(slug)) unlock(false);

  /* ---------- Checklist with score ---------- */
  function levelFor(score) {
    const levels = [...(data.niveles || [])].sort((a, b) => b.desde - a.desde);
    return levels.find((l) => score >= l.desde) || levels.at(-1) || { titulo: "", texto: "" };
  }

  function renderChecklist() {
    const checked = new Set(store.get(STATE, []) || []);
    tool.innerHTML = `
      <div class="rc-score" aria-live="polite">
        <span class="rc-score-num" data-score>0<small>/100</small></span>
        <div><p class="rc-score-level" data-level></p><div class="rc-bar" style="margin-top:10px"><i data-total-bar></i></div></div>
        <p class="rc-score-text" data-level-text></p>
      </div>
      ${data.secciones.map((s, si) => `
        <section class="rc-sec">
          <div class="rc-sec-head"><h3>${esc(s.titulo)}</h3><div class="rc-bar"><i data-sec-bar="${si}"></i></div><span data-sec-count="${si}"></span></div>
          ${s.items.map((it, ii) => `
            <label class="rc-item">
              <input type="checkbox" data-item="${si}-${ii}" ${checked.has(`${si}-${ii}`) ? "checked" : ""}>
              <span><b>${esc(it.texto)}${it.critico ? '<span class="rc-weight">Crítico</span>' : ""}</b>${it.detalle ? `<small>${esc(it.detalle)}</small>` : ""}</span>
            </label>`).join("")}
        </section>`).join("")}
      <p class="rc-note">Los puntos marcados como críticos cuentan el doble. Tus respuestas se guardan solo en este navegador.</p>
      <div class="rc-actions">
        <button class="btn btn-primary" type="button" data-print><i class="ph-bold ph-file-pdf" aria-hidden="true"></i><span>Descargar en PDF</span></button>
        <button class="btn btn-ghost" type="button" data-reset><i class="ph ph-arrow-counter-clockwise" aria-hidden="true"></i><span>Empezar de nuevo</span></button>
      </div>`;

    const update = () => {
      let got = 0, total = 0;
      data.secciones.forEach((s, si) => {
        let sGot = 0, sTotal = 0, n = 0;
        s.items.forEach((it, ii) => {
          const w = it.critico ? 2 : 1;
          sTotal += w;
          if ($(`[data-item="${si}-${ii}"]`, tool).checked) { sGot += w; n++; }
        });
        got += sGot; total += sTotal;
        $(`[data-sec-bar="${si}"]`, tool).style.width = `${Math.round((sGot / sTotal) * 100)}%`;
        $(`[data-sec-count="${si}"]`, tool).textContent = `${n}/${s.items.length}`;
      });
      const score = total ? Math.round((got / total) * 100) : 0;
      const level = levelFor(score);
      $("[data-score]", tool).innerHTML = `${score}<small>/100</small>`;
      $("[data-total-bar]", tool).style.width = `${score}%`;
      $("[data-level]", tool).textContent = level.titulo;
      $("[data-level-text]", tool).textContent = level.texto;
      store.set(STATE, $$("[data-item]", tool).filter((i) => i.checked).map((i) => i.dataset.item));
    };
    tool.addEventListener("change", update);
    $("[data-reset]", tool).addEventListener("click", () => { $$("[data-item]", tool).forEach((i) => (i.checked = false)); update(); });
    $("[data-print]", tool).addEventListener("click", print);
    update();
  }

  /* ---------- Editable template ---------- */
  function renderTemplate() {
    const saved = store.get(STATE, null);
    const tablas = saved?.length === data.tablas.length ? saved : data.tablas.map((t) => t.filas);
    tool.innerHTML = `
      ${data.tablas.map((t, ti) => `
        <section class="rc-sec">
          <div class="rc-sec-head"><h3>${esc(t.titulo)}</h3></div>
          ${t.descripcion ? `<p class="rc-note" style="margin:0 0 12px">${esc(t.descripcion)}</p>` : ""}
          <div class="rc-table"><table>
            <thead><tr>${t.columnas.map((c) => `<th scope="col">${esc(c)}</th>`).join("")}</tr></thead>
            <tbody>${tablas[ti].map((row, ri) => `<tr>${t.columnas.map((_, ci) => `<td contenteditable="true" data-cell="${ti}-${ri}-${ci}">${esc(row[ci] ?? "")}</td>`).join("")}</tr>`).join("")}</tbody>
          </table></div>
        </section>`).join("")}
      <p class="rc-note">${esc(data.nota || "Puedes editar las celdas aquí mismo o descargar la plantilla y completarla en Excel o Google Sheets.")}</p>
      <div class="rc-actions">
        <button class="btn btn-primary" type="button" data-csv><i class="ph-bold ph-microsoft-excel-logo" aria-hidden="true"></i><span>Descargar para Excel / Sheets</span></button>
        <button class="btn btn-ghost" type="button" data-print><i class="ph ph-file-pdf" aria-hidden="true"></i><span>Guardar en PDF</span></button>
      </div>`;

    const read = () => data.tablas.map((t, ti) => tablas[ti].map((row, ri) => t.columnas.map((_, ci) => $(`[data-cell="${ti}-${ri}-${ci}"]`, tool).textContent.trim())));
    tool.addEventListener("input", () => store.set(STATE, read()));
    $("[data-print]", tool).addEventListener("click", print);
    $("[data-csv]", tool).addEventListener("click", () => {
      // Semicolons and a BOM so Excel in Spanish opens it in columns with accents intact
      const cell = (v) => `"${String(v).replace(/"/g, '""')}"`;
      const rows = [];
      read().forEach((filas, ti) => {
        if (ti) rows.push("");
        if (data.tablas.length > 1) rows.push(cell(data.tablas[ti].titulo));
        rows.push(data.tablas[ti].columnas.map(cell).join(";"));
        filas.forEach((f) => rows.push(f.map(cell).join(";")));
      });
      const blob = new Blob(["﻿" + rows.join("\r\n")], { type: "text/csv;charset=utf-8" });
      const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: `${slug}.csv` });
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    });
  }

  function print() {
    document.body.classList.add("is-printing");
    window.addEventListener("afterprint", () => document.body.classList.remove("is-printing"), { once: true });
    window.print();
  }
})();
