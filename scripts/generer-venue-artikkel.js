/**
 * Genererer venue-artikkel (index.html) for en arena – Unity Arena-mal.
 * Praktisk info (dl + kart) + Spørsmål og svar (FAQ-accordion). Long-tail i setninger.
 *
 * Bruk: node scripts/generer-venue-artikkel.js <venue-slug>
 * Eksempel: node scripts/generer-venue-artikkel.js oslo-spektrum
 *
 * Skriver til: byer/<by_slug>/<venue_slug>/index.html
 * Bruk --dry-run for å skrive til konsoll i stedet.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ARENAER_PATH = path.join(ROOT, 'data', 'arenaer.json');

const BY_TO_SLUG = {
  Oslo: 'oslo',
  Bergen: 'bergen',
  Trondheim: 'trondheim',
  Stavanger: 'stavanger',
  Tromsø: 'tromso',
  Kristiansand: 'kristiansand',
  Tønsberg: 'tonsberg',
  Ålesund: 'alesund',
};

const KOLLEKTIV_LENKE = {
  Oslo: { url: 'https://ruter.no', navn: 'Ruters reiseplanlegger' },
  Bergen: { url: 'https://skyss.no', navn: 'Skyss' },
  Trondheim: { url: 'https://atb.no', navn: 'AtB' },
  Stavanger: { url: 'https://kolumbus.no', navn: 'Kolumbus' },
};

function escapeHtml(s) {
  if (!s) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Stedsnavn fra adresse (f.eks. "Fornebu" fra "..., 1366 Fornebu") */
function stedsnavnFraAdresse(adresse) {
  if (!adresse) return '';
  const parts = adresse.split(',');
  const siste = (parts[parts.length - 1] || '').trim();
  const ord = siste.split(/\s+/);
  return ord[ord.length - 1] || '';
}

