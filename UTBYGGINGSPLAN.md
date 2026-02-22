# Utbyggingsplan – Konserter i Norge

**Sist oppdatert:** 22. februar 2026 (By-gullstandard etablert, alle Oslo/Bergen venues ferdig med støtteartikler)  
**Prosjektmappe:** `c:\Users\Fredrik\.cursor-tutor\konserterinorge\`

---

## Overordnet status

Prosjektet er en statisk HTML/CSS/JS-nettside. All kode befinner seg i prosjektmappen over.
Designsystem og regler finnes i `.cursor/rules/konserterinorge-design.mdc`.
Universell artikkelmal finnes i `_ARTIKKEL-MAL.html`.

### Prosjektets SEO-regler (fra Parkteatret-erfaringen)
Disse gjelder **alle** nye sider og skal sjekkes mot `_ARTIKKEL-MAL.html`:
- **Title-tag:** Maks 60 tegn *inkludert* " | Konserter i Norge"
- **H1 på hoveddokumentet:** Må inneholde bynavnet (f.eks. "i Oslo")
- **Schema.org Article image:** Skal alltid være `ImageObject` med `url`, `width` og `height` – aldri bare en string-URL
- **datePublished og dateModified:** Konsistente ISO 8601-datoer. Sett `dateModified` lik `datePublished` med mindre siden er oppdatert
- **info-cards:** Alltid partall (2, 4, 6)
- **insider-grid:** Alltid partall (8 eller 10)
- **Øl:** Alltid "0,4-liters" – aldri "halvliter"
- **Bilder:** Alltid fra Wikimedia Commons med CC-lisens. 1280px-thumbnail-URL

---

## Faserekkefølge

```
FASE 1:  Oslo – Venues          ✅ FERDIG
FASE 2:  Bergen – Venues        ← PÅGÅR NÅ
FASE 3:  Billettselskaper
FASE 4:  Festivaler
FASE 5:  Turneer
FASE 6:  Artister
```

---

## By-Gullstandard – Felles krav for alle bysider

Basert på sammenligning av `byer/oslo/index.html` (859 linjer, 8 FAQ) og `byer/bergen/index.html` (806 linjer, 10 FAQ) i feb 2026. Begge sider er strukturelt identiske og anses som gullstandarden.

### Obligatorisk seksjonsrekkefølge (alle bysider)

1. **Intro** (`section-badge` + H2 om byens konsertscene) – 2–3 avsnitt + stats
2. **Oversikt** – Alle konsertscener med cards (kapasitet, sjanger, adresse i meta)
3. **Sammenligning** – Tabell med kapasitet, pris, sesong, kjøretid fra sentrum
4. **Sjanger** – Scener gruppert etter musikksjanger (minst 4 sjangre)
5. **Transport** – Kollektivtransport generelt + parkeringstips for byen
6. **Insidertips** – 10 insidertips i `insider-grid` (alltid 10, partall)
7. **Barn og unge** – Familievennlige venues og tips
8. **Gratis konserter** – Gratis konsertmuligheter i byen
9. **FAQ** – Minimum 8 spørsmål i FAQPage-schema

### Obligatoriske schema-typer (alle bysider)

- `FAQPage` med min. 8 spørsmål
- `Article` med `ImageObject` (url + width + height)
- `BreadcrumbList` (Hjem → Byer → [By])

### Faste krav

- **Title-tag:** Maks 60 tegn inkl. " | Konserter i Norge". Format: "Konserter i [By] – [X] scener og tips | Konserter i Norge"
- **H1:** Skal inneholde bynavnet + "konsert" e.l. (lokal SEO)
- **Meta description:** 150–160 tegn med antall scener og nøkkelfakta
- **Forfatterboks:** Alltid inkludert (EEAT)
- **Verified badge + lesetid** i hero-seksjonen
- **Insider-grid:** Alltid 10 tips (10 = partall ✓)
- **Canonical URL:** Alltid satt

### Avvik mellom Oslo og Bergen (per feb 2026)

| Krav | Oslo | Bergen |
|---|---|---|
| Seksjoner | 9 ✅ | 9 ✅ |
| FAQPage | 8 ✅ | 10 ✅ Bergen har 2 ekstra |
| Article schema | ✅ | ✅ |
| BreadcrumbList | ✅ | ✅ |
| Forfatterboks | ✅ | ✅ |
| Linjer | 859 | 806 |

**Konklusjon:** Bergen-siden er litt kortere (53 linjer), men har litt mer i FAQ-schema. Begge anses som godkjente etter gullstandarden over. For fremtidige byer: bruk Bergen-siden som mal (nyere kode + litt mer FAQ).

---

## FASE 1 – Oslo Venues ✅ FERDIG

### Ferdige Oslo-venues med alle støtteartikler

| Venue | Hoveddok | Støtteartikler |
|---|---|---|
| Oslo Spektrum | ✅ | salkart/, transport/ (basert på filstruktur) |
| Unity Arena | ✅ | salkart/, transport/, hotell/, historikk/, handball/, priser/ |
| Rockefeller Music Hall | ✅ | salkart/, transport/, hotell/, teknikk/ |
| Sentrum Scene | ✅ | salkart/, transport/, hotell/ |
| John Dee Live Club | ✅ | salkart/, transport/, hotell/ |
| Parkteatret | ✅ | salkart/, transport/, hotell/ |
| Blå | ✅ | – |
| Oslo Konserthus | ✅ | salkart/, transport/ |
| Operaen | ✅ | salkart/, transport/, parkering/, dresscode/ |
| Bjerke Travbane | ✅ | salkart/, transport/ |
| Voldsløkka | ✅ | transport/ |

### Oslo-venues som IKKE er i byer/oslo/index.html (Slett eller behold?)
- `byer/oslo/bla/` – Er lagt inn i oversikten, men sjekk innholdskvalitet

### Oslo-venues som mangler (kandidater til fremtiden)
- Ulleval Stadion / Bislett Stadion (kan bli aktuelt)

---

## FASE 2 – Bergen Venues ← PÅGÅR NÅ

### Venues i Bergen (prioritert rekkefølge)

| Venue | Kapasitet | Status | Mappe |
|---|---|---|---|
| Grieghallen | 1 638 | ✅ Ferdig | `byer/bergen/grieghallen/` – salkart/, parkering/, historikk/, transport/ |
| Ole Bull Scene | ~800 | 🔨 Under arbeid | `byer/bergen/ole-bull-scene/` |
| USF Verftet | ~600 | 🔨 Under arbeid | `byer/bergen/usf-verftet/` |

### Workflow for Bergen-venues
Bruk samme tilnærming som Oslo:
1. Les `_ARTIKKEL-MAL.html` og `konserterinorge-design.mdc`
2. Gullstandard: `byer/oslo/sentrum-scene/index.html` (hoveddok) og `byer/oslo/john-dee/salkart/index.html` (støtteartikkel)
3. Longtail keyword research: seed "[venue] bergen" og "[venue] konsert"
4. Opprett mappe under `byer/bergen/[venue-slug]/`
5. Bygg `hoveddokument/index.html` + `innholdsplan.md`
6. **Bygg støtteartikler umiddelbart** – alle søkeordklynger fra innholdsplanen som bekrefter søkeintensjon skal ha en støtteartikkel. Ikke utsett til neste chat. Typiske kandidater per venue: `salkart/`, `parkering/`, `historikk/`, `transport/`
7. Kjør standard sjekkliste (tittel maks 60 tegn, H1 med "Bergen", partall info-cards osv.)

### Når en Bergen-venue er ferdig – oppdater disse filene:
1. **`robots.txt`** – Bergen er **IKKE blokkert** (verifisert feb 2026). Ingen `Disallow: /byer/bergen/` i robots.txt. Bergen er allerede åpen for crawling. ✅ Ingen handling nødvendig.
2. **`sitemap.xml`** – Legg til URL-er for Bergen-sider med `<lastmod>`.
3. **`byer/bergen/index.html`** – Oppdater venue-kortet med korrekt kapasitet og beskrivelse.

---

## FASE 3 – Billettselskaper

### Status
Det finnes allerede mapper og delvis innhold fra en tidligere runde:

| Billettselskap | Status | Mappe |
|---|---|---|
| Ticketmaster | Delvis | `billettselskaper/ticketmaster/` |
| Eventim | Delvis | `billettselskaper/eventim/` |
| Ticketco | Delvis | `billettselskaper/ticketco/` |
| Tikkio | Delvis | `billettselskaper/tikkio/` |
| StubHub | Delvis | `billettselskaper/stubhub/` |
| Viagogo | Delvis | `billettselskaper/viagogo/` |
| Tise | Delvis | `billettselskaper/tise/` |

### Hva skal gjøres i Fase 2
1. Kjør longtail-keyword-research på hvert billettselskap (f.eks. "ticketmaster norge", "eventim norge")
2. Erstatt eksisterende innhold med det nye designsystemet (samme mal som Oslo-venues)
3. Prioriter Ticketmaster og Eventim (størst volum) – resten er sekundært
4. Oppdater `billettselskaper/index.html` med cards til alle ferdige sider
5. Lag innholdsplan.md for hele seksjonen

### Workflow for hvert billettselskap
Bruk samme tilnærming som Parkteatret:
1. Longtail keyword research (seed: "[billettselskap] norge" + "[billettselskap] billetter")
2. Faktasjekk: gebyrer, betalingsmetoder, kundestøtte, kjøps-/byttevilkår
3. Bilde fra Wikimedia (logo er sannsynligvis ikke CC-lisens – bruk konsertbilde i stedet)
4. Skriv ny index.html med fullstendig designsystem
5. Vurder støtteartikler: f.eks. "slik sender du billetter på Ticketmaster"

---

## FASE 4 – Festivaler

### Status
Det finnes allerede en `festivaler/`-mappe med mange festivaler (ser ut til å være auto-generert med eldre format). **Kvaliteten er sannsynligvis ikke god nok og bør erstattes.**

### Tilnærming
- Start med de største norske festivalene (Øyafestivalen, Findings, Bergenfest, Pstereo osv.)
- Kjør longtail keyword research per festival
- Vurder om de minste festivalene skal ha egne sider eller samles i lister

---

## FASE 5 – Turneer

### Status
`turneer/index.html` eksisterer. Innhold ukjent.

### Tilnærming
- Turneer er tidssensitivt innhold – vurder nøye hvilken strategi som gir varig SEO-verdi
- Fokuser på tidløse, generiske "turne-guider" fremfor artist-spesifikke turneesider

---

## FASE 6 – Artister

### Status
`artister/index.html` eksisterer. Innhold ukjent.

### Tilnærming
- Artister er svært tidssensitivt – dette er sannsynligvis den mest krevende fasen
- Kan vurdere "statiske" artistprofiler med fokus på artistens historikk i Norge (ikke dato-basert)

---

## Andre byer (Fremtiden)

| By | Status |
|---|---|
| Bergen | 🔨 Under arbeid – se Fase 2 |
| Trondheim | Delvis – Trondheim Spektrum, Olavshallen |
| Stavanger | Delvis – DNB Arena, Stavanger Konserthus |
| Tønsberg | Tom mappe |
| Ålesund | Tom mappe |
| Tromsø | Tom mappe |
| Kristiansand | Tom mappe |

---

## Lanseringsplan ("Soft Launch")

### Strategi
- Kun ferdige Oslo-venues og billettselskaper er synlige for Google
- Alt annet er skjult via CSS-klassen `.draft` og blokkert i `robots.txt`
- Filene eksisterer fortsatt lokalt – kun du kan se dem via `localhost` eller Cursor

### Filer som må opprettes ved lansering
- [ ] `robots.txt` – blokker alle uferdige seksjoner
- [ ] `sitemap.xml` – kun ferdige Oslo-venues
- [ ] Google Analytics 4 script inn i alle HTML-filer
- [ ] Google Search Console verifisering (TXT-record på domenet)

### Anbefalt hosting
- Netlify, Vercel eller Cloudflare Pages (statisk hosting, gratis SSL)
- Koble til GitHub-repo for enkel opplasting ved endringer

---

## Slik starter du en ny chat med kontekst

Lim inn følgende i toppen av en ny chat:

```
Les filen c:\Users\Fredrik\.cursor-tutor\konserterinorge\UTBYGGINGSPLAN.md
for å forstå prosjektets status og neste oppgave.

Les deretter .cursor/rules/konserterinorge-design.mdc og _ARTIKKEL-MAL.html
for å forstå designsystemet og reglene.

Gullstandard for venue-sider: byer/oslo/sentrum-scene/index.html
Gullstandard for støtteartikler: byer/oslo/john-dee/salkart/index.html
```

---

## Nyttige kommandoer og ressurser

- **Longtail keyword research:** `& "C:\Users\Fredrik\.cursor\skills\longtail-keyword-research\scripts\fetch-keywords.ps1" -Keyword "SØKEORD HER"` (krever `required_permissions: ["all"]`)
- **Bilder:** Alltid Wikimedia Commons, CC BY / CC BY-SA, 1280px-thumbnail-URL
- **Designguide:** `.cursor/rules/konserterinorge-design.mdc`
- **Artikkelmal:** `_ARTIKKEL-MAL.html`
