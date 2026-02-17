/**
 * Erstatter søkefraser for én venue i longtail-nokkelord.json med fraser fra en forslagsfil.
 * Bruk: node scripts/merge-venue-longtail.js <venue_slug> data/<venue>-forslag.json
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const LONGTAIL_PATH = path.join(ROOT, 'data', 'longtail-nokkelord.json');

const venueSlug = process.argv[2];
const forslagPath = process.argv[3];

if (!venueSlug || !forslagPath) {
  console.error('Bruk: node scripts/merge-venue-longtail.js <venue_slug> data/<venue>-forslag.json');
  process.exit(1);
}

const longtail = JSON.parse(fs.readFileSync(LONGTAIL_PATH, 'utf8'));
const forslag = JSON.parse(fs.readFileSync(path.join(ROOT, forslagPath), 'utf8'));

const v = forslag.venuer && forslag.venuer.find((x) => x.venue_slug === venueSlug);
if (!v || !v.søkefraser) {
  console.error('Fant ikke venue eller søkefraser i', forslagPath);
  process.exit(1);
}

const existing = longtail.venuer.find((x) => x.venue_slug === venueSlug);
if (!existing) {
  console.error('Fant ikke venue', venueSlug, 'i longtail-nokkelord.json');
  process.exit(1);
}

existing.søkefraser = v.søkefraser.map((s) => ({ frase: s.frase, dekkes_av: s.dekkes_av || '' }));
longtail.meta.oppdatert = new Date().toISOString().slice(0, 10);
fs.writeFileSync(LONGTAIL_PATH, JSON.stringify(longtail, null, 2), 'utf8');
console.error('Oppdatert', venueSlug, 'med', existing.søkefraser.length, 'søkefraser');
