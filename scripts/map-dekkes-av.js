/**
 * Setter dekkes_av for longtail-fraser som matcher vanlige nøkkelord,
 * slik at de peker til riktig anker på venue-siden.
 *
 * Bruk: node scripts/map-dekkes-av.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const LONGTAIL_PATH = path.join(ROOT, 'data', 'longtail-nokkelord.json');

// Søkefrase (lowercase) inneholder ett av ordene -> anker (må matche id på venue-siden)
const REGLER = [
  { ord: ['adresse', 'address'], anker: 'adresse' },
  { ord: ['kapasitet', 'capacity', 'antall plass', 'antall mennesker', 'plasser'], anker: 'kapasitet' },
  { ord: ['beste sitteplasser', 'sitteplasser'], anker: 'beste-sitteplasser' },
  { ord: ['parkering', 'parking'], anker: 'parkering' },
  { ord: ['konsert', 'concert', 'billetter', 'events', 'event'], anker: 'billetter' },
  { ord: ['program', 'calendar', 'kalender'], anker: 'billetter' },
  { ord: ['salkart', 'seating'], anker: 'salkart' },
  { ord: ['kart', 'map'], anker: 'kart' },
  { ord: ['i dag', 'today'], anker: 'billetter' },
  { ord: ['inngang', 'entrance'], anker: 'salkart' },
  { ord: ['adkomst', 'buss', 'bus', 'shuttle', 'kollektiv', 'reise'], anker: 'kollektivtransport' },
  { ord: ['rives', 'revet', 'rivning'], anker: 'rives' },
  { ord: ['kryssord'], anker: 'kryssord' },
  { ord: ['2026', '2025', '2027'], anker: 'program-2026' },
  { ord: ['ombygging', 'ombygget', 'renovering'], anker: 'ombygging' },
];

function getAnker(frase) {
  const f = frase.toLowerCase();
  for (const r of REGLER) {
    for (const ord of r.ord) {
      if (f.includes(ord)) return r.anker;
    }
  }
  return null;
}

const data = JSON.parse(fs.readFileSync(LONGTAIL_PATH, 'utf8'));
let oppdatert = 0;

for (const v of data.venuer || []) {
  const base = `byer/${v.by_slug}/${v.venue_slug}`;
  for (const s of v.søkefraser || []) {
    if (s.dekkes_av) continue;
    const anker = getAnker(s.frase);
    if (anker !== null) {
      s.dekkes_av = anker ? `${base}/#${anker}` : `${base}/`;
      oppdatert++;
    }
  }
}

data.meta.oppdatert = new Date().toISOString().slice(0, 10);
fs.writeFileSync(LONGTAIL_PATH, JSON.stringify(data, null, 2), 'utf8');
console.error('Oppdatert', oppdatert, 'dekkes_av');
