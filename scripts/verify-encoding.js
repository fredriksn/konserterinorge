const fs = require('fs');
const buf = fs.readFileSync(process.argv[2]);
let txt;
try { txt = buf.toString('utf8'); } catch (e) { console.error('Feil:', e); process.exit(1); }

const roundTrip = Buffer.from(txt, 'utf8');
console.log('UTF-8 round-trip OK:', roundTrip.every((b,i) => b === buf[i]));
console.log('Ingen U+FFFD:', !txt.includes('\uFFFD'));
console.log('Har en-strek (\u2013):', txt.includes('\u2013'));
console.log('Har anf\u00f8rselstegn (\u201c):', txt.includes('\u201C'));
console.log('Har \u00f8 (Voldsl\u00f8kka):', txt.includes('Voldsl\u00F8kka'));
console.log('Har \u00e5:', txt.includes('\u00E5'));
console.log('Har \u00e6:', txt.includes('\u00E6'));

// Spot check
const idx = txt.indexOf('konsertscener');
if (idx > -1) console.log('\nSample:', txt.substring(idx - 5, idx + 100));
