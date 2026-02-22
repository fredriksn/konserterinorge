const fs = require('fs');
const txt = fs.readFileSync(process.argv[2], 'utf8');
const qqCount = (txt.match(/\?\?+/g) || []).length;
const icons = txt.match(/<div class="info-card-icon">[\s\S]{1,20?}<\/div>/g) || [];
console.log('Gjenv\u00e6rende ?? plassholdere:', qqCount);
console.log('Info-card-ikoner funnet:', icons.length);
icons.slice(0, 8).forEach(m => console.log(' ', m));
