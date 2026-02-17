/**
 * OCR på skjermbilde av festivalregneark.
 * Henter ut tekst fra PNG (festivalnavn, evt. region hvis lesbart).
 *
 * Krever: npm install tesseract.js
 * Bruk: node scripts/ocr-festival-bilde.js
 *
 * Skriver rå tekst til data/festivaler-ocr-raw.txt og forsøker å parse
 * til data/festivaler-fra-ocr.json (navn + region der vi ser mønster).
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const IMAGE_PATH = path.join(ROOT, 'screencapture-docs-google-spreadsheets-d-1sJSOH61E6n-U8dDgkVa2j6u0QFj6YNqZ-htmlview-2026-02-17-20_32_28.png');
const RAW_OUT = path.join(ROOT, 'data', 'festivaler-ocr-raw.txt');
const JSON_OUT = path.join(ROOT, 'data', 'festivaler-fra-ocr.json');

async function main() {
  if (!fs.existsSync(IMAGE_PATH)) {
    console.error('Bilde ikke funnet:', IMAGE_PATH);
    process.exit(1);
  }

  let Tesseract;
  try {
    Tesseract = require('tesseract.js');
  } catch (e) {
    console.error('Kjør først: npm install tesseract.js');
    process.exit(1);
  }

  console.log('Kjører OCR på bildet (kan ta 30–60 sekunder) …');
  const { data: { text } } = await Tesseract.recognize(IMAGE_PATH, 'nor', { logger: (m) => { if (m.status === 'recognizing text') process.stderr.write('.'); } });
  console.log('\nFerdig.');

  fs.writeFileSync(RAW_OUT, text, 'utf8');
  console.log('Rå tekst skrevet til', RAW_OUT);

  // Parsing: hver linje som ser ut som et festivalnavn. Region-kolonnen er ofte fargeceller på bildet, så vi tar med region bare hvis OCR leser det.
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const regionPattern = /^(Agder|Innlandet|Møre og Romsdal|Nordland|Oslo|Rogaland|Trøndelag|Troms og Finnmark|Vestfold og Telemark|Vestland|Viken)$/i;
  const monthPattern = /^(Januar|Februar|Mars|April|Mai|Juni|Juli|August|September|Oktober|November|Desember)$/;
  const skipPattern = /^(Region|Festivalens navn|Broadcast|liste|Norge|2026|\.xlsx)/i;

  const festivaler = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (skipPattern.test(line) || monthPattern.test(line) || /^\d{1,3}$/.test(line)) {
      i++;
      continue;
    }
    const nextLine = (lines[i + 1] || '').trim();
    let region = '';
    if (regionPattern.test(nextLine)) {
      region = nextLine;
      i += 2;
    } else {
      i++;
    }
    const navn = line.replace(/\s+/g, ' ').trim();
    if (navn.length < 2 || navn.length > 120) continue;
    festivaler.push({
      navn,
      region: mapRegion(region),
      måned: 'Varierende',
      sjanger: 'Diverse/Kultur',
    });
  }

  const unike = [];
  const seen = new Set();
  for (const f of festivaler) {
    const key = f.navn.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unike.push(f);
  }

  const data = {
    meta: { beskrivelse: 'Fra OCR av regnearksbilde', oppdatert: new Date().toISOString().slice(0, 10), totalt: unike.length },
    festivaler: unike,
  };
  fs.writeFileSync(JSON_OUT, JSON.stringify(data, null, 2), 'utf8');
  console.log('Parset', unike.length, 'festivaler til', JSON_OUT);
}

function mapRegion(r) {
  if (!r) return 'Diverse';
  const m = {
    'Oslo': 'Øst', 'Viken': 'Øst', 'Vestfold og Telemark': 'Øst', 'Agder': 'Sør', 'Rogaland': 'Sør',
    'Vestland': 'Vest', 'Møre og Romsdal': 'Vest', 'Trøndelag': 'Midt', 'Innlandet': 'Innlandet',
    'Nordland': 'Nord', 'Troms og Finnmark': 'Nord',
  };
  return m[r] || r;
}

main().catch((e) => { console.error(e); process.exit(1); });
