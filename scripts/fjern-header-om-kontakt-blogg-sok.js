/**
 * Fjerner Om oss, Kontakt, Blogg og Søk fra header (nav-main) i alle HTML-filer.
 * De forbli i footer. Kjør: node scripts/fjern-header-om-kontakt-blogg-sok.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function removeHeaderLinks(html) {
  const lines = html.split(/\r?\n/);
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed.startsWith('<a href=') && !trimmed.includes('<li>')) {
      if ((trimmed.includes('om-oss/') && trimmed.includes('>Om oss</a>')) ||
          (trimmed.includes('kontakt/') && trimmed.includes('>Kontakt</a>')) ||
          (trimmed.includes('blogg/') && trimmed.includes('>Blogg</a>')) ||
          (trimmed.includes('sok/') && trimmed.includes('>Søk</a>'))) {
        continue;
      }
    }
    out.push(line);
  }
  return out.join('\n');
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules') {
      walk(full);
    } else if (e.isFile() && e.name.toLowerCase().endsWith('.html')) {
      let content = fs.readFileSync(full, 'utf8');
      const updated = removeHeaderLinks(content);
      if (updated !== content) {
        fs.writeFileSync(full, updated, 'utf8');
        console.log('Oppdatert:', path.relative(ROOT, full));
      }
    }
  }
}

walk(ROOT);
console.log('Ferdig.');
