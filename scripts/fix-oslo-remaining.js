const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'byer', 'oslo', 'index.html');
let txt = fs.readFileSync(file, 'utf8');

const before = (txt.match(/\?\?/g) || []).length;

const replacements = [
  // Hero venue-chips
  ['<span class="venue-chip">?? 11 konsertscener</span>', '<span class="venue-chip">🎤 11 konsertscener</span>'],
  ['<span class="venue-chip">?? 350', '<span class="venue-chip">👥 350'],
  ['<span class="venue-chip">?? Ruter T-bane', '<span class="venue-chip">🚇 Ruter T-bane'],
  ['<span class="venue-chip">?? Rock, pop', '<span class="venue-chip">🎸 Rock, pop'],
  ['<span class="read-time">?? 7 min', '<span class="read-time">⏱️ 7 min'],

  // "Helårs" chip – check both possible encodings after UTF-8 conversion
  ['<span class="venue-chip">?? Helårs', '<span class="venue-chip">📅 Helårs'],

  // Kollektiv-ikoner (newlines preserved)
];

for (const [from, to] of replacements) {
  txt = txt.split(from).join(to);
}

// Kollektiv-ikoner (må matche med faktisk innhold i filen)
txt = txt.replace(
  /<div class="kollektiv-icon">\?\?<\/div>(\s*<div>\s*<strong>T-bane)/,
  '<div class="kollektiv-icon">🚇</div>$1'
);
txt = txt.replace(
  /<div class="kollektiv-icon">\?\?<\/div>(\s*<div>\s*<strong>Trikk)/,
  '<div class="kollektiv-icon">🚃</div>$1'
);
txt = txt.replace(
  /<div class="kollektiv-icon">\?\?<\/div>(\s*<div>\s*<strong>Nattbuss)/,
  '<div class="kollektiv-icon">🌙</div>$1'
);
txt = txt.replace(
  /<div class="kollektiv-icon">\?\?<\/div>(\s*<div>\s*<strong>Bil og)/,
  '<div class="kollektiv-icon">🚗</div>$1'
);

// Tips-hack ikon
txt = txt.replace('<span class="tips-hack-icon">??</span>', '<span class="tips-hack-icon">💡</span>');

// Tabellceller med ?? – sett musikknote som generisk ikon
txt = txt.replace(
  /(<td style="padding:11px 14px;text-align:center">)\?\?(<\/td>)/g,
  '$1🎵$2'
);

const after = (txt.match(/\?\?/g) || []).length;
console.log(`Før: ${before} ?? → Etter: ${after} ??`);

fs.writeFileSync(file, txt, 'utf8');
console.log('Lagret.');
