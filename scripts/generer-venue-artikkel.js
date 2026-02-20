/**
 * Genererer venue-artikkel (index.html) for en arena.
 * Produserer rik layout med stats-strip, quicknav, parkering, transport,
 * sitteplassguide, insidertips og FAQ-accordion.
 *
 * Bruk: node scripts/generer-venue-artikkel.js <venue-slug>
 * Eksempel: node scripts/generer-venue-artikkel.js unity-arena
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

  let arenaerData = {};
  let arenaer = [];
  try {
    arenaerData = JSON.parse(fs.readFileSync(ARENAER_PATH, 'utf8'));
    arenaer = arenaerData.arenaer || [];
  } catch (e) {
    console.error('Kunne ikke lese data/arenaer.json:', e.message);
    process.exit(1);
  }
  const sistOppdatert = arenaerData.meta && arenaerData.meta.oppdatert
    ? arenaerData.meta.oppdatert
    : new Date().toISOString().slice(0, 10);

  const arena = arenaer.find((a) => a.slug === slug);
  if (!arena) {
    console.error('Arena ikke funnet:', slug);
    process.exit(1);
  }

  const n = arena.navn;
  const bySlug = BY_TO_SLUG[arena.by] || arena.by.toLowerCase()
    .replace(/\s/g, '-').replace(/ø/g, 'o').replace(/å/g, 'a').replace(/æ/g, 'ae');
  const depth = 3;
  const basePath = '../'.repeat(depth);
  const nettside = arena.nettside || '#';
  const adresse = arena.adresse || '';
  const cap = arena.kapasitet_tekst || (arena.kapasitet ? `ca. ${Number(arena.kapasitet).toLocaleString('nb-NO')}` : '');
  const capSittende = arena.kapasitet_sittende_tekst || '';
  const aretApnet = arena.aret_apnet ? String(arena.aret_apnet) : '';
  const parkering = arena.parkering || 'Begrenset parkering i nærheten. Se arenaens nettside for oppdatert info.';
  const kollektiv = arena.kollektiv || 'Se kollektivtilbud i området.';
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

  const metaDesc = `Komplett guide til ${n} i ${arena.by}: parkering, kollektivtransport, beste sitteplasser og insidertips. Alt du trenger å vite som konsertgjest – oppdatert ${sistOppdatert.slice(0, 4)}.`;
  const metaTitle = `${n} – Parkering, beste sitteplasser og insidertips | Konserter i Norge`;

  // ===== VENUE STATS =====
  const statsHtml = (() => {
    const items = [
      { val: cap, label: 'Kapasitet' },
      capSittende ? { val: capSittende, label: 'Kapasitet sittende' } : null,
      aretApnet ? { val: aretApnet, label: 'Åpnet' } : null,
      { val: escapeHtml(arena.by), label: 'Beliggenhet' },
    ].filter(Boolean);
    return items.map(i => `        <div class="venue-stat">
          <strong>${escapeHtml(i.val)}</strong>
          <span>${escapeHtml(i.label)}</span>
        </div>`).join('\n');
  })();

  // ===== PARKERING SECTION =====
  const parkeringsKort = arena.parkering_alternativer || [];
  let parkeringsKortHtml = '';
  if (parkeringsKort.length > 0) {
    parkeringsKortHtml = `\n        <div class="tips-grid">\n` +
      parkeringsKort.map(p => `          <div class="tips-card">
            <div class="tips-card-header">
              <strong>${escapeHtml(p.navn)}</strong>
              <span class="tips-badge${p.naermest ? ' tips-badge--green' : ''}">${escapeHtml(p.avstand || '')}</span>
            </div>
            <p>${escapeHtml(p.beskrivelse)}</p>
            ${p.adresse ? `<p class="tips-meta">Adresse: ${escapeHtml(p.adresse)}</p>` : ''}
          </div>`).join('\n') +
      `\n        </div>`;
  } else {
    parkeringsKortHtml = `\n        <p>${escapeHtml(parkering)}</p>`;
  }

  // ===== KOLLEKTIVTRANSPORT CARDS =====
  const kollektivKort = arena.kollektiv_alternativer || [];
  let kollektivKortHtml = '';
  if (kollektivKort.length > 0) {
    kollektivKortHtml = `\n        <div class="kollektiv-cards">\n` +
      kollektivKort.map(k => `          <div class="kollektiv-card">
            <div class="kollektiv-icon">${k.ikon || '🚇'}</div>
            <div>
              <strong>${escapeHtml(k.navn)}</strong>
              <p>${escapeHtml(k.beskrivelse)}</p>
            </div>
          </div>`).join('\n') +
      `\n        </div>`;
  } else {
    kollektivKortHtml = `\n        <div class="kollektiv-cards">
          <div class="kollektiv-card">
            <div class="kollektiv-icon">🚌</div>
            <div>
              <strong>Kollektivtransport til ${escapeHtml(n)}</strong>
              <p>${escapeHtml(kollektiv)} Sjekk <a href="${escapeHtml(kollektivInfo.url)}" target="_blank" rel="noopener">${escapeHtml(kollektivInfo.navn)}</a> for avganger.</p>
            </div>
          </div>
        </div>`;
  }

  // ===== SITTEPLASSGUIDE =====
  const sitteplasserGuide = arena.sitteplasser_guide || [
    { rating: '⭐⭐⭐⭐⭐ Anbefalt', klasse: 'top', navn: 'Midtbalkongen / sentrale plasser', tekst: `De beste plassene for de fleste konserter i ${n}. God oversikt over scenen og god lyd. Midtre rader gir det beste totalperspektivet. Sjekk salkart nøye og unngå ytterste hjørner.` },
    { rating: '⭐⭐⭐⭐ Bra', klasse: 'good', navn: 'Gulvet (stående, fremre felt)', tekst: `For deg som vil ha konsertatmosfæren tett på. Kom tidlig for å stå fremme. Forbered deg på tranghet og varme – komfortable sko og klær du tåler å svette i er et must.` },
    { rating: '⭐⭐⭐⭐ Bra', klasse: 'good', navn: 'Sideplasser i balkong', tekst: `Godt alternativ som gir et annerledes perspektiv på scenen. Velg midtre rader for best sikt. Unngå bakre hjørner der siktlinjen kan bli begrenset.` },
    { rating: '⭐⭐⭐ OK', klasse: 'ok', navn: 'Øverste seksjon / galleri', tekst: `Billigste alternativ med god total oversikt. Lyden er ofte overraskende god. Scenen kan virke langt unna, men det er et godt valg om du prioriterer lydopplevelsen.` },
    { rating: '⚠️ Unngå', klasse: 'avoid', navn: 'Bak lydmikseren', tekst: `Lydbordet plasseres midt i salen. Plasser direkte bak er markert «begrenset sikt» hos billettselger. Unngå disse med mindre prisen er vesentlig lavere.` },
  ];

  const sitteplasserHtml = sitteplasserGuide.map(s => `          <div class="sitteplasser-card sitteplasser-card--${s.klasse}">
            <div class="sitteplasser-rating">${escapeHtml(s.rating)}</div>
            <strong>${escapeHtml(s.navn)}</strong>
            <p>${escapeHtml(s.tekst)}</p>
          </div>`).join('\n');

  // ===== INSIDERTIPS =====
  const insidertips = arena.insidertips || [
    { tittel: 'Kom tidlig – dørene åpner 1–1,5 time før show', tekst: `Garderobeplassen er begrenset og køen kan bli lang. Ankommer du tidlig, leverer du yttertøy og rekker en runde ved baren uten kø. Billettscanning går raskere jo tidligere du dukker opp.` },
    { tittel: 'Sjekk blokk og inngang på billetten', tekst: `${n} kan ha innganger på flere sider. Blokk og seksjon på billetten bestemmer hvilken inngang du skal til. Feil inngang gir unødvendig kø og irritasjon.` },
    { tittel: 'Ta med musikerørepropper', tekst: `Store konserter kan nå 105–110 dB. Musikerørepropper (f.eks. Alpine MusicSafe) demper jevnt uten å ødelegge lydbildet – du hører faktisk klarere. En god investering som beskytter hørselen.` },
    { tittel: 'Bestill ekstra drikke tidlig i showet', tekst: `I pausen er det lang kø i baren. Bestill en ekstra runde kort etter at showet begynner, mens alle er fokusert på scenen. Spar deg for 15–20 minutters venting.` },
    { tittel: 'Kompakt veske og vannflaske', tekst: `Store ryggsekker sjekkes grundig og kan bli avvist ved inngangen. Ta med en kompakt veske. En forseilet vannflaske er vanligvis tillatt – sjekk arenaens regler på forhånd.` },
    { tittel: 'Vent 15 minutter etter siste sang', tekst: `Alle på en gang gir trengsel i utgangen. Vent inne noen minutter etter showslutt og gå ut til en halvtom arena. Særlig viktig om du skal hente yttertøy eller ta kollektivt.` },
  ];

  const insidertipsHtml = insidertips.map(t => `          <li>
            <strong>${escapeHtml(t.tittel)}</strong>
            ${escapeHtml(t.tekst)}
          </li>`).join('\n');

  // ===== FAQ =====
  const faqItems = [
    { q: `Hva er kapasiteten i ${n}?`, a: `${n} har kapasitet for ${escapeHtml(capPhrase)} ved konserter. Kapasiteten varierer med sceneoppsett og type arrangement.`, id: 'faq-kapasitet' },
    { q: `Hvor ligger ${n}? ${n} adresse?`, a: `${n} adresse er ${escapeHtml(adresse)}, i ${escapeHtml(arena.by)}.`, id: 'faq-adresse' },
    { q: `Beste parkering ved ${n}? ${n} parkering`, a: `${escapeHtml(parkering)} Book gjerne parkeringsplass på forhånd via EasyPark for å sikre plass på konsertkveld. Kollektivtransport anbefales.`, id: 'faq-parkering', anker: 'parkering' },
    { q: `Kollektivtransport til ${n}? Buss til ${n} ${stedsnavn}`, a: `Kollektivtransport til ${n}: ${escapeHtml(kollektiv)} Sjekk <a href="${escapeHtml(kollektivInfo.url)}" target="_blank" rel="noopener">${escapeHtml(kollektivInfo.navn)}</a> for ruter og avgangstider.`, id: 'faq-kollektiv', anker: 'kollektivtransport' },
    { q: `Beste sitteplasser i ${n}? ${n} beste sitteplasser`, a: `Midtbalkongen eller sentrale plasser gir best oversikt og lyd i ${n}. Gulvet (stående) gir best atmosfære – kom tidlig for å stå fremme. Unngå plasser bak lydmikseren. Se vår <a href="#salkart">sitteplassguide</a>.`, id: 'faq-beste-sitteplasser', anker: 'beste-sitteplasser' },
    { q: `Salkart og innganger ${n} – hvilken inngang?`, a: `Hvilken inngang du skal bruke, fremgår av blokk og seksjon på billetten. Salkart vises interaktivt ved billettkjøp på Ticketmaster og Eventim.`, id: 'faq-salkart', anker: 'salkart' },
    { q: `Hvor kjøper jeg billetter til ${n}? ${n} billetter`, a: `${n} billetter kjøpes hos <a href="${ticketPath}">Ticketmaster</a> og <a href="${eventimPath}">Eventim</a>. Velg digitale billetter på mobil – enklest og tryggst. Vær kritisk ved videresalg da priser er ofte oppblåste.`, id: 'faq-billetter' },
    { q: `${n} konserter – hvor ser jeg program og billetter?`, a: `${n} konserter og program finner du på <a href="${escapeHtml(nettside)}" target="_blank" rel="noopener">${escapeHtml(n)}s offisielle nettside</a> og hos Ticketmaster og Eventim.`, id: 'faq-konserter' },
    { q: `Konserter i ${n} 2026? ${n} 2026`, a: `${n} er i aktiv drift med konserter jevnlig gjennom året. Program for 2026 oppdateres løpende hos billettselgerne. Sjekk Ticketmaster og Eventim regelmessig for nye annonserte konserter.`, id: 'faq-2026', anker: 'program-2026' },
    { q: `Blir ${n} revet? ${n} rives`, a: `Per 2026 er ${n} i full drift som konsertarena. Det er ingen kjente planer om riving. Arenaen gjennomgår løpende oppgraderinger.`, id: 'faq-rives', anker: 'rives' },
    { q: `${n} kryssord – hva betyr det?`, a: `«${n}» betegner konsert- og eventarenaen i ${escapeHtml(arena.by)} med adresse ${escapeHtml(adresse)}. Arenaen er et vanlig svar i norske kryssord.`, id: 'faq-kryssord', anker: 'kryssord' },
    { q: `Ombygging av ${n}? ${n} ombygging`, a: `${n} gjennomgår løpende vedlikehold og oppgraderinger. Per 2026 er arenaen i full drift. Ingen kjente større ombyggingsplaner er annonsert.`, id: 'faq-ombygging', anker: 'ombygging' },
  ];

  const faqHtml = faqItems.map((item) => {
    const ddId = item.anker || item.id;
    const controlId = item.id.replace('faq-', '');
    return `          <div class="faq-item">
            <dt><button type="button" class="faq-question" aria-expanded="false" aria-controls="${escapeHtml(ddId)}" id="faq-q-${escapeHtml(controlId)}">${escapeHtml(item.q)}</button></dt>
            <dd id="${escapeHtml(ddId)}" role="region" aria-labelledby="faq-q-${escapeHtml(controlId)}">${item.a}</dd>
          </div>`;
  }).join('\n');

  const faqSchemaItems = faqItems.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&') },
  }));

  // ===== SCHEMA =====
  const placeSchema = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: n,
    description: `Konsert- og eventarena i ${arena.by}. Kapasitet ${cap}. Adresse, parkering, transport, billetter og insidertips.`,
    address: { '@type': 'PostalAddress', streetAddress: adresse.split(',')[0] || adresse, addressLocality: arena.by, addressCountry: 'NO' },
    url: nettside.startsWith('http') ? nettside : undefined,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Hjem', item: SITE_URL + '/' },
      { '@type': 'ListItem', position: 2, name: 'Byer', item: SITE_URL + '/byer/' },
      { '@type': 'ListItem', position: 3, name: arena.by, item: SITE_URL + '/byer/' + bySlug + '/' },
      { '@type': 'ListItem', position: 4, name: n, item: pageUrl },
    ],
  };

  // ===== SILO (andre arenaer i samme by) =====
  const andreArenaer = arenaer.filter((a) => a.by === arena.by && a.slug !== slug).slice(0, 4);
  let siloHtml = '';
  if (andreArenaer.length > 0) {
    siloHtml = `
      <section class="venue-silo" aria-labelledby="silo-heading" style="margin-top:4rem;padding-top:2rem;border-top:1px solid var(--border);">
        <h2 id="silo-heading">Andre konsertscener i ${escapeHtml(arena.by)}</h2>
        <div class="card-grid">
          ${andreArenaer.map((a) => `<article class="card">
            <h3><a href="../${a.slug}/">${escapeHtml(a.navn)}</a></h3>
            <p class="card-meta">${a.kapasitet_tekst ? 'Kapasitet: ' + escapeHtml(a.kapasitet_tekst) : escapeHtml(a.by)}</p>
          </article>`).join('')}
        </div>
      </section>`;
  }

  // ===== FULL HTML =====
  const html = `<!DOCTYPE html>
<html lang="no">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${escapeHtml(metaDesc)}">
  <meta name="robots" content="index, follow">
  <title>${escapeHtml(metaTitle)}</title>
  <link rel="canonical" href="${pageUrl}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:title" content="${escapeHtml(n)} – Parkering, beste sitteplasser og insidertips">
  <meta property="og:description" content="${escapeHtml(metaDesc)}">
  <meta property="og:image" content="${OG_IMAGE}">
  <meta property="og:site_name" content="Konserter i Norge">
  <meta property="og:locale" content="nb_NO">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(n)} – Parkering, beste sitteplasser og insidertips">
  <meta name="twitter:description" content="${escapeHtml(metaDesc)}">
  <meta name="twitter:image" content="${OG_IMAGE}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${basePath}css/style.css">
  <script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqSchemaItems }).replace(/</g, '\\u003c')}</script>
  <script type="application/ld+json">${JSON.stringify(placeSchema).replace(/</g, '\\u003c')}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c')}</script>
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
      <p class="text-muted" style="margin-top:-0.5rem;margin-bottom:1rem;font-size:0.9rem;">Sist sjekket mot offisielle kilder: ${sistOppdatert}</p>

      <div class="venue-stats">
${statsHtml}
      </div>

      <p class="lead">${escapeHtml(n)} er en av ${escapeHtml(arena.by)}s ledende konsertarenaer med kapasitet for ${escapeHtml(capPhrase)}. Denne guiden gir deg alt du trenger å vite som konsertgjest: parkering, transport, hvilke plasser som er best og hacks fra erfarne konsertgjengere.</p>

      <nav class="venue-quicknav" aria-label="Hopp til seksjon">
        <a href="#adresse">Adresse og info</a>
        <a href="#parkering">Parkering</a>
        <a href="#kollektivtransport">Kollektivtransport</a>
        <a href="#salkart">Beste sitteplasser</a>
        <a href="#insidertips">Insidertips</a>
        <a href="#faq">Spørsmål og svar</a>
      </nav>

      <!-- ADRESSE OG INFO -->
      <section class="venue-fakta" id="adresse" aria-labelledby="fakta-heading">
        <span class="section-badge">Praktisk info</span>
        <h2 id="fakta-heading">Adresse og adkomst</h2>
        <div class="venue-map-wrap">
          <div class="venue-map-left">
            <dl class="venue-dl">
              <dt>Adresse</dt>
              <dd>${escapeHtml(adresse)}. Arenaen ligger i ${escapeHtml(arena.by)}.</dd>

              <dt>Inngang</dt>
              <dd>Hvilken inngang du skal bruke, fremgår av blokk og seksjon på billetten. Sjekk billetten nøye – feil inngang gir unødvendig kø.</dd>

              <dt id="billetter">Billetter</dt>
              <dd>Kjøp billetter fra autoriserte selgere som <a href="${ticketPath}">Ticketmaster</a> og <a href="${eventimPath}">Eventim</a>. Digitale billetter på mobil er enklest og tryggst. Vær kritisk ved kjøp i annenhåndsmarkedet – priser er ofte sterkt oppblåste.</dd>

              <dt id="salkart">Salkart</dt>
              <dd>Interaktivt salkart vises ved billettkjøp på Ticketmaster og Eventim. Zoom inn på seksjonen du vurderer og sjekk om plassen er merket «begrenset sikt».</dd>
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

      <!-- PARKERING -->
      <section class="venue-fakta" id="parkering" aria-labelledby="parkering-heading">
        <span class="section-badge">Parkering</span>
        <h2 id="parkering-heading">Parkering ved ${escapeHtml(n)}</h2>
        <p>Kollektivtransport anbefales på konsertkveld – parkeringsplasser i nærheten fylles raskt. Må du kjøre, book plass på forhånd.${parkeringsKortHtml}
        <div class="tips-hack">
          <span class="tips-hack-icon">💡</span>
          <div>
            <strong>Book på forhånd og vent ut rushen:</strong> Bruk <strong>EasyPark-appen</strong> for å reservere parkeringsplass – slipper å sirkulere rundt på jakt etter ledig plass. Etter store konserter kan det ta 20–40 min å komme ut av p-hus. Vent inne til trengsel letter.
          </div>
        </div>
      </section>

      <!-- KOLLEKTIVTRANSPORT -->
      <section class="venue-fakta" id="kollektivtransport" aria-labelledby="kollektiv-heading">
        <span class="section-badge">Kollektivtransport</span>
        <h2 id="kollektiv-heading">Kollektivtransport til ${escapeHtml(n)}</h2>
        <p>Kollektivt er det smarteste valget – du slipper parkering og kø, og det er enkelt å komme seg hjem etter konserten.${kollektivKortHtml}
        <div class="tips-hack">
          <span class="tips-hack-icon">💡</span>
          <div>
            <strong>Etter konserten:</strong> Kollektivtrafikken kan bli overbelastet rett etter store konserter. Vent noen minutter inne eller gå til et alternativt stoppested. Last ned <a href="${escapeHtml(kollektivInfo.url)}" target="_blank" rel="noopener">${escapeHtml(kollektivInfo.navn)}s app</a> på forhånd og sjekk avganger i sanntid.
          </div>
        </div>
      </section>

      <!-- BESTE SITTEPLASSER -->
      <section class="venue-fakta" id="salkart" aria-labelledby="sitteplasser-heading">
        <span class="section-badge">Beste sitteplasser</span>
        <h2 id="sitteplasser-heading">Beste sitteplasser i ${escapeHtml(n)}</h2>
        <p>De fleste plasser i ${escapeHtml(n)} har god sikt, men det er klare forskjeller mellom seksjonene. Her er guiden:</p>
        <div class="sitteplasser-grid">
${sitteplasserHtml}
        </div>
        <div class="tips-hack">
          <span class="tips-hack-icon">💡</span>
          <div>
            <strong>Bruk salkart aktivt:</strong> Ticketmaster og Eventim viser interaktivt salkart ved billettkjøp. Zoom inn og sjekk om plassen er merket «begrenset sikt» før du kjøper. For stående konserter gjelder fri plassering på gulvet – kom tidlig for å stå fremst.
          </div>
        </div>
      </section>

      <!-- INSIDERTIPS -->
      <section class="venue-fakta" id="insidertips" aria-labelledby="tips-heading">
        <span class="section-badge">Insidertips</span>
        <h2 id="tips-heading">Hacks og tips til ${escapeHtml(n)}</h2>
        <p>Disse tipsene lærer erfarne konsertgjengere seg på den harde måten:</p>
        <ul class="tips-list">
${insidertipsHtml}
        </ul>
      </section>

      <!-- FAQ -->
      <section class="venue-faq" id="faq" aria-labelledby="faq-heading">
        <span class="section-badge">Vanlige spørsmål</span>
        <h2 id="faq-heading">Spørsmål og svar om ${escapeHtml(n)}</h2>
        <dl class="faq-list">
${faqHtml}
        </dl>
      </section>
${siloHtml}
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
        <img src="${basePath}images/footer-1.webp" width="280" height="180" alt="Konsert med scenelys" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=280&h=180&fit=crop'">
        <img src="${basePath}images/footer-2.webp" width="280" height="180" alt="Livekonsert på festival" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=280&h=180&fit=crop'">
        <img src="${basePath}images/footer-3.webp" width="280" height="180" alt="Konsertpublikum og scene" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=280&h=180&fit=crop'">
        <img src="${basePath}images/footer-4.webp" width="280" height="180" alt="Festival med scene" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=280&h=180&fit=crop'">
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
