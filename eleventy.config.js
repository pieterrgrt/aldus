import markdownItFootnote from "markdown-it-footnote";

const datumNL = new Intl.DateTimeFormat("nl-NL", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

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
  eleventyConfig.addWatchTarget("src/css/");

  eleventyConfig.amendLibrary("md", (md) => md.use(markdownItFootnote));

  // Alle stukken, nieuwste eerst.
  eleventyConfig.addCollection("stukken", (api) =>
    api.getFilteredByGlob("src/stukken/*.md").sort((a, b) => b.date - a.date)
  );

  eleventyConfig.addFilter("datum", (d) => datumNL.format(d));
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
