/**
 * Importerer festivaler fra CSV (eksport fra regneark).
 * Kolonner: Festivalens navn (eller navn), Region (obligatorisk).
 * Valgfritt: Sjanger, Startdato (for måned), Fylke.
 *
 * Bruk: node scripts/import-festivaler-csv.js data/festivaler-493.csv
 *       node scripts/import-festivaler-csv.js data/festivaler-493.csv --merge
 *
 * --merge: beholder eksisterende festivaler i festivaler.json og legger til nye fra CSV.
 * Uten --merge: erstatter innholdet med CSV-data (anbefales ved første import av 493).
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const FESTIVALER_JSON = path.join(ROOT, 'data', 'festivaler.json');
const CSV_PATH = process.argv[2];
const MERGE = process.argv.includes('--merge');

if (!CSV_PATH) {
  console.error('Bruk: node scripts/import-festivaler-csv.js <csv-fil> [--merge]');
  process.exit(1);
}

/** Map fra regnearkets region/fylke til vårt region-felt (Øst, Vest, Nord, Sør, Midt, Innlandet) */
const REGION_MAP = {
  'Oslo': 'Øst',
  'Viken': 'Øst',
  'Vestfold og Telemark': 'Øst',
  'Telemark': 'Øst',
  'Vestfold': 'Øst',
  'Buskerud': 'Øst',
  'Østfold': 'Øst',
  'Akershus': 'Øst',
  'Agder': 'Sør',
  'Rogaland': 'Sør',
  'Vestland': 'Vest',
  'Møre og Romsdal': 'Vest',
  'Vestlandet': 'Vest',
  'Hordaland': 'Vest',
  'Sogn og Fjordane': 'Vest',
  'Trøndelag': 'Midt',
  'Nord-Trøndelag': 'Midt',
  'Sør-Trøndelag': 'Midt',
  'Innlandet': 'Innlandet',
  'Hedmark': 'Innlandet',
  'Oppland': 'Innlandet',
  'Nordland': 'Nord',
  'Troms og Finnmark': 'Nord',
  'Troms': 'Nord',
  'Finnmark': 'Nord',
  'Sør': 'Sør',
  'Øst': 'Øst',
  'Vest': 'Vest',
  'Nord': 'Nord',
  'Midt': 'Midt',
};

/** Måned fra dato-streng (f.eks. 17.06.2023 -> Juni) */
const MANEDER = ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'];
function maanedFraDato(s) {
  if (!s || typeof s !== 'string') return 'Varierende';
  const trimmed = s.trim();
  const m = trimmed.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if (m) {
    const maanedNr = parseInt(m[2], 10);
    if (maanedNr >= 1 && maanedNr <= 12) return MANEDER[maanedNr - 1];
  }
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    const maanedNr = parseInt(trimmed.substring(5, 7), 10);
    if (maanedNr >= 1 && maanedNr <= 12) return MANEDER[maanedNr - 1];
  }
  return 'Varierende';
}

function normaliserRegion(r) {
  if (!r || typeof r !== 'string') return 'Diverse';
  const t = r.trim();
  return REGION_MAP[t] || REGION_MAP[t.replace(/\s+/g, ' ')] || t;
}

function parseCSVLine(line, sep) {
  const out = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (!inQuotes && ch === sep) {
      out.push(cur.trim());
      cur = '';
    } else {
      cur += ch;
    }
  }
  out.push(cur.trim());
  return out;
}

function parseCSV(content) {
  const lines = content.split(/\r?\n/).filter((l) => l.length > 0);
  if (lines.length < 2) return [];
  const header = lines[0];
  const sep = header.includes(';') ? ';' : ',';
  const headers = parseCSVLine(header, sep).map((h) => h.replace(/^"|"$/g, '').trim());
  const nameCol = headers.findIndex((h) => /festivalens?\s+navn|^navn$/i.test(h));
  const regionCol = headers.findIndex((h) => /^region$/i.test(h));
  const sjangerCol = headers.findIndex((h) => /sjanger|genre/i.test(h));
  const startdatoCol = headers.findIndex((h) => /startdato|start/i.test(h));
  const fylkeCol = headers.findIndex((h) => /fylke/i.test(h));

  if (nameCol === -1 || regionCol === -1) {
    console.error('Krever kolonner: Festivalens navn (eller Navn), Region.');
    console.error('Fant kolonner:', headers);
    process.exit(1);
  }

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = parseCSVLine(lines[i], sep).map((c) => c.replace(/^"|"$/g, '').trim());
    const navn = (cells[nameCol] || '').trim();
    if (!navn) continue;
    let region = (cells[regionCol] || '').trim();
    if (fylkeCol !== -1 && cells[fylkeCol]) region = region || cells[fylkeCol].trim();
    const sjanger = sjangerCol !== -1 && cells[sjangerCol] ? cells[sjangerCol].trim() : 'Diverse/Kultur';
    const startdato = startdatoCol !== -1 ? cells[startdatoCol] : '';
    rows.push({
      navn,
      region: normaliserRegion(region),
      måned: maanedFraDato(startdato),
      sjanger: sjanger || 'Diverse/Kultur',
    });
  }
  return rows;
}

function main() {
  const csvPath = path.isAbsolute(CSV_PATH) ? CSV_PATH : path.join(ROOT, CSV_PATH);
  if (!fs.existsSync(csvPath)) {
    console.error('Fil ikke funnet:', csvPath);
    process.exit(1);
  }
  const content = fs.readFileSync(csvPath, 'utf8');
  const rows = parseCSV(content);
  console.log('Leser', rows.length, 'rader fra CSV.');

  let festivaler = [];
  if (MERGE) {
    try {
      const data = JSON.parse(fs.readFileSync(FESTIVALER_JSON, 'utf8'));
      festivaler = data.festivaler || [];
      console.log('Beholder', festivaler.length, 'eksisterende festivaler.');
    } catch (e) {
      console.log('Starter uten eksisterende data.');
    }
    const existingNames = new Set(festivaler.map((f) => f.navn.toLowerCase()));
    let added = 0;
    for (const r of rows) {
      if (!existingNames.has(r.navn.toLowerCase())) {
        festivaler.push(r);
        existingNames.add(r.navn.toLowerCase());
        added++;
      }
    }
    console.log('La til', added, 'nye festivaler.');
  } else {
    festivaler = rows;
  }

  const data = {
    meta: {
      beskrivelse: 'Norske festivaler med måned, region og sjanger. Importert fra regneark.',
      oppdatert: new Date().toISOString().slice(0, 10),
      totalt: festivaler.length,
    },
    festivaler,
  };
  fs.writeFileSync(FESTIVALER_JSON, JSON.stringify(data, null, 2), 'utf8');
  console.log('Skrev', festivaler.length, 'festivaler til data/festivaler.json.');
}

main();
