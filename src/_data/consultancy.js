export default {
  // Staat aan: het consultancy-gedeelte is te zien op alduslab.eu. Op false zetten om het
  // weer alleen lokaal (npm start) te tonen.
  klaar: true,

  titel: "Consultancy",
  intro: "Agents die werken en die mogen. Ik ben jurist met een Europese opleiding en ik bouw de pijplijnen zelf, voor familiebedrijven, mkb en kleine financiële partijen in Nederland en Vlaanderen.",

  // De soorten werk. Kort: een kop en twee, drie zinnen per soort.
  werk: [
    {
      titel: "Naar een agentic organisatie",
      tekst: "Ik zoek met je uit welk werk een agent kan doen, bouw een eerste agent met een menselijke poort ervoor en zet die in productie, EU-gehost. Je houdt een werkende agent over, met de documentatie erbij.",
    },
    {
      titel: "Regelwerk",
      tekst: "Ik breng in kaart welke AI-systemen je organisatie gebruikt, welke plichten daaruit volgen onder de AI Act, de AVG en voor financiële partijen DORA, en wat daar nu al van geldt. Elke regelcheck noemt de datum waarop hij klopte.",
    },
  ],

  // Vaste producten met een vaste prijs. Leeg = geen blok "Aanbod".
  aanbod: [
    {
      titel: "Agentscan",
      tekst: "Twee dagen. Welke taken zijn geschikt voor een agent, welke niet, en waarom. Eindigt met een rapport en een voorstel voor één pilot.",
      prijs: "€ 950",
    },
    {
      titel: "Regelcheck",
      tekst: "Anderhalve dag. Een lijst van de AI-systemen in huis, hun risicoklasse en de plichten die nu gelden.",
      prijs: "€ 700",
    },
    {
      titel: "Pilot",
      tekst: "Eén agent in productie, EU-gehost, met een menselijke poort en documentatie. Ongeveer zes dagen.",
      prijs: "vanaf € 2.600",
    },
    {
      titel: "Agent met papieren",
      tekst: "Scan, regelcheck en pilot samen, met een dossier dat de agent verantwoordt.",
      prijs: "vanaf € 3.900",
    },
  ],
  aanbodNoot: "Prijzen exclusief btw.",

  // Contact. Leeg e-mailadres = geen contactblok.
  contact: {
    email: "regoortp@proton.me",
    tekst: "Een vraag of een idee? Stuur een mail met een paar zinnen over de situatie; ik antwoord binnen twee werkdagen.",
    onderwerp: "Vraag via alduslab.eu",
  },

  // Engelse versie (/en/consulting/). Het e-mailadres en `klaar` gelden voor allebei.
  en: {
    titel: "Consulting",
    intro: "Agents that work, and that are allowed to. I am a lawyer with a European education and I build the pipelines myself, for family businesses, SMEs and small financial firms in the Netherlands and Flanders.",
    werk: [
      {
        titel: "Towards an agentic organisation",
        tekst: "Together we work out which work an agent can do; I build a first agent with a human gate in front of it and put it into production, hosted in the EU. You end up with a working agent, documentation included.",
      },
      {
        titel: "Rules work",
        tekst: "I map which AI systems your organisation uses, which obligations follow under the AI Act, the GDPR and, for financial firms, DORA, and which of them already apply. Every rules check states the date on which it was correct.",
      },
    ],
    aanbod: [
      {
        titel: "Agent scan",
        tekst: "Two days. Which tasks suit an agent, which do not, and why. Ends with a report and a proposal for one pilot.",
        prijs: "€ 950",
      },
      {
        titel: "Rules check",
        tekst: "A day and a half. A list of the AI systems in house, their risk class and the obligations that apply now.",
        prijs: "€ 700",
      },
      {
        titel: "Pilot",
        tekst: "One agent in production, hosted in the EU, with a human gate and documentation. About six days.",
        prijs: "from € 2,600",
      },
      {
        titel: "Agent with papers",
        tekst: "Scan, rules check and pilot together, with a file that accounts for the agent.",
        prijs: "from € 3,900",
      },
    ],
    aanbodNoot: "Prices exclude VAT.",
    contact: {
      tekst: "A question or an idea? Send an email with a few sentences about the situation; I reply within two working days.",
      onderwerp: "Question via alduslab.eu",
    },
  },
};
