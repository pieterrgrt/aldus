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
};
