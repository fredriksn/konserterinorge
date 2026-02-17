/**
 * Tildeler sjanger til festivaler ut fra navn (nøkkelord).
 * Kun festivaler som ikke matcher noen regel beholdes som Diverse/Kultur.
 * Bruk: node scripts/tildel-sjanger-festivaler.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const FILE = path.join(ROOT, 'data', 'festivaler.json');

/** Liste av [regex eller streng, sjanger]. Første treff vinner. */
const SJANGER_REGLER = [
  // Metal (før rock, så "metalfest" ikke blir Rock)
  [/\bmetal\b|inferno\s*metal|beyond\s*the\s*gates|desertfest|midgardsblot|karmøygeddon|hellbotn\s*metal|iskald\s*metal|legend\s*metalfest|warriors\s*of\s*steel|høstsabbat|drammen\s*metalfest/i, 'Metal'],
  // Blues
  [/\bblues\b/i, 'Blues'],
  // Jazz (bredt: jazz, nattjazz, moldejazz, djangofestivalen, bajazz, etc.)
  [/\bjazz\b|bajazz|djangofestival|nattjazz|moldejazz|maijazz|kongsberg\s*jazz|vossa\s*jazz|bodø\s*jazz|mandaljazz|fjordjazz|gamlebyen\s*jazz|drammen\s*jazzfestival|kristiansand\s*jazz|hemnesjazz|vinterjazz|all\s*ears\s*festivalen|jazzfest\b|kryssover\s*jazz/i, 'Jazz'],
  // Punk
  [/\bpunk\b|pønk|råkk/i, 'Punk'],
  // Rock
  [/\brock\b|rocken|vinjerock|alperock|alvik\s*rock|malakoff\s*rock|eiker\s*rock|havgapsrock|jordeplerock|målrock|kanalrock|odal\s*rock|lillehammer\s*rock|mc\s*rock|midnattrock|hove\s*rock|brynerocken|we\s*låve\s*rock|malstrøm|nidarock|kristiansand\s*fuzz|bygderampen/i, 'Rock'],
  // Country
  [/\bcountry\b/i, 'Country'],
  // Folk / roots
  [/\bfolk\b|folkemusikk|folkelarm|visefestival|americana|roots\s*music|gras\s*og\s*rot|jørn\s*hilme|førdefestivalen/i, 'Folk/Roots'],
  // Klassisk / kammermusikk / opera
  [/\bklassisk\b|kammermusikk|organ\s*festival|choir\s*festival|symfoni|opera(?:fest)?|flagstad|johan\s*halvorsen|gloger|borealis\b|fjord\s*cadenza|kon-tiki\s*kammermusikk/i, 'Klassisk'],
  // Gospel / kristen
  [/\bgospel\b|kirkemusikk|kristen|chrisfestivalen|kirkelig/i, 'Gospel/Kristen'],
  // Hip-hop
  [/\bhip[- ]?hop\b|rap\s*fest/i, 'Hip-hop'],
  // Elektronisk
  [/\belektron\b|insomnia\s*festival|hardstyle|techno|edm\b|katapult\s*future\s*fest|only\s*connect/i, 'Elektronisk'],
  // Pop (tydelige pop + generelle live/gate/sommer-festivaler uten annet sjangerord)
  [/\bpopfestival\b|pop\s*fest\b|beatlesfestivalen|gatefestival|gatefest\b|sommertestival|sommerfest\b|minifestival|musikkfest\b|musikkfestival\b|bylam\b|bysommer\b|altalive|asker\s*live|bakgården\s*live|buktafestivalen|halvøyen\s|halvøya\s|høydenfestivalen|jeløyafestivalen|justivalen|mossfest\b|øyafestivalen|miniøya|slottsfjell|bergenfest\b|indiefjord|havstrøm\b|liverpoolfestivalen/i, 'Pop'],
  // Open air (oftest rock/pop)
  [/\open\s*air\b/i, 'Rock'],
];

function infererSjanger(navn) {
  const n = String(navn || '');
  for (const [pattern, sjanger] of SJANGER_REGLER) {
    if (typeof pattern === 'string') {
      if (n.toLowerCase().includes(pattern.toLowerCase())) return sjanger;
    } else if (pattern.test(n)) {
      return sjanger;
    }
  }
  return 'Diverse/Kultur';
}

function main() {
  const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const teller = {};

  for (const f of data.festivaler) {
    const sjanger = infererSjanger(f.navn);
    f.sjanger = sjanger;
    teller[sjanger] = (teller[sjanger] || 0) + 1;
  }

  data.meta.oppdatert = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2), 'utf8');

  console.log('Sjangerfordeling etter tildeling:');
  const sortert = Object.entries(teller).sort((a, b) => b[1] - a[1]);
  sortert.forEach(([sjanger, n]) => console.log('  ' + sjanger + ': ' + n));
  console.log('Totalt: ' + data.festivaler.length + ' festivaler. Skrev data/festivaler.json');
}

main();
