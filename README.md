# Aldus

Een leessite. Elk artikel is een los Markdown-bestand; [Eleventy](https://www.11ty.dev/) maakt er pagina's van.

## Op je laptop draaien

Nodig: [Node.js](https://nodejs.org/) 18 of nieuwer.

```sh
npm install      # eenmalig
npm start        # site op http://localhost:8080, ververst bij elke wijziging
npm run build    # bouwt de site naar _site/
```

## Een stuk schrijven

Maak een nieuw bestand in `src/stukken/`, bijvoorbeeld `src/stukken/mijn-stuk.md`:

```markdown
---
title: Titel van het stuk
samenvatting: Eén zin die onder de titel en in het overzicht staat.
date: 2026-10-01
---

Hier begint de tekst. Gewone Markdown: *cursief*, **vet**, koppen met `##`,
citaten met `>`, en voetnoten.[^1]

[^1]: Zo werkt een voetnoot.
```

De bestandsnaam wordt het adres: `mijn-stuk.md` → `/stukken/mijn-stuk/`.
Het stuk verschijnt vanzelf op de homepage (vijf nieuwste) en in *Alle stukken* (per jaar).

## Consultancy en portfolio

Het consultancy-gedeelte staat op `/consultancy/`: een korte introductie en je projecten. Elk project is een Markdown-bestand in `src/consultancy/`:

```markdown
---
title: Titel van het project
opdrachtgever: Naam van de opdrachtgever
periode: 2025–2026
rol: Adviseur
diensten:
  - Strategie
  - Onderzoek
samenvatting: Eén zin over de vraag en wat je opleverde.
date: 2026-03-01
---

## De vraag
…
```

`date` bepaalt de volgorde (nieuwste bovenaan). De introductie en je contactgegevens staan in `src/_data/consultancy.js`.

**Concepten.** Zet `concept: true` bovenaan een stuk of project. Dan zie je het wel tijdens `npm start` (met het label *Concept*), maar komt het niet op de echte site. Het hele consultancy-gedeelte staat nog uit: pas als je in `src/_data/consultancy.js` `klaar: true` zet, verschijnt het op alduslab.eu, inclusief de link in de kop.

## Indeling

```
src/
  _data/site.js           titel, ondertitel, domein
  _includes/layouts/      base.njk (elke pagina), artikel.njk (een stuk)
  css/style.css           alle typografie en kleuren
  stukken/*.md            de artikelen
  consultancy/*.md        de projecten
  _data/consultancy.js    introductie, contact, aan/uit
  index.njk               homepage
  stukken.njk             overzicht van alle stukken
docs/domein.md            domein en DNS
eleventy.config.js        Eleventy-instellingen
```

## Huisstijl

Afgeleid van het beeldmerk (zie `docs/merk/`).

- **Beeldmerk:** `src/merk/aldus-beeldmerk.svg` (wit rondje, blauwe letters) en `aldus-beeldmerk-rand.svg` (met de grijze rand, voor op wit). Ook favicon en app-icoon.
- **Kleur:** Aldus-blauw `#0d3793` op wit. Tekst `#161a26`, gedempt `#555c70`, lijnen `#e5e5e5`. Donkere modus volgt de systeeminstelling.
- **Letters:** Helvetica (vet) voor merknaam, koppen en interface, net als het logo. Source Serif 4 voor lopende tekst, zelf gehost vanuit een npm-pakket. Helvetica is een licentieletter en wordt niet meegeleverd: Apple-apparaten tonen de echte Helvetica, Windows en Android vallen terug op Arial.
- **Maat:** ca. 65 tekens per regel, tekst 18–21 px, regelafstand 1,6. Verticale afstanden zijn veelvouden van één regel (`--ruimte`).

Alles staat als variabelen bovenaan `src/css/style.css`.
