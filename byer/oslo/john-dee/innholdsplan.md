# Innholdsplan – John Dee Live Club & Pub

Basert på Google Autocomplete-analyse (263 unike longtail-keywords, feb 2026).
Seed-keywords: "john dee" + "john dee oslo" + "john dee konsert".

**OBS:** Søk alltid på det korte seed-keywordet "john dee" (uten "live club oslo") for å
fange alle venue-relevante varianter. "john dee oslo" og "john dee konsert" brukes
i tillegg for å avdekke Oslo-spesifikke og konsertrelaterte underklynger.

---

## Keyword-klynger og dekningsform

| Intensjonsklynge | Eksempel-keywords | Dekningsform |
|---|---|---|
| Adresse / inngang | john dee adresse, john dee inngang, john dee oslo, john dee kart | [SEKSJON] Adresse og adkomst |
| Kapasitet / plasser | john dee kapasitet, john dee oslo kapasitet, john dee antall plasser, john dee plasser, john dee sitteplasser, john dee capacity | [SEKSJON] Salsstruktur + [ARTIKKEL:salkart] |
| Venue-identitet / hva er | john dee oslo norway, john dee ved rockefeller, john dee rockefeller oslo, john dee venue | [SEKSJON] Hero + FAQ |
| Transport | john dee oslo scene (kontekst: komme seg dit) | [SEKSJON] Kollektivtransport |
| Billetter | john dee billetter | [FAQ] |
| Program / hva skjer | john dee i dag, john dee i kveld, john dee fredag, john dee program, john dee konserter | [FAQ] → lenker til rockefeller.no |
| Sammenligning scener | john dee vs rockefeller, john dee sentrum scene | [FAQ] |
| Bar / mat | john dee bar | [SEKSJON] Mat og drikke |
| Garderobe / regler | john dee garderobe | [SEKSJON] Garderobe og regler |
| Utleie | leie john dee pris | [FAQ] |
| Kontakt | john dee kontakt | [FAQ] |
| Anmeldelser | john dee anmeldelser, john dee oslo anmeldelser | [FAQ] → lenker til Google Maps / Ticketmaster |
| Artister (evergreen) | john dee thundermother, john dee lemonheads, john dee tom waits, john dee ronny påbel | [UTELATES] – tidsbegrenset og artist-spesifikt |
| Bilder | john dee bilder, john dee oslo bilder | [UTELATES] – brukerrelatert, ikke egnet for statisk innhold |
| Historisk okkultist (John Dee) | john dee enochian, john dee crystal ball, john dee queen elizabeth | [UTELATES] – helt annet emne |

---

## Støtteartikler

### 1. Salkart og beste plasser i John Dee
**Keywords:** john dee oslo kapasitet, john dee oslo scene, john dee oslo capacity
**Fil:** `salkart/index.html`

### Transport
Keyword-volumet er for lavt til egen side. Lenker til Rockefeller-transportartikkelen (`../rockefeller/transport/`) i kollektivtransport-seksjonen.

---

## Keyword-coverage-status

Kontrollert mot index.html og salkart/index.html (feb 2026).

| Klynge | Implementert | Plassering |
|---|---|---|
| Adresse / inngang | ✅ | SEKSJON: Adresse og adkomst (4 info-cards), FAQ, hero-chips |
| Kapasitet / plasser | ✅ | SEKSJON: Salsstruktur (4 info-cards), ARTIKKEL: salkart/, hero-chips, FAQ |
| Venue-identitet / hva er | ✅ | SEKSJON: Hero + Historikk (4 info-cards), FAQ: «Hva er John Dee Oslo?» |
| Transport | ✅ | SEKSJON: Kollektivtransport (5 kollektiv-cards), lenke til Rockefeller-transportguide |
| Billetter | ✅ | FAQ: «Hvor kjøper jeg billetter til John Dee?» |
| Program / hva skjer | ✅ | FAQ: «Hva skjer på John Dee i dag / i kveld?» → lenker til rockefeller.no |
| Sammenligning scener | ✅ | FAQ: «Hva er forskjellen på John Dee og Rockefeller?» + «John Dee vs Sentrum Scene» |
| Bar / mat | ✅ | SEKSJON: Mat og drikke (tips-grid 3 kort) |
| Garderobe / regler | ✅ | SEKSJON: Garderobe og regler (6 info-cards), FAQ |
| Utleie | ✅ | FAQ: «Kan man leie John Dee til private arrangementer?» |
| Kontakt | ✅ | FAQ: «Hvordan kontakter jeg John Dee?» → rockefeller.no |
| Anmeldelser | ✅ | FAQ: «Hvor finner jeg anmeldelser av John Dee Oslo?» → lenker til Google Maps / Ticketmaster |
| Artister (evergreen) | ⛔ UTELATT | Tidsbegrenset og artist-spesifikt – ikke egnet for tidløst venue-innhold |
| Bilder | ⛔ UTELATT | Brukerrelatert innhold – ikke egnet for statisk side |
| Historisk okkultist | ⛔ UTELATT | Helt annet emne (John Dee 1527–1608) |

**Konklusjon:** Alle [SEKSJON]- og [FAQ]-klynger er implementert. Tre klynger er bevisst utelatt.

---

## UX-sjekkliste (verifisert)

| Element | Kontroll | Status |
|---|---|---|
| info-cards (index.html) | Adresse: 4, Salkart: 4, Garderobe: 6, Historikk: 4 | ✅ Alle partall |
| insider-grid | 10 kort | ✅ |
| tips-grid | Mat og drikke: 3 kort | ✅ |
| kollektiv-cards | 5 kort (alltid én kolonne) | ✅ |
| Schema.org index.html | Article + BreadcrumbList + FAQPage + MusicVenue | ✅ |
| Schema.org salkart | Article + BreadcrumbList + FAQPage | ✅ |
| MusicVenue-schema | geo, maximumAttendeeCapacity, sameAs Wikipedia | ✅ |
| Article schema image | ImageObject med url, width, height | ✅ |
| Title-tag | "John Dee Oslo – Adresse, kapasitet og billetter \| Konserter i Norge" | ✅ |
| H1 inneholder "Oslo" | "John Dee Live Club Oslo" | ✅ |
| datePublished / dateModified | 2026-02-20T08:00:00+01:00 | ✅ |
| Bildeattribusjon i hero | Ssu / CC BY-SA 4.0 via Wikimedia Commons | ✅ |
| CC-bilde | File:John_Dee_Live_Club_and_pub,_Torggata_16,_Oslo.jpg | ✅ |
| Alle lenker relative stier | Sjekket | ✅ |
| Øl referert som "0,4-liters" | Gjennomgående | ✅ |
| Postnummer 0183 Oslo | Gjennomgående | ✅ |
| byer/oslo/index.html oppdatert | John Dee-kort lagt til | ✅ |

---

*Generert: Februar 2026 | Keywords hentet via Google Autocomplete API (263 unike keywords, seed: "john dee" + "john dee oslo" + "john dee konsert") | Venue-relevante keywords etter filtrering: ~46 | Alle tre seeds bekreftet kjørt og krysssjekket*
