// Ozmetra for startups (/startups/): language switch, request tabs, forms and the phone video.
// The page ships already translated (tools/build-pages.mjs); this only adds behaviour.
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const root = document.documentElement;
  const lang = root.dataset.pageLang || "es";
  const BASE = root.dataset.base || "";
  const t = (key) => window.I18N[lang]?.[key] ?? window.I18N.es[key] ?? key;

  /* ---------- Language: each language has its own /startups/ page ---------- */
  const select = $("[data-lang]");
  select.value = lang;
  select.addEventListener("change", () => {
    try { localStorage.setItem("ozmetra-lang", select.value); } catch { /* private mode */ }
    location.href = `${BASE}${select.value === "es" ? "" : `${select.value}/`}startups/${location.hash}`;
  });

  /* ---------- Nav border on scroll ---------- */
  const nav = $(".nav");
  const sentinel = document.createElement("div");
  sentinel.style.cssText = "position:absolute;top:8px;height:1px;width:1px";
  document.body.prepend(sentinel);
  new IntersectionObserver(([e]) => nav.classList.toggle("is-scrolled", !e.isIntersecting)).observe(sentinel);

  /* ---------- Request tabs: diagnosis / call ---------- */
  const group = $("[data-tabs]");
  const thumb = $(".thumb", group);
  const tabButtons = $$("button", group);
  const panels = $$("[data-tabpanel]");
  const place = (btn, animate) => {
    if (!animate) thumb.style.transition = "none";
    thumb.style.width = `${btn.offsetWidth}px`;
    thumb.style.transform = `translateX(${btn.offsetLeft}px)`;
    if (!animate) requestAnimationFrame(() => (thumb.style.transition = ""));
  };
  const selectTab = (value, animate = true) => {
    const btn = tabButtons.find((b) => b.dataset.v === value);
    if (!btn) return;
    tabButtons.forEach((b) => {
      b.setAttribute("aria-pressed", String(b === btn));
      b.setAttribute("aria-selected", String(b === btn));
    });
    panels.forEach((p) => (p.hidden = p.dataset.tabpanel !== value));
    place(btn, animate);
  };
  tabButtons.forEach((b) => b.addEventListener("click", () => selectTab(b.dataset.v)));
  const init = () => place(tabButtons.find((b) => b.getAttribute("aria-pressed") === "true"), false);
  new ResizeObserver(init).observe(group);
  document.fonts?.ready.then(init);
  $$("[data-open-tab]").forEach((a) => a.addEventListener("click", () => selectTab(a.dataset.openTab)));

  /* ---------- Forms ---------- */
  const { send, attribution, callAttribution } = window.OzForms;
  function setLoading(btn, on) {
    btn.disabled = on;
    const label = $(".btn-label", btn);
    if (on) {
      btn.dataset.label = label.innerHTML;
      label.innerHTML = `<span class="spinner" aria-hidden="true"></span>${t("sending")}`;
    } else if (btn.dataset.label) {
      label.innerHTML = btn.dataset.label;
    }
  }
  const fieldError = (input, errEl, key) => {
    input.setAttribute("aria-invalid", "true");
    errEl.textContent = t(key);
    input.focus();
  };
  const clearError = (input, errEl) => { input.removeAttribute("aria-invalid"); errEl.textContent = ""; };

  const diag = $("[data-diag]");
  const diagForm = $("[data-diag-form]");
  diagForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = $("#st-email"), err = $("#st-email-err"), btn = $("button[type=submit]", diagForm);
    const v = email.value.trim();
    if (!EMAIL_RE.test(v)) return fieldError(email, err, v ? "err.emailBad" : "st.err.emailEmpty");
    clearError(email, err);
    const consent = $("[name=consent]", diagForm), consentErr = $("#st-consent-err");
    clearError(consent, consentErr);
    if (!consent.checked) return fieldError(consent, consentErr, "err.consent");
    const worry = $("#st-worry").value.trim();
    setLoading(btn, true);
    try {
      // quiz_size holds the team size on requests from this page (see the Supabase migration)
      await send("join_waitlist", {
        p_email: v, p_company: $("#st-company").value, p_role: "founder", p_lang: lang,
        p_quiz_phase: "", p_quiz_size: $("#st-size").value, p_quiz_pain: "",
        p_source: "startups", p_consent: true, ...(worry && { p_prompt: worry }),
      }, attribution("startups"));
    } catch {
      setLoading(btn, false);
      consentErr.textContent = t("err.send");
      return;
    }
    diag.classList.add("is-done");
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
    const consent = $("[name=consent]", callForm), consentErr = $("#call-consent-err");
    clearError(consent, consentErr);
    if (!consent.checked) return fieldError(consent, consentErr, "err.consent");
    setLoading(btn, true);
    try {
      await send("request_call", {
        p_name: name.value.trim(), p_phone_prefix: $("[name=prefix]", callForm).value, p_phone: digits,
        p_slot: $("#call-slot").value, p_lang: lang, p_consent: true,
      }, callAttribution("startups"));
    } catch {
      setLoading(btn, false);
      consentErr.textContent = t("err.send");
      return;
    }
    call.classList.add("is-done");
  });

  /* ---------- Phone video: plays only on screen, never downloads before ---------- */
  const frame = $("[data-demo]");
  const video = $("[data-demo-video]");
  const toggle = $("[data-demo-toggle]");
  let userPaused = reduceMotion; // reduced motion: poster until the visitor presses play
  const setToggle = () => {
    const playing = !video.paused;
    frame.classList.toggle("is-playing", playing);
    toggle.setAttribute("aria-label", t(playing ? "demo.pause" : "demo.play"));
  };
  const load = () => {
    if (video.dataset.loaded) return;
    video.dataset.loaded = "1";
    $$("source", video).forEach((s) => (s.src = s.dataset.src));
    video.load();
  };
  const play = () => { load(); video.play().catch(setToggle); };
  ["play", "pause"].forEach((ev) => video.addEventListener(ev, setToggle));
  toggle.addEventListener("click", () => {
    if (video.paused) { userPaused = false; play(); } else { userPaused = true; video.pause(); }
  });
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { if (!userPaused) play(); else load(); }
    else if (!video.paused) video.pause();
  }, { threshold: 0.35 }).observe(video);
})();
