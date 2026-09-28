# Domein

**Besluit:** de hoofdsite is **alduslab.eu**. Het adres staat in `src/_data/site.js` (`url`). Daar komt ook de canonieke link in elke pagina vandaan.

## DNS

De site staat op **GitHub Pages**. De DNS wordt beheerd bij **Infomaniak** (nameservers `nsany1/nsany2.infomaniak.com`).
Publiceren gaat automatisch via `.github/workflows/pages.yml` bij elke push naar `main`.

Records voor e-mail (Proton: MX, SPF, DKIM, DMARC, `protonmail-verification`) en de subdomeinen `cloud` en `vault` laat je staan zoals ze zijn.

### GitHub Pages instellen

In deze volgorde:

1. **Domein verifiëren** bij GitHub, zodat niemand anders het kan claimen:
   GitHub → Settings (je account) → Pages → *Add a domain* → `alduslab.eu`.
   GitHub geeft je een TXT-record dat je bij je registrar toevoegt, iets als:

   | Type | Naam                                  | Waarde           |
   |------|---------------------------------------|------------------|
   | TXT  | `_github-pages-challenge-pieterrgrt`  | (code van GitHub) |

2. **Records voor de site** bij je registrar:

   | Type  | Naam  | Waarde                   |
   |-------|-------|--------------------------|
   | A     | `@`   | `185.199.108.153`        |
   | A     | `@`   | `185.199.109.153`        |
   | A     | `@`   | `185.199.110.153`        |
   | A     | `@`   | `185.199.111.153`        |
   | AAAA  | `@`   | `2606:50c0:8000::153`    |
   | AAAA  | `@`   | `2606:50c0:8001::153`    |
   | AAAA  | `@`   | `2606:50c0:8002::153`    |
   | AAAA  | `@`   | `2606:50c0:8003::153`    |
   | CNAME | `www` | `pieterrgrt.github.io.`  |

   `@` staat voor het domein zelf (`alduslab.eu`). Sommige registrars willen dat veld leeg.
   Staan er al A-, AAAA- of CNAME-records voor `@` of `www`, bijvoorbeeld een parkeerpagina van de registrar? Verwijder die dan eerst.

3. **Pages instellen** in de repository: Settings → Pages → *Source*: **GitHub Actions**. Daarna bij *Custom domain* → `alduslab.eu`. Zet *Enforce HTTPS* aan zodra GitHub het certificaat heeft aangemaakt. Dat kan tot een uur duren.

4. **Controleren**, als DNS is bijgewerkt (minuten tot een paar uur):

   ```sh
   dig alduslab.eu +short        # vier 185.199.x.153-adressen
   dig www.alduslab.eu +short    # pieterrgrt.github.io.
   ```

Let op: GitHub Pages werkt gratis voor een **publieke** repository. Voor een privé-repository heb je GitHub Pro nodig.
