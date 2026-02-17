/**
 * Rydder OCR-data: fjerner radnumre/bråk, beholder rene festivalnavn, infererer region fra sted.
 * Bruk: node scripts/rydd-ocr-festivaler.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const IN = path.join(ROOT, 'data', 'festivaler-fra-ocr.json');
const OUT = path.join(ROOT, 'data', 'festivaler.json');

const SKIP = /^(A B c|—|>|Broadcast|Kontakt|Region|Januar|Februar|Mars|April|Mai|Juni|Juli|August|September|Oktober|November|Desember|Setene|pene)/i;
const MANEDER = / (1 Jan|2Feb|3 Mar|4 Apr|5 May|6 Jun|7 Jul|8 Aug|9 Sep|9Sep|0 Oct|1 Nov|2 Dec)$/i;
const TRAILING = /\s*[\[\|\]\s]+\d*\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)?\s*$/i;
const LEADING = /^\d+\.?\s*/;

/** Sted -> region (fylke/storby) */
const STED_REGION = {
  Oslo: 'Øst', Bergen: 'Vest', Trondheim: 'Midt', Stavanger: 'Sør', Tromsø: 'Nord', Bodø: 'Nord',
  Kristiansand: 'Sør', Drammen: 'Øst', Arendal: 'Sør', Halden: 'Øst', Moss: 'Øst', Sandefjord: 'Øst',
  Kongsberg: 'Øst', Notodden: 'Øst', Porsgrunn: 'Øst', Skien: 'Øst', Tønsberg: 'Øst', Larvik: 'Øst',
  Fredrikstad: 'Øst', Sarpsborg: 'Øst', Hamar: 'Innlandet', Lillehammer: 'Innlandet', Gjøvik: 'Innlandet',
  Molde: 'Vest', Kristiansund: 'Vest', Ålesund: 'Vest', Haugesund: 'Vest', Stord: 'Vest', Leirvik: 'Vest',
  Egersund: 'Sør', Farsund: 'Sør', Mandal: 'Sør', Grimstad: 'Sør', Lillesand: 'Sør', Risør: 'Sør',
  Alta: 'Nord', Hammerfest: 'Nord', Kirkenes: 'Nord', Harstad: 'Nord', Narvik: 'Nord', Mosjøen: 'Nord',
  Levanger: 'Midt', Steinkjer: 'Midt', Raufoss: 'Innlandet', Odalen: 'Øst', Ringebu: 'Innlandet',
  Voss: 'Vest', Kinsarvik: 'Vest', Luster: 'Vest', Førde: 'Vest', Nordheimsund: 'Vest', Alvik: 'Vest',
  Henningsvær: 'Nord', Kjøllefjord: 'Nord', Bugøynes: 'Nord', Karasjok: 'Nord', Varangerbotn: 'Nord',
  Kongsvinger: 'Øst', Asker: 'Øst', Drøbak: 'Øst', Kulleseidkanalen: 'Vest', Gjestehamn: 'Vest',
  Sund: 'Vest', Fogn: 'Vest', Varde: 'Vest', Hell: 'Midt', Odda: 'Vest', Madam: 'Vest',
};

function hentSted(navn) {
  const m = navn.match(/\(([^)]+)\)/);
  return m ? m[1].trim() : null;
}

function infererRegion(navn) {
  for (const [sted, region] of Object.entries(STED_REGION)) {
    if (navn.includes(sted)) return region;
  }
  const sted = hentSted(navn);
  if (sted && STED_REGION[sted]) return STED_REGION[sted];
  if (navn.includes('Oslo') || navn.includes('Drammen') || navn.includes('Østfold') || navn.includes('Viken')) return 'Øst';
  if (navn.includes('Bergen') || navn.includes('Stord') || navn.includes('Haugesund') || navn.includes('Ålesund') || navn.includes('Molde')) return 'Vest';
  if (navn.includes('Trondheim') || navn.includes('Levanger') || navn.includes('Steinkjer')) return 'Midt';
  if (navn.includes('Stavanger') || navn.includes('Kristiansand') || navn.includes('Arendal') || navn.includes('Agder')) return 'Sør';
  if (navn.includes('Tromsø') || navn.includes('Bodø') || navn.includes('Alta') || navn.includes('Nord')) return 'Nord';
  if (navn.includes('Lillehammer') || navn.includes('Hamar') || navn.includes('Raufoss') || navn.includes('Innlandet')) return 'Innlandet';
  return 'Diverse';
}

