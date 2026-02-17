# Data – konserterinorge

## Innhold

- **arenaer.json** – Norges største konsertarenaer. Navn, by, kapasitet, adresse, nettside, parkering, kollektiv. Brukes på forsiden og under Byer. Rediger her for å oppdatere arena-info på hele nettsiden.
- **arenaer-mal.csv** – Mal for å legge til flere arenaer (kan importeres til Excel/Sheets, deretter konverteres til JSON).
- **festivaler.json** – Norske festivaler med måned, region og sjanger. Brukes på nettsiden.
- **festivaler-mal.csv** – Mal for å importere resten av dine 493 festivaler fra Excel/Google Sheets.

## Måneder (bruk nøyaktig stavemåte)

Januar, Februar, Mars, April, Mai, Juni, Juli, August, September, Oktober, November, Desember

## Regioner

Øst, Vest, Sør, Nord, Midt, Innlandet

## Sjangere (eksempler)

Pop/Rock, Metal, Jazz, Blues, Klassisk, Folk, Country, Elektronika, EDM, World, Indie, Diverse/Kultur, Russ, Rock/Metal, Teater, Film, Litteratur, Mat & Drikke, Barn & Familie, Kunst

## Slik legger du inn resten av festivalene

1. Eksporter din liste fra regneark til CSV (komma som skilletegn, første rad = overskrifter: `navn,måned,region,sjanger`).
2. Slå sammen med innholdet i `festivaler.json` eller erstatt `festivaler`-arrayet i JSON med data fra CSV (bruk f.eks. en CSV-til-JSON-konverterer eller eget lite script).
3. Oppdater `meta.totalt` i `festivaler.json` til antall festivaler.

## Arenaer – slik legger du inn informasjon

1. Rediger **arenaer.json**: legg til eller endre objekter i `arenaer`-arrayet. Felt: `navn`, `by`, `kapasitet`, `kapasitet_tekst`, `adresse`, `nettside`, `slug`, `beskrivelse`, `parkering`, `kollektiv`.
2. `slug` brukes i URL (f.eks. `oslo-spektrum` → byer/oslo/oslo-spektrum/). By må matche en by-mappe under byer/ (Oslo, Bergen, Trondheim, Stavanger, etc.).
3. Forsiden og sidene under Byer kan bruke disse dataene – forsiden laster arenaene automatisk fra `arenaer.json`.
4. For mange arenaer: fyll ut **arenaer-mal.csv** i Excel/Sheets, eksporter CSV og konverter til JSON (samme struktur som i arenaer.json).

## Hosting

Nettsiden er bygget for statisk hosting (HTML/CSS/JS). Du kan hoste på Netlify, GitHub Pages, Cloudflare Pages eller lignende og knytte domenet konserterinorge fra domene.shop dit (DNS).
