# Aldus online zetten op alduslab.eu

Aldus draait op de Hetzner-server, net als liveaux: in een eigen Docker-container op een interne poort, met de nginx van de server ervoor voor het domein en HTTPS. Het verschil met liveaux: Aldus is een statische site. Er is geen database, geen `.env` en geen admin. De container bouwt de site met Eleventy en serveert de bestanden met nginx.

| Website | Domein | Interne poort | Map op de server | Repository |
| --- | --- | --- | --- | --- |
| alduslab | alduslab.eu, www.alduslab.eu | 8003 | ~/aldus | github.com/pieterrgrt/aldus |

Neem deze rij over in de tabel van *Website live zetten op Hetzner*. In gebruik op 28 september 2026: 8001 (liveaux), 8002 (onbekend, zie `docker ps`), 8003 (Aldus), 8004 (Listmonk, zie `docs/nieuwsbrief.md`), 11000 (Nextcloud). De volgende krijgt 8005.

`cloud.alduslab.eu` (Nextcloud), `vault.alduslab.eu` en de Proton-mail blijven zoals ze zijn. Dit plan raakt alleen `alduslab.eu` en `www`.

## Stappenplan

Stap 1 gebeurt op GitHub, stap 2 en 3 bij Infomaniak en GitHub, de rest op de server (`ssh root@178.105.62.224`).

1. **Code op `main` zetten.** Merge de branch `claude/adoring-johnson-lhv3ra` naar `main`. Daarin zitten de `Dockerfile`, `docker-compose.yml` en `docker/nginx.conf`.

2. **Poort controleren.**

   ```bash
   sudo ss -tlnp | grep 127.0.0.1
   ```

   Staat `127.0.0.1:8003` er al tussen, kies dan een vrije poort. Pas die aan in `docker-compose.yml` en in stap 7.

3. **DNS bij Infomaniak omzetten.** Nu wijst het domein naar GitHub Pages. Dat moet de Hetzner-server worden.

   Verwijderen:
   - de vier A-records van `alduslab.eu` naar `185.199.108.153` t/m `185.199.111.153`
   - de vier AAAA-records van `alduslab.eu` naar `2606:50c0:8000::153` t/m `8003::153`
   - het CNAME-record `www` naar `pieterrgrt.github.io`

   Toevoegen:

   | Type | Naam | Doel | TTL |
   | --- | --- | --- | --- |
   | A | (leeg / `@`) | 178.105.62.224 | 1 uur |
   | A | `www` | 178.105.62.224 | 1 uur |

   Laat alles anders staan: MX, SPF, DKIM, DMARC, de Proton-verificatie, `cloud` en `vault`.

   Controleer vanaf de server:

   ```bash
   NS=$(dig +short NS alduslab.eu | head -1); for p in "" "www."; do n="${p}alduslab.eu"; for t in A AAAA; do echo "$n $t: $(dig +short $t $n @$NS)"; done; done
   ```

   Goed = beide A-regels tonen 178.105.62.224 en beide AAAA-regels zijn leeg.

4. **GitHub Pages loskoppelen.** Ga op GitHub naar de repository → Settings → Pages en haal `alduslab.eu` weg bij *Custom domain*. Staat *Source* op iets anders dan *None*, zet het uit. De publicatie-workflow voor GitHub Pages is uit de code gehaald.

5. **Code ophalen.**

   ```bash
   git clone https://github.com/pieterrgrt/aldus.git ~/aldus
   cd ~/aldus
   ```

   Privé repository: gebruik een GitHub-token als wachtwoord.

6. **Starten en testen.**

   ```bash
   docker compose up -d --build
   curl -I http://127.0.0.1:8003/
   ```

   `HTTP/1.1 200 OK` = goed. De eerste keer duurt het bouwen een paar minuten. Test ook de doorverwijzing van www:

   ```bash
   curl -I -H "Host: www.alduslab.eu" http://127.0.0.1:8003/
   ```

   Een 301 naar `https://alduslab.eu/` = goed.

7. **nginx laten doorsturen.** Maak `/etc/nginx/sites-available/aldus` met dit blok:

   ```nginx
   server {
       listen 80;
       server_name alduslab.eu www.alduslab.eu;
       location / {
           proxy_pass http://127.0.0.1:8003;
           proxy_set_header Host $host;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

   Zet hem aan en herlaad:

   ```bash
   sudo ln -s /etc/nginx/sites-available/aldus /etc/nginx/sites-enabled/aldus
   sudo nginx -t && sudo systemctl reload nginx
   ```

8. **HTTPS aanvragen.** Pas als stap 3 klopt:

   ```bash
   sudo certbot certificates
   sudo certbot --nginx -d alduslab.eu -d www.alduslab.eu
   ```

   Kijk bij de eerste opdracht of er al een certificaat bestaat met de naam `alduslab.eu`, bijvoorbeeld van Nextcloud. Vraagt certbot dan om dat uit te breiden (*Expand*), kies dat. Kies "redirect" als certbot erom vraagt.

9. **Controleren.** Open `https://alduslab.eu` en `https://www.alduslab.eu`. De tweede moet doorsturen naar de eerste. Controleer ook `https://cloud.alduslab.eu`: Nextcloud moet gewoon blijven werken.

## Valkuilen

