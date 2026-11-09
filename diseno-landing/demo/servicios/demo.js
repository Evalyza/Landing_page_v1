// Ozmetra demo: assessment of the Services dimension, scripted for screen-sharing.
// Every text and score comes from data.js (window.DEMO); this file only lays it out and
// drives the five screens. Nothing is recomputed: the only derived figures are counts.
//
// Keys: → or Space next, ← previous, R restart, Esc closes the evidence drawer.
// Pressing "next" while an animation runs finishes it instead of moving on.
(() => {
  const D = window.DEMO;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const STEPS = ["Bienvenida", "Documentos", "Lo que hemos encontrado", "Entrevista", "Resultados"];
  const DIMENSIONES = [D.meta.dimension, "Gobierno organizativo", "Clientes y consumidores", "Personas"];
  const NIVELES = ["Incompleto", "Realizado", "Gestionado", "Establecido"];
  const PRIORIDADES = ["Alta", "Media", "Baja"];
  const RECS_VISIBLES = 8;
  const ESTADOS = {
    cumplido: ["Encontrado", "ok"],
    parcial: ["Parcial", "watch"],
    no: ["No encontrado", "none"],
    pendiente: ["Lo veremos en la entrevista", "pending"],
  };
  const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

  // ---- Lookups over data.js ----
  const docs = Object.fromEntries(D.documentos.map((d) => [d.id, d]));
  const procs = Object.fromEntries(D.procesos.map((p) => [p.id, p]));
  const items = D.procesos.flatMap((p) => p.tareas.flatMap((t) => t.items.map((i) => ({ ...i, p, t, key: `${t.id}-${i.codigo}` }))));
  const itemByKey = Object.fromEntries(items.map((i) => [i.key, i]));
  const pendientes = items.filter((i) => i.previo === "pendiente");
  const turns = D.entrevista;
  const MSGS = turns.flatMap((t) => [{ kind: "q", t }, { kind: "a", t }]);

  // ---- Formatting ----
  const num = (n) => n.toLocaleString("es-ES", { maximumFractionDigits: 1 });
  const pct = (n) => `${num(n)} %`;
  const fecha = (iso) => { const [y, m, d] = iso.split("-").map(Number); return `${d} de ${MESES[m - 1]} de ${y}`; };
  const nivel = (n) => `Nivel ${n} · ${NIVELES[n]}`;
  const lista = (arr) => new Intl.ListFormat("es", { type: "conjunction" }).format(arr);
  const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
  const peso = (b) => (b < 1e6 ? `${num(Math.max(1, Math.round(b / 1e3)))} KB` : `${num(Math.round(b / 1e5) / 10)} MB`);

  const ICONS = {
    check: '<path d="M4.5 12.5l5 5L19.5 7"/>',
    x: '<path d="M7 7l10 10M17 7L7 17"/>',
    upload: '<path d="M12 15V4M7.5 8.5L12 4l4.5 4.5"/><path d="M4 14.5V19a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4.5"/>',
    file: '<path d="M14 3H6.5a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V7.5z"/><path d="M14 3v4.5h4.5M9 13h6M9 16.5h4"/>',
    chevron: '<path d="M6.5 9.5l5.5 5.5 5.5-5.5"/>',
    chat: '<path d="M4 5.5h16v10.5H10l-6 4z"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8.5 11V8a3.5 3.5 0 0 1 7 0v3"/>',
  };
  const icon = (n, cls = "") => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[n]}</svg>`;
  const chip = (estado) => { const [txt, cls] = ESTADOS[estado]; return `<span class="chip chip-${cls}">${txt}</span>`; };

  // Evidence button: opens the drawer. `fase` says which status the drawer shows (previo or final).
  function evidence(it, fase) {
    const ev = it.evidencia;
    const src = ev.doc ? docs[ev.doc].nombre : "Entrevista";
    return `<button class="evidence" type="button" data-evidence="${it.key}" data-fase="${fase}">
      <span class="evidence-src">${icon(ev.doc ? "file" : "chat")}${esc(src)}</span>
      <q class="evidence-quote">${esc(ev.cita)}</q>
    </button>`;
  }

  // ---- Timers and the animation in progress ----
  const timers = new Set();
  const later = (fn, ms) => { const id = setTimeout(() => { timers.delete(id); fn(); }, ms); timers.add(id); };
  const clearTimers = () => { timers.forEach(clearTimeout); timers.clear(); };
  let pending = null; // { finish } puts the running animation in its end state
  let instant = false; // set while jumping ahead: every animation ends at once
  const quick = () => REDUCED || instant;
  function finishPending() {
    clearTimers();
    const p = pending;
    pending = null;
    p?.finish();
  }

  let state;
  const fresh = () => ({ screen: 1, revealed: 0, chatDone: false, recsOpen: false });
  let gen = 0; // bumped on restart, so a file picked before it never lands afterwards

  // =====================================================================
  // Screen 1 · Bienvenida
  // =====================================================================
  function buildBienvenida() {
    const e = D.empresa;
    return `<div class="wrap">
      <header class="screen-head">
        <h1 class="display">Diagnóstico de procesos · ${esc(D.meta.dimension)}</h1>
        <p class="lead">${esc(D.meta.metodo)}</p>
      </header>
      <div class="s1-grid">
        <article class="panel company">
          <p class="kicker">Empresa</p>
          <h2 class="title">${esc(e.nombre)}</h2>
          <p class="company-desc">${esc(e.descripcion)}</p>
          <p class="kicker">Servicios</p>
          <ul class="service-list">${e.servicios.map((s) => `<li>${icon("check")}<span>${esc(s)}</span></li>`).join("")}</ul>
        </article>
        <div class="dims">
          <p class="kicker">Dimensiones de LightSME</p>
          <ul class="dims-grid">${DIMENSIONES.map((d, i) => `
            <li class="dim ${i ? "is-soon" : "is-active"}">
              <span class="dim-name">${esc(d)}</span>
              ${i ? `<span class="tag tag-muted">${icon("lock")}Próximamente</span>` : `<span class="dim-meta">${D.procesos.length} procesos</span>`}
            </li>`).join("")}
          </ul>
        </div>
      </div>
      <ol class="how">
        <li><span class="how-n">1</span><span>Suba lo que ya tenga</span></li>
        <li><span class="how-n">2</span><span>Le preguntamos solo lo que falta</span></li>
        <li><span class="how-n">3</span><span>Reciba su nivel y qué mejorar</span></li>
      </ol>
    </div>`;
  }

  // =====================================================================
  // Screen 2 · Documentos
  // =====================================================================
  function buildDocumentos() {
    return `<div class="wrap">
      <header class="screen-head">
        <h1 class="headline">Suba lo que tenga. Nada es obligatorio.</h1>
        <p class="lead">Sirven capturas y enlaces. Le recomendamos ocultar datos personales de sus clientes.</p>
      </header>
      <ol class="slots">${D.documentos.map((d, i) => `
        <li class="slot" data-slot="${i}">
          <p class="slot-pide">${esc(d.pide)}</p>
          <button class="slot-empty" type="button">${icon("upload")}<span>Arrastre aquí o elija un archivo</span></button>
          <input class="slot-input" type="file" data-input="${i}" tabindex="-1" hidden>
          <div class="slot-file">
            <span class="slot-ic">${icon("file")}</span>
            <span class="slot-meta"><span class="slot-name">${esc(d.nombre)}</span><span class="slot-type">${esc(d.tipo)}</span></span>
            <span class="slot-check">${icon("check")}</span>
            <span class="slot-bar"><i></i></span>
          </div>
        </li>`).join("")}
      </ol>
      <p class="slots-count" data-slots-count></p>
    </div>`;
  }

  const slotEl = (i) => $(`[data-slot="${i}"]`);
  const setSlot = (i, s) => {
    const el = slotEl(i);
    el.classList.toggle("is-loading", s === "loading");
    el.classList.toggle("is-done", s === "done");
  };
  const allUploaded = () => $$(".slot.is-done").length === D.documentos.length;
  const slotsCount = () => {
    const done = $$(".slot.is-done").length;
    $("[data-slots-count]").textContent = `${done} de ${plural(D.documentos.length, "documento recibido", "documentos recibidos")}`;
  };
  function completeUploads() {
    D.documentos.forEach((_, i) => setSlot(i, "done"));
    slotsCount();
  }
  // "Next" simulates the slots the presenter has not filled by hand
  function startUploads() {
    const todo = D.documentos.map((_, i) => i).filter((i) => !slotEl(i).matches(".is-done, .is-loading"));
    if (quick() || !todo.length) return completeUploads();
    todo.forEach((i, k) => {
      later(() => setSlot(i, "loading"), k * 400);
      later(() => { setSlot(i, "done"); slotsCount(); }, k * 400 + 340);
    });
    pending = { finish: completeUploads };
    later(() => { pending = null; }, todo.length * 400);
  }

  // A file picked or dropped by the presenter: it fills the slot with its name and size.
  // The file is never read nor sent anywhere; the rest of the demo still uses data.js.
  function pickFile(i, file) {
    if (!file) return;
    const el = slotEl(i);
    const g = gen;
    $(".slot-name", el).textContent = file.name;
    $(".slot-type", el).textContent = `${D.documentos[i].tipo} · ${peso(file.size)}`;
    el.classList.remove("is-loading", "is-done");
    void el.offsetWidth; // restart the progress bar
    setSlot(i, "loading");
    setTimeout(() => { if (g === gen && el.isConnected) { setSlot(i, "done"); slotsCount(); } }, quick() ? 0 : 400);
  }

  // =====================================================================
  // Screen 3 · Lo que hemos encontrado (status from `previo`, no scores)
  // =====================================================================
  function buildHallazgos() {
    return `<div class="wrap">
      <header class="screen-head"><h1 class="headline">Lo que hemos encontrado en sus documentos</h1></header>
      <div class="accs">${D.procesos.map((p, n) => {
        const its = items.filter((i) => i.p === p);
        const conEv = its.filter((i) => i.evidencia?.doc).length;
        return accordion(p.id, n === 0, `
          <span class="code">${p.id}</span>
          <span class="acc-name">${esc(p.nombre)}</span>
          <span class="tag tag-band">${esc(p.banda)}</span>
          <span class="acc-count">${conEv} de ${its.length} puntos con evidencia</span>`,
          p.tareas.map((t) => taskBlock(t, "previo")).join(""));
      }).join("")}
      </div>
      <p class="summary">${icon("chat")}<span><strong>${plural(pendientes.length, "punto pendiente", "puntos pendientes")}.</strong> Le haremos ${plural(turns.length, "pregunta", "preguntas")} para completarlos.</span></p>
    </div>`;
  }

  function accordion(id, open, head, body, cls = "") {
    return `<section class="acc ${cls}${open ? " is-open" : ""}">
      <h2 class="acc-h"><button class="acc-btn" type="button" aria-expanded="${open}" aria-controls="acc-${id}">${head}${icon("chevron", "acc-chev")}</button></h2>
      <div class="acc-body" id="acc-${id}"${open ? "" : " hidden"}>${body}</div>
    </section>`;
  }
  function toggleAcc(btn) {
    const acc = btn.closest(".acc");
    const open = !acc.classList.contains("is-open");
    acc.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", String(open));
    $(".acc-body", acc).hidden = !open;
  }

  // One task with its items. On screen 3 only document evidence exists yet.
  function taskBlock(t, fase, extra = "") {
    return `<div class="task">
      <h3 class="task-h"><span class="code">${t.id}</span><span>${esc(t.nombre)}</span>${extra}</h3>
      <ul class="items">${t.items.map((raw) => {
        const it = itemByKey[`${t.id}-${raw.codigo}`];
        const ev = it.evidencia && (fase === "final" || it.evidencia.doc) ? evidence(it, fase) : "";
        return `<li class="item">
          <span class="item-code">${it.codigo}</span>
          <div class="item-main"><p class="item-text">${esc(it.texto)}</p>${ev}</div>
          ${chip(it[fase])}
        </li>`;
      }).join("")}</ul>
    </div>`;
  }

  // =====================================================================
  // Screen 4 · Entrevista
  // =====================================================================
  function buildEntrevista() {
    return `<div class="wrap">
      <header class="screen-head"><h1 class="headline">Le preguntamos solo lo que falta</h1></header>
      <div class="s4-grid">
        <section class="panel chat" aria-label="Conversación">
          <header class="panel-head"><span>Entrevista · ${esc(D.meta.dimension)}</span><span class="num" data-chat-count></span></header>
          <div class="chat-log" data-chat-log aria-live="polite">
            <p class="chat-empty" data-chat-empty>La entrevista empieza al pulsar Siguiente.</p>
          </div>
        </section>
        <aside class="panel pend" aria-label="Puntos pendientes">
          <header class="panel-head"><span>Puntos pendientes</span><span class="num" data-pend-count></span></header>
          <ul class="pend-list">${pendientes.map((i) => `
            <li class="pend-item" data-pend="${i.key}">
              <span class="pend-top"><span class="code">${i.t.id} ${i.codigo}</span><span class="pend-chip">${chip("pendiente")}</span></span>
              <span class="pend-text">${esc(i.texto)}</span>
            </li>`).join("")}
          </ul>
        </aside>
      </div>
    </div>`;
  }

  const chatLog = () => $("[data-chat-log]");
  const scrollChat = () => { const l = chatLog(); l.scrollTop = l.scrollHeight; };
  function chatCount() {
    const asked = MSGS.slice(0, state.revealed).filter((m) => m.kind === "q").length;
    $("[data-chat-count]").textContent = `${asked} de ${plural(turns.length, "pregunta", "preguntas")}`;
  }
  function pendCount() {
    const left = $$(".pend-item:not(.is-resolved)").length;
    $("[data-pend-count]").textContent = left ? `${left} de ${pendientes.length}` : "Completados";
  }

  // A pending item takes its final status
  function flip(it) {
    const li = $(`[data-pend="${it.key}"]`);
    if (li.classList.contains("is-resolved")) return;
    li.classList.remove("is-asked");
    li.classList.add("is-resolved");
    if (!quick()) li.classList.add("is-flash");
    $(".pend-chip", li).innerHTML = chip(it.final);
    pendCount();
  }

  function revealNext() {
    const m = MSGS[state.revealed++];
    $("[data-chat-empty]").hidden = true;
    if (m.kind === "q") ask(m.t);
    else answer(m.t, state.revealed === MSGS.length);
    chatCount();
  }

  function ask(t) {
    const el = document.createElement("div");
    el.className = "msg msg-q";
    el.innerHTML = `<span class="msg-label">${esc(t.bloque)}</span><div class="bubble"></div>`;
    chatLog().append(el);
    pendientes.filter((i) => i.evidencia?.chat === t.id).forEach((i) => $(`[data-pend="${i.key}"]`).classList.add("is-asked"));
    const bubble = $(".bubble", el);
    const done = () => { bubble.classList.remove("is-typing"); bubble.textContent = t.pregunta; scrollChat(); };
    if (quick()) return done();
    bubble.classList.add("is-typing");
    bubble.innerHTML = "<i></i><i></i><i></i>";
    scrollChat();
    pending = { finish: done };
    later(() => { pending = null; done(); }, 700);
  }

  function answer(t, last) {
    const el = document.createElement("div");
    el.className = "msg msg-a";
    el.innerHTML = `<div class="bubble"><span class="bubble-text"></span></div>`;
    chatLog().append(el);
    const txt = $(".bubble-text", el);
    const full = t.respuesta;
    const done = () => {
      txt.textContent = full;
      el.classList.remove("is-typing");
      scrollChat();
      pendientes.filter((i) => i.evidencia?.chat === t.id).forEach(flip);
      if (last) endInterview();
    };
    if (quick()) return done();
    el.classList.add("is-typing");
    const TICK = 30, TICKS = 50; // typed in about 1.5 s, whatever the length
    let k = 0;
    const step = () => {
      k++;
      txt.textContent = full.slice(0, Math.round((full.length * k) / TICKS));
      scrollChat();
      if (k < TICKS) later(step, TICK);
      else { pending = null; done(); }
    };
    pending = { finish: done };
    later(step, TICK);
  }

  // After the last answer: items with no evidence take their final status, then the result
  function endInterview() {
    const rest = pendientes.filter((i) => !i.evidencia?.chat);
    const el = document.createElement("p");
    el.className = "chat-done";
    el.innerHTML = `<span class="spinner" aria-hidden="true"></span>${icon("check", "chat-done-ic")}<span>Entrevista completada. Calculando su resultado…</span>`;
    chatLog().append(el);
    scrollChat();
    const complete = () => {
      rest.forEach(flip);
      el.classList.add("is-done");
      state.chatDone = true;
      readyNext();
    };
    if (quick()) return complete();
    rest.forEach((it, k) => later(() => flip(it), 140 * k));
    pending = { finish: complete };
    later(() => { pending = null; complete(); }, 1000);
  }

  function completeChat() {
    instant = true;
    if (pending) finishPending();
    while (state.revealed < MSGS.length) revealNext();
    instant = false;
  }

  // =====================================================================
  // Screen 5 · Resultados
  // =====================================================================
  // A process in a band above the one reached can already work well (e.g. SD1 at level 2
  // in data-faro.js): it already meets the reached band's target level and does not block
  // the next band. It is shown plainly, with a note, instead of greyed out.
  function buenNivel(p) {
    const r = D.resultado;
    return r.bandas.indexOf(p.banda) > r.bandas.indexOf(r.banda)
      && !(r.bloquean || []).includes(p.id)
      && p.nivel >= r.objetivo_por_banda[r.banda];
  }
  function buildResultados() {
    const r = D.resultado;
    const reached = r.bandas.indexOf(r.banda);
    const bloqueanIds = r.bloquean || [];
    const bloquean = bloqueanIds.length ? ` Lo bloquean: ${lista(bloqueanIds.map((id) => `${procs[id].nombre} (${id})`))}` : "";

    const ladder = r.bandas.map((b, i) => {
      const cls = i < reached ? "is-passed" : i === reached ? "is-reached" : b === r.siguiente_banda ? "is-next" : "is-later";
      const ps = D.procesos.filter((p) => p.banda === b);
      return `<li class="rung ${cls}">
        <div class="rung-top">
          <span class="rung-n">${i <= reached ? icon("check") : i + 1}</span>
          <span class="rung-name">${esc(b)}</span>
          ${i === reached ? '<span class="tag tag-accent">Alcanzado</span>' : ""}
        </div>
        <p class="rung-target">Nivel objetivo: ${nivel(r.objetivo_por_banda[b])}</p>
        <ul class="rung-procs">${ps.map((p) => buenNivel(p)
          ? `<li class="good"><span class="good-dot" aria-hidden="true"></span><span><span class="code">${p.id}</span> ${esc(p.nombre)} · ${nivel(p.nivel)}</span></li>`
          : `<li class="${p.alcanza_objetivo ? "ok" : "ko"}">${icon(p.alcanza_objetivo ? "check" : "x")}<span><span class="code">${p.id}</span> ${esc(p.nombre)}</span></li>`).join("")}</ul>
        ${b === r.siguiente_banda ? `<p class="rung-next">Siguiente: ${esc(b)}.${esc(bloquean)}</p>` : ""}
      </li>`;
    }).join("");

    const factores = D.factores.map((f) => `<li class="factor">
        <span class="factor-name">${esc(f.nombre)}<span class="factor-procs">${f.procesos.join(" · ")}</span></span>
        <span class="meter"><i style="--w:${f.pct}%"></i></span>
        <span class="num factor-pct">${pct(f.pct)}</span>
      </li>`).join("");

    const tabla = D.procesos.map((p) => accordion(`r-${p.id}`, false, `
        <span class="cell cell-proc"><span class="code">${p.id}</span><span class="cell-proc-main"><span class="acc-name">${esc(p.nombre)}</span>${buenNivel(p) ? '<span class="row-note">Buen nivel, aunque su banda aún no cuenta para el resultado</span>' : ""}</span></span>
        <span class="cell"><span class="tag tag-band">${esc(p.banda)}</span></span>
        <span class="cell num">${pct(p.pct)}</span>
        <span class="cell">${nivel(p.nivel)}</span>
        <span class="cell cell-soft">${nivel(p.objetivo)}</span>
        <span class="cell cell-ok ${p.alcanza_objetivo ? "ok" : "ko"}" aria-label="${p.alcanza_objetivo ? "Alcanza el objetivo" : "No alcanza el objetivo"}">${icon(p.alcanza_objetivo ? "check" : "x")}</span>`,
      p.tareas.map((t) => taskBlock(t, "final", `
        <span class="task-score"><span class="num">${pct(t.pct_final)}</span>
          <span class="val" title="Valoración ${t.valoracion} (escala 0–2)">Valoración<span class="pips">${[0, 1].map((k) => `<i class="${k < t.valoracion ? "on" : ""}"></i>`).join("")}</span><span class="num">${t.valoracion}</span></span>
        </span>`)).join(""),
      "acc-row")).join("");

    const recs = PRIORIDADES.map((pr) => {
      const list = D.recomendaciones.map((rec, i) => ({ ...rec, i })).filter((rec) => rec.prioridad === pr);
      if (!list.length) return "";
      const extra = list.every((rec) => rec.i >= RECS_VISIBLES);
      return `<div class="rec-group prio-${pr.toLowerCase()}${extra ? " is-extra" : ""}">
        <h3 class="rec-h"><span class="prio-dot"></span>Prioridad ${pr.toLowerCase()} <span class="num">${list.length}</span></h3>
        <ol class="recs">${list.map((rec) => `<li class="rec${rec.i >= RECS_VISIBLES ? " is-extra" : ""}"><span>${esc(rec.texto)}</span><span class="code rec-code">${rec.tarea}</span></li>`).join("")}</ol>
      </div>`;
    }).join("");

    return `<div class="wrap">
      <header class="screen-head">
        <h1 class="headline">Resultados · ${esc(D.meta.dimension)}</h1>
        <p class="lead">${esc(D.empresa.nombre)} · ${fecha(D.meta.fecha)}</p>
      </header>

      <section class="block">
        <h2 class="block-h">Banda de madurez</h2>
        <ol class="ladder">${ladder}</ol>
      </section>

      <section class="block">
        <h2 class="block-h">Factores clave</h2>
        <ul class="factors">${factores}</ul>
      </section>

      <section class="block">
        <h2 class="block-h">Procesos</h2>
        <div class="table">
          <div class="table-head" aria-hidden="true">
            <span>Proceso</span><span>Banda</span><span>Resultado</span><span>Nivel de capacidad</span><span>Nivel objetivo</span><span>Objetivo</span>
          </div>
          ${tabla}
        </div>
      </section>

      <section class="block">
        <h2 class="block-h">Recomendaciones</h2>
        <div class="rec-groups" data-recs>${recs}</div>
        ${D.recomendaciones.length > RECS_VISIBLES ? `<button class="btn btn-ghost btn-small" type="button" data-recs-toggle>Ver todas (${D.recomendaciones.length})</button>` : ""}
      </section>

      <p class="foot-note">Cada resultado está enlazado a su evidencia. Puede revisar y corregir cualquier punto antes del informe final.</p>
    </div>`;
  }

  function toggleRecs() {
    state.recsOpen = !state.recsOpen;
    $("[data-recs]").classList.toggle("is-open", state.recsOpen);
    $("[data-recs-toggle]").textContent = state.recsOpen ? "Ver menos" : `Ver todas (${D.recomendaciones.length})`;
  }

  // Factor bars grow from the left each time the screen is shown
  function growBars() {
    const bars = $$(".factor .meter");
    bars.forEach((b) => b.classList.remove("is-in"));
    if (REDUCED) return bars.forEach((b) => b.classList.add("is-in"));
    requestAnimationFrame(() => requestAnimationFrame(() => bars.forEach((b) => b.classList.add("is-in"))));
  }

  // =====================================================================
  // Evidence drawer
  // =====================================================================
  const drawer = $("[data-drawer]");
  const backdrop = $("[data-drawer-backdrop]");
  let lastTrigger = null;

  function openDrawer(btn) {
    const it = itemByKey[btn.dataset.evidence];
    const fase = btn.dataset.fase;
    const ev = it.evidencia;
    const para = `<div class="drawer-for">
      <p class="kicker">Evidencia para</p>
      <p class="drawer-item"><span class="code">${it.t.id} ${it.codigo}</span><span>${esc(it.texto)}</span>${chip(it[fase])}</p>
      <p class="drawer-proc">${esc(it.p.nombre)} · ${esc(it.t.nombre)}</p>
    </div>`;
    let kicker, title, body;
    if (ev.doc) {
      const d = docs[ev.doc];
      kicker = d.tipo;
      title = d.nombre;
      body = `<p class="kicker">Fragmento citado</p>
        <div class="sheet" aria-label="Documento">
          <div class="sheet-head">${icon("file")}<span>${esc(d.nombre)}</span></div>
          <span class="ln" style="--l:86%"></span><span class="ln" style="--l:92%"></span><span class="ln" style="--l:64%"></span>
          <p class="sheet-quote"><mark>${esc(ev.cita)}</mark></p>
          <span class="ln" style="--l:90%"></span><span class="ln" style="--l:78%"></span><span class="ln" style="--l:40%"></span>
        </div>${para}`;
    } else {
      const t = turns.find((x) => x.id === ev.chat);
      kicker = "Entrevista";
      title = t.bloque;
      body = `<div class="drawer-chat">
          <div class="msg msg-q"><span class="msg-label">Pregunta</span><div class="bubble">${esc(t.pregunta)}</div></div>
          <div class="msg msg-a"><div class="bubble">${esc(t.respuesta)}</div></div>
        </div>
        <p class="kicker">Lo que hemos anotado</p>
        <p class="drawer-note"><mark>${esc(ev.cita)}</mark></p>${para}`;
    }
    $("[data-drawer-kicker]").textContent = kicker;
    $("[data-drawer-title]").textContent = title;
    $("[data-drawer-body]").innerHTML = body;
    lastTrigger = btn;
    drawer.hidden = false;
    backdrop.hidden = false;
    $("[data-drawer-close]").focus();
  }
  function closeDrawer() {
    if (drawer.hidden) return;
    drawer.hidden = true;
    backdrop.hidden = true;
    $("[data-drawer-body]").innerHTML = "";
    lastTrigger?.focus({ preventScroll: true });
    lastTrigger = null;
  }

  // =====================================================================
  // Navigation
  // =====================================================================
  const stage = $("[data-stage]");
  const nextBtn = $("[data-next]");
  const prevBtn = $("[data-prev]");

  const readyNext = () => nextBtn.classList.toggle("is-ready", state.screen === 4 && state.chatDone);

  function show(n) {
    if (pending) finishPending();
    closeDrawer();
    // Jumping ahead with the step indicator completes the screens in between
    if (n >= 3 && !allUploaded()) completeUploads();
    if (n >= 5 && !state.chatDone) completeChat();
    state.screen = n;
    $$("[data-screen]").forEach((s) => s.classList.toggle("is-active", Number(s.dataset.screen) === n));
    $$("[data-step]").forEach((b) => {
      const k = Number(b.dataset.step);
      b.classList.toggle("is-done", k < n);
      if (k === n) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current");
    });
    prevBtn.disabled = n === 1;
    nextBtn.disabled = n === STEPS.length;
    $("[data-keys]").textContent = `Paso ${n} de ${STEPS.length} · → o Espacio: siguiente · ←: anterior · R: reiniciar`;
    stage.scrollTop = 0;
    readyNext();
    if (n === 4) scrollChat();
    if (n === 5) growBars();
  }

  function next() {
    if (pending) return finishPending();
    if (state.screen === 2 && !allUploaded()) return startUploads();
    if (state.screen === 4 && !state.chatDone) return revealNext();
    if (state.screen < STEPS.length) show(state.screen + 1);
  }
  const prev = () => { if (state.screen > 1) show(state.screen - 1); };

  function restart() {
    clearTimers();
    pending = null;
    instant = false;
    closeDrawer();
    state = fresh();
    gen++;
    $('[data-screen="1"]').innerHTML = buildBienvenida();
    $('[data-screen="2"]').innerHTML = buildDocumentos();
    $('[data-screen="3"]').innerHTML = buildHallazgos();
    $('[data-screen="4"]').innerHTML = buildEntrevista();
    $('[data-screen="5"]').innerHTML = buildResultados();
    slotsCount();
    chatCount();
    pendCount();
    show(1);
  }

  // ---- Company brand (marcas.js): its colours over the Ozmetra defaults, its logo next to ours ----
  const marca = (window.MARCAS || {})[D.empresa.slug];
  if (marca) {
    const css = document.documentElement.style;
    const s = marca.superficies || {};
    // Light companies get the light palette and the Ozmetra logo meant for light grounds
    if (marca.modo === "claro") {
      document.documentElement.dataset.modo = "claro";
      $(".logo").src = "../../assets/ozmetra-logo-horizontal.svg";
    }
    Object.entries({
      "--accent": marca.acento, "--on-accent": marca.sobreAcento, "--accent-ink": marca.acentoTexto || marca.acento,
      "--bg": s.fondo, "--bg-2": s.fondo2, "--paper": s.papel, "--line": s.linea,
      "--tinta": s.panel, "--tinta-2": s.panel2, "--tinta-3": s.panel3, "--tinta-line": s.lineaPanel,
      "--ink": s.texto, "--on-tinta": s.texto, "--ink-soft": s.textoSuave, "--on-tinta-soft": s.textoSuave,
    }).forEach(([v, val]) => { if (val) css.setProperty(v, val); });
    if (s.fondo) $('meta[name="theme-color"]').content = s.fondo;
    if (marca.logo) {
      $("[data-brands]").insertAdjacentHTML("beforeend",
        `<span class="brands-sep" aria-hidden="true"></span><img class="logo-co" src="${esc(marca.logo)}" alt="${esc(D.empresa.nombre)}" style="height:${Number(marca.logoAlto) || 28}px">`);
    }
  }
  document.title = `Demostración · Diagnóstico de procesos · ${D.meta.dimension} · ${D.empresa.nombre}`;

  // ---- Static parts ----
  $("[data-etiqueta]").textContent = D.meta.etiqueta;
  $("[data-aviso]").textContent = D.empresa.aviso;
  $("[data-steps]").innerHTML = STEPS.map((s, i) => `<li><button class="step" type="button" data-step="${i + 1}"><span class="step-n">${i + 1}</span><span class="step-label">${s}</span></button></li>`).join("");

  // ---- Events ----
  nextBtn.addEventListener("click", next);
  prevBtn.addEventListener("click", prev);
  backdrop.addEventListener("click", closeDrawer);
  document.addEventListener("click", (e) => {
    // Any click on an upload slot opens the file picker
    const slot = e.target.closest(".slot");
    if (slot && !e.target.matches(".slot-input")) return $(".slot-input", slot).click();
    const t = e.target.closest("[data-step], [data-evidence], .acc-btn, [data-recs-toggle], [data-drawer-close]");
    if (!t) return;
    if (t.dataset.step) show(Number(t.dataset.step));
    else if (t.dataset.evidence) openDrawer(t);
    else if (t.classList.contains("acc-btn")) toggleAcc(t);
    else if (t.hasAttribute("data-recs-toggle")) toggleRecs();
    else closeDrawer();
  });

  document.addEventListener("change", (e) => {
    if (!e.target.matches(".slot-input")) return;
    pickFile(Number(e.target.dataset.input), e.target.files[0]);
    e.target.value = "";
  });
  // Files can be dropped on a slot; dropped anywhere else they are ignored, so the
  // browser never navigates away from the demo to open them
  document.addEventListener("dragover", (e) => {
    e.preventDefault();
    const slot = e.target.closest?.(".slot");
    $$(".slot.is-drag").forEach((s) => s !== slot && s.classList.remove("is-drag"));
    slot?.classList.add("is-drag");
    if (e.dataTransfer) e.dataTransfer.dropEffect = slot ? "copy" : "none";
  });
  document.addEventListener("dragleave", (e) => { if (!e.relatedTarget) $$(".slot.is-drag").forEach((s) => s.classList.remove("is-drag")); });
  document.addEventListener("drop", (e) => {
    e.preventDefault();
    $$(".slot.is-drag").forEach((s) => s.classList.remove("is-drag"));
    const slot = e.target.closest?.(".slot");
    if (slot) pickFile(Number(slot.dataset.slot), e.dataTransfer?.files[0]);
  });

  // Space is a navigation key here: it never scrolls the page nor clicks the focused button
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key;
    const nav = k === "ArrowRight" || k === "ArrowLeft" || k === " " || k === "Escape" || k === "r" || k === "R";
    if (!nav) return;
    e.preventDefault();
    if (e.repeat) return;
    if (!drawer.hidden && k !== "r" && k !== "R") return closeDrawer();
    if (k === "ArrowRight" || k === " ") next();
    else if (k === "ArrowLeft") prev();
    else if (k === "r" || k === "R") restart();
  });
  document.addEventListener("keyup", (e) => { if (e.key === " ") e.preventDefault(); });

  restart();
})();
