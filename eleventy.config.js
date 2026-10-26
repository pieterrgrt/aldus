import markdownItFootnote from "markdown-it-footnote";
import { inTaal } from "./lib/in-taal.js";
import teksten from "./src/_data/teksten.js";

// Datums per taal: „20 november 2025” en "20 November 2025".
const datumNotatie = Object.fromEntries(
  Object.entries(teksten).map(([taal, t]) => [
    taal,
    new Intl.DateTimeFormat(t.locale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }),
  ])
);

export default function (eleventyConfig) {
  // Lettertypes rechtstreeks uit het npm-pakket, zodat er niets van een CDN komt.
  const fontDir = "node_modules/@fontsource-variable/source-serif-4/files";
  eleventyConfig.addPassthroughCopy({
    [`${fontDir}/source-serif-4-latin-opsz-normal.woff2`]: "fonts/source-serif-4-normal.woff2",
    [`${fontDir}/source-serif-4-latin-opsz-italic.woff2`]: "fonts/source-serif-4-italic.woff2",
  });
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/merk");
  eleventyConfig.addPassthroughCopy({ "src/favicon.svg": "favicon.svg", "src/favicon-32.png": "favicon-32.png", "src/apple-touch-icon.png": "apple-touch-icon.png" });
  // Voor de server: /health geeft 200 zolang de site gebouwd en online is.
  eleventyConfig.addPassthroughCopy({ "src/health": "health" });
  eleventyConfig.addWatchTarget("src/css/");

  eleventyConfig.amendLibrary("md", (md) => md.use(markdownItFootnote));

  // Concepten zie je tijdens `npm start`, maar ze komen niet op de echte site (`npm run build`).
  // Het consultancy-gedeelte blijft offline tot `klaar: true` in src/_data/consultancy.js,
  // de nieuwsbriefpagina tot de lijst-UUID in src/_data/nieuwsbrief.js staat,
  // de winkel tot `klaar: true` in src/_data/winkel.js.
  eleventyConfig.addPreprocessor("concepten", "*", (data) => {
    if (process.env.ELEVENTY_RUN_MODE !== "build") return;
    if (data.concept) return false;
    if (data.onderdeel === "consultancy" && !data.consultancy.klaar) return false;
    if (data.onderdeel === "nieuwsbrief" && !inTaal(data.nieuwsbrief, data.taal).lijst) return false;
    if (data.onderdeel === "winkel" && !data.winkel.klaar) return false;
  });

  // Per taal: stukken_nl uit src/stukken/, stukken_en uit src/en/stukken/, enzovoort.
  for (const taal of Object.keys(teksten)) {
    const map = taal === "nl" ? "src" : `src/${taal}`;

    // Alle stukken, nieuwste eerst.
    eleventyConfig.addCollection(`stukken_${taal}`, (api) =>
      api.getFilteredByGlob(`${map}/stukken/*.md`).sort((a, b) => b.date - a.date)
    );
    // Consultancyprojecten, nieuwste eerst.
    eleventyConfig.addCollection(`projecten_${taal}`, (api) =>
      api.getFilteredByGlob(`${map}/consultancy/*.md`).sort((a, b) => b.date - a.date)
    );
    // Producten in de winkel, op `volgorde`.
    eleventyConfig.addCollection(`producten_${taal}`, (api) =>
      api.getFilteredByGlob(`${map}/winkel/*.md`).sort((a, b) => (a.data.volgorde ?? 99) - (b.data.volgorde ?? 99))
    );
  }

  // Adres van dezelfde pagina in de andere taal, of niets als die (nog) niet bestaat.
  // Een pagina en zijn vertaling hebben dezelfde bestandsnaam: src/x ↔ src/en/x.
  eleventyConfig.addFilter("vertaling", (alle, inputPath) => {
    const ander = inputPath.startsWith("./src/en/")
      ? inputPath.replace("./src/en/", "./src/")
      : inputPath.replace("./src/", "./src/en/");
    return alle.find((p) => p.inputPath === ander)?.url;
  });

  eleventyConfig.addFilter("datum", (d, taal = "nl") => datumNotatie[taal].format(d));
  eleventyConfig.addFilter("isoDatum", (d) => d.toISOString().slice(0, 10));
  eleventyConfig.addFilter("jaar", (d) => d.getUTCFullYear());
  eleventyConfig.addFilter("eerste", (arr, n) => arr.slice(0, n));

  // Stukken per jaar groeperen voor het overzicht: [[2026, [...]], [2025, [...]]].
  eleventyConfig.addFilter("perJaar", (stukken) => {
    const groepen = new Map();
    for (const stuk of stukken) {
      const jaar = stuk.date.getUTCFullYear();
      if (!groepen.has(jaar)) groepen.set(jaar, []);
      groepen.get(jaar).push(stuk);
    }
    return [...groepen];
  });

  // Geschatte leestijd op basis van ca. 230 woorden per minuut.
  eleventyConfig.addFilter("leestijd", (html) => {
    const woorden = String(html).replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(woorden / 230));
  });
}

export const config = {
  dir: {
    input: "src",
    includes: "_includes",
    data: "_data",
    output: "_site",
  },
  markdownTemplateEngine: "njk",
  htmlTemplateEngine: "njk",
};
