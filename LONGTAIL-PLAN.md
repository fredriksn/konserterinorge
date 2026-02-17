# Plan: Long-tail-nøkkelord for konsertarenaer

**Mål:** Få tak i alle long-tail-søkefraser som dukker opp i Google når brukere skriver inn venue-navn (f.eks. «unity arena» → kapasitet, parkering, salkart, konserter), prioritert fra største til minste venue – og dekke dem med innhold.

---

## 1. Prioritert venueliste (etter kapasitet)

Rekkefølgen bestemmes av **kapasitet** i `data/arenaer.json`: størst først = mest søketrafikk potensielt.

| Prioritet | Venue           | Kapasitet (ca.) | By        |
|----------|-----------------|-----------------|-----------|
| 1        | Unity Arena     | 15 000          | Oslo      |
| 2        | DNB Arena       | 11 500          | Stavanger |
| 3        | Oslo Spektrum   | 9 000           | Oslo      |
| 4        | Trondheim Spektrum | 4 000       | Trondheim |
| 5        | Sentrum Scene   | 1 750           | Oslo      |
| 6        | Grieghallen     | 1 500           | Bergen    |
| 7        | Oslo Konserthus | 1 400           | Oslo      |
| 8        | Rockefeller     | 1 350           | Oslo      |
| 9        | Operaen         | 1 364           | Oslo      |
| 10       | Olavshallen     | 1 200           | Trondheim |
| 11       | Stavanger Konserthus | 1 200   | Stavanger |
| 12       | USF Verftet     | 800             | Bergen    |
| 13       | Parkteateret    | 500             | Oslo      |
| 14       | Blå             | 400             | Oslo      |
| 15       | Ole Bull Scene  | 350             | Bergen    |

**Nye arenaer** legges inn i `data/arenaer.json` med `kapasitet`; prioritetslisten kan genereres på nytt (se script under).

---

## 2. Hvordan få tak i long-tail-nøkkelordene

### A) Manuelt i Google (mest pålitelig, ingen risiko)

1. Åpne Google i inkognito eller ren session.
2. Skriv **kun venue-navnet** (f.eks. `unity arena`) i søkefeltet.
3. Noter alle forslag som dukker opp under feltet (kapasitet, konserter, parkering, salkart, innganger, program, i dag, kart, osv.).
4. Test også med **venue + mellomrom** og første bokstav (f.eks. `unity arena k`, `unity arena p`) for å få flere forslag.
5. Skriv inn i `data/longtail-nokkelord.json` (se nedenfor).

**Fordeler:** 100 % det brukere faktisk ser, ingen ToS-problemer.  
**Ulemper:** Tar tid ved mange arenaer.

### B) Script som henter Google Suggest (automatisert)

Et lite script kan kalle Googles suggest-tjeneste for hvert venue-navn og vanlige endelser (kapasitet, parkering, konserter, …). Resultatene lagres i `data/longtail-nokkelord.json`.

- **Kjør med forsiktighet:** Bruk minst 1–2 sekunders pause mellom kall per venue for å unngå blokkering.
- **Ansvarsfraskrivelse:** Automatiske forespørsler kan stride mot Googles retningslinjer. Bruk på eget ansvar; manuell innsamling er tryggere.

Script: `scripts/hent-longtail-forslag.js` (se under).

### C) Verktøy (Ahrefs, SEMrush, Ubersuggest, etc.)

- **Keywords Explorer / søk etter venue-navn:** Gir søkevolum og «also rank for» / forslag.
- **Autocomplete-funksjon** i noen verktøy henter forslag som ligner på det Google viser.

Bruk verktøy for å **supplere** manuell liste og eventuelt prioritere nøkkelord etter volum/konkurranse.

---

## 3. Datastruktur: hvor vi lagrer long-tail

Fil: **`data/longtail-nokkelord.json`**

Struktur per venue:

- **venue_slug** – matcher `slug` i `arenaer.json` (f.eks. `unity-arena`).
- **venue_navn** – visningsnavn (f.eks. «Unity Arena»).
- **prioritet** – 1 = størst kapasitet, 2 = nest størst, osv.
- **søkefraser** – liste over long-tail-fraser som dukket opp i Google (eller fra script/verktøy).
- **dekkes_av** – hvordan vi dekker den (URL + eventuelt anker, f.eks. `byer/oslo/unity-arena/#parkering`, eller «ikke dekket»).

Eksempel:

```json
{
  "venue_slug": "unity-arena",
  "venue_navn": "Unity Arena",
  "prioritet": 1,
  "søkefraser": [
    { "frase": "unity arena kapasitet",     "dekkes_av": "byer/oslo/unity-arena/#kapasitet" },
    { "frase": "unity arena parkering",     "dekkes_av": "byer/oslo/unity-arena/#parkering" },
    { "frase": "unity arena konserter",     "dekkes_av": "byer/oslo/unity-arena/#konserter" },
    { "frase": "unity arena salkart",       "dekkes_av": "" },
    { "frase": "unity arena innganger",     "dekkes_av": "" }
  ]
}
```

Da kan vi:

- Gå gjennom venuer i prioritert rekkefølge.
- For hver søkefrase: enten lage en egen landingsside eller en seksjon med anker på venue-siden (som Oslo Spektrum / Unity Arena).
- Oppdatere `dekkes_av` når innhold er på plass.

