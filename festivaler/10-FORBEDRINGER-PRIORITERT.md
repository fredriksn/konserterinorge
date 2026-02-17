# 10 forbedringer for festivaloversikten – prioritert rekkefølge

Gjennomgang av `/festivaler/`: struktur, filter, søk, kort, ytelse og tilgjengelighet.

---

## 1. **Lastingstilstand (skeleton eller spinner)**
**Prioritet: 1**  
Når siden laster, hentes `festivaler.json` uten noen visuell tilbakemelding. Listen er bare tom til data er inne.

- **Forslag:** Vis en kort melding («Laster festivaler …») eller 6–8 skeleton-kort i grid mens XHR pågår. Når data er lastet, erstatt med reelle kort.
- **Effekt:** Brukeren ser at noe skjer; mindre følelse av «henging».

---

## 2. **Sortering**
**Prioritet: 2**  
Det finnes ingen måte å sortere listen på. 480 festivaler vises i datarekkefølge.

- **Forslag:** En liten «Sorter på»-velger (dropdown eller knapper): **Navn (A–Å)**, **Område**, **Sjanger**. Sorter den filtrerte listen før den rendres.
- **Effekt:** Enklere å finne en konkret festival og å skanne systematisk.

---

## 3. **Pagination eller «Last inn flere»**
**Prioritet: 3**  
Alle treff rendres samtidig (opp mot 480 kort). Det gir mange DOM-noder og lang scroll.

- **Forslag:** Vis f.eks. 24 eller 48 kort av gangen med en knapp «Last inn flere» (eller sidetall 1, 2, 3 …). Filtrering/søk gjelder fortsatt hele datasettet; kun visning begrenses.
- **Effekt:** Raskere første render og bedre ytelse, spesielt på mobil.

---

## 4. **Søk treffer også sted og sjanger**
**Prioritet: 4**  
Søk matcher kun `f.navn`. Søk på «Volda» eller «Jazz» gir ingen treff selv om festivaler har det i sted/sjanger.

- **Forslag:** Inkluder i søket: navn + sted (fra parentes) + sjanger. F.eks. `f.navn + ' ' + (parsed.sted || '') + ' ' + (f.sjanger || '')` og match `searchLower` mot den samlede strengen.
- **Effekt:** Bedre oppfinnelighet uten ekstra UI.

---

## 5. **Filter i URL (delbare lenker)**
**Prioritet: 5**  
Valgte filter (søk, måned, område, sjanger) ligger bare i sidens tilstand. Man kan ikke dele eller bokmerke en filtrert visning.

- **Forslag:** Bruk query-parametre, f.eks. `?q=rock&region=Vest&sjanger=Rock`. Ved innlasting: les parametrene og sett filter + søkefelt, kjør `applyFilters()`. Ved endring av filter: oppdater URL med `history.replaceState` (eller `pushState`).
- **Effekt:** Delbare og bokmerkbare lenker; tilbake-knapp fungerer for filterendringer.

---

## 6. **Hurtigfiltre (chips)**
**Prioritet: 6**  
Alt filtrering skjer via dropdowns. Hurtigvalg for typiske valg mangler.

- **Forslag:** Under eller ved siden av filterbaren: klikkbare chips, f.eks. «Jazz», «Rock», «Trøndelag», «Øst». Ett klikk setter tilsvarende filter; aktiv chip vises tydelig og kan klikkes bort for å fjerne filteret.
- **Effekt:** Raskere filtrering for vanlige brukeroppgaver.

---

## 7. **Mobil: ryddigere filter**
**Prioritet: 7**  
På smal skjerm blir filterbaren en lang, oppbrettet rad med mange elementer. Søk, tre dropdowns og nullstill kan føles travelt.

- **Forslag:** På mobil: samle Måned, Område og Sjanger i en «Filter»-knapp som åpner en liten modal eller uttrekk; behold søk og nullstell synlig. Alternativt: én kolonne med labels over hvert felt for tydeligere lesing.
- **Effekt:** Mindre støy og bedre bruk på mobil.

---

## 8. **Tilgjengelighet (semantikk og live-region)**
**Prioritet: 8**  
Resultatlisten er en `div` med `aria-label`; telleren har `aria-live="polite"`. Det kan strammes opp.

- **Forslag:** (1) Bruk `<ul>` og `<li>` for listen, eller behold grid men legg på `role="list"` og `role="listitem"` på kort for skjermlesere som støtter det. (2) Sikre at resultattekst («X festivaler» / «Viser Y av Z») leses opp ved endring (live-region er satt; dobbeltsjekk at teksten oppdateres i samme element). (3) Evt. «Hopp til resultater»-lenke etter filter for tastaturnavigasjon.
- **Effekt:** Bedre for skjermlesere og tastaturbrukere.

---

## 9. **Valgfri ekstra info på kort**
**Prioritet: 9**  
Hvert kort viser kun festivalnavn og én meta-linje (sted · område · sjanger). Måned vises ikke.

- **Forslag:** Hvis du vil uten å rote til: inkluder måned på kortet bare når det ikke er «Varierende», f.eks. som liten etikett eller i meta-linjen. Eller la kortene være som nå for å unngå visuell støy.
- **Effekt:** Mer info der det er nyttig; kan droppes hvis du foretrekker minimalt kort.

---

## 10. **Fremheving av store festivaler**
**Prioritet: 10**  
Alle festivaler presenteres likt. Kjente navn (Øya, Slottsfjell, Bergenfest, Tons of Rock) skiller seg ikke ut.

- **Forslag:** Enten: (a) en egen seksjon «Store festivaler» øverst med 8–12 navn, deretter «Alle festivaler», eller (b) et lite merke/badge på kort (f.eks. «Stor festival») for en definert liste i kode/data.
- **Effekt:** Raskere orientering for brukere som leter etter de største arrangementene; krever vedlikehold av liste over «store» festivaler.

---

## Kort oppsummert

| # | Forbedring                    | Hovedeffekt              |
|---|------------------------------|---------------------------|
| 1 | Lastingstilstand             | Tydelig feedback ved load |
| 2 | Sortering                    | Kontroll og finnbarhet    |
| 3 | Pagination / Last inn flere  | Ytelse og oversikt        |
| 4 | Søk i sted + sjanger        | Bedre søk                 |
| 5 | Filter i URL                 | Delbare lenker            |
| 6 | Hurtigfiltre (chips)         | Rask filtrering           |
| 7 | Mobil-filter                 | Bedre mobil-UX            |
| 8 | Tilgjengelighet              | A11y og tastatur          |
| 9 | Ekstra info på kort         | Valgfri informasjon       |
|10 | Fremheving store festivaler | Orientering               |

Anbefaling: Start med **1** (lastingstilstand) og **2** (sortering), deretter **3** (pagination) og **4** (utvidet søk). Det gir raskest merkbart bedre opplevelse uten å endre hele siden.
