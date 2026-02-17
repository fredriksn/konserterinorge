/**
 * Genererer egne landingssider per festival fra data/festivaler.json.
 * Skriver til: festivaler/<slug>/index.html
 *
 * Bruk: node scripts/generer-festival-sider.js
 *       node scripts/generer-festival-sider.js --dry-run
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const FESTIVALER_PATH = path.join(ROOT, 'data', 'festivaler.json');
const FESTIVALER_DIR = path.join(ROOT, 'festivaler');

function slug(s) {
  return String(s)
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[æå]/g, 'a')
    .replace(/ø/g, 'o')
    .replace(/[^a-z0-9-]/g, '');
}

function escapeHtml(s) {
  if (!s) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Trekker ut rent festivalnavn og evt. sted fra raw navn, f.eks. "X9 Festivalen (Volda) [0" -> { displayName: "X9 Festivalen", sted: "Volda" } */
function parseFestivalNavn(raw) {
  const s = String(raw || '').trim();
  const stedMatch = s.match(/\s*\(([^)]+)\)\s*/);
  const sted = stedMatch ? stedMatch[1].trim() : null;
  let displayName = s
    .replace(/\s*\([^)]+\)\s*/g, '')
    .replace(/\s*\[[^\]]*\]?\s*$/, '')
    .replace(/\s*[–\-]\s*[A-Za-z0-9\s]*$/, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!displayName) displayName = s;
  return { displayName, sted };
}

const BASE = '../../';
const SITE_URL = 'https://www.konserterinorge.no';
const OG_IMAGE = SITE_URL + '/images/og-default.jpg';

