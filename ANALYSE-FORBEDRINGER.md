# Analyse: Konserter i Norge – kode, visuell, innhold, SEO og EEAT

Mål: Bli det ultimate stedet for konsertinformasjon i Norge med sterk EEAT, bedre og mer oppdatert informasjon enn offisielle kilder, og toppranking på nøkkelord.

---

## 1. Kode og teknisk kvalitet

### Sterke sider
- Semantisk HTML (header, main, nav, section, article, dl/dt/dd for FAQ).
- ARIA brukt (aria-label, aria-expanded, aria-controls, role).
- Canonical, meta description og Open Graph på tvers av sider.
- Schema.org FAQPage og Place på forsiden og venue-sider.
- Felles CSS med variabler, mobilførst, sticky header.
- Ingen unødvendige avhengigheter; ren JS.

### Forbedringer
- **Sitemap mangler `lastmod`** – legg til `<lastmod>` for hver URL slik at Google ser oppdateringsfrekvens. Scriptet `oppdater-sitemap-venuer.js` kan utvides til å sette lastmod.
- **Ingen WebSite- eller Organization-schema på forsiden** – legg til `WebSite` med `potentialAction` (SearchAction) for søkeboks, og `Organization` med navn, URL og evt. logo. Styrker EEAT og søkeboks i SERP.
- **Bilder** – alle bruker eksterne URL-er (Unsplash). Vurder å hoste egne bilder (eller fallback) under `/images/` for raskere lasting og uavhengighet; behold alt-tekst og `loading="lazy"`.
- **Fonts** – preconnect er satt; vurder `font-display: swap` (allerede i URL med `display=swap`). OK som det er.
- **arenaer.json** – `meta.oppdatert` står som "2025-02-17"; oppdater til gjeldende år (2026) og hold det jevnlig oppdatert for EEAT.

---

## 2. Visuell og UX

### Sterke sider
- Ryddig layout, tydelig hierarki, accent-farge (gul) og konsistent knappestil.
- Mobilmeny, tema (lys/mørk), scroll-til-topp.
- Kort og lesbare kort (byer, arenaer, festivaler).

### Forbedringer
- **«Uavhengig redaksjon»** i stat-strip – underbygg visuelt: f.eks. kort «Om oss»-tekst eller «Slik jobber vi» med oppdateringsdato.
- **Trust-signaler** – vurder én setning i hero eller footer om at info sjekkes mot offisielle kilder og oppdateres (dato), for EEAT og tillit.
- **CTA** – på by-/festival-sider: tydelig primær knapp «Se program og billetter» som lenker til arenaens/festivalens nettside.
- **Footer** – full footer med bilder og lenker er bra; sørg for at «Om oss» og «Kontakt» alltid er synlige.

---

## 3. Innholdskvalitet og oppdaterthet

### Sterke sider
- Venue-sider (f.eks. Oslo Spektrum, Unity Arena) har konkret praktisk info, FAQ med long-tail og Place + FAQPage schema.
- Forsiden har mange FAQ, tydelig struktur og lenker til undernivå.

### Svakheter og forbedringer
- **Festival-sider** – mye generisk tekst: «Festivalen arrangeres vanligvis i Varierende», «Nøyaktig dato publiseres på festivalens offisielle nettside». For store festivaler (Øya, Slottsfjell, Bergenfest, Tons of Rock): skriv **konkrete datoer, sted og kort beskrivelse** (1–2 avsnitt) slik at dere er bedre enn én linje på offisielle sider. Erstatt «Varierende» med faktisk måned når det finnes.
- **By-sider** – Oslo har god beskrivelse; andre byer (Tønsberg, Kristiansand, Tromsø, Ålesund) har bare én generisk setning. Utvid med 2–3 setninger om konsertmiljøet og hvilke arenaer som dominerer.
- **Om oss** – er veldig kort. For EEAT: utvid til 3–5 avsnitt: hvem som står bak, hvorfor dere lager siden, hvordan info oppdateres (kilder, frekvens), og at målet er å samle alt på ett sted. Legg gjerne inn «Sist oppdatert: [dato]».
- **Ingen synlige oppdateringsdatoer** – på viktige sider (forside, Om oss, kanskje venue): vurder «Sist oppdatert: …» (evt. i footer eller under H1). Signaliser ferskhet for både brukere og Google.
- **Arena-data** – `arenaer.json` har gode felter; sjekk at alle har korrekt og full kollektivtekst (ingen avkortinger). Oslo Spektrum sin kollektivtekst ser komplett ut.

---

## 4. SEO

### Sterke sider
- Gode titler og meta descriptions med nøkkelord.
- Long-tail dekkes i FAQ og i teksten på venue-sider (adresse, parkering, kapasitet, salkart, rives, 2026, ombygging, kryssord).
- `dekkes_av` i longtail-nokkelord.json peker til ankre; nyttig for intern lenking.
- Sitemap.xml finnes og inkluderer viktige URL-er.