function main() {
  const slug = process.argv[2];
  const dryRun = process.argv.includes('--dry-run');
  if (!slug) {
    console.error('Bruk: node scripts/generer-venue-artikkel.js <venue-slug> [--dry-run]');
    process.exit(1);
  }

  let arenaer = [];
  try {
    arenaer = JSON.parse(fs.readFileSync(ARENAER_PATH, 'utf8')).arenaer || [];
  } catch (e) {
    console.error('Kunne ikke lese data/arenaer.json:', e.message);
    process.exit(1);
  }

  const arena = arenaer.find((a) => a.slug === slug);
  if (!arena) {
    console.error('Arena ikke funnet:', slug);
    process.exit(1);
  }

  const n = arena.navn;
  const bySlug = BY_TO_SLUG[arena.by] || arena.by.toLowerCase().replace(/\s/g, '-').replace(/ø/g, 'o').replace(/å/g, 'a');
  const depth = 3;
  const basePath = '../'.repeat(depth);
  const nettside = arena.nettside || '#';
  const adresse = arena.adresse || '';
  const cap = arena.kapasitet_tekst || (arena.kapasitet ? `ca. ${Number(arena.kapasitet).toLocaleString('nb-NO')}` : '');
  const parkering = arena.parkering || 'Sjekk arenaens nettside for parkering.';
  const kollektiv = arena.kollektiv || 'Sjekk kollektivtilbud i området.';
  const kollektivInfo = KOLLEKTIV_LENKE[arena.by] || { url: 'https://ruter.no', navn: 'reiseplanlegger' };
  const stedsnavn = stedsnavnFraAdresse(adresse) || arena.by;
  const ticketPath = basePath + 'billettselskaper/ticketmaster/';
  const eventimPath = basePath + 'billettselskaper/eventim/';
  const capPhrase = String(cap || '').toLowerCase().startsWith('ca.') ? cap : 'rundt ' + cap;

  const mapsQuery = encodeURIComponent(n + ' ' + adresse + ' Norway');
  const mapsEmbed = `https://www.google.com/maps?q=${mapsQuery}&output=embed&z=16`;
  const mapsSearch = `https://www.google.com/maps/search/${encodeURIComponent(n + ' ' + adresse)}`;

  const SITE_URL = 'https://www.konserterinorge.no';
  const pageUrl = `${SITE_URL}/byer/${bySlug}/${slug}/`;
  const OG_IMAGE = SITE_URL + '/images/og-default.jpg';

  const metaDesc = `${n} ${arena.by}${stedsnavn !== arena.by ? ' ' + stedsnavn : ''} – adresse, kapasitet, parkering, kollektivtransport og billetter. Spørsmål og svar om ${n}.`;
  const title = `${n} ${arena.by} – Adresse, kapasitet, parkering og billetter | Konserter i Norge`;

  // Praktisk info: dl med long-tail i setninger (anker-ids for dekkes_av)
  const dlItems = [
    { id: 'venue-address-heading', dt: 'Adresse', dd: `<strong>${escapeHtml(n)} adresse</strong> er ${escapeHtml(adresse)}. Arenaen ligger i ${escapeHtml(arena.by)}.` },
    { id: 'kapasitet', dt: 'Kapasitet', dd: `<strong>${escapeHtml(n)} kapasitet</strong> er ${escapeHtml(capPhrase)} ved konserter. Kapasiteten varierer med sceneoppsett.` },
    { id: 'parkering', dt: 'Parkering', dd: `<strong>${escapeHtml(n)} parkering:</strong> ${escapeHtml(parkering)} Ved store arrangementer kan det bli travelt – kom i god tid eller bruk kollektivtransport. Aktuelle priser og info finner du på <a href="${escapeHtml(nettside)}" target="_blank" rel="noopener">${escapeHtml(n)}s nettside</a>.` },
    { id: 'kollektivtransport', dt: 'Kollektivtransport', dd: `<strong>Kollektivtransport til ${escapeHtml(n)}:</strong> ${escapeHtml(kollektiv)} Sjekk <a href="${escapeHtml(kollektivInfo.url)}" target="_blank" rel="noopener">${escapeHtml(kollektivInfo.navn)}</a> for ruter og avgangstider. Kollektiv anbefales ved store konserter.` },
    { id: 'billetter', dt: 'Billetter og konserter', dd: `<strong>${escapeHtml(n)} billetter</strong> kjøpes hos <a href="${ticketPath}">Ticketmaster</a>, <a href="${eventimPath}">Eventim</a> og andre anerkjente billettselskaper. Kommende konserter og program vises på <a href="${escapeHtml(nettside)}" target="_blank" rel="noopener">arenaens offisielle nettside</a>.` },
    { id: 'salkart', dt: 'Salkart og innganger', dd: `<strong>Salkart og innganger ${escapeHtml(n)}:</strong> Hvilken inngang du skal bruke står på billetten (blokk/seksjon). Salkart og detaljer finner du ved billettkjøp og på arenaens nettside.` },
  ];

  const dlHtml = dlItems
    .map((item, i) => {
      const dtId = i === 0 ? ` id="adresse"` : (item.id ? ` id="${item.id}"` : '');
      return `              <dt${dtId}>${escapeHtml(item.dt)}</dt>
              <dd>${item.dd}</dd>`;
    })
    .join('\n\n              ');

  // FAQ: 13 spørsmål – alle long-tail fra Google (beste sitteplasser, rives, kryssord, 2026, ombygging) i egne punkter
  const faqItems = [
    { q: `Hva er kapasiteten i ${n}?`, a: `${n} har plass til ${escapeHtml(capPhrase)} ved konserter. Kapasiteten kan variere med sceneoppsett.`, id: 'faq-kapasitet' },
    { q: `Hvor ligger ${n}? ${n} adresse?`, a: `${n} adresse er ${escapeHtml(adresse)}, like ved ${escapeHtml(arena.by)}.`, id: 'faq-adresse' },
    { q: `Hvor kan jeg parkere ved ${n}? ${n} parkering`, a: `${n} parkering: ${escapeHtml(parkering)} Ved store konserter anbefales kollektivtransport. Oppdatert info på <a href="${escapeHtml(nettside)}" target="_blank" rel="noopener">${escapeHtml(n)}s nettside</a>.`, id: 'faq-parkering' },
    { q: `Hvor kjøper jeg billetter til konserter i ${n}? ${n} billetter`, a: `${n} billetter kjøpes via Ticketmaster, Eventim og andre billettselskaper. Kommende konserter og billetter finner du på <a href="${escapeHtml(nettside)}" target="_blank" rel="noopener">${escapeHtml(n)}s nettside</a>.`, id: 'faq-billetter' },
    { q: `Kollektivtransport til ${n}? Buss til ${n} ${stedsnavn}`, a: `Kollektivtransport til ${n}: ${escapeHtml(kollektiv)} Sjekk <a href="${escapeHtml(kollektivInfo.url)}" target="_blank" rel="noopener">${escapeHtml(kollektivInfo.navn)}</a> for ruter og avgangstider.`, id: 'faq-kollektiv' },
    { q: `${n} ${stedsnavn} – hvor er det?`, a: `${n} ${stedsnavn} ligger i ${escapeHtml(arena.by)}. Adressen er ${escapeHtml(adresse)}.`, id: 'faq-sted' },
    { q: `${n} konserter – hvor ser jeg program og billetter?`, a: `${n} konserter og program vises på <a href="${escapeHtml(nettside)}" target="_blank" rel="noopener">${escapeHtml(n)}s offisielle nettside</a>. Billetter kjøpes hos Ticketmaster, Eventim og arenaen.`, id: 'faq-konserter' },
    { q: `Salkart og innganger ${n} – hvilken inngang?`, a: `Salkart og innganger ${n}: Hvilken inngang du skal bruke står på billetten (blokk/seksjon). Salkart og detaljer finner du ved billettkjøp og på <a href="${escapeHtml(nettside)}" target="_blank" rel="noopener">arenaens nettside</a>.`, id: 'faq-salkart' },
    { q: `Hvor er beste sitteplasser i ${n}? ${n} beste sitteplasser`, a: `Beste sitteplasser i ${n} avhenger av arrangement og preferanse. Syn og akustikk varierer med blokk og etasje. Salkart vises ved billettkjøp – der ser du plassering i salen. For konkrete anbefalinger per konsert, sjekk <a href="${escapeHtml(nettside)}" target="_blank" rel="noopener">${escapeHtml(n)}s nettside</a> eller billettselskapet.`, id: 'faq-beste-sitteplasser', anker: 'beste-sitteplasser' },
    { q: `Blir ${n} revet? ${n} rives`, a: `Per i dag er ${n} i drift med konserter og arrangementer. Arenaen revnes ikke. Eventuelle langtidsplaner for området eller bygget finner du på <a href="${escapeHtml(nettside)}" target="_blank" rel="noopener">${escapeHtml(n)}s nettside</a>.`, id: 'faq-rives', anker: 'rives' },
    { q: `${n} kryssord – hva betyr det?`, a: `«${n}» er et vanlig svar i norske kryssord og betegner konsert- og eventarenaen i ${escapeHtml(arena.by)}. Adressen er ${escapeHtml(adresse)}.`, id: 'faq-kryssord', anker: 'kryssord' },
    { q: `Konserter i ${n} 2026? ${n} 2026`, a: `Konserter og arrangementer i ${n} i 2026 finner du i arenaens offisielle program. Oppdatert kalender og billetter: <a href="${escapeHtml(nettside)}" target="_blank" rel="noopener">${escapeHtml(n)}s nettside</a>.`, id: 'faq-2026', anker: 'program-2026' },
    { q: `Ombygging av ${n}? ${n} ombygging`, a: `${n} har gjennomgått oppgraderinger gjennom årene. For oppdatert informasjon om ombygging eller vedlikehold, sjekk <a href="${escapeHtml(nettside)}" target="_blank" rel="noopener">${escapeHtml(n)}s nettside</a>.`, id: 'faq-ombygging', anker: 'ombygging' },
  ];

  const faqHtml = faqItems
    .map((item) => {
      const ddId = item.anker || item.id;
      const controlId = item.id.replace('faq-', '');
      return `          <div class="faq-item">
            <dt><button type="button" class="faq-question" aria-expanded="false" aria-controls="${escapeHtml(ddId)}" id="faq-q-${escapeHtml(controlId)}">${escapeHtml(item.q)}</button></dt>
            <dd id="${escapeHtml(ddId)}" role="region" aria-labelledby="faq-q-${escapeHtml(controlId)}">${item.a}</dd>
          </div>`;
    })
    .join('\n');

  // Schema: FAQPage (kun tekst i acceptedAnswer, ingen HTML)
  const faqSchemaItems = faqItems.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&') },
  }));

  const placeDesc = `Konsert- og eventarena i ${arena.by}. Kapasitet ${cap}. Adresse, parkering, kollektivtransport, billetter. Spørsmål og svar om ${n}.`;
  const placeSchema = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: n,
    description: placeDesc,
    address: { '@type': 'PostalAddress', streetAddress: adresse.split(',')[0] || adresse, addressLocality: arena.by, addressCountry: 'NO' },
    url: nettside.startsWith('http') ? nettside : undefined,
  };

  const html = `<!DOCTYPE html>
<html lang="no">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${escapeHtml(metaDesc)}">
  <meta name="robots" content="index, follow">
  <title>${escapeHtml(title)}</title>
  <link rel="canonical" href="${pageUrl}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:title" content="${escapeHtml(n)} ${escapeHtml(arena.by)} – Adresse, kapasitet, parkering og billetter">
  <meta property="og:description" content="Praktisk info om ${escapeHtml(n)}. Spørsmål og svar om adresse, kapasitet, parkering og billetter.">
  <meta property="og:image" content="${OG_IMAGE}">
  <meta property="og:site_name" content="Konserter i Norge">
  <meta property="og:locale" content="nb_NO">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(n)} ${escapeHtml(arena.by)} – Spørsmål og svar, adresse, billetter">
  <meta name="twitter:description" content="${escapeHtml(n)} – adresse, kapasitet, parkering, billetter. Spørsmål og svar.">
  <meta name="twitter:image" content="${OG_IMAGE}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${basePath}css/style.css">
  <script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqSchemaItems }).replace(/</g, '\\u003c')}</script>
  <script type="application/ld+json">${JSON.stringify(placeSchema).replace(/</g, '\\u003c')}</script>
</head>
<body>
  <header class="site-header" role="banner">
    <div class="container">
      <a href="${basePath}index.html" class="logo">Konserter<span>iNorge</span>.no</a>
      <nav class="nav-main" aria-label="Hovednavigasjon">
        <a href="${basePath}index.html">Hjem</a>
        <a href="${basePath}byer/">Byer</a>
        <a href="${basePath}festivaler/">Festivaler</a>
        <a href="${basePath}billettselskaper/">Billettselskaper</a>
        <a href="${basePath}turneer/">Turneer</a>
        <a href="${basePath}artister/">Artister</a>
      </nav>
      <button type="button" class="nav-toggle" aria-label="Åpne meny" aria-expanded="false">☰</button>
    </div>
  </header>

  <main id="main-content" role="main">
    <div class="container page-content">
      <nav class="breadcrumb" aria-label="Brødsmule">
        <a href="${basePath}index.html">Hjem</a>
        <span>/</span>
        <a href="${basePath}byer/">Byer</a>
        <span>/</span>
        <a href="../">${escapeHtml(arena.by)}</a>
        <span>/</span>
        <span>${escapeHtml(n)}</span>
      </nav>

      <h1>${escapeHtml(n)}</h1>
      <p class="lead">Praktisk info om ${escapeHtml(n)} i ${escapeHtml(arena.by)}: adresse, kapasitet, parkering, kollektivtransport og billetter. Nedenfor finner du spørsmål og svar om arenaen.</p>

      <section class="venue-fakta" aria-labelledby="fakta-heading">
        <span class="section-badge">Praktisk info</span>
        <h2 id="fakta-heading">Adresse, kapasitet og transport</h2>

        <div class="venue-map-wrap" aria-labelledby="adresse">
          <div class="venue-map-left">
            <dl class="venue-dl">
${dlHtml}
            </dl>

            <p><a href="${escapeHtml(nettside)}" target="_blank" rel="noopener" class="btn btn-primary">Gå til ${escapeHtml(n)}s nettside</a></p>
          </div>
          <div class="venue-map-right" id="kart">
            <div class="venue-map-frame">
              <iframe
                src="${escapeHtml(mapsEmbed)}"
                width="100%"
                height="100%"
                style="border:0"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                title="${escapeHtml(n)} på kart"></iframe>
            </div>
            <a href="${escapeHtml(mapsSearch)}" target="_blank" rel="noopener" class="venue-map-link">Åpne i Google Kart</a>
          </div>
        </div>
      </section>

      <section class="venue-faq" aria-labelledby="faq-heading">
        <span class="section-badge">Vanlige spørsmål</span>
        <h2 id="faq-heading">Spørsmål og svar om ${escapeHtml(n)}</h2>
        <dl class="faq-list">
${faqHtml}
        </dl>
      </section>

      <p class="venue-cta"><a href="../" class="btn btn-secondary">Se alle konsertscener i ${escapeHtml(arena.by)}</a></p>
    </div>
  </main>

  <footer class="site-footer" role="contentinfo">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="${basePath}index.html" class="logo">Konserter<span>iNorge</span>.no</a>
          <p>Oversikt over konsertscener, festivaler og arrangementer i Norge. Finn arenaer, parkering og billetter.</p>
        </div>
        <div>
          <h4>Nettside</h4>
          <ul>
            <li><a href="${basePath}index.html">Hjem</a></li>
            <li><a href="${basePath}byer/">Byer</a></li>
            <li><a href="${basePath}festivaler/">Festivaler</a></li>
            <li><a href="${basePath}billettselskaper/">Billettselskaper</a></li>
            <li><a href="${basePath}turneer/">Turneer</a></li>
            <li><a href="${basePath}artister/">Artister</a></li>
          </ul>
        </div>
        <div>
          <h4>Informasjon</h4>
          <ul>
            <li><a href="${basePath}om-oss/">Om oss</a></li>
            <li><a href="${basePath}kontakt/">Kontakt</a></li>
            <li><a href="${basePath}blogg/">Blogg</a></li>
            <li><a href="${basePath}sok/">Søk</a></li>
            <li><a href="${basePath}personvern/">Personvern</a></li>
            <li><a href="${basePath}vilkar/">Vilkår</a></li>
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

  <script src="${basePath}js/main.js"></script>
</body>
</html>
`;

  const outDir = path.join(ROOT, 'byer', bySlug, slug);
  const outFile = path.join(outDir, 'index.html');

  if (dryRun) {
    console.log(html);
    return;
  }

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  fs.writeFileSync(outFile, html, 'utf8');
  console.log('Skrevet:', outFile);
}

main();