function genererHtml(f) {
  const rawNavn = f.navn;
  const { displayName, sted } = parseFestivalNavn(rawNavn);
  const slugNavn = slug(rawNavn);
  const maned = f.måned || '';
  const region = f.region || '';
  const sjanger = f.sjanger || '';
  const metaParts = [displayName];
  if (sted) metaParts.push(sted);
  metaParts.push([maned, region, sjanger].filter(Boolean).join(' · '));
  const metaDesc = metaParts.filter(Boolean).join(' – ') + '. Svar på spørsmål om adkomst, parkering, program og billetter.';
  const pageUrl = SITE_URL + '/festivaler/' + slugNavn + '/';

  const q1 = 'Når og hvor er ' + displayName + '?';
  const a1 = (maned ? 'Festivalen arrangeres vanligvis i ' + maned + '. ' : '') + (sted ? 'Stedet er ' + sted + '. ' : '') + 'Nøyaktig dato publiseres på festivalens offisielle nettside.';
  const q2 = 'Hvordan kommer jeg til ' + displayName + '?';
  const a2 = 'Sjekk festivalens nettside og kollektivtilbudet i området. Ved store festivaler anbefales kollektivtransport.';
  const q3 = 'Hvor kan jeg parkere ved ' + displayName + '?';
  const a3 = 'Parkering varierer fra sted til sted. Oppdatert info om parkeringsplasser og priser finner du på arrangørens nettside.';
  const q4 = 'Hvor kjøper jeg billetter til ' + displayName + '?';
  const a4 = 'Program og billetter finner du hos arrangør og på billettselskaper som Ticketmaster og Eventim.';

  const faqSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: q1, acceptedAnswer: { '@type': 'Answer', text: a1 } },
      { '@type': 'Question', name: q2, acceptedAnswer: { '@type': 'Answer', text: a2 } },
      { '@type': 'Question', name: q3, acceptedAnswer: { '@type': 'Answer', text: a3 } },
      { '@type': 'Question', name: q4, acceptedAnswer: { '@type': 'Answer', text: a4 } },
    ],
  }).replace(/</g, '\\u003c');

  return `<!DOCTYPE html>
<html lang="no">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${escapeHtml(metaDesc)}">
  <meta name="robots" content="index, follow">
  <title>${escapeHtml(displayName)} – Når, hvor, parkering og billetter | Konserter i Norge</title>
  <link rel="canonical" href="${pageUrl}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:title" content="${escapeHtml(displayName)}${sted ? ' – ' + escapeHtml(sted) : ''} – Festival, praktisk info">
  <meta property="og:description" content="${escapeHtml(metaDesc)}">
  <meta property="og:image" content="${OG_IMAGE}">
  <meta property="og:site_name" content="Konserter i Norge">
  <meta property="og:locale" content="nb_NO">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(displayName)}${sted ? ' – ' + escapeHtml(sted) : ''} – Festival">
  <meta name="twitter:description" content="${escapeHtml(metaDesc)}">
  <meta name="twitter:image" content="${OG_IMAGE}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${BASE}css/style.css">
  <script type="application/ld+json">${faqSchema}</script>
</head>
<body>
  <header class="site-header" role="banner">
    <div class="container">
      <a href="${BASE}index.html" class="logo">Konserter<span>iNorge</span>.no</a>
      <nav class="nav-main" aria-label="Hovednavigasjon">
        <a href="${BASE}index.html">Hjem</a>
        <a href="${BASE}byer/">Byer</a>
        <a href="${BASE}festivaler/">Festivaler</a>
        <a href="${BASE}billettselskaper/">Billettselskaper</a>
        <a href="${BASE}turneer/">Turneer</a>
        <a href="${BASE}artister/">Artister</a>
      </nav>
      <button type="button" class="nav-toggle" aria-label="Åpne meny" aria-expanded="false">☰</button>
    </div>
  </header>

  <main id="main-content" role="main">
    <div class="container page-content">
      <nav class="breadcrumb" aria-label="Brødsmule">
        <a href="${BASE}index.html">Hjem</a>
        <span>/</span>
        <a href="${BASE}festivaler/">Festivaler</a>
        <span>/</span>
        <span>${escapeHtml(displayName)}</span>
      </nav>

      <h1>${escapeHtml(displayName)}</h1>
      ${sted ? '<p class="festival-sted">' + escapeHtml(sted) + '</p>' : ''}
      <p>${escapeHtml(displayName)} er en norsk festival${sted ? ' i ' + escapeHtml(sted) : ''}${maned ? ', arrangeres typisk i ' + maned.toLowerCase() : ''}${region ? ' i ' + region + '-' : ''}regionen${sjanger ? ', med fokus på ' + sjanger.toLowerCase() : ''}. Her får du svar på vanlige spørsmål om adkomst, parkering, program og billetter.</p>

      <h2 id="tidspunkt">Når og hvor er ${escapeHtml(displayName)}?</h2>
      <p>${maned ? 'Festivalen arrangeres vanligvis i ' + maned + '. ' : ''}${sted ? 'Stedet er ' + escapeHtml(sted) + '. ' : ''}Nøyaktig dato publiseres på festivalens offisielle nettside.</p>

      <h2 id="adkomst">Hvordan kommer jeg til ${escapeHtml(displayName)}?</h2>
      <p>Sjekk festivalens nettside og kollektivtilbudet i området. Ved store festivaler anbefales kollektivtransport.</p>

      <h2 id="parkering">Hvor kan jeg parkere ved ${escapeHtml(displayName)}?</h2>
      <p>Parkering varierer fra sted til sted. Oppdatert info om parkeringsplasser og priser finner du på arrangørens nettside.</p>

      <h2 id="kapasitet">Hvor stort er festivalområdet?</h2>
      <p>Kapasitet og festivalområdets utforming offentliggjøres av arrangør. Sjekk festivalens egen nettside for kart og praktisk info.</p>

      <h2 id="program">Hvor kjøper jeg billetter til ${escapeHtml(displayName)}?</h2>
      <p>Program og billetter finner du hos arrangør og på <a href="${BASE}billettselskaper/">billettselskapene</a> vi lenker til.</p>

      <h2 id="tips">Tips for besøkende</h2>
      <p>Kom i god tid, kle deg etter vær og sjekk hva som er tillatt å ta med. Følg festivalens kanaler for siste nytt.</p>
    </div>
  </main>

  <footer class="site-footer" role="contentinfo">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="${BASE}index.html" class="logo">Konserter<span>iNorge</span>.no</a>
          <p>Oversikt over konsertscener, festivaler og arrangementer i Norge. Finn arenaer, parkering og billetter.</p>
        </div>
        <div>
          <h4>Nettside</h4>
          <ul>
            <li><a href="${BASE}index.html">Hjem</a></li>
            <li><a href="${BASE}byer/">Byer</a></li>
            <li><a href="${BASE}festivaler/">Festivaler</a></li>
            <li><a href="${BASE}billettselskaper/">Billettselskaper</a></li>
            <li><a href="${BASE}turneer/">Turneer</a></li>
            <li><a href="${BASE}artister/">Artister</a></li>
          </ul>
        </div>
        <div>
          <h4>Informasjon</h4>
          <ul>
            <li><a href="${BASE}om-oss/">Om oss</a></li>
            <li><a href="${BASE}kontakt/">Kontakt</a></li>
            <li><a href="${BASE}blogg/">Blogg</a></li>
            <li><a href="${BASE}sok/">Søk</a></li>
            <li><a href="${BASE}personvern/">Personvern</a></li>
            <li><a href="${BASE}vilkar/">Vilkår</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-gallery" aria-label="Bilder">
        <img src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=280&h=180&fit=crop" width="280" height="180" alt="Konsert med scenelys" loading="lazy">
        <img src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=280&h=180&fit=crop" width="280" height="180" alt="Livekonsert på festival" loading="lazy">
        <img src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=280&h=180&fit=crop" width="280" height="180" alt="Konsertpublikum og scene" loading="lazy">
        <img src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=280&h=180&fit=crop" width="280" height="180" alt="Festival med scene" loading="lazy">
      </div>
      <div class="footer-bottom">
        <p>© Konserter i Norge. Konsertscener, festivaler og arrangementer i Norge.</p>
      </div>
    </div>
  </footer>

  <button type="button" class="scroll-top" aria-label="Scroll til toppen" title="Scroll til toppen">↑</button>

  <script src="${BASE}js/main.js"></script>
</body>
</html>
`;
}

function main() {
  const dryRun = process.argv.includes('--dry-run');
  let data;
  try {
    data = JSON.parse(fs.readFileSync(FESTIVALER_PATH, 'utf8'));
  } catch (e) {
    console.error('Kunne ikke lese', FESTIVALER_PATH, e.message);
    process.exit(1);
  }
  const festivaler = data.festivaler || [];
  console.log('Genererer', festivaler.length, 'festivalsider' + (dryRun ? ' (dry-run)' : '') + ' …');

  const seen = {};
  let written = 0;
  for (const f of festivaler) {
    const s = slug(f.navn);
    if (!s || seen[s]) continue;
    seen[s] = true;
    const dir = path.join(FESTIVALER_DIR, s);
    const file = path.join(dir, 'index.html');
    const html = genererHtml(f);
    if (dryRun) {
      console.log('  ', s, '->', file);
      written++;
      continue;
    }
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(file, html, 'utf8');
    written++;
  }
  console.log('Ferdig. Skrev', written, 'filer.');
}

main();
