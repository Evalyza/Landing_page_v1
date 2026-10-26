// Ozmetra forms: saved in Supabase (project Landing_page_v1), shared by the home and /startups.
// The publishable key is meant to live in the browser. The tables are closed to it;
// it can only call the validating functions join_waitlist, request_call and
// download_resource (the last one from the Recursos pages, see recursos.js).
window.OzForms = (() => {
  const SUPABASE_URL = "https://oobfyooytxscmqkrwemj.supabase.co";
  const SUPABASE_KEY = "sb_publishable_WlHIirz5kR1zG_LIIwNTRw_or0vUlkf";

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

  // Attribution (page, campaign, article) travels with the request, but a request is
  // never lost over it: if the call with the extras fails, it is sent again without them.
  async function send(fn, args, extra = {}) {
    try {
      await rpc(fn, { ...args, ...extra });
    } catch {
      await rpc(fn, args);
    }
  }

  // First campaign of the visit (utm_source, utm_medium, utm_campaign), kept for the session
  // so it survives moving from /startups to the home or back.
  const KEYS = ["utm_source", "utm_medium", "utm_campaign"];
  function campaign() {
    const q = new URLSearchParams(location.search);
    let v = {};
    try { v = JSON.parse(sessionStorage.getItem("ozmetra-utm") || "{}"); } catch { /* private mode */ }
    if (!v.utm_source && KEYS.some((k) => q.get(k))) {
      v = Object.fromEntries(KEYS.map((k) => [k, (q.get(k) || "").trim().slice(0, 120)]));
      try { sessionStorage.setItem("ozmetra-utm", JSON.stringify(v)); } catch { /* private mode */ }
    }
    return { p_utm_source: v.utm_source || null, p_utm_medium: v.utm_medium || null, p_utm_campaign: v.utm_campaign || null };
  }
  // Article of the Recursos section (ozmetra.com/recursos/) that brought the visitor:
  // recursos.js keeps the first one of the visit; the blog's CTA also tags the URL.
  function article() {
    const q = new URLSearchParams(location.search);
    let v = q.get("utm_source") === "blog" ? q.get("utm_campaign") : null;
    try { v = sessionStorage.getItem("ozmetra-articulo") || v; } catch { /* private mode */ }
    return v && v !== "recursos" && /^[a-z0-9-]{1,120}$/.test(v) ? v : null;
  }
  const attribution = (page) => {
    const a = article();
    return { p_page: page, ...campaign(), ...(a && { p_article: a }) };
  };

  // request_call has no article parameter
  const callAttribution = (page) => {
    const { p_article, ...rest } = attribution(page);
    return rest;
  };

  return { rpc, send, attribution, callAttribution };
})();
