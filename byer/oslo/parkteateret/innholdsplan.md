# Innholdsplan – Parkteatret

Basert på Google Autocomplete-analyse (over 350 unike longtail-keywords, feb 2026).
Seed-keywords: "parkteateret", "parkteatret", "parkteateret oslo" + "parkteateret konsert".

---

## Keyword-klynger og dekningsform

| Intensjonsklynge | Eksempel-keywords | Dekningsform |
|---|---|---|
| Adresse/Kart | parkteateret adresse, hvor er parkteateret, parkteateret kart, parkteateret inngang | [SEKSJON] Adresse og adkomst |
| Transport/Parkering | trikk til parkteateret, parkering ved parkteateret | [SEKSJON] Kollektivtransport / Parkering + [ARTIKKEL:transport] |
| Kapasitet/Sitteplasser | parkteateret kapasitet, parkteatret antall plasser, parkteateret sitteplasser | [SEKSJON] Salkart |
| Mat/Bar/Drikke | parkteateret bar, parkteateret drikkemeny, parkteateret pizza, parkteateret meny, indisk parkteateret | [SEKSJON] Mat og drikke + [ARTIKKEL:hotell] |
| Garderobe/Aldersgrense | parkteateret garderobe, parkteateret aldersgrense, parkteateret bar aldersgrense | [SEKSJON] Regler |
| Yngling | parkteatret yngling | [FAQ] / [SEKSJON] Regler / Tips |
| Historikk | parkteateret historie, parkteateret kino, parkteateret eier | [SEKSJON] Historikk |
| Kontakt | parkteateret kontakt, telefon, facebook | [FAQ] |
| Program/Konserter | parkteateret program, parkteateret konsert i kveld, parkteateret billetter | [FAQ] |
| Hotell/Restauranter | hotell nær parkteateret, restauranter ved parkteateret | [FAQ] / Tips-seksjon + [ARTIKKEL:hotell] |
| Feil by/Land | parkteatret i moss, parkteater 2025 stockholm, parkteatret frederikssund | [UTELATES] – ikke relevant for Oslo |
| Artist-spesifikt | datarock parkteateret, flyte parkteateret, crap comedy parkteateret, veslemøy narvesen parkteateret | [UTELATES] – dato- og artist-spesifikt |
| Internt/Annet | parkteateret jobb, parkteatret cvr, parkteateret ledige stillinger | [UTELATES] |

---

## Støtteartikler

### 1. Transport og parkering ved Parkteatret
**Keywords:** trikk til parkteateret, parkering ved parkteateret, parkteateret inngang, hvor er parkteateret, parkteateret kart
**Fil:** `transport/index.html`

### 2. Hotell og restauranter nær Parkteatret
**Keywords:** parkteateret hotell, hotell nær parkteateret, restauranter nær parkteateret, parkteateret pizza, parkteateret bar, parkteateret restaurant, indisk parkteateret
**Fil:** `hotell/index.html`

---

## Keyword-coverage-status

Kontrollert mot index.html, transport/index.html og hotell/index.html.

| Klynge | Implementert | Plassering |
|---|---|---|
| Adresse/Kart | ✅ | SEKSJON: Adresse og adkomst, FAQ + ARTIKKEL: transport/ |
| Transport/Parkering | ✅ | SEKSJON: Kollektivtransport, Parkering + ARTIKKEL: transport/ |
| Kapasitet/Sitteplasser | ✅ | SEKSJON: Adresse, Salkart, FAQ, hero-chips |
| Mat/Bar/Drikke | ✅ | SEKSJON: Mat og drikke + ARTIKKEL: hotell/ |
| Garderobe/Aldersgrense | ✅ | SEKSJON: Regler (info-cards), FAQ |
| Yngling | ✅ | SEKSJON: Insidertips, FAQ (aldersgrense) |
| Historikk | ✅ | SEKSJON: Historikk |
| Program/Konserter | ✅ | FAQ: Spørsmål om billetter og program |
| Hotell/Restauranter | ✅ | SEKSJON: Mat og drikke + ARTIKKEL: hotell/ |
| Kontaktinfo | ⛔ UTELATT | Håndteres via lenking til offisiell side |
| Artist-spesifikt | ⛔ UTELATT | Dato- og artist-spesifikt |
| Feil by / Jobb | ⛔ UTELATT | Ikke relevant |

**Konklusjon:** Ved å utvide analysen til kun stedsnavnet avdekket vi flere hundre keywords, der spesielt hotell, restauranter (pizza, indisk), trikk og parkering utmerket seg i volum. To nye støtteartikler (`hotell` og `transport`) er opprettet for å gi bedre dybde på de mest søkte praktiske spørsmålene. Innholdet er nå ansett som 100% komplett.
