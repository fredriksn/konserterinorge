# Scripts – Konserter i Norge

## generer-venue-artikkel.js

**Genererer en ferdig venue-artikkel** i Unity Arena-mal: Praktisk info (dl + kart), Spørsmål og svar (FAQ med long-tail i setninger). Bruker `data/arenaer.json`. Output: `byer/<by>/<venue>/index.html`.

**Bruk (fra prosjektrot):**
```bash
node scripts/generer-venue-artikkel.js <venue-slug>
```

**Eksempler:**
```bash
node scripts/generer-venue-artikkel.js oslo-spektrum
node scripts/generer-venue-artikkel.js dnb-arena
node scripts/generer-venue-artikkel.js rockefeller --dry-run
```

- **Uten `--dry-run`:** Skriver til `byer/<by_slug>/<venue_slug>/index.html` (oppretter mappe om nødvendig).
- **Med `--dry-run`:** Skriver HTML til konsollen (for å sjekke eller lime inn manuelt).

**Rekkefølge for ny venue:** 1) Legg arenaen i `data/arenaer.json`. 2) Kjør `generer-venue-artikkel.js <slug>`. 3) Tilpass teksten om nødvendig. 4) Kjør `node scripts/oppdater-sitemap-venuer.js` for å legge inn URL i sitemap. 5) Kjør `node scripts/map-dekkes-av.js` for å sette `dekkes_av` i longtail-nokkelord.json.

**Merk:** Kjører du scriptet for en arena som allerede har manuelt innhold (f.eks. Unity Arena), overskrives det. Bruk `--dry-run` først eller ta backup.

---

## hent-longtail-forslag.js

Henter **akkurat de longtail-frasene som dukker opp i Google** når man skriver arena-navnet (autocomplete/dropdown).

**Standard (anbefalt):** Én forespørsel per arena – arena-navn + mellomrom (f.eks. «Unity Arena »). Gir det som vises i dropdown når brukeren har skrevet navnet og et mellomrom (typisk adresse, kapasitet, parkering, billetter, oslo, fornebu). Få, relevante fraser.

**Kjør (fra prosjektrot):**
```bash
node scripts/hent-longtail-forslag.js
```
Resultat skrives til konsollen (JSON). Kort kjøretid (1–2 sek per arena).

**Hvis du vil ha alle forslag inkl. artistnavn og enkeltarrangementer** (gammel oppførsel, mange hundre fraser per arena):
```bash
node scripts/hent-longtail-forslag.js --alle-bokstaver
```
Tar lang tid (ca. 1 min per arena) pga. 30 kall per arena.

**Kun én arena:**
```bash
node scripts/hent-longtail-forslag.js --venue dnb-arena --out data/dnb-arena-forslag.json
```

**De 10 største arenaene (etter kapasitet):**
```bash
node scripts/hent-longtail-forslag.js --limit 10 --out data/longtail-forslag-top10.json
node scripts/merge-longtail.js data/longtail-forslag-top10.json
```
Merge-scriptet slår resultatet inn i `data/longtail-nokkelord.json` og beholder eksisterende `dekkes_av`.

**Alle arenaer til fil:**
```bash
node scripts/hent-longtail-forslag.js --out data/longtail-forslag-raw.json
```
Sammenlign deretter med `data/longtail-nokkelord.json` og flytt over ønskede fraser, eller bruk output som kilde for generer-venue-artikkel.

**Viktig:**
- Scriptet bruker 1,5 sekunders pause mellom hvert kall. Ikke reduser for mye – Google kan blokkere.
- Automatiske kall mot Google kan stride mot deres retningslinjer. Bruk på eget ansvar.

Se **LONGTAIL-PLAN.md** for full plan og arbeidsflyt.

---

## map-dekkes-av.js

Setter **dekkes_av** for longtail-fraser i `data/longtail-nokkelord.json` som matcher vanlige nøkkelord (adresse, kapasitet, parkering, billetter, kollektivtransport, salkart, kart). Peker til riktig anker på venue-siden (`byer/<by>/<venue>/#adresse` osv.).

```bash
node scripts/map-dekkes-av.js
```

---

## oppdater-sitemap-venuer.js

Legger **manglende venue-URL-er** fra `data/arenaer.json` inn i `sitemap.xml`. Kjør når du har lagt til nye arenaer.

```bash
node scripts/oppdater-sitemap-venuer.js
```
