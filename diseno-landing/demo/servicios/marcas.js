// Ozmetra demo: brand of each company, keyed by `empresa.slug` in its data file
// (data-<slug>.js, opened with ?empresa=<slug>). A company with no entry here, like the
// default example in data.js, keeps the Ozmetra look.
//
//   modo          "oscuro" (default) or "claro" for a company whose site is light: white page,
//                 dark text, the dark Ozmetra logo and status colours readable on white
//   logo          path from this folder; shown next to the Ozmetra logo. It must read on the
//                 page's ground (dark, or light with modo "claro")
//   logoAlto      logo height in the header, in px
//   acento        fills: main button, current step, reached band, highlighted quotes
//   sobreAcento   text on top of `acento`
//   acentoTexto   the accent as text, icons and lines on the page (optional, defaults to
//                 `acento`); use another tint when `acento` does not read on the page's ground
//   superficies   page, panel and text colours (optional; without it the Ozmetra defaults
//                 for the chosen modo stay): fondo, fondo2 (header and footer bars), papel
//                 (cards and drawer), linea, panel, panel2 (rows inside panels), panel3,
//                 lineaPanel, texto, textoSuave
//
// The status colours (found, partial, not found, pending) and the fonts never change:
// they belong to the diagnosis, not to the company.
window.MARCAS = {
  // stemdo.io: white site, black text, electric blue-violet buttons and borders,
  // soft lavender panels; site in Inter / Monument Extended
  stemdo: {
    modo: "claro",
    logo: "logos/StemdoLogo.svg",
    logoAlto: 24,
    acento: "#4237ff",
    sobreAcento: "#ffffff",
    acentoTexto: "#4237ff",
    superficies: {
      fondo: "#ffffff",
      fondo2: "#ffffff",
      papel: "#ffffff",
      linea: "#e9e8f8",
      panel: "#f4f3ff",
      panel2: "#ffffff",
      panel3: "#e4e2ff",
      lineaPanel: "#dcdaf8",
      texto: "#000000",
      textoSuave: "#494a52",
    },
  },
  // quantumhowl.com: dark navy site with a cyan accent; site in Exo 2 / JetBrains Mono
  quantumhowl: {
    logo: "logos/QuantumHowlLogo.avif",
    logoAlto: 36,
    acento: "#5bcae1",
    sobreAcento: "#0a0e17",
    acentoTexto: "#5bcae1",
    superficies: {
      fondo: "#0a0e17",
      fondo2: "#0f1419",
      papel: "#151a26",
      linea: "#1e2435",
      panel: "#1a1f2e",
      panel2: "#1e2435",
      panel3: "#2a3142",
      lineaPanel: "#2a3142",
    },
  },
};
