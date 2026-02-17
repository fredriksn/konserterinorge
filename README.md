# Konserter i Norge

Nettside for konsertscener, festivaler og arrangementer i Norge. SEO-optimalisert, mobilvennlig og bygget for statisk hosting.

## Struktur

- **index.html** – Forside
- **byer/** – Konsertscener etter by (Oslo, Bergen, Trondheim, Stavanger, m.fl.)
- **festivaler/** – Festivaloversikt med filtrering (måned, region, sjanger)
- **billettselskaper/** – Ticketmaster, Eventim, Ticketco, Tikkio
- **turneer/** – Julekonserter, sommerkonserter
- **artister/** – Nye og populære artister
- **om-oss/**, **kontakt/**, **blogg/**, **sok/** – Info og funksjoner
- **personvern/**, **vilkar/** – Juridiske sider
- **css/style.css** – Designsystem
- **js/main.js** – Felles script (mobilmeny)
- **js/festivaler.js** – Laster og filtrerer festivaler
- **data/festivaler.json** – Festivaldata (måned, region, sjanger)
- **data/festivaler-mal.csv** – Mal for å importere resten av 493 festivaler
- **data/longtail-nokkelord.json** – Long-tail-søkefraser per venue (fra Google-forslag); brukes i LONGTAIL-PLAN
- **scripts/hent-longtail-forslag.js** – Henter Google Suggest-forslag for alle arenaer (prioritert etter kapasitet)

## Festivaldata

Listen i `data/festivaler.json` inneholder per i dag 85 festivaler. For å få inn alle 493:

1. Eksporter din liste fra regneark til CSV med kolonnene: `navn,måned,region,sjanger`.
2. Konverter CSV til JSON-array eller slå sammen med eksisterende innhold i `festivaler.json`.
3. Oppdater `meta.totalt` i `festivaler.json`.

Se **data/README.md** for måneder, regioner og sjangere.

## Kjøre lokalt

Åpne `index.html` direkte i nettleser, eller bruk en enkel lokal server:

```bash
# Python 3
python -m http.server 8000

# Node (npx)
npx serve .
```

Deretter: http://localhost:8000

## Hosting

Nettsiden er statisk (HTML/CSS/JS). Se **HOSTING.md** for hvordan du hoster billig (Netlify, GitHub Pages, Cloudflare Pages) og knytter domenet fra domene.shop.

## Sitemap

Strukturen følger sitemapen du oppga: Hjem → Byer (med underartikler per scene) → Festivaler (største, rock, jazz, elektronika, russ) → Billettselskaper → Turneer → Artister → Om oss → Kontakt → Blogg → Søk → Personvern → Vilkår.

## SEO og kvalitet

Bruk **SEO-SJEKKLISTE.md** før publisering av nye sider og ved oppdateringer. Sjekklisten fokuserer på EEAT, CTR og at innholdet kan bli lest opp i Google (voice, featured snippets, AI).

## Videre arbeid

- Fylle inn resten av 493 festivaler i `data/festivaler.json`.
- Egne landingssider per festival (long-tail SEO).
- Egne underartikler for alle scener (som Oslo Spektrum-eksempelet).
- Søk (f.eks. Google Custom Search eller egen indeks).
- Oppdatere personvern og vilkår med faktisk praksis og juridisk språk.
