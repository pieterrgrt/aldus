# Domein

De site staat op **alduslab.eu**. Het adres staat in `src/_data/site.js` (`url`). Daar komt ook de canonieke link in elke pagina vandaan.

- **Hosting:** de Hetzner-server (178.105.62.224), in een Docker-container achter de nginx van de server. Stappen en beheer: `docs/online-zetten.md`.
- **DNS:** bij Infomaniak (nameservers `nsany1/nsany2.infomaniak.com`). `alduslab.eu` en `www` krijgen een A-record naar 178.105.62.224, zonder AAAA-records. `www` stuurt door naar `alduslab.eu`.
- **Niet aankomen:** de records voor e-mail (Proton: MX, SPF, DKIM, DMARC, `protonmail-verification`) en de subdomeinen `cloud`, `vault` en `fits`.
- **fits.alduslab.eu:** Fits, de sportapp. Een eigen app met eigen repository (github.com/pieterrgrt/fits), op dezelfde server op poort 8005. A-record `fits` naar 178.105.62.224. Stappen staan in die repository, in `docs/online-zetten.md`.