### Forbedringer
- **WebSite + SearchAction** – schema for søkefeltet på forsiden, for mulighet til søkeboks i SERP.
- **BreadcrumbList** – schema for brødsmule på alle undersider (by, venue, festival). Dere har allerede brødsmuler i HTML; legg til schema.
- **Sitemap lastmod** – som nevnt over.
- **Intern lenking** – på forsiden lenkes det godt til byer og arenaer. På venue-sider: vurder «Andre arenaer i Oslo» med 3–4 lenker. Tilsvarende for festivaler (samme region/sjanger).
- **H1-unikhet** – hver side har én H1; behold det. Unngå at H1 og title er helt identiske; la title være litt mer søkeoptimalisert.
- **Festival-URL-er** – sitemap har både `ypsilon` og `ypsilon-drammen`; sjekk at det ikke er duplikater eller at den kanoniske er riktig.

---

## 5. EEAT (Experience, Expertise, Authoritativeness, Trustworthiness)

### Hva som mangler eller kan styrkes
- **Experience** – «Vi har besøkt / sjekket …» eller «Våre kilder: arenaens nettside, Ruter, …» på 1–2 steder (f.eks. Om oss eller under parkering på venue).
- **Expertise** – Om oss kan nevne at teamet følger norsk konsert- og festivalmarked og samler praktisk info slik at brukeren slipper å søke på flere steder.
- **Authoritativeness** – lenker til offisielle kilder (arena, Ruter, billettselskaper) er viktig; dere har det. Vurder å liste kilder eksplisitt på venue-sider (f.eks. «Kilder: Oslo Spektrum, Ruter, oppdatert [dato]»).
- **Trustworthiness** – tydelig Kontakt og Personvern; oppdatert personvernside. «Vi tar ikke betaling for billetter» er bra og bør stå tydelig (f.eks. i FAQ og evt. i footer).
- **Forfatter/redaksjon** – selv om det er «Konserter i Norge» som merke: én setning om at innholdet produseres og oppdateres av et redaksjonelt team (eller eier) øker tillit. Ingen brukerprofil nødvendig; «Vi» er nok.

---

## 6. Prioriterte tiltak (kort sikt)

| Prioritet | Tiltak | Effekt |
|-----------|--------|--------|
| 1 | **Om oss utvidet** – 3–5 avsnitt med hvem, hvorfor, hvordan oppdateres, kilder, «sist oppdatert». | EEAT, tillit |
| 2 | **WebSite + Organization schema** på forsiden + SearchAction for søk. | SEO, søkeboks |
| 3 | **Konkrete festivaldatoer/sted** for 5–10 store festivaler (Øya, Slottsfjell, Bergenfest, Tons of Rock, Palmesus); fjern «Varierende» der dere har fakta. | Innhold bedre enn konkurrenter |
| 4 | **BreadcrumbList-schema** på by-, venue- og festival-sider. | SEO |
| 5 | **«Sist oppdatert»** på forsiden og Om oss (synlig dato). | EEAT, ferskhet |
| 6 | **Sitemap lastmod** – script som setter lastmod ved generering/oppdatering. | Teknisk SEO |
| 7 | **Kort kildeliste** på venue-sider (arena, kollektiv, oppdatert). | EEAT |
| 8 | **Utvid by-tekst** for Tønsberg, Kristiansand, Tromsø, Ålesund (2–3 setninger hver). | Dybde, relevans |

---

## 7. Lengre sikt

- **Egen bildestruktur** – egne bilder for hovedarenaer/festivaler med god alt-tekst; reduser avhengighet av Unsplash.
- **Strukturert data for festivaler** – Event-schema der det finnes dato og sted.
- **Blogg/nyheter** – korte «Oppdateringer» (f.eks. ny arena, endret parkering) med dato understreker at siden holdes oppe.
- **Sammenligning med offisielle kilder** – for hver store arena: én linje «Sammenlignet med [arena] og [Ruter] [dato]» for å vise at dere faktisk sjekker.

---

## Oppsummering

- **Kode:** God semantikk og tilgjengelighet; legg til WebSite/Organization-schema, BreadcrumbList og lastmod i sitemap.
- **Visuell:** Allerede ryddig; styrk tillit med korte tekster om oppdatering og kilder.
- **Innhold:** Styrk festival- og by-sidene med konkrete fakta og lengre, unike tekster; utvid Om oss.
- **SEO:** Schema og intern lenking er på plass; komplett med WebSite, BreadcrumbList og lastmod.
- **EEAT:** Tydelig «hvem/hvorfor/hvordan», kilder, oppdateringsdato og at dere ikke selger billetter – gjør dere til det ultimate, troverdige stedet for konsertinfo i Norge.

Implementerer du disse stegene systematisk, vil nettsiden både kodemessig, visuelt og innholds messig stå sterkt og være godt posisjonert for å ranke øverst på nøkkelordene dere sikter til.
