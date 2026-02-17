/**
 * Genererer sitemap.xml fra data/arenaer.json og data/festivaler.json.
 * Bruk: node scripts/generer-sitemap.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://www.konserterinorge.no';

const BY_SLUG = {
  Oslo: 'oslo',
  Bergen: 'bergen',
  Trondheim: 'trondheim',
  Stavanger: 'stavanger',
  Tromsø: 'tromso',
  Kristiansand: 'kristiansand',
  Tønsberg: 'tonsberg',
  Ålesund: 'alesund',
};

function slug(s) {
  return String(s)
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[æå]/g, 'a')
    .replace(/ø/g, 'o')
    .replace(/[^a-z0-9-]/g, '');
}

function url(loc, changefreq, priority) {
  return `  <url><loc>${BASE}${loc}</loc><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
}

const urls = [];

urls.push(url('/', 'weekly', '1.0'));
urls.push(url('/byer/', 'weekly', '0.9'));
urls.push(url('/festivaler/', 'weekly', '0.9'));
urls.push(url('/billettselskaper/', 'monthly', '0.7'));
urls.push(url('/turneer/', 'weekly', '0.7'));
urls.push(url('/artister/', 'weekly', '0.7'));
urls.push(url('/om-oss/', 'monthly', '0.5'));
urls.push(url('/kontakt/', 'monthly', '0.5'));
urls.push(url('/blogg/', 'weekly', '0.6'));
urls.push(url('/sok/', 'monthly', '0.5'));
urls.push(url('/personvern/', 'yearly', '0.3'));
urls.push(url('/vilkar/', 'yearly', '0.3'));

const byer = ['oslo', 'bergen', 'trondheim', 'stavanger', 'tonsberg', 'kristiansand', 'tromso', 'alesund'];
byer.forEach((b) => urls.push(url(`/byer/${b}/`, 'weekly', '0.8')));

let arenaer = [];
try {
  const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'arenaer.json'), 'utf8'));
  arenaer = data.arenaer || [];
} catch (e) {}
arenaer.forEach((a) => {
  const byPath = BY_SLUG[a.by] || slug(a.by) || 'oslo';
  const slugPath = a.slug || slug(a.navn);
  urls.push(url(`/byer/${byPath}/${slugPath}/`, 'monthly', '0.8'));
});

const festivalSlugs = new Set();
try {
  const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'festivaler.json'), 'utf8'));
  (data.festivaler || []).forEach((f) => festivalSlugs.add(slug(f.navn)));
} catch (e) {}
festivalSlugs.forEach((s) => {
  if (s) urls.push(url(`/festivaler/${s}/`, 'monthly', '0.7'));
});

urls.push(url('/festivaler/største/', 'weekly', '0.8'));
urls.push(url('/festivaler/største/oyafestivalen/', 'monthly', '0.8'));

['ticketmaster', 'eventim', 'ticketco', 'tikkio'].forEach((s) =>
  urls.push(url(`/billettselskaper/${s}/`, 'monthly', '0.6'))
);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml, 'utf8');
console.log('Sitemap skrevet. Totalt', urls.length, 'URL-er.');
console.log('Husk å legge sitemap.xml i roten og oppdatere i Search Console.');