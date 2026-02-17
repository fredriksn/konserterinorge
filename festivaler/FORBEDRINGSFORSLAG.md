# 5 forbedringer for festivaloversikten

## 1. **Resultattekst og tom tilstand** (implementert)
- **Før:** Bare «480 festivaler» som tekst under filterbaren.
- **Nå:** Tallet er flyttet inn i filterbaren (samme linje som Nullstill), og viser «480 festivaler» eller «Viser X av 480» når du filtrerer. I hero står «Over 480 festivaler – søk eller filtrer listen under.» så tallet har kontekst. Ved 0 treff vises en egen tom-tilstand med knapp for å nullstille.

## 2. **Pagination eller «Last inn flere»**
- 480 kort på én side er tungt for både lesbarhet og ytelse.
- **Forslag:** Vis f.eks. 24 eller 48 festivaler av gangen med «Last inn flere» eller sidetall (1, 2, 3 …). Brukeren får raskere lasting og mer oversikt.

## 3. **Sortering**
- La brukeren velge sortering: **Navn (A–Å)**, **Område**, **Sjanger**.
- Gjerne en liten dropdown eller knapper ved siden av filterbaren. Gir kontroll og gjør det enklere å finne en konkret festival.

## 4. **Hurtigfiltre (chips)**
- Ved siden av (eller under) dropdowns: klikkbare **chips** for f.eks. «Jazz», «Rock», «Trøndelag», «Øst».
- Ett klikk setter filteret og viser tydelig hva som er valgt. Kan fjernes med ett klikk på chipen.

## 5. **Fremheving av store festivaler**
- **Forslag:** To nivåer – f.eks. «Store festivaler» (Øya, Slottsfjell, Bergenfest, Tons of Rock, osv.) øverst i en egen seksjon eller med et lite merke, deretter resten. Eller en fane «Alle» / «Kun store» for å skjule/vise kun de største.

---

## Anbefaling

**Prioritet 1 (allerede gjort):** Resultattekst inn i filterbaren + hero-tekst + tom tilstand. Det fjerner den «nakne» teksten midt på siden og gir tallet mening.

**Prioritet 2:** **Sortering** – enkel å implementere (sorter array før render) og gir stor UX-gevinst. Anbefaler å legge til en liten «Sorter på: Navn | Område | Sjanger»-velger.

**Prioritet 3:** **Pagination eller «Last inn flere»** – viktig når listen er lang; 24–48 per side er behagelig. «Last inn flere» er ofte enklere og mer mobilvennlig enn sidetall.

**Prioritet 4:** **Hurtigfiltre (chips)** – bra for de som vil filtrere raskt uten å åpne dropdowns. Kan bygges på toppen av eksisterende filterlogikk.

**Prioritet 5:** **Fremheving av store festivaler** – krever at noen festivaler markeres som «store» i data eller kode; nyttig for nyheter og første gangs brukere.

**Kort sagt:** Med resultattekst og tom tilstand på plass anbefaler jeg **sortering** som neste steg, deretter **pagination / «Last inn flere»** for bedre ytelse og lesbarhet.
