// Kiest per pagina de teksten in de juiste taal (`taal`: nl, of en onder src/en/).
// De gegevensbestanden hebben hun Engelse teksten onder `en`; zie lib/in-taal.js.
import { inTaal } from "../../lib/in-taal.js";
import teksten from "./teksten.js";
import site from "./site.js";
import consultancy from "./consultancy.js";
import nieuwsbrief from "./nieuwsbrief.js";
import winkel from "./winkel.js";

export default {
  t: (data) => teksten[data.taal],
  site: (data) => inTaal(site, data.taal),
  consultancy: (data) => inTaal(consultancy, data.taal),
  nieuwsbrief: (data) => inTaal(nieuwsbrief, data.taal),
  winkel: (data) => inTaal(winkel, data.taal),
};
