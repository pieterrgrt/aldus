// Portfolio (/portfolio/ en /en/portfolio/): de sites en apps die ik heb gebouwd.
//
// Per site:
//   naam      zoals hij heet
//   url       adres om naartoe te linken; weglaten als de site niet (openbaar) online staat
//   techniek  korte opsomming, voor beide talen gelijk
//   nl / en   soort (één of twee woorden), tekst (twee, drie zinnen) en eventueel status
//             (een label naast de naam, zoals "Demo" of "Nog niet online")
//
// Een nieuwe site: zet hem in de juiste groep, in de volgorde waarin hij op de pagina moet staan.

const groepen = [
  {
    nl: { titel: "Op het web", tekst: "" },
    en: { titel: "On the web", tekst: "" },
    sites: [
      {
        naam: "Uitvloed",
        url: "https://uitvloed.nl",
        techniek: "Eleventy, Node.js, Typst, Claude API",
        nl: {
          soort: "Uitgeverij",
          tekst: "Nederlandse klassiekers opnieuw als pocket, gedrukt zodra vijfhonderd lezers een exemplaar hebben gereserveerd. Een website met pre-orders en inloggen via een link per e-mail, en een werkplaats die drukklare A6-pockets zet, met een Claude-agent die de teksten nakijkt.",
        },
        en: {
          soort: "Publisher",
          tekst: "Dutch classics reissued as paperbacks, printed once five hundred readers have reserved a copy. A website with pre-orders and sign-in by email link, and a workshop that typesets print-ready A6 paperbacks, with a Claude agent that checks the texts.",
        },
      },
      {
        naam: "liveaux",
        url: "https://liveaux.eu",
        techniek: "Django, SQLite",
        nl: {
          soort: "Stadsgids en bibliotheek",
          tekst: "Wat er te doen is in Berlijn en Hamburg, van concerten en clubavonden tot tentoonstellingen en theater, met een logboek van waar je bent geweest. Daarnaast een eigen bibliotheek van wat je thuis kijkt, leest, speelt en luistert.",
        },
        en: {
          soort: "City guide and library",
          tekst: "What is on in Berlin and Hamburg, from concerts and club nights to exhibitions and theatre, with a log of where you have been. Alongside it, a personal library of what you watch, read, play and listen to at home.",
        },
      },
      {
        naam: "Closeknit",
        url: "https://closeknit.eu",
        techniek: "SvelteKit, PostgreSQL, ActivityPub",
        nl: {
          soort: "Platform voor buren",
          status: "Demo",
          tekst: "Een besloten ontmoetingsplek voor je flatgebouw: prikbord, chat per verdieping, gedeelde agenda, uitleenhoek en peilingen. Europees gehost, open source en gefedereerd. Nu nog een klikbare demo.",
        },
        en: {
          soort: "Platform for neighbours",
          status: "Demo",
          tekst: "A private meeting place for your building: notice board, chat per floor, shared calendar, lending corner and polls. Hosted in Europe, open source and federated. For now, a clickable demo.",
        },
      },
      {
        naam: "Properent",
        techniek: "HTML, CSS, JavaScript, Supabase",
        nl: {
          soort: "Verhuur",
          status: "Nog niet online",
          tekst: "Website voor huurwoningen in en rond Zeeland: aanbod met filters, een pagina per woning, een contactformulier en een beheeromgeving voor woningen, aanvragen en huurders.",
        },
        en: {
          soort: "Lettings",
          status: "Not online yet",
          tekst: "Website for rental homes in and around Zeeland: listings with filters, a page per home, a contact form and a back office for homes, applications and tenants.",
        },
      },
      {
        naam: "Aldus",
        url: "https://alduslab.eu",
        techniek: "Eleventy, Listmonk, Pagefind",
        nl: {
          soort: "Deze site",
          tekst: "Stukken, een nieuwsbrief via een eigen Listmonk, zoeken, consultancy en een winkel, in het Nederlands en het Engels. Zonder trackers en zonder lettertypes van een ander.",
        },
        en: {
          soort: "This site",
          tekst: "Articles, a newsletter on a self-hosted Listmonk, search, consulting and a shop, in Dutch and English. No trackers and no fonts from anyone else.",
        },
      },
    ],
  },
  {
    nl: {
      titel: "Eigen gereedschap",
      tekst: "Apps die ik voor mezelf heb gebouwd en elke dag gebruik. Ze draaien op mijn eigen server, achter een inlog.",
    },
    en: {
      titel: "Own tools",
      tekst: "Apps I built for myself and use every day. They run on my own server, behind a login.",
    },
    sites: [
      {
        naam: "Fits",
        techniek: "SvelteKit, SQLite",
        nl: {
          soort: "Sport",
          tekst: "Trainingen loggen met dubbele progressie en een rusttimer, ook zonder bereik. Eten bijhouden met een barcodescanner, slaap uit Apple Gezondheid, en hardlooprondjes over straten waar je nog niet liep.",
        },
        en: {
          soort: "Training",
          tekst: "Logging workouts with double progression and a rest timer, offline too. Tracking food with a barcode scanner, sleep from Apple Health, and running routes over streets you have not run yet.",
        },
      },
      {
        naam: "Fond",
        techniek: "FastAPI, SQLite",
        nl: {
          soort: "Koken",
          tekst: "Een kookcursus die je van commis tot chef brengt, met meal prep als rode draad. Kookmodus met timers, porties schalen en een boodschappenlijst op volgorde van je route door de winkel.",
        },
        en: {
          soort: "Cooking",
          tekst: "A cooking course that takes you from commis to chef, with meal prep as the common thread. Cooking mode with timers, portion scaling and a shopping list in the order of your route through the shop.",
        },
      },
      {
        naam: "Lus",
        techniek: "FastAPI, SQLite",
        nl: {
          soort: "Haken en breien",
          tekst: "Haken en breien leren met geanimeerde steekdiagrammen, een vertaaltabel van termen in vijf varianten, een toerenteller voor één hand en een patroonlezer die afkortingen uitlegt.",
        },
        en: {
          soort: "Crochet and knitting",
          tekst: "Learning to crochet and knit with animated stitch diagrams, a table of terms in five variants, a one-handed row counter and a pattern reader that explains abbreviations.",
        },
      },
      {
        naam: "Knuckles",
        techniek: "FastAPI, SvelteKit, Web Audio",
        nl: {
          soort: "Muziek",
          tekst: "Muziek ontdekken, begrijpen en leren maken en draaien: lessen met een speelbaar klavier en gitaar, gehoortraining en een setplanner. Alle klank komt uit de browser en werkt offline.",
        },
        en: {
          soort: "Music",
          tekst: "Discovering music, understanding it, and learning to make and mix it: lessons with a playable keyboard and guitar, ear training and a set planner. All sound comes from the browser and works offline.",
        },
      },
      {
        naam: "Post",
        techniek: "FastAPI, JMAP",
        nl: {
          soort: "E-mail",
          tekst: "Een webmailclient in de stijl van Aldus, rechtstreeks op mijn eigen mailserver. Drie kolommen op de computer, één op de telefoon, sneltoetsen, en berichten in een afgeschermde omgeving.",
        },
        en: {
          soort: "Email",
          tekst: "A webmail client in the style of Aldus, straight on my own mail server. Three columns on the computer, one on the phone, keyboard shortcuts, and messages in a sandbox.",
        },
      },
      {
        naam: "Woordenbak",
        techniek: "FastAPI, Claude API, Anki",
        nl: {
          soort: "Talen",
          tekst: "Nieuwe woorden noteren op de telefoon; Claude vertaalt ze meteen, met grammatica en een voorbeeldzin. Elke zondagavond worden het Anki-kaarten in het juiste deck.",
        },
        en: {
          soort: "Languages",
          tekst: "Jotting down new words on the phone; Claude translates them straight away, with grammar and an example sentence. Every Sunday evening they become Anki cards in the right deck.",
        },
      },
    ],
  },
];

// Zet de groepen om naar één taal, zodat de pagina gewoon `groep.titel` en `site.tekst` kan gebruiken.
const inTaal = (taal) =>
  groepen.map((groep) => ({
    ...groep[taal],
    sites: groep.sites.map(({ nl, en, ...site }) => ({ ...site, ...(taal === "en" ? en : nl) })),
  }));

export default {
  titel: "Portfolio",
  intro: "Sites en apps die ik de afgelopen tijd heb gebouwd, meestal samen met Claude. Een paar voor iedereen, de meeste voor mezelf.",
  groepen: inTaal("nl"),

  en: {
    intro: "Sites and apps I have built recently, mostly together with Claude. A few for everyone, most of them for myself.",
    groepen: inTaal("en"),
  },
};
