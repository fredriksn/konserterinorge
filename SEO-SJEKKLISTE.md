# SEO-sjekkliste – Konserter i Norge

**Formål:** Sikre at alle sider og artikler er av høyeste kvalitet for Google – med fokus på **EEAT**, **CTR** og at innholdet **faktisk blir lest opp** (voice search, featured snippets, sitat i AI).

**Når brukes denne:** Ved publisering av nye sider, arenaer, festivaler og blogginnlegg. Gå gjennom ved større oppdateringer.

---

## 1. EEAT (Experience, Expertise, Authoritativeness, Trustworthiness)

### Experience (Erfaring)
- [ ] **Førstehåndsinfo** – Har du vært på arenaen/festivalen eller siterer du pålitelige kilder?
- [ ] **Konkrete detaljer** – Adresse, kapasitet, parkering, kollektiv – sjekk at tall og fakta stemmer
- [ ] **Praktiske tips** – «Vær der 30 min før» / «Beste inngang for rullestol» – vis at du vet noe leseren trenger

### Expertise (Ekspertise)
- [ ] **Faglig riktig** – Konsertbransjen, arenaer, billetter – bruk riktig terminologi
- [ ] **Dybde** – Svar på mer enn det som står i én setning; gi kontekst (f.eks. historikk, kapasitet over tid)
- [ ] **Struktur** – Overskrifter som matcher søkeintent (Hvordan komme seg til, Parkering, Kapasitet, osv.)

### Authoritativeness (Autoritet)
- [ ] **Kilder** – Lenk til arenaens/festivalens offisielle nettside, Ruter, parkeringsselskaper
- [ ] **Oppdatert info** – Sist oppdatert-dato synlig; fjern utdatert navn/info (f.eks. arena-bytt av navn)
- [ ] **Om oss / Kontakt** – Tydelig hvem som står bak nettsiden; kontaktinfo

### Trustworthiness (Troverdighet)
- [ ] **Ingen feil** – Riktig arena-navn, adresse, årstall (f.eks. Unity Arena, ikke gammelt navn)
- [ ] **Transparent** – Hvis du lenker til billettselskaper, vær tydelig på at det er eksterne lenker
- [ ] **Personvern og vilkår** – Oppdatert og tilgjengelig

---

## 2. CTR (Click-Through Rate) – at folk faktisk klikker i Google

### Title tag (søkeresultat-tittel)
- [ ] **50–60 tegn** – Får plass i Google uten avkapping
- [ ] **Primært nøkkelord** i starten – f.eks. «Oslo Spektrum – Kapasitet, parkering og adresse»
- [ ] **Branding** – «| Konserter i Norge» i slutten der det passer
- [ ] **Unik per side** – Aldri samme title på to sider

### Meta description
- [ ] **150–160 tegn** – Full synlighet i søkeresultat
- [ ] **Beskrivende og lokket** – Hva får brukeren? (kapasitet, parkering, billetter)
- [ ] **Call-to-action eller konkret info** – «Finn parkering», «Se kapasitet», «Praktisk info»
- [ ] **Nøkkelord naturlig** – Arena-navn, by, «konserter», «parkering», «billetter»

### URL
- [ ] **Kort og lesbar** – `/byer/oslo/unity-arena/` ikke `/byer/oslo/arena-123/`
- [ ] **Nøkkelord i sti** – by, arena/festival-navn
- [ ] **Stabil** – Bytt ikke URL uten 301-omdirigering

### Rich results / utvidet visning
- [ ] **Strukturert data** – JSON-LD (LocalBusiness, Event, FAQPage) der det passer – øker sjanse for rich snippets
- [ ] **FAQ på siden** – Øker sjanse for FAQ-snippet i Google
- [ ] **Én tydelig H1** – Matcher det brukeren søker etter?

---

## 3. Bli lest opp på Google (Voice, Featured Snippets, AI)

