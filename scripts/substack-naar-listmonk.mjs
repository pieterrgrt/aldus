// Zet de abonneelijst uit een Substack-export om naar een CSV die Listmonk kan importeren.
//
//   node scripts/substack-naar-listmonk.mjs email_list.aldus.csv > listmonk-import.csv
//
// Substack: Settings → Exports → "Create new export". In de zip staat email_list.<naam>.csv.
// Listmonk: Subscribers → Import → dit bestand, modus "Subscribe", lijst "Aldus".
// Adressen die Substack als onbezorgbaar of afgemeld markeert (email_disabled), gaan niet mee.

import { readFileSync } from "node:fs";

const bestand = process.argv[2];
if (!bestand) {
  console.error("Gebruik: node scripts/substack-naar-listmonk.mjs <substack-export.csv> > listmonk-import.csv");
  process.exit(1);
}

// Kleine CSV-lezer: komma's, aanhalingstekens en regeleinden binnen aanhalingstekens.
function leesCsv(tekst) {
  const rijen = [];
  let rij = [], veld = "", tussenAanhalingstekens = false;
  for (let i = 0; i < tekst.length; i++) {
    const t = tekst[i];
    if (tussenAanhalingstekens) {
      if (t === '"' && tekst[i + 1] === '"') { veld += '"'; i++; }
      else if (t === '"') tussenAanhalingstekens = false;
      else veld += t;
    } else if (t === '"') tussenAanhalingstekens = true;
    else if (t === ",") { rij.push(veld); veld = ""; }
    else if (t === "\n" || t === "\r") {
      if (t === "\r" && tekst[i + 1] === "\n") i++;
      rij.push(veld); rijen.push(rij); rij = []; veld = "";
    } else veld += t;
  }
  if (veld || rij.length) { rij.push(veld); rijen.push(rij); }
  return rijen.filter((r) => r.some((v) => v.trim()));
}

const csvVeld = (v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
const waar = (v) => /^(true|1|yes)$/i.test(String(v ?? "").trim());

const [kop, ...rijen] = leesCsv(readFileSync(bestand, "utf8").replace(/^﻿/, ""));
const kolom = Object.fromEntries(kop.map((naam, i) => [naam.trim().toLowerCase(), i]));
if (kolom.email === undefined) {
  console.error(`Geen kolom "email" gevonden. Kolommen: ${kop.join(", ")}`);
  process.exit(1);
}
const waarde = (rij, naam) => (kolom[naam] === undefined ? "" : (rij[kolom[naam]] ?? "").trim());

const gezien = new Set();
let overgeslagen = 0;
const uit = ["email,name,attributes"];

for (const rij of rijen) {
  const email = waarde(rij, "email").toLowerCase();
  if (!email.includes("@") || gezien.has(email)) { overgeslagen++; continue; }
  // Onbezorgbaar of afgemeld bij Substack: niet overnemen. (active_subscription gaat over
  // betaalde abonnementen; gratis lezers staan daar op false en horen er wel bij.)
  if (waar(waarde(rij, "email_disabled"))) {
    overgeslagen++;
    continue;
  }
  gezien.add(email);
  const naam = waarde(rij, "name");
  const kenmerken = { bron: "substack" };
  const sinds = waarde(rij, "created_at");
  if (sinds) kenmerken.sinds = sinds;
  const plan = waarde(rij, "plan");
  if (plan && plan !== "free") kenmerken.substack_plan = plan;
  uit.push([email, naam, JSON.stringify(kenmerken)].map(csvVeld).join(","));
}

process.stdout.write(uit.join("\n") + "\n");
console.error(`${gezien.size} abonnees omgezet, ${overgeslagen} overgeslagen (afgemeld, dubbel of ongeldig).`);
