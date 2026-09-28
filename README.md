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

## Indeling

```
src/
  _data/site.js           titel, ondertitel, domein
  _includes/layouts/      base.njk (elke pagina), artikel.njk (een stuk)
  css/style.css           alle typografie en kleuren
  stukken/*.md            de artikelen
  index.njk               homepage
  stukken.njk             overzicht van alle stukken
docs/domein.md            domein en DNS
eleventy.config.js        Eleventy-instellingen
```

## Typografie

- **Letter:** Source Serif 4 (variabel, met optische maten), zelf gehost vanuit het npm-pakket — geen Google Fonts of andere externe verzoeken.
- **Maat:** ca. 65 tekens per regel, tekst 18–21 px afhankelijk van het scherm, regelafstand 1,6.
- **Kleur:** warm papier (`#fbf8f2`), bijna-zwarte inkt (`#1e1c1a`), één accent in rubriceerrood (`#a3281c`). Donkere modus volgt de instelling van het systeem.
- **Witruimte:** alle verticale afstanden zijn veelvouden van één regel (`--ruimte`).

Alles staat als variabelen bovenaan `src/css/style.css`.
