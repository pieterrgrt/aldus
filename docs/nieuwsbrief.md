# Nieuwsbrief met Listmonk

De nieuwsbrief gaat via [Listmonk](https://listmonk.app) op de eigen Hetzner-server, op **nieuwsbrief.alduslab.eu**. Listmonk draait in Docker naast Nextcloud en Vaultwarden, met een eigen Postgres-database. Het aanmeldformulier op alduslab.eu stuurt rechtstreeks naar Listmonk.

| Wat | Waarde |
| --- | --- |
| Domein | nieuwsbrief.alduslab.eu |
| Interne poort | 8004 (de volgende vrije na Aldus) |
| Map op de server | `~/aldus/listmonk` (komt mee met de repository) |
| Gegevens | `~/aldus/listmonk/data` (database) en `uploads/` (afbeeldingen), niet in git |

De volgorde is belangrijk: **Substack blijft aan tot de eerste nieuwsbrief via Listmonk goed is aangekomen.**

## 1. Listmonk installeren

Op de server (`ssh root@178.105.62.224`):

1. **Poort controleren.** `sudo ss -tlnp | grep 127.0.0.1:8004` moet leeg zijn. Anders een andere poort kiezen in `listmonk/docker-compose.yml` en in stap 3.

2. **DNS bij Infomaniak.** Voeg een A-record toe:

   | Type | Naam | Doel | TTL |
   | --- | --- | --- | --- |
   | A | `nieuwsbrief` | 178.105.62.224 | 1 uur |

3. **Starten.**

   ```bash
   cd ~/aldus && git pull
   cd listmonk
   cp .env.voorbeeld .env
   nano .env        # DB_WACHTWOORD: openssl rand -hex 24; BEHEERDER_WACHTWOORD: uit Vaultwarden
   docker compose up -d
   docker compose logs -f app   # wacht op "http server started", dan Ctrl+C
   curl -I http://127.0.0.1:8004/admin/
   ```

4. **nginx.** Maak `/etc/nginx/sites-available/nieuwsbrief`:

   ```nginx
   server {
       listen 80;
       server_name nieuwsbrief.alduslab.eu;
       client_max_body_size 20m;   # voor het importeren van de abonneelijst
       location / {
           proxy_pass http://127.0.0.1:8004;
           proxy_set_header Host $host;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

   ```bash
   sudo ln -s /etc/nginx/sites-available/nieuwsbrief /etc/nginx/sites-enabled/nieuwsbrief
   sudo nginx -t && sudo systemctl reload nginx
   sudo certbot --nginx -d nieuwsbrief.alduslab.eu
   ```

5. **Inloggen** op `https://nieuwsbrief.alduslab.eu/admin` met `BEHEERDER` en `BEHEERDER_WACHTWOORD`. Zet het wachtwoord in Vaultwarden. Daarna mogen `BEHEERDER` en `BEHEERDER_WACHTWOORD` uit `.env`.

## 2. Instellen

In Listmonk, onder **Settings**:

- **General:** Root URL `https://nieuwsbrief.alduslab.eu`. Default 'from' email `Aldus <nieuwsbrief@alduslab.eu>`. Language `Nederlands`. Zet *Enable public subscription page* en *Enable public mailing list archive* aan.
- **SMTP:** de server die de mails echt verstuurt. Twee mogelijkheden:
  - **Proton** (je mail staat daar al): maak in Proton een SMTP-token voor `nieuwsbrief@alduslab.eu` (Settings → IMAP/SMTP → SMTP tokens; vraagt een betaald abonnement met eigen domein). Host `smtp.protonmail.ch`, poort 587, STARTTLS. Proton is bedoeld voor kleine volumes; houd *Concurrency* laag (1–2) en *Message rate* rond 1 per seconde.
  - **Een Europese verzenddienst** zoals Scaleway TEM, Brevo of Mailjet, als de lijst groter wordt of Proton mails tegenhoudt. Die geven je SMTP-gegevens en DNS-records (SPF/DKIM) om toe te voegen bij Infomaniak.

  Klik daarna op *Test connection* en stuur een testmail naar jezelf.
- **Privacy:** zet *Individual subscriber tracking* uit en *Allow unsubscribe* aan. Dat past bij Aldus: geen tracking.
- **Appearance → Public:** eventueel de huisstijl (`#0d3793`, Helvetica) in de CSS, zodat de bevestigings- en afmeldpagina's bij de site passen.

Onder **Lists → New**: naam `Aldus`, type **Public**, opt-in **Double**. Open de lijst en kopieer het lange ID (UUID) en het getal (ID); die heb je zo nodig.

Onder **Campaigns → Templates**: pas de standaardtemplate aan (logo `https://alduslab.eu/merk/aldus-beeldmerk-512.png`, blauw `#0d3793`) en zet hem als standaard.

## 3. Abonnees overzetten van Substack

1. Substack → Settings → Exports → **Create new export**. Download de zip en pak `email_list.<naam>.csv` uit.
2. Op je laptop, in de repository:

   ```bash
   node scripts/substack-naar-listmonk.mjs ~/Downloads/email_list.aldus.csv > listmonk-import.csv
   ```

   Het script neemt alleen adressen over die Substack niet als afgemeld of onbezorgbaar markeert, haalt dubbele eruit, en bewaart als kenmerk dat ze van Substack komen en sinds wanneer. Zet `listmonk-import.csv` **niet** in git (het bevat e-mailadressen) en verwijder het na de import.
3. Listmonk → Subscribers → **Import**. Mode *Subscribe*, Subscription status **Confirmed** (deze mensen hebben zich al aangemeld bij Substack; ze nogmaals laten bevestigen kost je lezers), lijst `Aldus`, *Overwrite* uit. Upload het bestand.
4. Controleer het aantal onder Lists → Aldus met het aantal in Substack.

## 4. Aanmeldformulier op de site

1. Zet de UUID van de lijst in `src/_data/nieuwsbrief.js` bij `lijst`.
2. Commit en push naar `main`. Het formulier verschijnt onder elk stuk, op de homepage en op `/nieuwsbrief/`.

Het formulier stuurt naar `https://nieuwsbrief.alduslab.eu/subscription/form`. Listmonk stuurt een bevestigingsmail en toont zelf de bedankpagina. Tegen spambots zit er een onzichtbaar lokveld in, plus de dubbele bevestiging.

Test het met een eigen adres: aanmelden, bevestigen, afmelden.

## 5. Eerste nieuwsbrief, dan Substack loslaten

1. **Campaigns → New.** Lijst `Aldus`, formaat Markdown of Rich text. Tip: `radar/` maakt elke week een concept met de regelgevingsradar (zie `docs/radar.md`).
2. **Eerst een test.** *Send test* naar je eigen adressen bij Proton, Gmail en Outlook. Kijk of hij in de inbox komt en niet in spam, of de links werken en of de afmeldlink werkt. Belandt hij in spam: controleer SPF, DKIM en DMARC via [mail-tester.com](https://www.mail-tester.com).
3. **Versturen.** Houd de eerste dagen Campaigns → *Bounces* in de gaten.
4. **Substack loslaten.** Pas als dit goed ging:
   - Een laatste bericht via Substack: de nieuwsbrief komt voortaan van `nieuwsbrief@alduslab.eu`, zet dat adres in je contacten, de stukken staan op alduslab.eu.
   - In Substack de publicatie op pauze of verwijderen. Doe nog een laatste export en bewaar die (in Nextcloud, niet in git).
   - Oude Substack-stukken die je wilt houden: zet ze als Markdown in `src/stukken/`, met de oorspronkelijke datum.

## Beheer

Alle opdrachten in `~/aldus/listmonk`.

| Wat | Opdracht |
| --- | --- |
| Draait alles? | `docker compose ps` |
| Logboek | `docker compose logs -f app` |
| Nieuwe versie van Listmonk | versie in `docker-compose.yml` ophogen, pushen, dan `git pull && docker compose up -d` (de database wordt vanzelf bijgewerkt) |
| Back-up van de abonnees | `docker compose exec -T db pg_dump -U listmonk listmonk \| gzip > ~/backups/listmonk-$(date +%F).sql.gz` |

**Back-up is hier wel nodig**: de abonneelijst staat alleen in de database. Zet de back-upopdracht in cron (`crontab -e`), bijvoorbeeld elke nacht om 3 uur:

```
0 3 * * * mkdir -p ~/backups && cd ~/aldus/listmonk && docker compose exec -T db pg_dump -U listmonk listmonk | gzip > ~/backups/listmonk-$(date +\%F).sql.gz && find ~/backups -name 'listmonk-*' -mtime +30 -delete
```

Kopieer `~/backups` af en toe naar een andere plek (Nextcloud of je laptop); een back-up op dezelfde server helpt niet als de server weg is.
