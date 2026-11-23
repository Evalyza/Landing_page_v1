// Ozmetra customer account (/cuenta/): sign up, sign in, password recovery and profile.
// Auth is Supabase Auth on the same project as the forms (see forms.js). On sign-up the
// metadata account_type = "customer" makes the database create the customer's row in
// public.accounts and a lead in the CRM (migration 20261122180000_customer_accounts.sql).
// The page ships already translated (tools/build-pages.mjs); this only adds behaviour.
(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const root = document.documentElement;
  const lang = root.dataset.pageLang || "es";
  const BASE = root.dataset.base || "";
  const t = (key) => window.I18N[lang]?.[key] ?? window.I18N.es[key] ?? key;
  const pageUrl = () => `${location.origin}${location.pathname}`;

  /* ---------- Language: each language has its own /cuenta/ page ---------- */
  const langSelect = $("[data-lang]");
  langSelect.value = lang;
  langSelect.addEventListener("change", () => {
    try { localStorage.setItem("ozmetra-lang", langSelect.value); } catch { /* private mode */ }
    location.href = `${BASE}${langSelect.value === "es" ? "" : `${langSelect.value}/`}cuenta/${location.search}${location.hash}`;
  });

  /* ---------- Mobile menu ---------- */
  const nav = $(".nav");
  const navToggle = $("[data-nav-toggle]");
  const setMenu = (open) => {
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", t(open ? "aria.menuClose" : "aria.menuOpen"));
  };
  navToggle.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  $$("[data-nav-menu] a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && nav.classList.contains("is-open")) setMenu(false); });

  /* ---------- Views ---------- */
  const views = $$("[data-view]");
  function show(name) {
    views.forEach((v) => (v.hidden = v.dataset.view !== name));
    window.scrollTo({ top: 0 });
    if (name === "auth") requestAnimationFrame(placeThumb);
  }
  $$("[data-show-view]").forEach((b) => b.addEventListener("click", () => show(b.dataset.showView)));

  /* ---------- Small form helpers ---------- */
  const fieldError = (input, errEl, msg) => { input.setAttribute("aria-invalid", "true"); errEl.textContent = msg; input.focus(); };
  const clearErrors = (form) => {
    $$("[aria-invalid]", form).forEach((i) => i.removeAttribute("aria-invalid"));
    $$(".err", form).forEach((e) => (e.textContent = ""));
  };
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
  $$("[data-pass-toggle]").forEach((b) => b.addEventListener("click", () => {
    const input = b.previousElementSibling;
    const showing = input.type === "text";
    input.type = showing ? "password" : "text";
    b.setAttribute("aria-label", t(showing ? "acc.showPass" : "acc.hidePass"));
    $(".ph", b).className = `ph ${showing ? "ph-eye" : "ph-eye-slash"}`;
  }));

  // Supabase Auth messages → our own words
  function authError(error) {
    const m = `${error?.code || ""} ${error?.message || ""}`.toLowerCase();
    if (m.includes("invalid login credentials") || m.includes("invalid_credentials")) return t("acc.err.invalid");
    if (m.includes("email not confirmed") || m.includes("email_not_confirmed")) return t("acc.err.unconfirmed");
    if (m.includes("already registered") || m.includes("user_already_exists")) return t("acc.err.exists");
    if (m.includes("password") && (m.includes("at least") || m.includes("weak"))) return t("acc.err.weak");
    if (m.includes("rate limit") || m.includes("over_email_send_rate_limit") || m.includes("too many")) return t("acc.err.rate");
    if (m.includes("invalid") && m.includes("email")) return t("err.emailBad");
    return t("acc.err.generic");
  }

  /* ---------- Supabase client ---------- */
  if (!window.supabase || !window.OzForms) {
    $("[data-view=loading]").textContent = t("acc.err.generic");
    return;
  }
  const { url, key } = window.OzForms.config;
  const sb = window.supabase.createClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });

  /* ---------- Auth tabs: sign in / create account ---------- */
  const tabs = $("[data-auth-tabs]");
  const tabButtons = $$("button", tabs);
  const thumb = $(".thumb", tabs);
  function placeThumb() {
    const btn = tabButtons.find((b) => b.getAttribute("aria-pressed") === "true");
    if (!btn || !btn.offsetWidth) return;
    thumb.style.width = `${btn.offsetWidth}px`;
    thumb.style.transform = `translateX(${btn.offsetLeft}px)`;
  }
  function selectTab(value) {
    tabButtons.forEach((b) => {
      const on = b.dataset.v === value;
      b.setAttribute("aria-pressed", String(on));
      b.setAttribute("aria-selected", String(on));
    });
    $$("[data-auth-panel]").forEach((p) => (p.hidden = p.dataset.authPanel !== value));
    placeThumb();
  }
  tabButtons.forEach((b) => b.addEventListener("click", () => selectTab(b.dataset.v)));
  $$("[data-go-tab]").forEach((b) => b.addEventListener("click", () => selectTab(b.dataset.goTab)));
  new ResizeObserver(placeThumb).observe(tabs);
  if (document.fonts) document.fonts.ready.then(placeThumb);

  /* ---------- Sign up ---------- */
  const regForm = $("[data-register-form]");
  const regPlans = $$("input[name=plan]", regForm);
  const regPlan = () => (regPlans.find((r) => r.checked) || regPlans[0]).value;
  const regRole = $("#rg-role");
  function applyRegPlan() {
    const plan = regPlan();
    const isProgram = plan === "programs";
    $("[data-program-field]", regForm).hidden = !isProgram;
    $("[data-plan-note]", regForm).hidden = plan === "free";
    if (isProgram && regRole.value === "founder") regRole.value = "director";
    if (!isProgram && regRole.value === "director") regRole.value = "founder";
  }
  regPlans.forEach((r) => r.addEventListener("change", applyRegPlan));
  // ?plan=custom from the pricing cards preselects the plan
  const askedPlan = new URLSearchParams(location.search).get("plan");
  if (["free", "custom", "programs"].includes(askedPlan)) regPlans.forEach((r) => (r.checked = r.value === askedPlan));
  applyRegPlan();

  regForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors(regForm);
    const name = $("#rg-name"), email = $("#rg-email"), pass = $("#rg-pass"), consent = $("[name=consent]", regForm);
    const btn = $("button[type=submit]", regForm);
    if (!name.value.trim()) return fieldError(name, $("#rg-name-err"), t("acc.err.name"));
    const v = email.value.trim();
    if (!EMAIL_RE.test(v)) return fieldError(email, $("#rg-email-err"), t(v ? "err.emailBad" : "acc.err.emailEmpty"));
    if (pass.value.length < 8) return fieldError(pass, $("#rg-pass-err"), t("acc.err.weak"));
    if (!consent.checked) return fieldError(consent, $("#rg-consent-err"), t("err.consent"));
    setLoading(btn, true);
    const plan = regPlan();
    const utm = window.OzForms.campaign();
    const { data, error } = await sb.auth.signUp({
      email: v,
      password: pass.value,
      options: {
        emailRedirectTo: pageUrl(),
        data: {
          account_type: "customer",
          full_name: name.value.trim(),
          company: $("#rg-company").value.trim(),
          role: regRole.value,
          plan,
          program_type: plan === "programs" ? $("#rg-program").value : null,
          lang,
          utm_source: utm.p_utm_source, utm_medium: utm.p_utm_medium, utm_campaign: utm.p_utm_campaign,
        },
      },
    });
    setLoading(btn, false);
    if (error) return fieldError(email, $("#rg-email-err"), authError(error));
    // With e-mail confirmation on, Supabase returns no session (and, for an address that already
    // exists, a user without identities): either way the next step is the e-mail.
    if (data.session) return loadAccount(data.session.user);
    $("[data-sent-email]").textContent = v;
    show("sent");
  });

  /* ---------- Sign in ---------- */
  const loginForm = $("[data-login-form]");
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors(loginForm);
    const email = $("#lg-email"), pass = $("#lg-pass"), btn = $("button[type=submit]", loginForm);
    const v = email.value.trim();
    if (!EMAIL_RE.test(v)) return fieldError(email, $("#lg-email-err"), t(v ? "err.emailBad" : "acc.err.emailEmpty"));
    if (!pass.value) return fieldError(pass, $("#lg-pass-err"), t("acc.err.passEmpty"));
    setLoading(btn, true);
    const { data, error } = await sb.auth.signInWithPassword({ email: v, password: pass.value });
    setLoading(btn, false);
    if (error) return fieldError(pass, $("#lg-pass-err"), authError(error));
    loadAccount(data.user);
  });

  /* ---------- Password recovery ---------- */
  const forgotForm = $("[data-forgot-form]");
  forgotForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors(forgotForm);
    const email = $("#fg-email"), btn = $("button[type=submit]", forgotForm);
    const v = email.value.trim();
    if (!EMAIL_RE.test(v)) return fieldError(email, $("#fg-email-err"), t(v ? "err.emailBad" : "acc.err.emailEmpty"));
    setLoading(btn, true);
    const { error } = await sb.auth.resetPasswordForEmail(v, { redirectTo: pageUrl() });
    setLoading(btn, false);
    if (error) return fieldError(email, $("#fg-email-err"), authError(error));
    $("[data-sent-email]").textContent = v;
    show("sent");
  });

  const newPassForm = $("[data-newpass-form]");
  newPassForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors(newPassForm);
    const pass = $("#np-pass"), btn = $("button[type=submit]", newPassForm);
    if (pass.value.length < 8) return fieldError(pass, $("#np-pass-err"), t("acc.err.weak"));
    setLoading(btn, true);
    const { data, error } = await sb.auth.updateUser({ password: pass.value });
    setLoading(btn, false);
    if (error) return fieldError(pass, $("#np-pass-err"), authError(error));
    history.replaceState(null, "", location.pathname);
    loadAccount(data.user);
  });

  /* ---------- Profile ---------- */
  let account = null;
  const PLAN_FEATURES = { free: 4, custom: 5, programs: 4 };

  function renderPlan() {
    const plan = account.plan;
    $("[data-plan-name]").textContent = t(`plans.${plan}.name`);
    $("[data-plan-price]").textContent = t(`plans.${plan}.price`);
    $("[data-plan-from]").hidden = plan === "free";
    $("[data-plan-unit]").textContent = plan === "free" ? t("plans.free.unit") : t("plans.month");
    const status = $("[data-plan-status]");
    status.textContent = t(`acc.status.${account.plan_status}`);
    status.dataset.status = account.plan_status;
    const textKey = account.plan_status === "requested" ? "acc.statusText.requested"
      : account.plan_status === "cancelled" ? "acc.statusText.cancelled"
      : plan === "free" ? "acc.statusText.free" : "acc.statusText.active";
    $("[data-plan-status-text]").textContent = t(textKey);
    const list = $("[data-plan-features]");
    list.innerHTML = "";
    for (let i = 1; i <= PLAN_FEATURES[plan]; i++) {
      const li = document.createElement("li");
      li.textContent = t(`plans.${plan}.f${i}`);
      list.append(li);
    }
    $$("input[name=new_plan]").forEach((r) => (r.checked = r.value === plan));
    $("[data-change-plan-form] button[type=submit]").disabled = true;
    // Cancel: only a paid plan that is not cancelled yet
    $("[data-cancel-box]").hidden = plan === "free" || account.plan_status === "cancelled";
    $("[data-cancel-form]").hidden = true;
    $("[data-cancel-open]").hidden = false;
    renderBilling();
  }

  function renderBilling() {
    const paid = account.plan !== "free" && account.plan_status !== "cancelled";
    $("[data-bill-method]").textContent = t(paid ? "acc.billMethod.invoice" : "acc.billMethod.none");
    $("[data-bill-amount]").textContent = paid
      ? `${t("plans.from")} ${t(`plans.${account.plan}.price`)}${t("plans.month")}`
      : t("plans.free.price");
    const f = $("[data-billing-form]");
    for (const k of ["billing_name", "billing_tax_id", "billing_address", "billing_email"]) f.elements[k].value = account[k] ?? "";
  }

  function renderCompany() {
    const f = $("[data-company-form]");
    for (const k of ["full_name", "phone", "company", "website", "sector", "team_size", "role", "program_type"]) {
      const el = f.elements[k];
      if (el) el.value = account[k] ?? "";
    }
  }

  function renderAccount(user) {
    $("[data-hello-name]").textContent = account.full_name ? `, ${account.full_name.split(" ")[0]}` : "";
    $("[data-account-email]").textContent = account.email || user.email;
    const since = new Date(account.created_at);
    $("[data-member-since]").textContent = since.toLocaleDateString(lang, { day: "numeric", month: "long", year: "numeric" });
    renderPlan();
    renderCompany();
    show("account");
  }

  async function loadAccount(user) {
    if (!user) return show("auth");
    const { data, error } = await sb.from("accounts").select("*").eq("id", user.id).maybeSingle();
    if (error) { $("[data-view=loading]").textContent = t("acc.err.generic"); return show("loading"); }
    if (!data) return show("noaccount");
    account = data;
    renderAccount(user);
  }

  // Change of plan
  const changeForm = $("[data-change-plan-form]");
  const changeBtn = $("button[type=submit]", changeForm);
  $$("input[name=new_plan]").forEach((r) => r.addEventListener("change", () => {
    // Same plan only makes sense to reactivate a cancelled one
    changeBtn.disabled = r.value === account.plan && r.checked && account.plan_status !== "cancelled";
    $("[data-plan-msg]").textContent = "";
  }));
  changeForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const chosen = $$("input[name=new_plan]").find((r) => r.checked)?.value;
    if (!chosen || (chosen === account.plan && account.plan_status !== "cancelled")) return;
    setLoading(changeBtn, true);
    const { data, error } = await sb.rpc("request_plan", { p_plan: chosen });
    setLoading(changeBtn, false);
    const msg = $("[data-plan-msg]");
    if (error) { msg.textContent = t("acc.err.generic"); msg.dataset.state = "error"; return; }
    account = Array.isArray(data) ? data[0] : data;
    renderPlan();
    msg.textContent = t(chosen === "free" ? "acc.planChangedFree" : "acc.planRequested");
    msg.dataset.state = "ok";
  });

  // Cancel subscription
  const cancelForm = $("[data-cancel-form]");
  $("[data-cancel-open]").addEventListener("click", (e) => {
    e.currentTarget.hidden = true;
    cancelForm.hidden = false;
    $("[data-cancel-msg]").textContent = "";
    cancelForm.elements.reason.focus();
  });
  $("[data-cancel-close]").addEventListener("click", () => {
    cancelForm.hidden = true;
    $("[data-cancel-open]").hidden = false;
  });
  cancelForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = $("button[type=submit]", cancelForm);
    const msg = $("[data-cancel-msg]");
    setLoading(btn, true);
    const { data, error } = await sb.rpc("cancel_plan", { p_reason: cancelForm.elements.reason.value.trim() || null });
    setLoading(btn, false);
    if (error) { msg.textContent = t("acc.err.generic"); msg.dataset.state = "error"; return; }
    account = Array.isArray(data) ? data[0] : data;
    cancelForm.reset();
    renderPlan();
    msg.textContent = t("acc.cancelDone");
    msg.dataset.state = "ok";
  });

  // Billing details
  const billingForm = $("[data-billing-form]");
  billingForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = $("button[type=submit]", billingForm);
    const msg = $("[data-billing-msg]");
    const f = billingForm.elements;
    const email = f.billing_email.value.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      msg.textContent = t("acc.err.email"); msg.dataset.state = "error"; f.billing_email.focus(); return;
    }
    const changes = {
      billing_name: f.billing_name.value.trim() || null,
      billing_tax_id: f.billing_tax_id.value.trim().toUpperCase() || null,
      billing_address: f.billing_address.value.trim() || null,
      billing_email: email || null,
    };
    setLoading(btn, true);
    const { data, error } = await sb.from("accounts").update(changes).eq("id", account.id).select().maybeSingle();
    setLoading(btn, false);
    if (error || !data) { msg.textContent = t("acc.err.generic"); msg.dataset.state = "error"; return; }
    account = data;
    renderBilling();
    msg.textContent = t("acc.saved");
    msg.dataset.state = "ok";
  });

  // Company details
  const companyForm = $("[data-company-form]");
  companyForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = $("button[type=submit]", companyForm);
    const msg = $("[data-company-msg]");
    const f = companyForm.elements;
    let website = f.website.value.trim();
    if (website && !/^https?:\/\//i.test(website)) website = `https://${website}`;
    const changes = {
      full_name: f.full_name.value.trim() || null,
      phone: f.phone.value.trim() || null,
      company: f.company.value.trim() || null,
      website: website || null,
      sector: f.sector.value.trim() || null,
      team_size: f.team_size.value || null,
      role: f.role.value || null,
      program_type: f.program_type.value || null,
    };
    setLoading(btn, true);
    const { data, error } = await sb.from("accounts").update(changes).eq("id", account.id).select().maybeSingle();
    setLoading(btn, false);
    if (error || !data) { msg.textContent = t("acc.err.generic"); msg.dataset.state = "error"; return; }
    account = data;
    f.website.value = account.website ?? "";
    $("[data-hello-name]").textContent = account.full_name ? `, ${account.full_name.split(" ")[0]}` : "";
    msg.textContent = t("acc.saved");
    msg.dataset.state = "ok";
  });

  // Change password from the profile: same e-mail link as "forgotten password"
  $("[data-reset-pass]").addEventListener("click", async (e) => {
    const { error } = await sb.auth.resetPasswordForEmail(account.email, { redirectTo: pageUrl() });
    e.target.textContent = error ? t("acc.err.generic") : t("acc.resetSent");
    e.target.disabled = true;
  });

  // Sign out
  $$("[data-signout]").forEach((b) => b.addEventListener("click", async () => {
    await sb.auth.signOut();
    account = null;
    selectTab("login");
    show("auth");
  }));

  /* ---------- Start ---------- */
  let recovering = /type=recovery/.test(location.hash);
  sb.auth.onAuthStateChange((event, session) => {
    if (event === "PASSWORD_RECOVERY") { recovering = true; show("newpass"); }
    else if (event === "SIGNED_IN" && session && !account && !recovering) loadAccount(session.user);
  });
  (async () => {
    // #acceder opens the sign-in tab; #registro (or a plan) the sign-up tab
    selectTab(location.hash === "#acceder" ? "login" : "register");
    const { data } = await sb.auth.getSession();
    if (recovering) return show("newpass");
    if (data.session) return loadAccount(data.session.user);
    show("auth");
  })();
})();
