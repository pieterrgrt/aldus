// Basistests op de gebouwde site. Eerst `npm run build`, dan `npm test` (of in één keer: `npm run controleer`).
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const pagina = (pad) => readFileSync(new URL(`../_site/${pad}`, import.meta.url), "utf8");

test("/health bestaat en zegt ok", () => {
  assert.equal(pagina("health").trim(), "ok");
});

// De belangrijkste adressen, in beide talen.
const routes = [
  "index.html",
  "stukken/index.html",
  "zoeken/index.html",
  "winkel/index.html",
  "consultancy/index.html",
  "404.html",
  "en/index.html",
  "en/articles/index.html",
  "en/search/index.html",
  "en/shop/index.html",
  "en/consulting/index.html",
  "en/404.html",
];

for (const route of routes) {
  test(`/${route.replace(/index\.html$/, "")} is een volledige pagina`, () => {
    const html = pagina(route);
    assert.match(html, /<!doctype html>/i);
    assert.match(html, /<title>[^<]+<\/title>/);
  });
}

test("de homepage linkt naar de stukken", () => {
  assert.match(pagina("index.html"), /href="\/stukken\//);
});

test("de Engelse homepage is Engels", () => {
  assert.match(pagina("en/index.html"), /<html[^>]+lang="en"/);
});

test("de zoekindex van Pagefind is gebouwd", () => {
  assert.ok(existsSync(new URL("../_site/pagefind/pagefind.js", import.meta.url)));
});
