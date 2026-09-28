// Regelgevingsradar: haalt de artikelen van de afgelopen week uit Miniflux, laat Claude
// er een overzicht van maken en bewaart dat als startpunt voor de nieuwsbrief.
//
//   node radar.mjs              overzicht van de afgelopen 7 dagen → uitvoer/2026-W40.md
//   node radar.mjs --dagen 14   langere periode
//   node radar.mjs --droog      alleen tellen wat er uit Miniflux komt, niets naar Claude
//
// Instellingen staan in .env (zie .env.voorbeeld). Staat LISTMONK_URL erin, dan komt het
// overzicht ook als concept-campagne in Listmonk; versturen doe je daar altijd zelf.

import Anthropic from "@anthropic-ai/sdk";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const hier = dirname(fileURLToPath(import.meta.url));

// .env inlezen zonder extra pakket; variabelen uit de omgeving gaan voor.
try {
  for (const regel of readFileSync(join(hier, ".env"), "utf8").split("\n")) {
    const m = regel.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, "$2");
  }
} catch {}

const args = process.argv.slice(2);
const dagen = Number(args[args.indexOf("--dagen") + 1]) || Number(process.env.RADAR_DAGEN) || 7;
const droog = args.includes("--droog");

// Per artikel gaat hoogstens dit aantal tekens naar Claude. Feeds leveren soms hele
// artikelen; het begin is genoeg om te bepalen waar het over gaat.
const MAX_TEKENS_PER_ARTIKEL = 4000;

function vereist(naam) {
  const waarde = process.env[naam];
  if (!waarde) {
    console.error(`${naam} ontbreekt. Zet het in radar/.env (zie .env.voorbeeld).`);
    process.exit(1);
  }
  return waarde;
}

// --- Miniflux ---------------------------------------------------------------

const minifluxUrl = vereist("MINIFLUX_URL").replace(/\/$/, "");
const minifluxToken = vereist("MINIFLUX_TOKEN");

async function miniflux(pad) {
  const antwoord = await fetch(`${minifluxUrl}/v1${pad}`, { headers: { "X-Auth-Token": minifluxToken } });
  if (!antwoord.ok) throw new Error(`Miniflux ${pad}: ${antwoord.status} ${await antwoord.text()}`);
  return antwoord.json();
}

