# Domein: aldus.eu of alduslab.eu?

**Nog te beslissen.** Voorstel:

- **aldus.eu wordt de hoofdsite.** Korter, makkelijker uit te spreken en te onthouden, en het is de naam van de site zelf.
- **alduslab.eu blijft in bezit** en stuurt met een permanente doorverwijzing (HTTP 301) door naar `https://aldus.eu`, met behoud van het pad (`alduslab.eu/stukken/x/` → `aldus.eu/stukken/x/`).
- Eventueel later: `alduslab.eu` inzetten voor experimenten of werk in uitvoering, los van de leessite.

Het hoofddomein staat op één plek in de code: `src/_data/site.js` (`url`). Daar komt ook de canonieke link in elke pagina vandaan.

De doorverwijzing zelf regel je bij de hosting of de domeinregistrar, niet in Eleventy. Dat komt aan bod bij de stap *publiceren*.
