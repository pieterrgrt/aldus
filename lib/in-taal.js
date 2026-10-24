// Geeft gegevens (site.js, consultancy.js, …) in een bepaalde taal: de teksten onder
// `en` vervangen de Nederlandse, al het andere (instellingen, adressen) blijft gelijk.
export function inTaal(gegevens, taal) {
  const vertaald = gegevens[taal];
  if (!vertaald) return gegevens;
  const isObject = (x) => x && typeof x === "object" && !Array.isArray(x);
  const uit = { ...gegevens };
  for (const [sleutel, waarde] of Object.entries(vertaald)) {
    uit[sleutel] = isObject(waarde) && isObject(gegevens[sleutel]) ? { ...gegevens[sleutel], ...waarde } : waarde;
  }
  return uit;
}