/** Infererer sjanger fra festivalnavn (samme regler som scripts/tildel-sjanger-festivaler.js). */
function infererSjanger(navn) {
  const SJANGER_REGLER = [
    [/\bmetal\b|inferno\s*metal|beyond\s*the\s*gates|desertfest|midgardsblot|karmøygeddon|hellbotn\s*metal|iskald\s*metal|legend\s*metalfest|warriors\s*of\s*steel|høstsabbat|drammen\s*metalfest/i, 'Metal'],
    [/\bblues\b/i, 'Blues'],
    [/\bjazz\b|bajazz|djangofestival|nattjazz|moldejazz|maijazz|kongsberg\s*jazz|vossa\s*jazz|bodø\s*jazz|mandaljazz|fjordjazz|gamlebyen\s*jazz|drammen\s*jazzfestival|kristiansand\s*jazz|hemnesjazz|vinterjazz|all\s*ears\s*festivalen|jazzfest\b|kryssover\s*jazz/i, 'Jazz'],
    [/\bpunk\b|pønk|råkk/i, 'Punk'],
    [/\brock\b|rocken|vinjerock|alperock|alvik\s*rock|malakoff\s*rock|eiker\s*rock|havgapsrock|jordeplerock|målrock|kanalrock|odal\s*rock|lillehammer\s*rock|mc\s*rock|midnattrock|hove\s*rock|brynerocken|we\s*låve\s*rock|malstrøm|nidarock|kristiansand\s*fuzz|bygderampen/i, 'Rock'],
    [/\bcountry\b/i, 'Country'],
    [/\bfolk\b|folkemusikk|folkelarm|visefestival|americana|roots\s*music|gras\s*og\s*rot|jørn\s*hilme|førdefestivalen/i, 'Folk/Roots'],
    [/\bklassisk\b|kammermusikk|organ\s*festival|choir\s*festival|symfoni|opera(?:fest)?|flagstad|johan\s*halvorsen|gloger|borealis\b|fjord\s*cadenza|kon-tiki\s*kammermusikk/i, 'Klassisk'],
    [/\bgospel\b|kirkemusikk|kristen|chrisfestivalen|kirkelig/i, 'Gospel/Kristen'],
    [/\bhip[- ]?hop\b|rap\s*fest/i, 'Hip-hop'],
    [/\belektron\b|insomnia\s*festival|hardstyle|techno|edm\b|katapult\s*future\s*fest|only\s*connect/i, 'Elektronisk'],
    [/\bpopfestival\b|pop\s*fest\b|beatlesfestivalen|gatefestival|gatefest\b|sommertestival|sommerfest\b|minifestival|musikkfest\b|musikkfestival\b|bylam\b|bysommer\b|altalive|asker\s*live|bakgården\s*live|buktafestivalen|halvøyen\s|halvøya\s|høydenfestivalen|jeløyafestivalen|justivalen|mossfest\b|øyafestivalen|miniøya|slottsfjell|bergenfest\b|indiefjord|havstrøm\b|liverpoolfestivalen/i, 'Pop'],
    [/\open\s*air\b/i, 'Rock'],
  ];
  for (const [pattern, sjanger] of SJANGER_REGLER) {
    if (typeof pattern === 'string' ? navn.toLowerCase().includes(pattern.toLowerCase()) : pattern.test(navn)) return sjanger;
  }
  return 'Diverse/Kultur';
}

function ryddNavn(s) {
  let n = s
    .replace(LEADING, '')
    .replace(TRAILING, '')
    .replace(/\s*\[\|\s*[^\]]*\]\s*/g, ' ')
    .replace(/\s*\|\s*\]\s*/g, ' ')
    .replace(/\s+\d{1,2}\s+(Jan|Feb|Mar|Apr|Mai|Jun|Jul|Aug|Sep|Okt|Nov|Des)\s*$/i, '')
    .replace(/\s*\|\s*[A-Za-z0-9]+\s*$/g, '')   // "| Asuma", "| TT", "| 0"
    .replace(/\s*\[\|\s*[A-Za-z0-9\s]+\s*$/g, '') // "[| TT"
    .replace(/\s+/g, ' ')
    .trim();
  if (n.endsWith('|')) n = n.slice(0, -1).trim();
  n = n.replace(/\s*\[\s*$/, '');  // trailing " ["
  n = n.replace(/\s+[0-9]\s+[a-z]{2}\s*$/i, '');  // " 0 oa", " 5 mo"
  n = n.replace(/\s*—\s*Ea\s*$/i, '').replace(/\s*\| pene\s*$/i, '');
  // Fjern duplisert stedsnavn på slutten (f.eks. "AltaLive (Alta) Alta" -> "AltaLive (Alta)")
  const sted = hentSted(n);
  if (sted && n.endsWith(' ' + sted)) n = n.slice(0, -(sted.length + 1)).trim();
  return n;
}

function main() {
  const data = JSON.parse(fs.readFileSync(IN, 'utf8'));
  const out = [];
  const seen = new Set();

  for (const f of data.festivaler) {
    let navn = f.navn.trim();
    if (SKIP.test(navn) || navn.length < 3 || navn.length > 100) continue;
    if (/^\|\s|—\s*Ea$|^\s*Boamstena\s*$/i.test(navn)) continue;  // ren bråk
    navn = ryddNavn(navn);
    if (navn.length < 3) continue;
    const key = navn.toLowerCase().replace(/\s+/g, ' ');
    if (seen.has(key)) continue;
    seen.add(key);
    const region = f.region && f.region !== 'Diverse' ? f.region : infererRegion(navn);
    out.push({
      navn,
      region,
      måned: 'Varierende',
      sjanger: infererSjanger(navn),
    });
  }

  const result = {
    meta: {
      beskrivelse: 'Norske festivaler – importert fra OCR av Broadcast-liste 2026.',
      oppdatert: new Date().toISOString().slice(0, 10),
      totalt: out.length,
    },
    festivaler: out,
  };
  fs.writeFileSync(OUT, JSON.stringify(result, null, 2), 'utf8');
  console.log('Skrev', out.length, 'festivaler til data/festivaler.json');
}

main();
