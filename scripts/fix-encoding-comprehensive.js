/**
 * Konverterer Windows-1252-encodede HTML-filer til UTF-8.
 * Brukes på filer som IKKE allerede inneholder UTF-8 multi-byte sekvenser.
 *
 * Kjøring: node scripts/fix-encoding-comprehensive.js [filsti ...]
 */

const fs = require('fs');
const path = require('path');

// Windows-1252 spesielle tegn 0x80–0x9F
const WIN1252_SPECIAL = {
  0x80: 0x20AC, 0x82: 0x201A, 0x83: 0x0192, 0x84: 0x201E,
  0x85: 0x2026, 0x86: 0x2020, 0x87: 0x2021, 0x88: 0x02C6,
  0x89: 0x2030, 0x8A: 0x0160, 0x8B: 0x2039, 0x8C: 0x0152,
  0x8E: 0x017D, 0x91: 0x2018, 0x92: 0x2019, 0x93: 0x201C,
  0x94: 0x201D, 0x95: 0x2022, 0x96: 0x2013, 0x97: 0x2014,
  0x98: 0x02DC, 0x99: 0x2122, 0x9A: 0x0161, 0x9B: 0x203A,
  0x9C: 0x0153, 0x9E: 0x017E, 0x9F: 0x0178,
};

function codePointToUtf8(cp) {
  if (cp <= 0x7F) return [cp];
  if (cp <= 0x7FF) return [0xC0 | (cp >> 6), 0x80 | (cp & 0x3F)];
  if (cp <= 0xFFFF) return [
    0xE0 | (cp >> 12),
    0x80 | ((cp >> 6) & 0x3F),
    0x80 | (cp & 0x3F),
  ];
  return [
    0xF0 | (cp >> 18),
    0x80 | ((cp >> 12) & 0x3F),
    0x80 | ((cp >> 6) & 0x3F),
    0x80 | (cp & 0x3F),
  ];
}

/**
 * Konverterer en buffer med Win-1252 bytes til UTF-8.
 * Alle bytes >= 0x80 behandles som Win-1252 (ingen UTF-8 deteksjon).
 */
function win1252ToUtf8(inBytes) {
  const out = [];
  for (let i = 0; i < inBytes.length; i++) {
    const b = inBytes[i];
    if (b < 0x80) {
      out.push(b);
    } else if (b <= 0x9F) {
      const cp = WIN1252_SPECIAL[b];
      if (cp) codePointToUtf8(cp).forEach(x => out.push(x));
      // undefined Win-1252 bytes (0x81, 0x8D, 0x8F, 0x90, 0x9D) droppes
    } else {
      // Latin-1 supplement 0xA0–0xFF: code point == byte value
      codePointToUtf8(b).forEach(x => out.push(x));
    }
  }
  return Buffer.from(out);
}

// Oslo-ikoner (erstatter ?? plassholdere med emoji)
function addOsloIcons(content) {
  const pairs = [
    [/(<div class="info-card-icon">)\?{1,3}(<\/div>[\s\S]{0,150}?<strong>11 konsertscener)/, '$1🎤$2'],
    [/(<div class="info-card-icon">)\?{1,3}(<\/div>[\s\S]{0,150}?<strong>350)/, '$1👥$2'],
    [/(<div class="info-card-icon">)\?{1,3}(<\/div>[\s\S]{0,150}?<strong>Alle sjangre)/, '$1🎸$2'],
    [/(<div class="info-card-icon">)\?{1,3}(<\/div>[\s\S]{0,150}?<strong>Hel[åa]rs tilbud)/, '$1📅$2'],
    [/(<div class="info-card-icon">)\?{1,3}(<\/div>[\s\S]{0,150}?<strong>T-bane)/, '$1🚇$2'],
    [/(<div class="info-card-icon">)\?{1,3}(<\/div>[\s\S]{0,150}?<strong>Trikk)/, '$1🚃$2'],
    [/(<div class="info-card-icon">)\?{1,3}(<\/div>[\s\S]{0,150}?<strong>Nattbuss)/, '$1🌙$2'],
    [/(<div class="info-card-icon">)\?{1,3}(<\/div>[\s\S]{0,150}?<strong>Bil og)/, '$1🚗$2'],
    [/(<div class="info-card-icon">)\?{1,3}(<\/div>[\s\S]{0,150}?<strong>Parkering)/, '$1🅿️$2'],
    [/(<div class="info-card-icon">)\?{1,3}(<\/div>[\s\S]{0,150}?<strong>Billett)/, '$1🎟️$2'],
    [/(<div class="tips-hack-icon">)\?{1,3}(<\/span>)/, '$1💡$2'],
  ];
  for (const [re, replacement] of pairs) {
    content = content.replace(re, replacement);
  }
  // Fjern gjenværende ?? plassholdere (erstatt med nøytral emoji)
  content = content.replace(/<div class="info-card-icon">\?{1,3}<\/div>/g, '<div class="info-card-icon">📌</div>');
  return content;
}

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error('Bruk: node fix-encoding-comprehensive.js <fil> [fil2 ...]');
  process.exit(1);
}

for (const rel of files) {
  const filePath = path.resolve(rel);
  if (!fs.existsSync(filePath)) { console.error(`Ikke funnet: ${filePath}`); continue; }

  const inBytes = fs.readFileSync(filePath);
  let outBytes = win1252ToUtf8(inBytes);

  // Oslo by-side: legg til ikoner
  const isOsloCity = filePath.replace(/\\/g, '/').endsWith('byer/oslo/index.html');
  if (isOsloCity) {
    let content = outBytes.toString('utf8');
    content = addOsloIcons(content);
    outBytes = Buffer.from(content, 'utf8');
  }

  fs.writeFileSync(filePath, outBytes);
  console.log(`✅ ${rel}`);
}
console.log('Ferdig.');
