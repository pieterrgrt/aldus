export default {
  // Staat aan: de winkel is te zien op alduslab.eu. Op false zetten om hem weer alleen
  // lokaal (npm start) te tonen. Een los product verberg je met `concept: true`.
  klaar: true,

  titel: "Winkel",
  intro: "Wat ik zelf gebruik om met Claude te werken aan regelgeving en tekst, klaar om over te nemen. Downloads die je meteen hebt, en sessies voor wie het liever samen opzet.",

  // Wie geen betaallink heeft, krijgt een knop om per mail te bestellen.
  email: "regoortp@proton.me",
  onderwerp: "Bestelling via alduslab.eu",

  // Staat onder elk product en onder de winkel. Laat dit staan: Claude is een merk van Anthropic.
  disclaimer: "Aldus is een zelfstandige site en niet verbonden aan Anthropic. Claude is een merk van Anthropic. Je hebt voor deze producten je eigen Claude-account of API-sleutel nodig.",

  // Engelse versie (/en/shop/). Het e-mailadres en `klaar` gelden voor allebei.
  en: {
    titel: "Shop",
    intro: "What I use myself to work with Claude on regulation and writing, ready to take over. Downloads you get straight away, and sessions for those who would rather set it up together.",
    onderwerp: "Order via alduslab.eu",
    disclaimer: "Aldus is an independent site and is not affiliated with Anthropic. Claude is a trademark of Anthropic. You need your own Claude account or API key for these products.",
  },
};
