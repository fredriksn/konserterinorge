# Mal og Retningslinjer for Konsertarena-artikler (Venue Template)

Denne guiden dokumenterer gullstandarden vi har satt med **Oslo Spektrum**-siden. Målet er at alle fremtidige venue-artikler skal matche denne kvaliteten for å maksimere SEO, EEAT (Experience, Expertise, Authoritativeness, Trustworthiness) og brukeropplevelse (UX).

## 1. EEAT & Tillitssignaler (Kritisk for Google)
For å unngå å bli straffet som "ansiktsløst AI-innhold", MÅ alle artikler inneholde:
- **Verifisert-badge i hero:** `<span class="badge-verified">✓ Verifisert oppdatert: [Måned År]</span>`
- **Lesetid:** `<span class="read-time">⏱️ [X] min lesetid</span>`
- **Forfatterboks (Author Bio):** Plassert i bunnen av artikkelen (`.author-bio-box`). Skal inneholde bilde, navn (f.eks. Henrik), rolle ("Skrevet av lokal ekspertise"), og en kort tekst som beviser faktisk erfaring (f.eks. "vært på over 150 konserter... kjenner snarveiene").

## 2. Strukturert Data (JSON-LD Schema)
Hver artikkel skal ha TRE separate schema-blokker i `<head>`:
1. **`Place`:** Grunnleggende info (navn, adresse, kapasitet).
2. **`BreadcrumbList`:** For riktig navigasjonsstruktur i søkeresultater.
3. **`Article`:** Definerer `headline`, `image`, `author` (Person), `publisher` (Organization), `datePublished` og `dateModified`.
4. **`FAQPage`:** Svarer direkte på longtail-søkeordene folk bruker på Google.

## 3. Visuelt Design & UX (Mobile-First Magasinstil)
- **Hero-seksjon (`.venue-page-hero`):** 
  - Bruk ekte `<img>` med `fetchpriority="high"` og `alt`-tekst for bilde-SEO, IKKE css-background.
  - Kompakte `.venue-chips` for nøkkeltall (Kapasitet stående/sittende, åpnet, by) som wrapper naturlig.
  - Animasjon: `.venue-hero-scroll` (pil ned).
- **Quicknav (`.venue-quicknav-bar`):** Ligger under heroen. IKKE sticky. Korte lenkenavn ("Tips", "Kollektiv", "Mat & drikke") med `white-space: nowrap` for horisontal scrolling på mobil.
- **Seksjonsnummerering:** CSS counter automatisk på `.venue-fakta > h2`. Gir et redaksjonelt preg (01, 02, 03...).
- **Adresse/Info (`.info-cards`):** 2-kolonne grid med ikoner. Inkluderer alltid lenke til Google Maps.
- **Sitteplasser (`.sitteplasser-grid`):** Visuelle kort med stjernerating (`.sitteplasser-rating`) og fargekoding (Anbefalt, OK, Unngå).
- **Insidertips (`.insider-grid`):** 2-kolonne grid (1 kolonne på mobil) med emoji-ikoner og store underliggende tall for dybde. Unngå "wall of text".

## 4. Innholdsstrategi & Kvalitet (Invertert Pyramide)
- **Ikke bare offisiell info:** Artikkelen skal være *bedre* enn arenaens egen nettside.
- **Svar på det folk faktisk lurer på (Longtail):**
  - Hvor lenge står man i kø ut av P-huset? (Eks: Oslo City vs. Bjørvika).
  - Hvilke T-bane-stopp bør man velge for å *unngå* trengsel etter konserten?
  - Er gulvet flatt? (Advar mot plasser bak rad 10 på gulvet).
  - Skjulte hacks: Garderobe-kø (ta med tynn jakke), ta med ørepropper, lei sparkesykkel for å slippe drosjekø.
- **Evergreen Nyheter:** Hvis arenaen skal pusses opp eller bygges om, ha en dedikert infoseksjon om dette (f.eks. "Oppgradering" for Oslo Spektrum).

## 5. Script for Autogenerering
Når vi skal oppdatere `generer-venue-artikkel.js`, må scriptet bygges for å spytte ut nøyaktig denne HTML-strukturen. Data for kapasitet, byggeår, parkerings-hacks og sitteplass-ratinger må enten hentes fra utvidede JSON-filer eller skrives unikt per by/arena.