### Voice search og «les opp»
- [ ] **Korte, fulle svar** – Første avsnitt svarer på spørsmålet direkte (f.eks. «Unity Arena har plass til rundt 15 000 ved konserter.»)
- [ ] **Naturlige spørsmål** – Overskrifter som spørsmål der det passer: «Hvor kan jeg parkere ved Unity Arena?»
- [ ] **Konkrete tall og fakta** – Kapasitet, adresse, åpningstider – lett for Google å plukke og lese opp

### Featured snippet (boks øverst)
- [ ] **Ett avsnitt som svar** – 40–60 ord som direkte svarer på søket; plasser øverst eller rett under H2
- [ ] **Lister og tabeller** – «Parkering ved Unity Arena: 1) … 2) …» – Google liker struktur
- [ ] **Definisjoner** – «Unity Arena er Norges største innendørs konsertarena og ligger på Fornebu.»

### AI-sitering (Perplexity, ChatGPT, Google AI)
- [ ] **Konsis oppsummering** – Topp av siden: 2–3 setninger som oppsummerer tema
- [ ] **Tydelige svar** – Bruk «Svaret er …» / «Kapasiteten er …» der det passer
- [ ] **Kilder og dato** – «Ifølge [arenaens nettside] …» – øker troverdighet og sitering

---

## 4. Teknisk og sidestruktur

### Per side
- [ ] **Én H1** – Tilsvarer sidens hovedtema
- [ ] **H2 → H3** – Logisk hierarki; ikke hopp fra H2 til H4
- [ ] **Intern lenking** – Min. 1–2 relevante lenker til andre sider (byer, festivaler, billettselskaper)
- [ ] **Alt-tekst på bilder** – Beskrivende og med nøkkelord der det er naturlig

### Helhet
- [x] **sitemap.xml** – Genereres med `node scripts/generer-sitemap.js` (arenaer + festivaler + alle statiske sider). Send til Google Search Console.
- [ ] **Mobil og hastighet** – Responsivt, rask lasting (bilder komprimert)
- [ ] **HTTPS** – Alt trafikk over HTTPS

### SoMe og deling (Open Graph / Twitter Card)
- [x] **Forsiden, byer/, festivaler/** – Har canonical, og:title, og:description, og:image, twitter:card. Legg inn `images/og-default.jpg` (1200×630) for fin forhåndsvisning når lenker deles.
- [ ] **Viktige undersider** – Ønskes samme meta på arena-/festivalsider, legg til i mal eller generer-script.

### Strukturert data (rich results)
- [x] **FAQPage (forsiden)** – JSON-LD med 4 spørsmål/svar; synlig «Ofte stilte spørsmål»-seksjon på siden.
- [ ] **LocalBusiness/Event** – Kan legges til på arena- og festivalsider for ekstra rich snippets.

---

## 5. Kvalitet før publisering

- [ ] **Stavekontroll** – Ingen skrivefeil
- [ ] **Faktasjekk** – Arena-navn (f.eks. Unity Arena), adresser, kapasitet, lenker
- [ ] **Alle lenker virker** – Ingen 404 til egne sider eller eksterne kilder
- [ ] **Test på mobil** – Lesbarhet og knapper/lenker

---

## 6. Etter publisering

- [ ] **Google Search Console** – Send inn sitemap; følg indeksering og feil
- [ ] **Søk etter sidetittel** – Ser du din side i resultatene? Hvordan ser title/description ut?
- [ ] **Oppdater ved endringer** – Ny arena-navn, flytting, nedleggelse – oppdater både data (arenaer.json) og tekster

---

## Suksesskriterier

En side som følger denne listen skal:

- **Støtte EEAT** – Oppleves som erfaring-based, ekspert, autoritativ og troverdig  
- **Gi god CTR** – Tydelig og lokkende title og meta description  
- **Ha større sjanse for å bli «lest opp»** – Korte svar, struktur og fakta som Google og voice/AI kan bruke  

---

**Versjon:** 1.0  
**Sist oppdatert:** 17. februar 2025  
**Prosjekt:** Konserter i Norge (konserterinorge.no)
