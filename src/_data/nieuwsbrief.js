export default {
  // Adres van Listmonk op de server; zie docs/nieuwsbrief.md.
  url: "https://nieuwsbrief.alduslab.eu",
  // UUID van de lijst in Listmonk (Lists → Aldus → het lange ID). Zolang dit leeg is,
  // staat het aanmeldformulier niet op alduslab.eu; lokaal (npm start) zie je het wel.
  lijst: "",

  titel: "De nieuwsbrief",
  tekst: "Eén keer per week een nieuw stuk en wat me opviel, in je inbox. Afmelden kan altijd, met één klik onderaan elke mail.",

  // Engelse versie (/en/newsletter/). Zonder eigen `lijst` melden Engelse lezers zich aan
  // voor dezelfde (Nederlandstalige) lijst. Een aparte Engelse lijst in Listmonk? Zet hier
  // dan `lijst: "…"` met de UUID van die lijst.
  en: {
    titel: "The newsletter",
    tekst: "Once a week, a new piece and what caught my eye, in your inbox. The newsletter is written in Dutch. Unsubscribe any time, with one click at the bottom of every email.",
  },
};
