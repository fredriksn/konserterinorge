/**
 * Henter longtail-nøkkelord fra Google – akkurat de forslagene som dukker opp
 * når man skriver arena-navnet i Google (autocomplete/dropdown).
 *
 * Bruk:
 *   node scripts/hent-longtail-forslag.js                    # alle arenaer (kun base-forslag)
 *   node scripts/hent-longtail-forslag.js --venue dnb-arena  # bare én arena
 *   node scripts/hent-longtail-forslag.js --out data/forslag.json
 *   node scripts/hent-longtail-forslag.js --alle-bokstaver   # gammel oppførsel: navn + a–z (mange forslag)
 *
 * Standard: Én forespørsel per arena – arena-navn + mellomrom (f.eks. "Unity Arena ").
 * Det gir kun det som dukker opp i Google-dropdownen når brukeren har skrevet
 * arena-navnet og et mellomrom – typisk adresse, kapasitet, parkering, billetter,
 * oslo, fornebu osv. Uten artistnavn og enkeltarrangementer.
 *
 * Viktig: 1–2 sek pause mellom kall. Bruk på eget ansvar (Google ToS).
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const DELAY_MS = 1500;
const ARENAER_PATH = path.join(__dirname, '..', 'data', 'arenaer.json');

// Brukes bare med --alle-bokstaver (gir mange hundre forslag per arena)
const BOKSTAVER = ' abcdefghijklmnopqrstuvwxyzæøå';

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function fetchSuggest(query) {
  return new Promise((resolve, reject) => {
    const url = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}`;
    https
      .get(url, { headers: { 'Accept': 'application/json' } }, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            // JSONP: window.google.ac.h(["query",["sug1","sug2",...],...])
            const match = data.match(/window\.google\.ac\.h\((.*)\)/s);
            let list = [];
            if (match) {
              const parsed = JSON.parse(match[1]);
              if (Array.isArray(parsed) && parsed[1]) list = parsed[1];
            } else {
              const parsed = JSON.parse(data);
              if (Array.isArray(parsed) && parsed[1]) list = parsed[1];
            }
            resolve(Array.isArray(list) ? list : []);
          } catch (e) {
            resolve([]);
          }
        });
      })
      .on('error', reject);
  });
}

async function main() {
  const args = process.argv.slice(2);
  const outIdx = args.indexOf('--out');
  const outPath = outIdx >= 0 ? args[outIdx + 1] : null;
  const venueIdx = args.indexOf('--venue');
  const venueSlug = venueIdx >= 0 ? args[venueIdx + 1] : null;
  const limitIdx = args.indexOf('--limit');
  const limit = limitIdx >= 0 ? parseInt(args[limitIdx + 1], 10) : null;
  const alleBokstaver = args.includes('--alle-bokstaver');

  let arenaer = [];
  try {
    const raw = fs.readFileSync(ARENAER_PATH, 'utf8');
    const data = JSON.parse(raw);
    arenaer = (data.arenaer || [])
      .slice()
      .sort((a, b) => (b.kapasitet || 0) - (a.kapasitet || 0));
    if (venueSlug) {
      arenaer = arenaer.filter((a) => a.slug === venueSlug);
      if (!arenaer.length) {
        console.error('Arena ikke funnet:', venueSlug);
        process.exit(1);
      }
    } else if (limit && limit > 0) {
      arenaer = arenaer.slice(0, limit);
    }
  } catch (e) {
    console.error('Kunne ikke lese data/arenaer.json:', e.message);
    process.exit(1);
  }

  const results = [];
  for (let i = 0; i < arenaer.length; i++) {
    const a = arenaer[i];
    const name = (a.navn || '').trim();
    const prioritet = venueSlug ? 1 : i + 1;
    const fraser = new Set();

    const queries = alleBokstaver
      ? BOKSTAVER.split('').map((char) => (char === ' ' ? name : name + ' ' + char).trim()).filter(Boolean)
      : [name + ' '];

    for (const q of queries) {
      await delay(DELAY_MS);
      try {
        const list = await fetchSuggest(q);
        list.forEach((s) => {
          const t = (s || '').trim();
          if (t && t.toLowerCase().includes(name.toLowerCase())) fraser.add(t);
        });
      } catch (e) {
        console.error(`Feil for "${q}":`, e.message);
      }
    }

    const arr = Array.from(fraser).sort();
    results.push({
      venue_slug: a.slug,
      venue_navn: a.navn,
      by_slug: (a.by || '').toLowerCase().replace(/\s/g, '-').replace(/ø/g, 'o').replace(/å/g, 'a'),
      prioritet,
      søkefraser: arr.map((frase) => ({ frase, dekkes_av: '' })),
    });
    console.error(`${a.navn}: ${arr.length} longtail-fraser`);
  }

  const output = JSON.stringify(
    { meta: { kilde: 'Google Suggest (autocomplete)', kjørt: new Date().toISOString() }, venuer: results },
    null,
    2
  );
  if (outPath) {
    fs.writeFileSync(outPath, output, 'utf8');
    console.error('Skrevet til:', outPath);
  } else {
    console.log(output);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
