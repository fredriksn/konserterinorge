# Todoliste – Konserter i Norge

## Prioritet 1

- [ ] **Dekkes_av-mapping for top 10** – I `data/longtail-nokkelord.json`: sett `dekkes_av` for fraser som dekkes av eksisterende seksjoner (f.eks. «unity arena adresse» → `#adresse`, «unity arena capacity» → `#kapasitet`). Evt. lage et lite script som mapper vanlige ord (adresse, kapasitet, parkering, konsert, program, kart, i dag, inngang, salkart) til riktig anker per venue.
- [ ] **Ferdigstille venue-artikler for top 10** – Unity Arena er ferdig. DNB Arena, Rockefeller, Grieghallen har generert side – gå gjennom og finpuss tekster (kollektiv per by, arena-spesifikke detaljer). Trondheim Spektrum, Sentrum Scene, Oslo Konserthus, Operaen, Olavshallen: kjør `generer-venue-artikkel.js` og rediger, eller legg inn lenker fra by-sidene.
- [ ] **Komplett festivalliste** – få inn alle 493 festivaler i `data/festivaler.json` (måned, region, sjanger). Bruk regneark/CSV og slå sammen med eksisterende data.

## Prioritet 2

- [ ] **Egne landingssider per festival** – long-tail SEO (f.eks. «Parkering Øyafestivalen», «Kapasitet Slottsfjell»). Øyafestivalen har allerede egen side – utvid med flere festivaler etter prioritet.
- [ ] **Fylle inn arenaer.json** – eventuelle manglende scener, oppdater kapasitet/adresse/parkering/kollektiv og nettside for de vi har.
- [ ] **Søk** – Google Custom Search eller egen søkeindeks på nettsiden.
- [ ] **Sitemap** – oppdatere `sitemap.xml` med alle nye venue-URL-er (Rockefeller, Grieghallen, DNB Arena, osv.) og sende til Search Console.

## Prioritet 3

- [ ] **Personvern og vilkår** – oppdatere med faktisk praksis og juridisk språk.
- [ ] **Blogg/nyheter** – første innlegg og rutine for oppdateringer.
- [ ] **Ekstra longtail-seksjoner** – vurder om noen arenaer skal ha kort seksjon for f.eks. «bilder», «servering/bar» eller «aldersgrense» der søket tyder på behov.

---

**Gjort:** Prosjektstruktur, SEO-sjekkliste, longtail-plan, hent-longtail-forslag for top 10 og merge inn i longtail-nokkelord, generer-venue-artikkel-script, Unity Arena full artikkel, DNB Arena / Rockefeller / Grieghallen generert, Unity Arena → korrekt navn, hosting-dok.

*Sist oppdatert: 2025-02-17*
