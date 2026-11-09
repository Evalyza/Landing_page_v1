# Demo: evaluación de la dimensión Servicios (spec for Claude Code)

A scripted, click-through demo of how an Ozmetra assessment of the **Services** dimension works.
The presenter shares their screen and navigates; the audience never touches it.
All content lives in `data.js` (`window.DEMO`). **Do not invent or recompute any content or score:
render what `data.js` contains.** Scores were computed with the real method outside this repo.

## Constraints (must)

- New standalone page at `diseno-landing/demo/servicios/index.html`, plus `demo.css`, `demo.js` and `data.js` in the same folder.
- **Do not touch** templates, `i18n.js`, `app.js`, `forms.js`, `build-pages.mjs`, `styles.css` or any generated page. No build step is needed.
- Spanish only, *usted* register. No language switcher, no i18n attributes.
- `<meta name="robots" content="noindex, nofollow">`. Not linked from any page and not added to the sitemap.
- Do not load `forms.js` or call Supabase. No network requests except fonts the site already uses.
- Reuse the visual language of `DESIGN.md` (tokens, type, components). Copy the tokens you need into `demo.css` instead of editing shared CSS.
- Load `data.js` with a `<script>` tag (not `fetch`), so the page also works when opened from disk.
- Desktop-first (screen-share at 1440×900 and 1280×720). It must not break at narrower widths, but mobile polish is not needed.
- A fixed banner at the top on every screen: **"Demostración · Datos de ejemplo"** (`DEMO.meta.etiqueta`) plus the company's `aviso`.
- Work on branch `demo-servicios`. Never merge into `main` (Vercel deploys `main`).

## Navigation

- Five screens in a fixed order, with a step indicator at the top: 1 Bienvenida · 2 Documentos · 3 Lo que hemos encontrado · 4 Entrevista · 5 Resultados.
- "Anterior" / "Siguiente" buttons, plus keyboard: → and Space for next, ← for previous. On screen 4, "next" reveals the next chat message before moving to screen 5.
- "R" restarts the demo from screen 1 (resets all animations).
- The step indicator is clickable, so the presenter can jump back to answer a question.

## Screen 1: Bienvenida

- Title: "Diagnóstico de procesos · Servicios".
- Company card: `empresa.nombre`, `descripcion`, list of `servicios`.
- The four LightSME dimensions as cards: **Servicios** active; Gobierno organizativo, Clientes y consumidores, Personas greyed out with the tag "Próximamente".
- One line on the method: `meta.metodo`.
- Short explanation of the 3 steps: "1. Suba lo que ya tenga · 2. Le preguntamos solo lo que falta · 3. Reciba su nivel y qué mejorar".

## Screen 2: Documentos

- Heading: "Suba lo que tenga. Nada es obligatorio."
- Subheading: "Sirven capturas y enlaces. Le recomendamos ocultar datos personales de sus clientes."
- Six upload slots, one per `documentos[]` entry, labelled with `pide`.
- On "Siguiente" (first press), simulate the uploads: each slot fills in turn (~400 ms each) with `nombre` and `tipo`, a short progress bar, then a check mark. The second press moves on.

## Screen 3: Lo que hemos encontrado

- Heading: "Lo que hemos encontrado en sus documentos".
- One collapsible section per process in `procesos[]` (in the given order), each showing its name, band tag and a count like "9 de 12 puntos con evidencia".
- Inside, per task: name, then its items. Each item shows a status chip from `previo`:
  - `cumplido` → "Encontrado" (positive colour)
  - `parcial` → "Parcial" (amber)
  - `no` → "No encontrado" (neutral, not red)
  - `pendiente` → "Lo veremos en la entrevista" (muted)
- Items with `evidencia.doc` show the document name and the `cita` in a quote style. Clicking it opens a side drawer showing the document `nombre`, `tipo` and the quote highlighted.
- **Do not show recommendations or scores on this screen.**
- Summary line at the bottom: "N puntos pendientes. Le haremos 4 preguntas para completarlos."

## Screen 4: Entrevista

- A chat panel. Messages from `entrevista[]`: Ozmetra's `pregunta` (left, with the block name `bloque` as a small label above), then the company's `respuesta` (right).
- Each "next" press reveals one message. The question appears with a short typing indicator (~700 ms). The answer appears as if typed in.
- A narrow side panel, "Puntos pendientes", lists the items whose `previo` is `pendiente`. When the answer to turn `cN` appears, every item whose `evidencia.chat == cN` changes to its `final` status with a short animation. Items with `pendiente` and no evidence turn to their `final` after the last turn.
- After the last answer, show: "Entrevista completada. Calculando su resultado…" (1 s), then move to screen 5 on next press.

## Screen 5: Resultados

Top to bottom:

1. **Band ladder.** The four bands from `resultado.bandas` as steps. `resultado.banda` ("Básico") is highlighted as reached. The next band shows "Siguiente: Mejorado. Lo bloquean: SR0, SR1" (process names, not only codes).
2. **Key factors.** One horizontal bar per `factores[]` entry with its `%`.
3. **Processes table.** One row per process: name, band, `%`, capability level ("Nivel 0–3" with names: 0 Incompleto, 1 Realizado, 2 Gestionado, 3 Establecido), target level, and a tick or cross for `alcanza_objetivo`. Expanding a row shows its tasks with `pct_final` and `valoracion` (0/1/2), then each item with its `final` status and evidence (document quote, or "Entrevista" plus `cita` for chat evidence). Clicking evidence opens the same drawer as on screen 3.
4. **Recommendations.** `recomendaciones[]` in the given order (already prioritised), grouped by `prioridad` (Alta, Media, Baja). Each shows the text and the task code it comes from. Show the first 8 and a "Ver todas (24)" toggle.
5. Footer line: "Cada resultado está enlazado a su evidencia. Puede revisar y corregir cualquier punto antes del informe final."

## Wording rules

- Use the Spanish strings from `data.js` exactly as written.
- Never say the evaluation is "automática", "certificada" or "ISO": this is a maturity diagnosis based on LightSME, not a certification.

## Done when

- The whole flow runs with keyboard only, from 1 to 5 and back, with no console errors.
- Opening `diseno-landing/demo/servicios/index.html` directly from disk works, and so does `npx serve diseno-landing`.
- `git diff main --stat` shows only new files under `diseno-landing/demo/servicios/`.
