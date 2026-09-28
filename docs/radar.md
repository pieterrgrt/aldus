# Regelgevingsradar

Een script dat elke week de artikelen uit je Miniflux-feeds ophaalt en Claude er een overzicht van laat maken: wat er gebeurde, voor wie het gevolgen heeft, drie invalshoeken voor de nieuwsbrief en deadlines om in de gaten te houden. Het is een startpunt; de nieuwsbrief schrijf je zelf.

| Bestand | Wat |
| --- | --- |
| `radar/radar.mjs` | het script |
| `radar/instructies.md` | wat Claude moet doen. **Hier stuur je de radar bij**: onderwerpen, opbouw, toon |
| `radar/.env` | sleutels en instellingen (niet in git; voorbeeld in `.env.voorbeeld`) |
| `radar/uitvoer/2026-W40.md` | het overzicht per week (niet in git) |
| `radar/draai.sh` | draaien op de server, in Docker |

## Instellen

1. **Miniflux.** Zet de feeds die over regelgeving gaan in één categorie, bijvoorbeeld `Regelgeving` (Autoriteit Persoonsgegevens, ACM, EDPB, Europese Commissie, EUR-Lex, Rijksoverheid, internetconsultatie.nl, …). Maak een API-sleutel: Instellingen → API-sleutels.
2. **Claude-API.** Maak een sleutel op [console.anthropic.com](https://console.anthropic.com) en zet er een bestedingslimiet op. Eén radar kost ruwweg een paar tientallen centen, afhankelijk van het aantal artikelen.
3. **.env invullen.**

   ```bash
   cd ~/aldus/radar
   cp .env.voorbeeld .env
   nano .env
   ```

4. **Proberen.** Eerst zonder Claude, om te zien wat er uit Miniflux komt:

   ```bash
   ./radar/draai.sh --droog
   ./radar/draai.sh
   cat radar/uitvoer/*.md
   ```

## Elke week vanzelf

Op de server, `crontab -e`, bijvoorbeeld zondagavond om 20:00:

```
0 20 * * 0 cd ~/aldus && ./radar/draai.sh >> radar/radar.log 2>&1
```

Staan `LISTMONK_URL` en de andere `LISTMONK_`-regels in `.env`, dan zet het script het overzicht ook als **concept-campagne** in Listmonk (`[Concept] Aldus, 2026-W40`). Daar herschrijf je het tot de nieuwsbrief en verstuur je het zelf. Het script verstuurt nooit iets.

Een API-gebruiker voor Listmonk maak je onder Admin → Users → New, type *API*, met alleen de rechten *campaigns:manage* en *lists:get*.

## Op je laptop

```bash
cd radar
npm install
node radar.mjs --dagen 14
```

## Hoe het werkt

1. Artikelen ophalen uit Miniflux (`/v1/entries`, gepubliceerd in de afgelopen `--dagen`, alleen de categorieën uit `MINIFLUX_CATEGORIEEN`). Dubbele links één keer.
2. Per artikel titel, bron, datum, link en de tekst uit de feed. Van lange artikelen gaan de eerste 4000 tekens mee (`MAX_TEKENS_PER_ARTIKEL` in het script); Claude weet dat het dan om een begin gaat.
3. Eén verzoek aan Claude (`claude-opus-5`, met nadenken aan), met `instructies.md` als opdracht. Weigert het model, dan probeert de API het zelf op een ander model.
4. Het resultaat naar `uitvoer/<jaar>-W<week>.md` en eventueel naar Listmonk.

Claude gebruikt alleen wat in de artikelen staat en moet links uit de feed noemen. Controleer toch altijd feiten en data voordat ze in de nieuwsbrief komen.