// MINIFLUX_CATEGORIEEN: kommagescheiden namen van categorieën, bijv. "Regelgeving,Toezicht".
// Leeg = alle feeds.
async function categorieIds() {
  const namen = (process.env.MINIFLUX_CATEGORIEEN || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (!namen.length) return [null];
  const alle = await miniflux("/categories");
  const gevonden = alle.filter((c) => namen.includes(c.title.toLowerCase()));
  const ontbrekend = namen.filter((n) => !gevonden.some((c) => c.title.toLowerCase() === n));
  if (ontbrekend.length) {
    console.error(`Categorie niet gevonden in Miniflux: ${ontbrekend.join(", ")}. Wel aanwezig: ${alle.map((c) => c.title).join(", ")}`);
    process.exit(1);
  }
  return gevonden.map((c) => c.id);
}

async function artikelen() {
  const vanaf = Math.floor(Date.now() / 1000) - dagen * 86400;
  const lijst = [];
  for (const categorie of await categorieIds()) {
    for (let offset = 0; ; offset += 100) {
      const q = new URLSearchParams({ published_after: vanaf, order: "published_at", direction: "desc", limit: 100, offset });
      if (categorie) q.set("category_id", categorie);
      const { entries } = await miniflux(`/entries?${q}`);
      lijst.push(...entries);
      if (entries.length < 100) break;
    }
  }
  // Dubbele adressen (zelfde bericht in twee feeds) één keer.
  const gezien = new Set();
  return lijst.filter((a) => !gezien.has(a.url) && gezien.add(a.url));
}

const zonderHtml = (html) =>
  String(html || "")
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

function alsTekst(a, i) {
  let inhoud = zonderHtml(a.content);
  const ingekort = inhoud.length > MAX_TEKENS_PER_ARTIKEL;
  if (ingekort) inhoud = inhoud.slice(0, MAX_TEKENS_PER_ARTIKEL) + " […]";
  return [
    `<artikel nr="${i + 1}"${ingekort ? ' ingekort="ja"' : ""}>`,
    `Titel: ${a.title}`,
    `Bron: ${a.feed?.title ?? "onbekend"}${a.feed?.category?.title ? ` (${a.feed.category.title})` : ""}`,
    `Datum: ${a.published_at?.slice(0, 10)}`,
    `Link: ${a.url}`,
    "",
    inhoud || "(geen tekst in de feed)",
    "</artikel>",
  ].join("\n");
}

// --- Week en uitvoer ----------------------------------------------------------

function isoWeek(d = new Date()) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dag = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - dag);
  const jaarStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((t - jaarStart) / 86400000 + 1) / 7);
  return `${t.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

// --- Claude -------------------------------------------------------------------

async function overzicht(lijst) {
  const client = new Anthropic(); // leest ANTHROPIC_API_KEY
  const instructies = readFileSync(join(hier, "instructies.md"), "utf8");
  const vandaag = new Date().toISOString().slice(0, 10);

  const stream = client.beta.messages.stream({
    model: process.env.RADAR_MODEL || "claude-opus-5",
    max_tokens: 32000,
    thinking: { type: "adaptive" },
    output_config: { effort: "high" },
    // Weigert het model een verzoek, dan probeert de API het zelf op een ander model.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: instructies,
    messages: [
      {
        role: "user",
        content: `Vandaag is het ${vandaag}. Hieronder ${lijst.length} artikelen uit de afgelopen ${dagen} dagen.\n\n${lijst.map(alsTekst).join("\n\n")}\n\nMaak nu de regelgevingsradar.`,
      },
    ],
  });
  const bericht = await stream.finalMessage();

  if (bericht.stop_reason === "refusal") {
    throw new Error(`Claude weigerde het overzicht (${bericht.stop_details?.category ?? "onbekend"}): ${bericht.stop_details?.explanation ?? ""}`);
  }
  const tekst = bericht.content.filter((b) => b.type === "text").map((b) => b.text).join("").trim();
  if (bericht.stop_reason === "max_tokens") console.error("Let op: het overzicht is afgekapt (max_tokens bereikt).");
  const u = bericht.usage;
  console.error(`Claude (${bericht.model}): ${u.input_tokens} tokens in, ${u.output_tokens} tokens uit.`);
  return tekst;
}

// --- Listmonk (optioneel) -----------------------------------------------------

async function conceptInListmonk(week, tekst) {
  const url = process.env.LISTMONK_URL?.replace(/\/$/, "");
  if (!url) return;
  const antwoord = await fetch(`${url}/api/campaigns`, {
    method: "POST",
    headers: {
      Authorization: `token ${vereist("LISTMONK_API_GEBRUIKER")}:${vereist("LISTMONK_API_TOKEN")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: `Radar ${week}`,
      subject: `[Concept] Aldus, ${week}`,
      lists: [Number(vereist("LISTMONK_LIJST_ID"))],
      type: "regular",
      content_type: "markdown",
      body: tekst,
      tags: ["radar"],
    }),
  });
  if (!antwoord.ok) throw new Error(`Listmonk: ${antwoord.status} ${await antwoord.text()}`);
  const { data } = await antwoord.json();
  console.error(`Concept-campagne in Listmonk: ${url}/admin/campaigns/${data.id}`);
}

// --- Draaien ------------------------------------------------------------------

const lijst = await artikelen();
console.error(`${lijst.length} artikelen uit Miniflux (afgelopen ${dagen} dagen).`);
if (droog) {
  for (const a of lijst) console.error(`- ${a.published_at?.slice(0, 10)}  ${a.feed?.title}: ${a.title}`);
  process.exit(0);
}
if (!lijst.length) {
  console.error("Niets om samen te vatten.");
  process.exit(0);
}

const week = isoWeek();
const tekst = await overzicht(lijst);
const bestand = join(hier, "uitvoer", `${week}.md`);
mkdirSync(dirname(bestand), { recursive: true });
writeFileSync(bestand, `# Regelgevingsradar ${week}\n\n${tekst}\n`);
console.error(`Opgeslagen: ${bestand}`);
await conceptInListmonk(week, tekst);
