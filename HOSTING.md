# Hosting av konserterinorge.no (domene.shop)

Nettsiden er bygget som **statisk HTML/CSS/JS**. Du trenger ikke database eller server-side kode. Det gjør hosting billig og enkel.

## Anbefalt: Billig og effektiv hosting

### 1. Netlify (anbefalt)
- **Pris:** Gratis for personlige prosjekter (generøs grense).
- **Fordeler:** Automatisk HTTPS, CDN, enkel deploy fra Git eller drag-and-drop.
- **Domene:** I domene.shop peker du domenet til Netlify (de gir deg CNAME eller A-records). Netlify har [veiledning for custom domain](https://docs.netlify.com/domains-https/custom-domains/).
- **Steg:** Lag konto på [netlify.com](https://netlify.com), last opp mappen `konserterinorge` (eller knytt til GitHub-repo), legg til domenet konserterinorge.no i Netlify og oppdater DNS hos domene.shop.

### 2. GitHub Pages
- **Pris:** Gratis.
- **Fordeler:** Integrert med GitHub, enkelt ved push.
- **Domene:** I domene.shop setter du CNAME til `brukernavn.github.io` (eller A-records som GitHub oppgir). I repoet legger du inn domenet under Settings → Pages → Custom domain.
- **Merk:** Bruk HTTPS (GitHub støtter det for eget domene).

### 3. Cloudflare Pages
- **Pris:** Gratis for vanlig bruk.
- **Fordeler:** Rask CDN, enkel knytting hvis domenet allerede bruker Cloudflare DNS.
- **Domene:** Hvis domene.shop kan bruke Cloudflare som DNS, eller du flytter DNS til Cloudflare, er det lett å knytte Pages til domenet.

### 4. Vercel
- **Pris:** Gratis for hobby.
- **Fordeler:** Rask deploy fra Git, automatisk HTTPS.
- **Domene:** Legg til domenet i Vercel-prosjektet og oppdater DNS hos domene.shop som Vercel viser.

## Slik kobler du domene.shop til hosting

1. **Kjøp/forny domenet** konserterinorge.no (eller .no/.com du foretrekker) hos domene.shop.
2. **Velg en host** (f.eks. Netlify eller GitHub Pages) og deploy nettsiden dit (upload av filer eller knytt Git-repo).
3. **DNS hos domene.shop:**  
   - Gå til domene.shop → Mine domener → DNS-innstillinger for konserterinorge.no.  
   - Legg til enten:
     - **CNAME:** `www` → `din-app.netlify.app` (eller tilsvarende fra hosten), og evt. **A-record** for apex (konserterinorge.no) hvis hosten oppgir IP.  
     - Eller følg hostens egen steg-for-steg for «custom domain».
4. **Vent på DNS** (opptil 24–48 timer, ofte raskere). Etterpå skal konserterinorge.no peke til din nettside.

## Oppsummert

| Tjeneste      | Pris   | Vanskelighet | God for SEO/hastighet |
|---------------|--------|--------------|------------------------|
| Netlify       | Gratis*| Lav          | Ja                    |
| GitHub Pages  | Gratis | Lav          | Ja                    |
| Cloudflare Pages | Gratis | Lav       | Ja                    |
| Vercel        | Gratis*| Lav          | Ja                    |

\* Innenfor gratis kvote.

For en statisk, SEO-vennlig side som denne er **Netlify** eller **GitHub Pages** svært billig og effektivt, og du beholder domenet hos domene.shop – du endrer bare DNS slik at det peker til hosten.