| Wat je ziet | Oorzaak | Oplossing |
| --- | --- | --- |
| Certbot: `unauthorized … 2606:50c0:… 404` | Er staat nog een AAAA-record van GitHub. Let's Encrypt probeert IPv6 eerst | De vier AAAA-records van GitHub verwijderen (stap 3), dan certbot opnieuw |
| Nextcloud-pagina op alduslab.eu | Er is nog geen HTTPS-blok voor alduslab.eu, dus nginx valt terug op het eerste | Certificaat aanvragen (stap 8) |
| Een GitHub-foutpagina (404 "There isn't a GitHub Pages site here") | Je Mac of provider onthoudt de oude DNS | Mac: `sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder`, of test via 4G |
| `toomanyrequests` of `429` bij het bouwen | Docker Hub beperkt het aantal downloads | Even wachten en opnieuw `docker compose up -d --build` |
| `/consultancy/` geeft 404 | Klopt: het consultancy-gedeelte staat uit | `klaar: true` in `src/_data/consultancy.js`, dan een nieuwe versie live zetten |

## Beheer

Alle opdrachten in `~/aldus`.

| Wat | Opdracht |
| --- | --- |
| Nieuwe versie live zetten | gaat vanzelf na een push naar `main` (zie hieronder); met de hand: `./deploy/update.sh` |
| Zien of het online zetten lukte | GitHub → Actions → *Online zetten* |
| Draait alles? | `docker compose ps` |
| Verzoeken en fouten bekijken | `docker compose logs -f web` (stoppen: Ctrl+C) |
| nginx-config testen na een wijziging | `sudo nginx -t && sudo systemctl reload nginx` |
| Certificaten controleren | `sudo certbot certificates` |

Een back-up is niet nodig. Alles staat in de repository en de server bouwt de site daaruit opnieuw op.

## Automatisch online zetten

Na elke push naar `main` bouwt GitHub de site eerst ter controle. Lukt dat, dan logt GitHub in op de server en draait daar `./deploy/update.sh`. Daarna kijkt de workflow of `https://alduslab.eu/` antwoordt. De workflow staat in `.github/workflows/online-zetten.yml`; je ziet elke ronde onder *Actions* op GitHub. Mislukt het bouwen, dan blijft de oude versie gewoon online.

GitHub krijgt daarvoor een eigen SSH-sleutel die op de server **alleen** `deploy/update.sh` mag draaien, niets anders. Eenmalig instellen:

1. **Sleutel maken**, op de server:

   ```bash
   ssh-keygen -t ed25519 -N "" -C "github-actions-aldus" -f ~/.ssh/github-aldus
   ```

2. **Beperkt toelaten.** Zet de publieke sleutel in `~/.ssh/authorized_keys`, met ervoor welke opdracht hij mag draaien:

   ```bash
   echo "command=\"cd /root/aldus && ./deploy/update.sh\",restrict $(cat ~/.ssh/github-aldus.pub)" >> ~/.ssh/authorized_keys
   ```

   `restrict` zet port forwarding, een terminal en de rest uit. Wat GitHub ook stuurt, er draait alleen `update.sh`.

3. **`git pull` zonder wachtwoord.** `update.sh` haalt `main` op. Is de repository privé, dan moet de server dat kunnen zonder te vragen. Controleer met `cd ~/aldus && git pull`; vraagt hij om een wachtwoord, sla het token dan op met `git config credential.helper store` en één keer `git pull` met het token als wachtwoord. Gebruik een *fine-grained token* met alleen leesrecht (*Contents: Read-only*) op deze ene repository.

4. **Geheimen op GitHub.** Repository → Settings → Secrets and variables → Actions → *New repository secret*:

   | Naam | Waarde |
   | --- | --- |
   | `DEPLOY_HOST` | `178.105.62.224` |
   | `DEPLOY_SSH_KEY` | de inhoud van `~/.ssh/github-aldus` (de privésleutel, zonder `.pub`, inclusief de BEGIN- en END-regels) |
   | `DEPLOY_KNOWN_HOSTS` | de uitvoer van `ssh-keyscan -t ed25519 178.105.62.224`, op je laptop gedraaid |

   Verwijder daarna de privésleutel van de server: `rm ~/.ssh/github-aldus`. Hij staat nu alleen nog als geheim bij GitHub.

5. **Testen.** GitHub → Actions → *Online zetten* → *Run workflow*. Groen = goed.

| Wat je ziet | Oorzaak | Oplossing |
| --- | --- | --- |
| `Permission denied (publickey)` | Sleutel niet (goed) in `authorized_keys`, of het geheim mist een regel | Stap 2 en 4 nalopen; het geheim moet met `-----BEGIN` beginnen en met `-----END …-----` eindigen |
| `Host key verification failed` | `DEPLOY_KNOWN_HOSTS` klopt niet | Opnieuw `ssh-keyscan -t ed25519 178.105.62.224` en het geheim vervangen |
| `Not possible to fast-forward` | Op de server is iets in `~/aldus` met de hand gewijzigd | Op de server: `cd ~/aldus && git status`; wijzigingen weggooien met `git checkout -- .` of eerst committen |
| Blijft hangen op `Username for 'https://github.com'` | Stap 3 | Token opslaan zoals in stap 3 |
