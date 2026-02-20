# Prompt: Bygg nytt venue fra scratch

Lim inn i ny chat. Bytt ut `[VENUE_NAVN]`, `[VENUE_SLUG]` og `[BY]` før du sender.

---

```
Du skal bygge ut konserterinorge.no-prosjektet for et nytt venue: [VENUE_NAVN] i [BY].

## Prosjektkontekst
Prosjektet ligger i: c:\Users\Fredrik\.cursor-tutor\konserterinorge\
Designsystem og regler: Les .cursor/rules/konserterinorge-design.mdc før du begynner.
Gullstandard å etterligne: konserterinorge/byer/oslo/oslo-spektrum/index.html
Universell artikkelmal (les denne nøye): konserterinorge/_ARTIKKEL-MAL.html
Fullført eksempel å lære av: konserterinorge/byer/oslo/unity-arena/ (med alle undersider)

## Din oppgave – gjør alt selv, i denne rekkefølgen:

### Steg 1: Keyword-research
Kjør longtail-keyword-analysen (PowerShell via Google Autocomplete) for "[VENUE_NAVN]"
på samme måte som for Unity Arena. Opprett en innholdsplan.md i venue-mappen.

### Steg 2: Lag mappestruktur
konserterinorge/byer/[BY_SLUG]/[VENUE_SLUG]/ med undermapper for alle støtteartikler
du identifiserer fra keyword-analysen.

### Steg 3: Skriv hoveddokumentet (index.html)
Modellér etter unity-arena/index.html og oslo-spektrum/index.html i struktur og CSS-klasser.
Finn bilde fra Wikimedia Commons (CC-lisens). Svar på alle keywords fra steg 1.

### Steg 4: Skriv alle støtteartikler
Bruk _ARTIKKEL-MAL.html som base. Finn Wikimedia-bilde til hvert.
Lenk alle artiklene til hverandre og til hoveddokumentet.

### Steg 5: UX-sjekkliste på alt du lager
- info-cards: ALLTID partall antall (2, 4, 6) – aldri 3 eller 5
- kollektiv-cards: brukes for lister med mye tekst, alltid én kolonne
- tips-grid: kun ved 3+ kort med kortere tekst
- Schema.org: Article + BreadcrumbList + FAQPage på alle sider
- Bildeattribusjon i footer av hero på alle sider
- Alle lenker fungerer (relative stier)

### Steg 6: Legg til lenke fra byer/[BY_SLUG]/index.html til det nye venuedet

## Kvalitetskrav
- Ingen artist-spesifikt innhold – kun tidløs venue-info
- Norsk bokmål gjennomgående
- Alle faktapåstander verifisert via WebSearch/WebFetch
- Svar på ALLE longtail-keywords naturlig integrert i teksten

Gå i gang og gjør alt uten at jeg trenger å følge opp. Spør bare dersom du treffer
på noe faktamessig du er usikker på og ikke finner bekreftet fra offisielle kilder.
```

---

## Eksempel på utfylte plassholdere (Sentrum Scene)

| Plassholder | Verdi |
|---|---|
| `[VENUE_NAVN]` | Sentrum Scene |
| `[VENUE_SLUG]` | sentrum-scene |
| `[BY]` | Oslo |
| `[BY_SLUG]` | oslo |
