// Engelse stukken. Geef een stuk dezelfde bestandsnaam als het Nederlandse origineel;
// het Engelse adres kies je met `slug` bovenaan (anders de bestandsnaam).
export default {
  layout: "layouts/artikel.njk",
  permalink: "/en/articles/{{ slug or page.fileSlug }}/",
};
