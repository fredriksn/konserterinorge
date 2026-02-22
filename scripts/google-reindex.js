/**
 * google-reindex.js
 *
 * Leser sitemap.xml og sender alle konserterinorge.no-URLer til det globale
 * reindekserings-scriptet (C:\Users\Fredrik\scripts\google-reindex.js).
 *
 * Bruk:
 *   node scripts/google-reindex.js              – sender alle URL-er i sitemap.xml
 *   node scripts/google-reindex.js --new-only   – sender kun URL-er med lastmod = i dag
 *   node scripts/google-reindex.js --dry-run    – vis hva som ville blitt sendt
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const GLOBAL_SCRIPT = 'C:\\Users\\Fredrik\\scripts\\google-reindex.js';
const SITEMAP_PATH = path.join(__dirname, '..', 'sitemap.xml');

const args = process.argv.slice(2);
const newOnly = args.includes('--new-only');
const dryRun = args.includes('--dry-run');

if (!fs.existsSync(SITEMAP_PATH)) {
  console.error('Feil: sitemap.xml ikke funnet på', SITEMAP_PATH);
  process.exit(1);
}

if (!fs.existsSync(GLOBAL_SCRIPT)) {
  console.error('Feil: globalt reindex-script ikke funnet på', GLOBAL_SCRIPT);
  process.exit(1);
}

const sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf-8');

// Trekk ut alle URL-er og tilhørende lastmod
const urlPattern = /<url>[\s\S]*?<loc>(.*?)<\/loc>(?:[\s\S]*?<lastmod>(.*?)<\/lastmod>)?[\s\S]*?<\/url>/g;
const today = new Date().toISOString().slice(0, 10);

let urls = [];
let match;
while ((match = urlPattern.exec(sitemapContent)) !== null) {
  const url = match[1].trim();
  const lastmod = match[2] ? match[2].trim() : null;

  if (newOnly && lastmod !== today) continue;
  urls.push(url);
}

if (urls.length === 0) {
  console.log(newOnly
    ? `Ingen URL-er med lastmod=${today} funnet i sitemap.xml.`
    : 'Ingen URL-er funnet i sitemap.xml.');
  process.exit(0);
}

console.log(`\nKonserterinorge Google Reindeksering`);
console.log(`─────────────────────────────────────`);
console.log(`Modus  : ${newOnly ? 'Kun nye (lastmod = ' + today + ')' : 'Alle URL-er'}`);
console.log(`Antall : ${urls.length} URL-er`);
if (dryRun) {
  console.log(`\n[DRY RUN] Ville sendt følgende URL-er:`);
  urls.forEach(u => console.log(' ', u));
  process.exit(0);
}

console.log(`\nSender til Google Indexing API...\n`);

// Send i grupper på 10 for å unngå rate-limiting
const BATCH_SIZE = 10;
for (let i = 0; i < urls.length; i += BATCH_SIZE) {
  const batch = urls.slice(i, i + BATCH_SIZE);
  const urlArgs = batch.map(u => `"${u}"`).join(' ');
  try {
    const output = execSync(`node "${GLOBAL_SCRIPT}" ${urlArgs}`, { encoding: 'utf-8' });
    console.log(output.trim());
  } catch (err) {
    console.error(`Feil ved batch ${i / BATCH_SIZE + 1}:`, err.message);
  }
  // Vent 1 sekund mellom batch-er
  if (i + BATCH_SIZE < urls.length) {
    const waitUntil = Date.now() + 1000;
    while (Date.now() < waitUntil) { /* busy wait */ }
  }
}

console.log('\nFerdig!');
