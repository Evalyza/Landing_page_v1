// Evalyza: dark (default) / light theme switch, shared by every page.
// The initial theme is applied by an inline script in <head> to avoid a flash.
(() => {
  const root = document.documentElement;
  const btn = document.querySelector("[data-theme-toggle]");
  if (!btn) return;
  const meta = document.querySelector('meta[name="theme-color"]');
  const current = () => (root.dataset.theme === "light" ? "light" : "dark");

  const t = (key) => {
    const lang = root.lang in (window.I18N || {}) ? root.lang : "es";
    return window.I18N?.[lang]?.[key] ?? key;
  };
  const label = () => {
    const next = current() === "dark" ? "theme.toLight" : "theme.toDark";
    btn.setAttribute("aria-label", t(next));
    btn.title = t(next);
    btn.setAttribute("aria-pressed", String(current() === "light"));
  };

  function apply(theme) {
    // Switch every colour at once instead of letting each element run its own transition
    root.classList.add("theme-switching");
    root.dataset.theme = theme;
    meta?.setAttribute("content", theme === "light" ? "#F4F5FA" : "#0B0E24");
    try { localStorage.setItem("evalyza-theme", theme); } catch { /* private mode */ }
    label();
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("theme-switching")));
  }

  btn.addEventListener("click", () => apply(current() === "dark" ? "light" : "dark"));
  // Keep the label in the page language when the language selector changes <html lang>
  new MutationObserver(label).observe(root, { attributes: true, attributeFilter: ["lang"] });
  meta?.setAttribute("content", current() === "light" ? "#F4F5FA" : "#0B0E24");
  label();
})();
