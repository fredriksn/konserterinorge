const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'byer', 'oslo', 'index.html');
let txt = fs.readFileSync(file, 'utf8');

// 1. Erstatt alle "?" i Innendørs-kolonnen med ✅
//    (kun de som er i table-celler med text-align:center og kun inneholder ?)
txt = txt.replace(/(<td style="padding:11px 14px;text-align:center">)\?(<\/td>)/g, '$1✅$2');

// 2. Erstatt "Les guide ?" med "Les guide →" i alle tabellceller
txt = txt.replace(/Les guide \?/g, 'Les guide \u2192');

// Voldsløkka og Bjerke Travbane har 🎵 (utendørs) – la dem stå

const innendors = (txt.match(/text-align:center">\?<\/td>/g) || []).length;
const guide = (txt.match(/Les guide \?/g) || []).length;
console.log('Gjenvaerende Innendors-?: ' + innendors + ' (skal vaere 0)');
console.log('Gjenvaerende "Les guide ?": ' + guide + ' (skal vaere 0)');

fs.writeFileSync(file, txt, 'utf8');
console.log('Lagret.');
