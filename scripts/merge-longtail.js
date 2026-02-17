/**
 * Merger longtail-forslag (fra hent-longtail-forslag.js --out) inn i longtail-nokkelord.json.
 * Beholder eksisterende dekkes_av der vi allerede har satt det.
 *
 * Bruk: node scripts/merge-longtail.js data/longtail-forslag-top10.json
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const LONGTAIL_PATH = path.join(ROOT, 'data', 'longtail-nokkelord.json');
const inputPath = process.argv[2] || path.join(ROOT, 'data', 'longtail-forslag-top10.json');

const existing = JSON.parse(fs.readFileSync(LONGTAIL_PATH, 'utf8'));
const fresh = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

const existingMap = new Map();
for (const v of existing.venuer || []) {
  for (const s of v.søkefraser || []) {
    existingMap.set(`${v.venue_slug}\t${s.frase}`, s.dekkes_av || '');
  }
}

const merged = (fresh.venuer || []).map((v) => {
  const søkefraser = (v.søkefraser || []).map((s) => ({
    frase: s.frase,
    dekkes_av: existingMap.get(`${v.venue_slug}\t${s.frase}`) ?? s.dekkes_av ?? '',
  }));
  return { ...v, søkefraser };
});

existing.venuer = merged;
existing.meta.oppdatert = new Date().toISOString().slice(0, 10);
fs.writeFileSync(LONGTAIL_PATH, JSON.stringify(existing, null, 2), 'utf8');
console.error('Merged', merged.length, 'venuer inn i', LONGTAIL_PATH);
merged.forEach((v) => console.error('  -', v.venue_navn + ':', v.søkefraser.length, 'fraser'));