---

## 4. Arbeidsflyt: fra liste til innhold

1. **Bygg prioritert venueliste**  
   Sorter `data/arenaer.json` etter `kapasitet` (synkende). Denne listen er kilden til rekkefølgen i LONGTAIL-PLAN og i script.

2. **Innsaml long-tail per venue**  
   For hvert venue, fra prioritet 1 og nedover:
   - Manuelt: skriv venue-navn i Google og noter forslag (og eventuelt venue + bokstav).
   - Valgfritt: kjør `scripts/hent-longtail-forslag.js` for å foreslå fraser som kan lagres i `longtail-nokkelord.json`.
   - Fyll inn/oppdater `data/longtail-nokkelord.json` med `søkefraser` og la `dekkes_av` stå tom der innhold ikke finnes ennå.

3. **Beslut innholdsformat per søkefrase**  
   - **Anker på eksisterende side:** f.eks. «unity arena parkering» → `byer/oslo/unity-arena/#parkering` med H2 «Parkering ved Unity Arena» og 1–2 avsnitt.
   - **Egen side:** bare hvis søket fortjener egen side (f.eks. «Unity Arena salkart» med et eget salkart-avsnitt eller egen side).

4. **Skriv og publiser**  
   - Bruk **SEO-SJEKKLISTE.md** (EEAT, CTR, korte svar for voice/snippet).
   - Oppdater `dekkes_av` i `longtail-nokkelord.json` når siden/anker er publisert.

5. **Oppdater og utvid**  
   - Nye arenaer i `arenaer.json` → legg inn i longtail-planen med riktig prioritet.
   - Ved behov: ny runde med manuell søk eller script for nye forslag.

---

## 5. Typiske long-tail-temaer (fra Google-forslag)

Ut fra forslag som «unity arena kapasitet», «unity arena parkering», osv.:

| Tema        | Eksempel søkefrase   | Innholdstype på siden                          |
|------------|----------------------|------------------------------------------------|
| Kapasitet  | [venue] kapasitet    | Tall + kort forklaring, evt. salkart           |
| Parkering  | [venue] parkering    | Adresser, priser, tips                         |
| Konserter  | [venue] konserter    | Kommende/årsoversikt + lenke til billetter     |
| Salkart    | [venue] salkart      | Beskrivelse + lenke til arenaens salkart       |
| Innganger  | [venue] innganger    | Hvor man går inn, tilgjengelighet             |
| Program    | [venue] program      | Program/kalender + lenke til billett/arrangør  |
| Kart       | [venue] kart         | Adresse, kollektiv, evt. embed kart           |
| I dag      | [venue] i dag        | Hva skjer i dag (krever oppdatering/feed)     |

Disse kan mappes til H2-seksjoner og ankre på venue-siden (som Oslo Spektrum og Unity Arena), slik at én URL dekker flere long-tail-søk.

---

## 6. Kort sjekkliste per venue

- [ ] Venue står i prioritert rekkefølge (fra arenaer.json, sortert på kapasitet).
- [ ] Long-tail-fraser er samlet inn (manuelt og/eller script) og lagret i `longtail-nokkelord.json`.
- [ ] For hver søkefrase er det bestemt: anker på venue-siden eller egen side.
- [ ] Innhold er skrevet og publisert (med SEO-sjekkliste).
- [ ] `dekkes_av` i `longtail-nokkelord.json` er oppdatert.
- [ ] Sitemap og interne lenker er oppdatert ved nye sider.

---

---

## 7. Script for å lage venue-artikkelen (neste steg)

**Script:** `scripts/generer-venue-artikkel.js`

For **neste** venue etter Unity Arena:

1. **Sørg for at arenaen finnes** i `data/arenaer.json` (navn, by, kapasitet, adresse, parkering, kollektiv, nettside, slug).
2. **Legg inn long-tail-fraser** for venuen i `data/longtail-nokkelord.json` (manuelt fra Google, eller kjør `node scripts/hent-longtail-forslag.js --out data/longtail-forslag-raw.json` og kopier inn fraser for den arenaen).
3. **Kjør:**  
   `node scripts/generer-venue-artikkel.js <venue-slug>`  
   Eksempel: `node scripts/generer-venue-artikkel.js oslo-spektrum` eller `node scripts/generer-venue-artikkel.js dnb-arena`
4. Scriptet skriver da `byer/<by>/<venue>/index.html` med alle H2-seksjoner (kapasitet, parkering, salkart, konserter, osv.) og placeholder-tekst hentet fra arenaer.json.
5. **Rediger teksten** – tilpass innholdet til arenaen (spesifikke tall, lenker, tone) og bruk SEO-SJEKKLISTE.md.
6. **Oppdater** `dekkes_av` i `longtail-nokkelord.json` for hver frase som nå dekkes av den nye siden.

**Før du overskriver en eksisterende side:** Kjør med `--dry-run` for å se HTML i konsollen, eller ta backup av `index.html` først.

---

**Neste steg:** Unity Arena er ferdig. Deretter: Oslo Spektrum (utvid med konserter/salkart), deretter DNB Arena, Trondheim Spektrum, osv. i prioritert rekkefølge.
