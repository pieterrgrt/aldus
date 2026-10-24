export default {
  // Zet op true zodra de teksten en projecten klaar zijn. Tot die tijd zie je het
  // consultancy-gedeelte alleen lokaal (npm start) en staat het niet op alduslab.eu.
  klaar: false,

  titel: "Consultancy",
  intro: "[Eén of twee zinnen over wat je doet en voor wie. Bijvoorbeeld: welk soort vraagstukken, welk soort organisaties.]",

  // De drie soorten werk. Kort: een kop en twee, drie zinnen per soort.
  werk: [
    {
      titel: "[Eerste soort werk]",
      tekst: "[Wat doe je, voor wie, en wat heeft de opdrachtgever daarna in handen?]",
    },
    {
      titel: "[Tweede soort werk]",
      tekst: "[Wat doe je, voor wie, en wat heeft de opdrachtgever daarna in handen?]",
    },
    {
      titel: "[Derde soort werk]",
      tekst: "[Wat doe je, voor wie, en wat heeft de opdrachtgever daarna in handen?]",
    },
  ],

  // Contact. Leeg e-mailadres = geen contactblok.
  contact: {
    email: "",
    tekst: "Een vraag of een idee? Stuur een mail met een paar zinnen over de situatie; ik antwoord binnen twee werkdagen.",
    onderwerp: "Vraag via alduslab.eu",
  },

  // Engelse versie (/en/consulting/). Het e-mailadres en `klaar` gelden voor allebei.
  en: {
    titel: "Consulting",
    intro: "[One or two sentences about what you do and for whom. For example: what kind of questions, what kind of organisations.]",
    werk: [
      {
        titel: "[First kind of work]",
        tekst: "[What do you do, for whom, and what does the client have in hand afterwards?]",
      },
      {
        titel: "[Second kind of work]",
        tekst: "[What do you do, for whom, and what does the client have in hand afterwards?]",
      },
      {
        titel: "[Third kind of work]",
        tekst: "[What do you do, for whom, and what does the client have in hand afterwards?]",
      },
    ],
    contact: {
      tekst: "A question or an idea? Send an email with a few sentences about the situation; I reply within two working days.",
      onderwerp: "Question via alduslab.eu",
    },
  },
};
