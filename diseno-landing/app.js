// Evalyza landing: design prototype interactions (vanilla JS, no build step)
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /* ---------- i18n ---------- */
  const LANGS = Object.keys(window.I18N);
  const store = {
    get: () => { try { return localStorage.getItem("evalyza-lang"); } catch { return null; } },
    set: (v) => { try { localStorage.setItem("evalyza-lang", v); } catch { /* private mode */ } },
  };
  const fromUrl = new URLSearchParams(location.search).get("lang");
  const fromBrowser = (navigator.language || "es").slice(0, 2);
  let lang = [fromUrl, store.get(), fromBrowser].find((l) => LANGS.includes(l)) || "es";

  const t = (key, vars = {}) => {
    const v = window.I18N[lang][key] ?? window.I18N.es[key] ?? key;
    return typeof v === "string" ? v.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "") : v;
  };
  const langListeners = [];
  const onLang = (fn) => langListeners.push(fn);

  function applyStatic() {
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach((n) => (n.textContent = t(n.dataset.i18n)));
    $$("[data-i18n-ph]").forEach((n) => (n.placeholder = t(n.dataset.i18nPh)));
    $$("[data-i18n-aria]").forEach((n) => n.setAttribute("aria-label", t(n.dataset.i18nAria)));
    $$("[data-i18n-content]").forEach((n) => n.setAttribute("content", t(n.dataset.i18nContent)));
  }
  function setLang(next) {
    lang = next;
    store.set(next);
    $("[data-lang]").value = next;
    applyStatic();
    langListeners.forEach((fn) => fn());
  }
  $("[data-lang]").addEventListener("change", (e) => setLang(e.target.value));

  /* ---------- Nav border on scroll ---------- */
  const nav = $(".nav");
  const sentinel = document.createElement("div");
  sentinel.style.cssText = "position:absolute;top:8px;height:1px;width:1px";
  document.body.prepend(sentinel);
  new IntersectionObserver(([e]) => nav.classList.toggle("is-scrolled", !e.isIntersecting)).observe(sentinel);

  /* ---------- Hero agent console ---------- */
  const consoleEl = $("[data-console]");
  const agents = $$(".agent", consoleEl);
  const findings = $$(".finding", consoleEl);
  const bars = $$(".bar", consoleEl);
  const progress = $("[data-progress]", consoleEl);
  // Current text state kept as keys so a language switch can re-render mid-run
  const agentState = agents.map(() => ["status.waiting", {}]);
  let progressState = ["prog.prep", {}];
  let timers = [];

  const at = (ms, fn) => timers.push(setTimeout(fn, ms));
  const setStatus = (i, key, vars = {}) => {
    agentState[i] = [key, vars];
    $("[data-status]", agents[i]).textContent = t(key, vars);
  };
  const setProgress = (key, vars = {}) => {
    progressState = [key, vars];
    progress.innerHTML = key === "prog.done"
      ? t(key, { n: '<span class="mono">3</span>' })
      : t(key, vars);
  };
  const count = (i, key, from, to, start, dur) => {
    const steps = to - from;
    for (let k = 0; k <= steps; k++) at(start + (dur / steps) * k, () => setStatus(i, key, { n: from + k }));
  };
  onLang(() => {
    agentState.forEach(([key, vars], i) => setStatus(i, key, vars));
    setProgress(...progressState);
  });

  function resetConsole() {
    timers.forEach(clearTimeout);
    timers = [];
    agents.forEach((a, i) => { a.classList.remove("is-active", "is-done"); setStatus(i, "status.waiting"); });
    findings.forEach((f) => f.classList.remove("is-in"));
    bars.forEach((b) => b.classList.remove("is-in"));
    setProgress("prog.prep");
  }

  function finalConsole() {
    agents.forEach((a, i) => { a.classList.add("is-done"); setStatus(i, `done.${i}`); });
    findings.forEach((f) => f.classList.add("is-in"));
    bars.forEach((b) => b.classList.add("is-in"));
    setProgress("prog.done");
  }

  function runConsole() {
    resetConsole();
    if (reduceMotion) return finalConsole();

    const activate = (i) => agents[i].classList.add("is-active");
    const done = (i) => { agents[i].classList.remove("is-active"); agents[i].classList.add("is-done"); setStatus(i, `done.${i}`); };

    at(300, () => { activate(0); setProgress("prog.collect"); });
    count(0, "status.interview", 1, 8, 300, 1500);
    at(900, () => activate(1));
    count(1, "status.reading", 4, 36, 900, 1700);
    at(1900, () => done(0));
    at(2700, () => { done(1); activate(2); setStatus(2, "status.framework"); setProgress("prog.analyze"); });
    at(3200, () => findings[0].classList.add("is-in"));
    at(3700, () => findings[1].classList.add("is-in"));
    at(4200, () => findings[2].classList.add("is-in"));
    at(4600, () => { done(2); activate(3); setStatus(3, "status.prioritizing"); setProgress("prog.prio"); });
    bars.forEach((b, i) => at(4700 + i * 120, () => b.classList.add("is-in")));
    at(5900, () => { done(3); setProgress("prog.done"); });
  }

  let consoleStarted = false;
  new IntersectionObserver(([e], obs) => {
    if (e.isIntersecting && !consoleStarted) { consoleStarted = true; runConsole(); obs.disconnect(); }
  }, { threshold: 0.35 }).observe(consoleEl);
  $("[data-replay]").addEventListener("click", runConsole);

  /* ---------- Pinned story ---------- */
  const steps = $$("[data-step]");
  const screens = $$("[data-screen]");
  const stageTitle = $("[data-stage-title]");
  let currentStep = 0;

  // Mobile: each step carries its own copy of the screen (its data-i18n keys are translated with the rest)
  steps.forEach((step, i) => {
    const holder = $(".inline-stage", step);
    const panel = document.createElement("div");
    panel.className = "panel";
    panel.innerHTML = `<div class="panel-head"><div class="panel-title"><img src="assets/evalyza-icono-app.svg" alt=""><span data-i18n="stage.${i}"></span></div><span class="tag tag-sample" data-i18n="tag.sample"></span></div>`;
    const clone = screens[i].cloneNode(true);
    clone.removeAttribute("data-screen");
    panel.appendChild(clone);
    holder.appendChild(panel);
  });

  function setStep(i) {
    currentStep = i;
    steps.forEach((s, k) => s.classList.toggle("is-active", k === i));
    screens.forEach((s, k) => s.classList.toggle("is-active", k === i));
    stageTitle.textContent = t(`stage.${i}`);
    $$(".build-track i").forEach((b, k) => b.classList.toggle("is-on", k <= i));
    $("[data-build-text]").textContent = t(`build.${i}`);
  }
  onLang(() => setStep(currentStep));
  const stepObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) setStep(+e.target.dataset.step); });
  }, { rootMargin: "-45% 0px -45% 0px" });
  steps.forEach((s) => stepObs.observe(s));

  /* ---------- Segmented control helper ---------- */
  function segmented(group, onChange) {
    const thumb = $(".thumb", group);
    const buttons = $$("button", group);
    const place = (btn, animate) => {
      if (!thumb || !btn) return;
      if (!animate) thumb.style.transition = "none";
      thumb.style.width = btn.offsetWidth + "px";
      thumb.style.transform = `translateX(${btn.offsetLeft}px)`;
      if (!animate) requestAnimationFrame(() => (thumb.style.transition = ""));
    };
    const pressed = () => buttons.find((b) => b.getAttribute("aria-pressed") === "true");
    const select = (btn, animate = true) => {
      buttons.forEach((b) => {
        b.setAttribute("aria-pressed", String(b === btn));
        if (b.hasAttribute("aria-selected")) b.setAttribute("aria-selected", String(b === btn));
      });
      place(btn, animate);
      onChange(btn.dataset.phaseValue || btn.dataset.v);
    };
    buttons.forEach((btn) => btn.addEventListener("click", () => select(btn)));
    // Re-measure whenever the control's size changes (fonts, breakpoints, language)
    const init = () => place(pressed(), false);
    new ResizeObserver(init).observe(group);
    if (document.fonts) document.fonts.ready.then(init);
    onLang(() => requestAnimationFrame(init));
    return { select: (value) => select(buttons.find((b) => (b.dataset.phaseValue || b.dataset.v) === value)) };
  }

  /* ---------- Framework radar ---------- */
  const AREAS = [
    { id: "strategy", score: 58, exp: { preseed: 40, seed: 55, seriea: 74 } },
    { id: "product", score: 82, exp: { preseed: 50, seed: 64, seriea: 78 } },
    { id: "team", score: 71, exp: { preseed: 45, seed: 60, seriea: 75 } },
    { id: "ops", score: 38, exp: { preseed: 30, seed: 55, seriea: 72 } },
    { id: "sales", score: 54, exp: { preseed: 30, seed: 58, seriea: 76 } },
    { id: "marketing", score: 49, exp: { preseed: 25, seed: 45, seriea: 66 } },
    { id: "finance", score: 66, exp: { preseed: 35, seed: 55, seriea: 74 } },
    { id: "tech", score: 63, exp: { preseed: 40, seed: 56, seriea: 72 } },
  ];
  const areaName = (a) => t(`area.${a.id}`);
  const R = 160, CX = 200, CY = 200, N = AREAS.length;
  const pointAt = (i, v) => {
    const a = (Math.PI * 2 * i) / N - Math.PI / 2;
    const r = (R * v) / 100;
    return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
  };
  const toPoints = (vals) => vals.map((v, i) => pointAt(i, v).map((n) => n.toFixed(1)).join(",")).join(" ");
  const svgNS = "http://www.w3.org/2000/svg";
  const g = $("[data-radar]");
  const el = (tag, attrs) => { const n = document.createElementNS(svgNS, tag); Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v)); return n; };

  [25, 50, 75, 100].forEach((v) => g.appendChild(el("polygon", { class: "ring", points: toPoints(Array(N).fill(v)) })));
  const axes = AREAS.map((_, i) => { const [x, y] = pointAt(i, 100); return g.appendChild(el("line", { class: "axis", x1: CX, y1: CY, x2: x, y2: y })); });
  g.appendChild(el("polygon", { class: "actual", points: toPoints(AREAS.map((a) => a.score)) }));
  const expected = g.appendChild(el("polygon", { class: "expected", points: toPoints(AREAS.map((a) => a.exp.seed)) }));
  const dots = AREAS.map((a, i) => { const [x, y] = pointAt(i, a.score); return g.appendChild(el("circle", { class: "pt", cx: x, cy: y, r: 5 })); });
  const labels = AREAS.map((a, i) => {
    const [x, y] = pointAt(i, 118);
    const tx = el("text", { x, y: y + 4, "text-anchor": Math.abs(x - CX) < 4 ? "middle" : x > CX ? "start" : "end" });
    tx.addEventListener("click", () => selectArea(i));
    return g.appendChild(tx);
  });

  let phase = "seed";
  let expVals = AREAS.map((a) => a.exp.seed);
  let rafId;
  function morphExpected(target) {
    cancelAnimationFrame(rafId);
    const from = expVals.slice();
    if (reduceMotion) { expVals = target; expected.setAttribute("points", toPoints(target)); return; }
    const t0 = performance.now(), dur = 520;
    const ease = (p) => 1 - Math.pow(1 - p, 4);
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      expVals = from.map((v, i) => v + (target[i] - v) * ease(p));
      expected.setAttribute("points", toPoints(expVals));
      if (p < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
  }

  const status = (a) => {
    const d = a.score - a.exp[phase];
    if (d >= 5) return ["tag.ok", "tag-light-ok"];
    if (d >= -8) return ["tag.watch", "tag-light-watch"];
    return ["tag.crit", "tag-light-crit"];
  };

  const list = $("[data-area-list]");
  const detail = $("[data-area-detail]");
  const areaBtns = AREAS.map((a, i) => {
    const li = document.createElement("li");
    li.innerHTML = `<button type="button" class="area-btn" aria-pressed="false"><span></span><span class="mono">${a.score}</span></button>`;
    const btn = li.firstElementChild;
    btn.addEventListener("click", () => selectArea(i));
    list.appendChild(li);
    return btn;
  });

  let selected = 3;
  function renderDetail() {
    const a = AREAS[selected];
    const [labelKey, cls] = status(a);
    const detailLine = t("fw.detail", { s: `<span class="mono">${a.score}</span>`, e: `<span class="mono">${a.exp[phase]}</span>`, phase: t(`phase.${phase}`) });
    detail.innerHTML = `
      <h3>${areaName(a)}<span class="tag ${cls}">${t(labelKey)}</span></h3>
      <p style="margin-top:6px;color:var(--ink-soft);font-size:15px">${detailLine}</p>
      <ul>${t(`items.${a.id}`).map((s) => `<li><i class="ph-bold ph-check"></i><span>${s}</span></li>`).join("")}</ul>`;
  }
  function renderRadarText() {
    labels.forEach((l, i) => (l.textContent = areaName(AREAS[i])));
    areaBtns.forEach((b, i) => (b.firstElementChild.textContent = areaName(AREAS[i])));
    $("[data-expected-label]").textContent = t("fw.expected", { phase: t(`phase.${phase}`) });
    renderDetail();
  }
  function selectArea(i, animate = true) {
    selected = i;
    areaBtns.forEach((b, k) => b.setAttribute("aria-pressed", String(k === i)));
    axes.forEach((ax, k) => ax.classList.toggle("is-on", k === i));
    dots.forEach((d, k) => d.classList.toggle("is-on", k === i));
    labels.forEach((l, k) => l.classList.toggle("is-on", k === i));
    if (!animate || reduceMotion) return renderDetail();
    detail.classList.add("is-swapping");
    setTimeout(() => { renderDetail(); detail.classList.remove("is-swapping"); }, 140);
  }
  onLang(renderRadarText);

  segmented($("[data-phase]"), (value) => {
    phase = value;
    morphExpected(AREAS.map((a) => a.exp[value]));
    renderRadarText();
  });

  /* ---------- Self-check quiz ---------- */
  const answers = { phase: "seed", size: "m", pain: "coord" };
  const resultBox = $("[data-result]");
  const focusTitle = () => t(`focus.${answers.pain}`);
  function renderResult(animate = true) {
    const apply = () => {
      $("[data-result-title]").textContent = t("result.start", { focus: focusTitle() });
      $("[data-result-text]").textContent = `${t(`sizeText.${answers.size}`)}, ${t(`focusText.${answers.pain}.${answers.size}`)}.`;
      $("[data-success-text]").textContent = t("wl.okP", { focus: focusTitle() });
    };
    if (!animate || reduceMotion) return apply();
    resultBox.classList.add("is-swapping");
    setTimeout(() => { apply(); resultBox.classList.remove("is-swapping"); }, 150);
  }
  $$("[data-q]").forEach((group) => {
    $$("button", group).forEach((btn) => btn.addEventListener("click", () => {
      $$("button", group).forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      answers[group.dataset.q] = btn.dataset.v;
      renderResult();
    }));
  });
  onLang(() => renderResult(false));

  /* ---------- Contact tabs: waitlist / call request ---------- */
  const panels = $$("[data-tabpanel]");
  const tabs = segmented($("[data-tabs]"), (value) => {
    panels.forEach((p) => (p.hidden = p.dataset.tabpanel !== value));
  });
  $$("[data-open-tab]").forEach((link) => link.addEventListener("click", () => tabs.select(link.dataset.openTab)));

  /* ---------- Forms (prototype: no backend, simulated submit) ---------- */
  function setLoading(btn, on) {
    btn.disabled = on;
    const label = $(".btn-label", btn);
    if (on) {
      btn.dataset.label = label.innerHTML;
      label.innerHTML = `<span class="spinner" aria-hidden="true"></span>${t("sending")}`;
    } else if (btn.dataset.label) {
      label.innerHTML = btn.dataset.label;
      $$("[data-i18n]", label).forEach((n) => (n.textContent = t(n.dataset.i18n)));
    }
  }
  const fakeSubmit = () => new Promise((r) => setTimeout(r, 900));
  const fieldError = (input, errEl, key) => {
    input.setAttribute("aria-invalid", "true");
    errEl.textContent = t(key);
    input.focus();
  };
  const clearError = (input, errEl) => { input.removeAttribute("aria-invalid"); errEl.textContent = ""; };

  const hero = $("[data-join]");
  hero.addEventListener("submit", async (e) => {
    e.preventDefault();
    const input = $("input", hero), msg = $(".field-msg", hero), btn = $("button", hero);
    const v = input.value.trim();
    msg.className = "field-msg";
    if (!EMAIL_RE.test(v)) {
      msg.classList.add("is-error");
      return fieldError(input, msg, v ? "err.emailBad" : "err.emailEmpty");
    }
    input.removeAttribute("aria-invalid");
    setLoading(btn, true);
    await fakeSubmit();
    setLoading(btn, false);
    msg.classList.add("is-ok");
    msg.textContent = t("ok.hero");
    input.value = "";
  });

  const wl = $("[data-waitlist]");
  const wlForm = $("[data-waitlist-form]");
  wlForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = $("#wl-email"), err = $("#wl-email-err"), btn = $("button[type=submit]", wlForm);
    const v = email.value.trim();
    if (!EMAIL_RE.test(v)) return fieldError(email, err, v ? "err.emailBad" : "err.emailEmpty");
    clearError(email, err);
    setLoading(btn, true);
    await fakeSubmit();
    wl.classList.add("is-done");
  });

  const call = $("[data-call]");
  const callForm = $("[data-call-form]");
  callForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = $("#call-name"), nameErr = $("#call-name-err");
    const phone = $("#call-phone"), phoneErr = $("#call-phone-err");
    const btn = $("button[type=submit]", callForm);
    clearError(name, nameErr);
    clearError(phone, phoneErr);
    const digits = phone.value.replace(/[\s\-().]/g, "");
    if (!name.value.trim()) return fieldError(name, nameErr, "err.name");
    if (!/^\d{6,15}$/.test(digits)) return fieldError(phone, phoneErr, "err.phone");
    setLoading(btn, true);
    await fakeSubmit();
    call.classList.add("is-done");
  });

  /* ---------- Boot ---------- */
  setStep(0);
  selectArea(selected, false);
  setLang(lang);
})();
