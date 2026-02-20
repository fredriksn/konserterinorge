# Prompt: Bygg Rockefeller Music Hall fra scratch

Lim inn hele teksten under i en ny chat.

---

```
Du skal bygge ut konserterinorge.no-prosjektet for et nytt venue: Rockefeller Music Hall i Oslo.
Det eksisterer allerede en svak index.html i mappen – erstatt den fullstendig.
Gjør alt selv i rekkefølgen under uten å vente på bekreftelse. Spør kun om du støter
på faktapåstander du ikke finner bekreftet fra offisielle kilder.

## Prosjektkontekst
- Prosjektmappe: c:\Users\Fredrik\.cursor-tutor\konserterinorge\
- Designsystem og regler: Les .cursor/rules/konserterinorge-design.mdc før du begynner
- Gullstandard å modellere etter: byer/oslo/sentrum-scene/index.html og alle dens
  undersider (transport/, salkart/, hotell/)
- Artikkelmal: _ARTIKKEL-MAL.html
- Referanse for keyword-grupperingen: byer/oslo/unity-arena/innholdsplan.md
- Rockefeller-mappe: byer/oslo/rockefeller/ – erstatt index.html, opprett undermapper

## Steg 1 – Keyword-research og innholdsplan

Kjør longtail-keyword-analysen via Google Autocomplete (PowerShell-skript i scripts/-mappen).
Søk på "Rockefeller oslo" og "Rockefeller music hall".

### Slik behandler du resultatet:

1. **Grupper keywords i intensjonsklynger.** Mange keywords er varianter av samme spørsmål.
   Eksempler på forventede klynger:
   - "rockefeller oslo adresse", "adresse rockefeller" → klynge: [Adresse]
   - "rockefeller parkering", "parkering ved rockefeller" → klynge: [Parkering]
   - "rockefeller balkong", "rockefeller sitteplasser" → klynge: [Salkart/balkong]
   - "rockefeller rives", "blir rockefeller revet" → klynge: [Fremtid/riving]
   - "rockefeller kryssord" → klynge: [Kryssord]
   - "rockefeller ombygging" → klynge: [Ombygging]
   - "rockefeller vs sentrum scene" → klynge: [Sammenligning]

2. **For hver intensjonsklynge, bestem dekningsform:**
   - [SEKSJON] – viktig nok til egen navngitt seksjon i hoveddokumentet
   - [FAQ] – besvares som FAQ-spørsmål (niche-spørsmål, lav volum, eller ikke egnet for seksjon)
   - [ARTIKKEL:transport] / [ARTIKKEL:salkart] / [ARTIKKEL:hotell] – eget dybdeartikkel
   - [UTELATES] – artist-spesifikt, dato-basert eller irrelevant for tidløst innhold

3. **Mål: dekk ALLE klynger, ikke alle individuelle keywords.**
   Innenfor en klynge er det nok å svare godt én gang. FAQ er "catch-all" for alt
   som ikke passer inn i seksjoner – evergreen søk som "kryssord", "rives",
   "ombygging", "vs sentrum scene" er typiske FAQ-kandidater.

4. **Opprett byer/oslo/rockefeller/innholdsplan.md** med en tabell:

| Intensjonsklynge | Eksempel-keywords | Dekningsform |
|---|---|---|
| Adresse | rockefeller oslo adresse, rockefeller where | [SEKSJON] Adresse og adkomst |
| ... | ... | ... |

## Steg 2 – Mappestruktur
Opprett undermapper for alle støtteartikler fra innholdsplan.md.
Minimum: transport/, salkart/, hotell/.

## Steg 3 – Hoveddokument (index.html)

Erstatt byer/oslo/rockefeller/index.html fullstendig.
Modeller etter byer/oslo/sentrum-scene/index.html i struktur og CSS-klasser.

### Faktasjekk via WebSearch/WebFetch:
- Offisiell adresse og postnummer (trolig Torggata 16, 0181 Oslo – bekreft)
- Nøyaktig kapasitet (ståplass, sitteplass, total)
- Salsstruktur: Rockefeller har balkong – verifiser navn og kapasitet per etasje
- Nærmeste T-banestasjon(er) og nøyaktig gangavstand
- Driftsselskap (trolig Auditorium AS – bekreft)
- Bygningens historikk: tidligere bruk, åpningsår som konsertscene
- Er vegger/bygning fredet? Sjekk
- Aldersgrense, garderobe, veskeregler, vannflaske-regler
- Geo-koordinater (latitude/longitude) for Torggata 16
- Rockefeller Café – eksisterer det, hva tilbyr de?
- Nettsted (trolig rockefeller.no – bekreft)
- Wikipedia-lenke for sameAs-felt i schema

### Finn CC-lisensbilde fra Wikimedia Commons:
Søk "Rockefeller Music Hall Oslo Wikimedia Commons". Prioriter eksteriørbilde med
CC BY eller CC BY-SA lisens. Inkluder korrekt attribusjon i hero-footeren.
Finn også ett bilde per støtteartikkel.

### Obligatoriske seksjoner:
- Hero med venue-chips (kapasitet, type, årstall, bydel, T-bane-avstand)
- Sticky quicknav
- Adresse og adkomst (4 info-cards)
- Kollektivtransport (kollektiv-cards)
- Parkering (tips-grid, 3 kort)
- Salkart: balkong vs. gulv (4 info-cards)
- Insidertips (insider-grid, 10 kort)
- Mat og drikke inkl. Rockefeller Café (tips-grid, 3 kort)
- Garderobe og regler (6 info-cards)
- Historikk (4 info-cards)
- FAQ (minst 10 spørsmål – alle klynger markert [FAQ] i innholdsplan skal med)
- Forfatterboks
- Dybdeguider (lenker til undersider)
- Andre konsertscener i Oslo (lenker til oslo-spektrum/, sentrum-scene/, unity-arena/, parkteateret/)

### Keyword-coverage-sjekk etter hoveddokumentet:
Gå gjennom innholdsplan.md. For hvert keyword markert [SEKSJON] eller [FAQ]:
bekreft at det er naturlig integrert i teksten eller besvart som FAQ.
Legg til manglende FAQ-innslag heller enn å hoppe over klynger.

## Steg 4 – Støtteartikler
Bruk _ARTIKKEL-MAL.html som base for hver. Finn Wikimedia-bilde til hvert.
Interlenk alle til hverandre og til hoveddokumentet.

For hvert keyword markert [ARTIKKEL:X] i innholdsplan: bekreft at det er besvart
i riktig artikkel. Legg til manglende FAQ-innslag.

- **transport/index.html**: T-bane fra Stortinget og Jernbanetorget, buss, gange fra
  Oslo S, parkering, transport fra Gardermoen
- **salkart/index.html**: Balkong vs. gulv, beste plasser per konserttype,
  sittende arrangementer
- **hotell/index.html**: Hoteller i gangavstand med verifisert distanse (WebFetch),
  restauranter nær Torggata. FAQPage: minst 6 spørsmål.

## Steg 5 – UX-sjekkliste (alle filer)
- info-cards: ALLTID partall (2, 4, 6) – aldri 3 eller 5
- kollektiv-cards: brukes for lister med mye tekst, alltid én kolonne
- tips-grid: kun ved 3+ kort med kortere tekst
- insider-grid: ALLTID partall (8 eller 10) – aldri 9
- Schema.org på alle sider: Article + BreadcrumbList + FAQPage
- Hoveddokument i tillegg: MusicVenue-schema (ikke Place) med:
  - geo-koordinater (latitude/longitude)
  - maximumAttendeeCapacity
  - sameAs til Wikipedia
  - image
- Article schema image: ImageObject med url, width og height – ikke bare URL-string
- Title-tags: maks 60 tegn inkludert "| Konserter i Norge"
- H1 på hoveddokumentet: inneholder "Oslo" (f.eks. "Rockefeller Music Hall Oslo")
- datePublished og dateModified: 2026-02-20T08:00:00+01:00
- Bildeattribusjon i footer av hero-seksjon på alle sider
- Alle lenker er relative stier
- Øl refereres alltid som "0,4-liters" – ikke "halvliter"

## Steg 6 – Oppdater byer/oslo/index.html
Finn Rockefeller-kortet og oppdater card-meta med faktisk kapasitet og lokasjon,
f.eks. "Kapasitet: 1 350 · Balkong og gulv · Torggata".

## Steg 7 – Sluttsjekk (IKKE hopp over)
Åpne innholdsplan.md og gå gjennom alle klynger markert [SEKSJON], [FAQ], [ARTIKKEL:X].
Bekreft at alle er implementert. Legg til en seksjon "## Keyword-coverage-status"
i innholdsplan.md med status per klynge.

## Kvalitetskrav
- Ingen artist-spesifikt innhold – kun tidløs venue-info
- Norsk bokmål gjennomgående
- Alle faktapåstander verifisert via WebSearch/WebFetch
- Øl refereres alltid som "0,4-liters" – ikke "halvliter"
- Ingen ufullstendige seksjoner – hellere et kortere FAQ-svar enn ingenting
```
