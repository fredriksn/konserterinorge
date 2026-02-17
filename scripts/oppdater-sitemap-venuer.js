/**
 * Oppdaterer sitemap.xml med alle venue-URL-er fra data/arenaer.json.
 * Legger inn manglende venue-URL-er etter de eksisterende by-sidene.
 *
 * Bruk: node scripts/oppdater-sitemap-venuer.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ARENAER_PATH = path.join(ROOT, 'data', 'arenaer.json');
const SITEMAP_PATH = path.join(ROOT, 'sitemap.xml');

const BY_TO_SLUG = {
  Oslo: 'oslo',
  Bergen: 'bergen',
  Trondheim: 'trondheim',
  Stavanger: 'stavanger',
  Tromsø: 'tromso',
  Kristiansand: 'kristiansand',
  Tønsberg: 'tonsberg',
  Ålesund: 'alesund',
};

const BASE = 'https://www.konserterinorge.no';
const VENUE_LINE = (bySlug, slug) => `  <url><loc>${BASE}/byer/${bySlug}/${slug}/</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>`;

function main() {
  let arenaer = [];
  try {
    arenaer = JSON.parse(fs.readFileSync(ARENAER_PATH, 'utf8')).arenaer || [];
  } catch (e) {
    console.error('Kunne ikke lese data/arenaer.json:', e.message);
    process.exit(1);
  }

  const venueUrls = new Set(
    arenaer.map((a) => {
      const bySlug = BY_TO_SLUG[a.by] || a.by.toLowerCase().replace(/\s/g, '-').replace(/ø/g, 'o').replace(/å/g, 'a');
      return `${BASE}/byer/${bySlug}/${a.slug}/`;
    })
  );

  let sitemap = fs.readFileSync(SITEMAP_PATH, 'utf8');
  const existingLocs = sitemap.match(/<loc>([^<]+)<\/loc>/g) || [];
  const existingUrls = new Set(existingLocs.map((m) => m.replace(/<loc>|<\/loc>/g, '')));

  const missing = [...venueUrls].filter((u) => !existingUrls.has(u));
  if (missing.length === 0) {
    console.log('Sitemap inneholder allerede alle', venueUrls.size, 'venue-URL-er.');
    return;
  }

  const bySlug = (a) => BY_TO_SLUG[a.by] || a.by.toLowerCase().replace(/\s/g, '-').replace(/ø/g, 'o').replace(/å/g, 'a');
  const newLines = arenaer.filter((a) => missing.includes(`${BASE}/byer/${bySlug(a)}/${a.slug}/`)).map((a) => VENUE_LINE(bySlug(a), a.slug));

  const lines = sitemap.split('\n');
  let lastVenueIdx = -1;
  const venuePattern = /byer\/[^/]+\/[^/]+\//;
  lines.forEach((line, i) => {
    if (venuePattern.test(line) && line.includes('<loc>')) lastVenueIdx = i;
  });
  const insertIdx = lastVenueIdx >= 0 ? lastVenueIdx + 1 : lines.findIndex((l) => l.includes('festivaler/'));
  if (insertIdx < 0) {
    console.error('Kunne ikke finne innsettingspunkt i sitemap.');
    process.exit(1);
  }
  lines.splice(insertIdx, 0, ...newLines);
  sitemap = lines.join('\n');

  fs.writeFileSync(SITEMAP_PATH, sitemap, 'utf8');
  console.log('Lagt til', newLines.length, 'venue-URL-er i sitemap.xml:', newLines.map((l) => l.match(/byer\/[^/]+\/[^/]+/)[0]).join(', '));
}

main();
